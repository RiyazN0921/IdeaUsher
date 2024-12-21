require('dotenv').config()

const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3')

const dayjs = require('dayjs')

const s3 = new S3Client({
  region: process.env.R2_REGION,
  endpoint: process.env.R2_ENDPOINT_URL,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
})

const uploadToR2 = async (file) => {
  const uploadParams = {
    Bucket: process.env.R2_BUCKET,
    Key: `MediaFiles/${Date.now().toString()}-${file.originalname}`,
    Body: file.buffer,
  }

  const data = await s3.send(new PutObjectCommand(uploadParams))

  const publicUrl = `https://pub-${process.env.R2_ACCOUNT_ID}.r2.dev/${uploadParams.Key}`
  return publicUrl
}

const sendResponse = (res, statusCode, message, data = null) => {
  const response = { message }

  if (data) {
    response.data = data
  }

  return res.status(statusCode).json(response)
}

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'video/mp4',
    'video/webm',
    'video/avi',
  ]

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Only images and videos are allowed'), false)
  }
}

const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false })

    if (error) {
      const errors = error.details.map((err) => err.message)
      return sendResponse(res, 400, `Validation Error: ${errors.join(', ')}`)
    }

    next()
  }
}

const getToday = (returnType, format = 'DD-MM-YYYY') => {
  const today = dayjs()
  switch (returnType) {
    case 'date':
      return today.toDate()
    case 'dayjs':
      return today
    default:
      return today.format(format).toString()
  }
}

module.exports = {
  uploadToR2,
  sendResponse,
  fileFilter,
  validateRequest,
  getToday,
}
