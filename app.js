const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')
const mongoose = require('mongoose')

const dns = require('dns')
dns.setServers(['1.1.1.1'])

logger.info('conecting to DB...')

mongoose.connect(config.MONGODB_URI, { dbName: config.MONGODB_DBNAME })
.then(() => {
  logger.info('connected to DB')
})
.catch(error => {
  logger.info('error connecting to DB:', error)
})

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())

app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)

app.use('/api/blogs', middleware.userExtractor, blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

app.use(middleware.handle404)
app.use(middleware.errorHandler)

module.exports = app
