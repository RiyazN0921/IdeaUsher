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

const addTagsSchema = Joi.object({
  tags: Joi.alternatives()
    .try(
      Joi.array()
        .items(
          Joi.string().trim().required().messages({
            'string.base': `"tags" should contain strings`,
            'string.empty': `"tags" cannot contain empty values`,
          }),
        )
        .required()
        .messages({
          'array.base': `"tags" should be an array`,
          'any.required': `"tags" is a required field`,
        }),
      Joi.string()
        .custom((value, helpers) => {
          try {
            const parsedTags = JSON.parse(value)
            if (
              Array.isArray(parsedTags) &&
              parsedTags.every((tag) => typeof tag === 'string')
            ) {
              return parsedTags
            } else {
              return helpers.message(
                '"tags" should be a valid JSON array of strings',
              )
            }
          } catch (err) {
            return helpers.message(
              '"tags" should be a valid JSON array of strings',
            )
          }
        })
        .required()
        .messages({
          'string.base': `"tags" should be a valid stringified JSON array`,
          'any.required': `"tags" is a required field`,
        }),
    )
    .required(),
})

module.exports = { getPostsSchema, addTagsSchema }
