const config = require('./utils/config')
const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const notesRouter = require('./controllers/notes')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

logger.info('connecting to', config.MONGODB_URI)

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => logger.error('error connecting to MongoDB', error.message))

app.use(cors()) //cross-origin resources sharing
app.use(express.static('build')) //built-in middleware from express, should be used first
app.use(express.json()) //json parser
app.use(middleware.requestLogger)

app.use('/api/notes', notesRouter)

app.use(middleware.unknownEndpoint) //handler of requests with unknown endpoint, place last
app.use(middleware.errorHandler) //this has to be the last loaded middleware, place last

module.exports = app
