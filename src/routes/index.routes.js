const express = require('express')

const postRouter = require('./post.routes')

const tagRouter = require('./tag.routes')

const mainRouter = express.Router()

mainRouter.get('/status', (req, res) => {
  res.status(200).json({ message: 'Server is live' })
})

mainRouter.use('/post', postRouter)

mainRouter.use('/tags', tagRouter)

module.exports = mainRouter
