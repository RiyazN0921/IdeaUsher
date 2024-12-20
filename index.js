const express = require('express')

require('dotenv').config()

const bodyParser = require('body-parser')
const { dbConnection } = require('./src/config/db.config')

const app = express()

app.use(bodyParser.json())

app.listen(process.env.PORT, async () => {
    await dbConnection()
    console.log(`server running on localhost:` + process.env.PORT)
})