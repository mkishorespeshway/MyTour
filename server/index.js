const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const path = require('path')
const fs = require('fs')
const { MongoMemoryServer } = require('mongodb-memory-server')
const { getModel } = require('./modelFactory')
const { router: authRouter, ensureAdminSeed, authMiddleware } = require('./auth')

dotenv.config()

const app = express()
const PORT = process.env.PORT || 4000
const ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:8082'
const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI

const DEV = process.env.NODE_ENV !== 'production'
const allowedOrigins = (process.env.CLIENT_ORIGINS || ORIGIN)
  .split(',')
  .map(s => s.trim())
  .filter(Boolean)

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true)
    if (allowedOrigins.includes(origin)) return callback(null, true)
    if (DEV && (
      origin.startsWith('http://localhost:') ||
      origin.startsWith('http://127.0.0.1:') ||
      origin.startsWith('http://192.168.')
    )) return callback(null, true)
    return callback(new Error('Not allowed by CORS'))
  },
  credentials: true,
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization']
}))

app.options('*', cors())
app.use(express.json({ limit: '1mb' }))
app.use(morgan('dev'))

// Serve uploaded files
const UPLOADS_DIR = path.join(__dirname, 'uploads')
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true })
}
app.use('/uploads', express.static(UPLOADS_DIR))

async function connectMongo() {
  try {
    if (MONGO_URI) {
      await mongoose.connect(MONGO_URI)
      console.log('Connected to MongoDB (URI)')
      return
    }
    const mem = await MongoMemoryServer.create()
    const uri = mem.getUri()
    await mongoose.connect(uri)
    console.log('Connected to MongoDB (in-memory dev)')
  } catch (err) {
    console.error('MongoDB connection error, starting in-memory MongoDB', err)
    const mem = await MongoMemoryServer.create()
    const uri = mem.getUri()
    await mongoose.connect(uri)
    console.log('Connected to MongoDB (in-memory fallback)')
  }
}

connectMongo()

// Seed admin user
ensureAdminSeed().catch((e) => console.error('Admin seed error', e))

app.get('/health', (req, res) => {
  res.json({ ok: true, server: 'goventure-backend', mongo: mongoose.connection.readyState === 1 })
})

// Auth routes
app.use('/auth', authRouter)

// Notifications endpoint
app.post('/api/notifications', authMiddleware, async (req, res) => {
  try {
    const { type, message, user_id, trip_id, data } = req.body
    const Model = getModel('notifications')
    const notification = await Model.create({
      type,
      message,
      user_id,
      trip_id,
      data,
      read: false,
      created_at: new Date()
    })
    res.status(201).json(notification)
  } catch (err) {
    res.status(500).json({ error: 'notification_failed', message: err.message })
  }
})

// Simple storage upload endpoint (base64 JSON)
app.post('/storage/upload', async (req, res) => {
  try {
    const { bucket, filePath, base64 } = req.body || {}
    if (!bucket || !filePath || !base64) {
      return res.status(400).json({ error: 'invalid_payload' })
    }
    const safeBucket = String(bucket).replace(/[^a-zA-Z0-9-_]/g, '')
    const destDir = path.join(UPLOADS_DIR, safeBucket)
    if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true })
    const safeRel = String(filePath).replace(/[^a-zA-Z0-9/_\-.]/g, '')
    const outPath = path.join(destDir, safeRel)
    const buf = Buffer.from(base64, 'base64')
    fs.writeFileSync(outPath, buf)
    const publicPath = `/uploads/${safeBucket}/${safeRel}`
    res.status(201).json({ ok: true, path: `${safeBucket}/${safeRel}`, url: publicPath })
  } catch (err) {
    res.status(500).json({ error: 'upload_failed', message: err.message })
  }
})

// List documents with optional filtering/sorting/pagination
app.get('/api/:collection', async (req, res) => {
  try {
    const { collection } = req.params
    const Model = getModel(collection)
    const { sort, order, limit, skip, filter } = req.query

    let q = {}
    if (filter) {
      try {
        q = JSON.parse(filter)
      } catch {}
    }

    let query = Model.find(q)
    if (sort) {
      const dir = (order || 'desc').toLowerCase() === 'asc' ? 1 : -1
      query = query.sort({ [sort]: dir })
    }
    if (skip) query = query.skip(parseInt(skip))
    if (limit) query = query.limit(parseInt(limit))

    const docs = await query.lean()
    res.json(docs)
  } catch (err) {
    res.status(500).json({ error: 'list_failed', message: err.message })
  }
})

// Get by id
app.get('/api/:collection/:id', async (req, res) => {
  try {
    const { collection, id } = req.params
    const Model = getModel(collection)
    const doc = await Model.findById(id).lean()
    if (!doc) return res.status(404).json({ error: 'not_found' })
    res.json(doc)
  } catch (err) {
    res.status(500).json({ error: 'get_failed', message: err.message })
  }
})

// Create one or many (admin only)
app.post('/api/:collection', async (req, res) => {
  try {
    const { collection } = req.params
    const Model = getModel(collection)
    const body = req.body

    // Allow public submissions for contact_submissions, require auth otherwise
    if (collection !== 'contact_submissions') {
      const header = req.headers.authorization || ''
      const token = header.startsWith('Bearer ') ? header.slice(7) : null
      if (!token) return res.status(401).json({ error: 'missing_token' })
      // Let authMiddleware verify
      return authMiddleware(req, res, async () => {
        try {
          if (Array.isArray(body)) {
            const created = await Model.insertMany(body)
            res.status(201).json(created)
          } else {
            const created = await Model.create(body)
            res.status(201).json(created)
          }
        } catch (err) {
          res.status(500).json({ error: 'create_failed', message: err.message })
        }
      })
    }

    if (Array.isArray(body)) {
      const created = await Model.insertMany(body)
      res.status(201).json(created)
    } else {
      const created = await Model.create(body)
      res.status(201).json(created)
    }
  } catch (err) {
    res.status(500).json({ error: 'create_failed', message: err.message })
  }
})

// Update by id (admin only)
app.put('/api/:collection/:id', authMiddleware, async (req, res) => {
  try {
    const { collection, id } = req.params
    const Model = getModel(collection)
    const updated = await Model.findByIdAndUpdate(id, req.body, { new: true, upsert: false }).lean()
    if (!updated) return res.status(404).json({ error: 'not_found' })
    res.json(updated)
  } catch (err) {
    res.status(500).json({ error: 'update_failed', message: err.message })
  }
})

// Delete by id (admin only)
app.delete('/api/:collection/:id', authMiddleware, async (req, res) => {
  try {
    const { collection, id } = req.params
    const Model = getModel(collection)
    const deleted = await Model.findByIdAndDelete(id).lean()
    if (!deleted) return res.status(404).json({ error: 'not_found' })
    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ error: 'delete_failed', message: err.message })
  }
})

app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`)
})
