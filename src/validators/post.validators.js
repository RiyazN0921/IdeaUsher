const Joi = require('joi')

const createPostSchema = Joi.object({
  title: Joi.string().trim().required().messages({
    'string.base': `"title" should be a type of 'text'`,
    'string.empty': `"title" cannot be an empty field`,
    'any.required': `"title" is a required field`,
  }),
  description: Joi.string().trim().optional().messages({
    'string.base': `"description" should be a type of 'text'`,
  }),
  tags: Joi.alternatives().try(
    Joi.array().items(Joi.string().trim()).optional().messages({
      'array.base': `"tags" should be an array`,
      'string.base': `"tags" should contain strings`,
    }),
    Joi.string()
      .custom((value, helpers) => {
        try {
          const parsedTags = JSON.parse(value)
          if (Array.isArray(parsedTags)) {
            return parsedTags
          } else {
            return helpers.message('"tags" should be a valid JSON array')
          }
        } catch (err) {
          return helpers.message('"tags" should be a valid JSON array')
        }
      })
      .optional()
      .messages({
        'string.base': `"tags" should be a valid stringified JSON array`,
      }),
  ),
  image: Joi.any().optional().messages({
    'any.base': `"image" should be a valid file`,
  }),
})

module.exports = { createPostSchema }
