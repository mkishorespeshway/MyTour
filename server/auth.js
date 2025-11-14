const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')

const router = express.Router()

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  passwordHash: String,
  role: { type: String, default: 'user' }
}, { timestamps: true })

const User = mongoose.models.users || mongoose.model('users', userSchema)

async function ensureAdminSeed() {
  const email = (process.env.ADMIN_EMAIL || 'admin@example.com').trim().toLowerCase()
  const pw = process.env.ADMIN_PASSWORD || 'admin123'
  const existing = await User.findOne({ email }).lean()
  if (!existing) {
    const hash = await bcrypt.hash(pw, 10)
    await User.create({ email, passwordHash: hash, role: 'admin' })
    console.log(`Seeded admin user: ${email}`)
  } else if (!existing.passwordHash && existing.password) {
    const u = await User.findById(existing._id)
    u.passwordHash = existing.password
    u.role = 'admin'
    await u.save()
  }
}

function sign(user) {
  const secret = process.env.JWT_SECRET || 'dev-secret-change'
  return jwt.sign({ sub: user._id.toString(), email: user.email, role: user.role }, secret, { expiresIn: '7d' })
}

function authMiddleware(req, res, next) {
  try {
    const header = req.headers.authorization || ''
    const token = header.startsWith('Bearer ') ? header.slice(7) : null
    if (!token) return res.status(401).json({ error: 'missing_token' })
    const secret = process.env.JWT_SECRET || 'dev-secret-change'
    const payload = jwt.verify(token, secret)
    req.user = payload
    next()
  } catch (e) {
    res.status(401).json({ error: 'invalid_token' })
  }
}

router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body
    const normEmail = String(email || '').trim().toLowerCase()
    
    if (!normEmail || !password) {
      return res.status(400).json({ error: 'missing_fields' })
    }
    
    if (password.length < 6) {
      return res.status(400).json({ error: 'password_too_short' })
    }
    
    const existing = await User.findOne({ email: normEmail })
    if (existing) {
      return res.status(409).json({ error: 'email_exists' })
    }
    
    const hash = await bcrypt.hash(password, 10)
    const user = await User.create({ 
      email: normEmail, 
      passwordHash: hash, 
      role: 'user' 
    })
    
    const token = sign(user)
    res.status(201).json({ token, role: user.role, email: user.email })
  } catch (e) { 
    res.status(500).json({ error: 'registration_failed' }) 
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const normEmail = String(email || '').trim().toLowerCase()
    const user = await User.findOne({ email: normEmail })
    if (!user) return res.status(401).json({ error: 'invalid_credentials' })
    const hash = user.passwordHash || user.password
    if (!hash) return res.status(401).json({ error: 'invalid_credentials' })
    const ok = await bcrypt.compare(password, hash)
    if (!ok) return res.status(401).json({ error: 'invalid_credentials' })
    const token = sign(user)
    res.json({ token, role: user.role, email: user.email })
  } catch (e) { res.status(500).json({ error: 'login_failed' }) }
})

router.get('/me', authMiddleware, async (req, res) => {
  const user = await User.findById(req.user.sub).lean()
  if (!user) return res.status(404).json({ error: 'not_found' })
  res.json({ email: user.email, role: user.role })
})

module.exports = { router, ensureAdminSeed, authMiddleware, User }
