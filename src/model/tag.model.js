const mongoose = require('mongoose')

const tagSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true },
  },
  { timestamps: true },
)

const tagModel = mongoose.model('tag', tagSchema)

module.exports = tagModel
