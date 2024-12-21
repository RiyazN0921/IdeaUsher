const logger = require('../winston/logger')

const chalk = require('chalk')

exports.logMiddleware = (req, res, next) => {
  const logMessage = `[${new Date().toISOString()}] ${req.method} ${
    req.url
  } - ${req.ip} - ${JSON.stringify(req.body)}`

  const startTime = Date.now()

  res.on('finish', () => {
    const endTime = Date.now()
    const responseTime = endTime - startTime

    const responseLogMessage = `${logMessage} - Status: ${res.statusCode} - Response Time: ${responseTime}ms`

    if (res.statusCode >= 400) {
      coloredLogMessage = logger.error(chalk.red.red(responseLogMessage))
    } else {
      coloredLogMessage = logger.info(chalk.bold.blueBright(responseLogMessage))
    }
  })

  next()
}
