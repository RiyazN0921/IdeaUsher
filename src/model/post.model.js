const mongoose = require('mongoose')

const postSchema = new mongoose.Schema(
  {
    title: { type: String, trim: true, required: true },
    description: { type: String },
    image: { type: String },
    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'tag',
      },
    ],
  },
  { timestamps: true },
)

const postModel = mongoose.model('post', postSchema)

module.exports = postModel
