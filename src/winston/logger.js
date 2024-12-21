const { createLogger, transports } = require('winston')

const chalk = require('chalk')

const { getToday } = require('../utils/helper')

const logger = createLogger()

logger.add(
  new transports.File({
    filename: `logs/${getToday('string')}-info.log`,
    level: 'info',
  }),
)
logger.add(
  new transports.File({
    filename: `logs/${getToday('string')}-error.log`,
    level: 'error',
  }),
)
logger.add(
  new transports.Console({
    log({ message, level, error, id, date }, next) {
      const logs = { level, message: chalk.italic }
      if (id) logs.id = id
      if (date) logs.date = date
      if (error) logs.error = error

      let coloredLevel
      switch (level.toUpperCase()) {
        case 'ERROR':
          coloredLevel = chalk.black.bgRed(level.toUpperCase())
          break
        case 'WARN':
          coloredLevel = chalk.black.bgYellow(level.toUpperCase())
          break
        case 'INFO':
          coloredLevel = chalk.black.bgWhiteBright(level.toUpperCase())
          break
        case 'DEBUG':
          coloredLevel = chalk.black.bgYellowBright(level.toUpperCase())
          break
        default:
          coloredLevel = level
      }
      console.log(`${coloredLevel} ${message}`)
      next()
    },
  }),
)

module.exports = logger
