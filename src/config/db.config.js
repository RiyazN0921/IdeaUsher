require('dotenv').config()

const mongoose = require('mongoose')

const logger = require('../winston/logger')

const chalk = require('chalk')

exports.dbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    logger.info(chalk.bold.blueBright('Database Connection Successful'))
  } catch (error) {
    logger.error(chalk.red.red(error))
  }
}
