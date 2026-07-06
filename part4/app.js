const config = require('./utils/config')
const express = require('express')
const app = express()
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')
const mongoose = require('mongoose')
const blogsRouter = require('./controllers/blogs')

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB Atlas')
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message)
  })

app.use(express.json())

app.use('/api/blogs', blogsRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
