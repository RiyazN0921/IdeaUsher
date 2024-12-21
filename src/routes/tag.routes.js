const express = require('express')

const tagController = require('../controller/tag.controller')

const { validateRequest } = require('../utils/helper')

const { getPostsSchema } = require('../validators/tag.validators')

const tagRouter = express.Router()

tagRouter.get('/', validateRequest(getPostsSchema), tagController.getPosts)

module.exports = tagRouter
