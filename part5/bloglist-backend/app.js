const express = require('express')
const mongoose = require('mongoose')
const blogsRouter = require('./controllers/blogs')
const {
  errorHandler,
  tokenExtractor,
  userExtractor,
} = require('./utils/middleware')
const config = require('./utils/config')
const logger = require('./utils/logger')
const userRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')

const app = express()

logger.info(`Connecting...`)
mongoose
  .connect(config.MONGODB_URI, { family: 4 })
  .then(() => {
    logger.info('Connected to MongoDB')
  })
  .catch((error) => {
    logger.error(`Error connecting to MongoDB: ${error.message}`)
  })

app.use(express.json())
app.use(tokenExtractor)
app.use('/api/blogs', blogsRouter)
app.use('/api/users', userRouter)
app.use('/api/login', loginRouter)

if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controllers/testing')
  app.use('/api/testing', testingRouter)
}

app.use(errorHandler)

module.exports = app
