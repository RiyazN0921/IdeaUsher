const { CustomError } = require('../middleware/errorHandler.middleware')

const postModel = require('../model/post.model')

const tagModel = require('../model/tag.model')

const { sendResponse } = require('../utils/helper')

exports.getPosts = async (req, res, next) => {
  try {
    const validParams = ['sort', 'page', 'limit', 'keyword', 'tag']
    const invalidParams = Object.keys(req.query).filter(
      (param) => !validParams.includes(param),
    )

    if (invalidParams.length > 0) {
      throw new CustomError(
        `Invalid query parameters: ${invalidParams.join(', ')}`,
        400,
      )
    }

    const {
      sort = 'createdAt',
      page = 1,
      limit = 10,
      keyword = '',
      tag = '',
    } = req.query

    const parsedPage = parseInt(page, 10)
    const parsedLimit = parseInt(limit, 10)

    const sortOption = {}
    if (sort === 'title') {
      sortOption.title = 1
    } else if (sort === 'createdAt') {
      sortOption.createdAt = -1
    }

    let filter = {}

    if (keyword) {
      filter.$or = [
        { title: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
      ]
    }

    if (tag) {
      const tagDoc = await tagModel.findOne({ name: tag })
      if (tagDoc) {
        filter.tags = tagDoc._id
      } else {
        throw new CustomError('Tag not found', 404)
      }
    }

    const posts = await postModel
      .find(filter)
      .sort(sortOption)
      .skip((parsedPage - 1) * parsedLimit)
      .limit(parsedLimit)
      .populate('tags')

    const totalPosts = await postModel.countDocuments(filter)

    return sendResponse(res, 200, 'Posts retrieved successfully', {
      posts,
      totalPosts,
      totalPages: Math.ceil(totalPosts / parsedLimit),
      currentPage: parsedPage,
    })
  } catch (error) {
    next(error)
  }
}

exports.addTagsToPost = async (req, res, next) => {
  try {
    const { postId } = req.params
    const { tags } = req.body

    const tagIds = await Promise.all(
      tags.map(async (tagName) => {
        let tag = await tagModel.findOne({ name: tagName })
        if (!tag) {
          tag = await tagModel.create({ name: tagName })
        }
        return tag._id
      }),
    )

    const updatedPost = await postModel.findByIdAndUpdate(
      postId,
      { $addToSet: { tags: { $each: tagIds } } },
      { new: true },
    )

    if (!updatedPost) {
      throw new CustomError('post not found', 404)
    }

    return sendResponse(res, 200, 'tags added successfully', updatedPost)
  } catch (error) {
    next(error)
  }
}

exports.fetchAllTags = async (req, res, next) => {
  try {
    const tags = await tagModel.find()

    return sendResponse(res, 200, 'tags fetched successfully', tags)
  } catch (error) {
    next(error)
  }
}
