const { CustomError } = require('../middleware/errorHandler.middleware')

const postModel = require('../model/post.model')

const tagModel = require('../model/tag.model')

const { uploadToR2, sendResponse } = require('../utils/helper')

exports.createPost = async (req, res, next) => {
  try {
    let imageUrl = ''
    if (req.file) {
      imageUrl = await uploadToR2(req.file)
    }

    let tagIds = []
    if (req.body.tags) {
      try {
        const tagsArray = JSON.parse(req.body.tags)

        if (Array.isArray(tagsArray)) {
          tagIds = await Promise.all(
            tagsArray.map(async (tagName) => {
              const existingTag = await tagModel.findOne({ name: tagName })
              if (existingTag) {
                return existingTag._id
              }
              const newTag = await tagModel.create({ name: tagName })
              return newTag._id
            }),
          )
        }
      } catch (error) {
        throw new CustomError(
          'Invalid tags format, should be a valid JSON array',
          400,
        )
      }
    }

    const newPost = await postModel.create({
      title: req.body.title,
      description: req.body.description,
      image: imageUrl,
      tags: tagIds,
    })

    await newPost.save()

    return sendResponse(res, 201, 'Post created successfully', newPost)
  } catch (error) {
    if (error.message === 'Only images and videos are allowed') {
      return sendResponse(res, 400, error.message)
    }
    next(error)
  }
}

exports.fetchAllTagsAlongWithPosts = async (req, res, next) => {
  try {
    const tags = await postModel.find().populate('tags')

    return sendResponse(res, 200, 'tags and posts fetched successfully', tags)
  } catch (error) {
    next(error)
  }
}
