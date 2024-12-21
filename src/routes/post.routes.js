require('dotenv').config()

const express = require('express')

const postController = require('../controller/post.controller')

const multer = require('multer')

const { fileFilter, validateRequest } = require('../utils/helper')

const { createPostSchema } = require('../validators/post.validators')

const storage = multer.memoryStorage()

const upload = multer({ storage: storage, fileFilter: fileFilter })

const postRouter = express.Router()

postRouter.post(
  '/onboard',
  upload.single('image'),
  validateRequest(createPostSchema),
  postController.createPost,
)

module.exports = postRouter
