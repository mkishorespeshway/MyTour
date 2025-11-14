const mongoose = require('mongoose')

const cache = new Map()

function getModel(name) {
  const norm = String(name).trim()
  if (cache.has(norm)) return cache.get(norm)

  const schema = new mongoose.Schema(
    {},
    {
      strict: false,
      timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
    }
  )

  const model = mongoose.models[norm] || mongoose.model(norm, schema)
  cache.set(norm, model)
  return model
}

module.exports = { getModel }
