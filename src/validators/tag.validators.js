const Joi = require('joi')

const getPostsSchema = Joi.object({
  page: Joi.number().integer().min(1).optional().default(1).messages({
    'number.base': `"page" should be a type of 'number'`,
    'number.integer': `"page" should be an integer`,
    'number.min': `"page" should be at least 1`,
  }),
  limit: Joi.number().integer().min(1).optional().default(10).messages({
    'number.base': `"limit" should be a type of 'number'`,
    'number.integer': `"limit" should be an integer`,
    'number.min': `"limit" should be at least 1`,
  }),
  keyword: Joi.string().trim().optional().messages({
    'string.base': `"keyword" should be a type of 'text'`,
  }),
  tag: Joi.string().trim().optional().messages({
    'string.base': `"tag" should be a type of 'text'`,
  }),
})

module.exports = { getPostsSchema }
