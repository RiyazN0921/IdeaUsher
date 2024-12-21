function errorHandler(err, req, res, next) {
  console.error(err.stack)
  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({ error: err.message })
  }
  res.status(500).json({ error: err.message })
}

class CustomError extends Error {
  constructor(message, statusCode) {
    super(message)
    this.statusCode = statusCode || 500
  }
}

module.exports = { CustomError, errorHandler }
