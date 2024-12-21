const express = require('express')

require('dotenv').config()

const bodyParser = require('body-parser')

const { dbConnection } = require('./src/config/db.config')

const mainRouter = require('./src/routes/index.routes')

const { logMiddleware } = require('./src/middleware/logger.middleware')

const logger = require('./src/winston/logger')

const cors = require('cors')

const chalk = require('chalk')

const app = express()

app.use(bodyParser.json())

app.use(bodyParser.urlencoded({ extended: true }))

app.use(logMiddleware)

app.use(cors())

app.use('/api', mainRouter)

logger.info(
  `${chalk.bold.blueBright(
    'Express application running in',
  )} ${chalk.black.bold.bgCyan(process.env.NODE_ENV)} environment`,
)

app.listen(process.env.PORT || 4000, async () => {
  await dbConnection()
  logger.info(
    `${chalk.bold.blueBright(
      'Server started at port',
    )}: ${chalk.bold.blueBright(
      process.env.PORT || 4000,
    )}, in ${chalk.black.bgGreenBright(` ${process.env.NODE_ENV} `)} mode`,
  )
})
