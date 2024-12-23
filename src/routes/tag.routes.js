const express = require('express')

const tagController = require('../controller/tag.controller')

const { validateRequest } = require('../utils/helper')

const {
  getPostsSchema,
  addTagsSchema,
} = require('../validators/tag.validators')

const tagRouter = express.Router()

tagRouter.get('/', validateRequest(getPostsSchema), tagController.getPosts)

tagRouter.get('/all', tagController.fetchAllTags)

tagRouter.post(
  '/add/:postId',
  validateRequest(addTagsSchema),
  tagController.addTagsToPost,
)

module.exports = tagRouter
