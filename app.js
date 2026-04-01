const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const blogsRouter = require('./controllers/blogs')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')
const mongoose = require('mongoose')

const dns = require('dns')
dns.setServers(['1.1.1.1'])

logger.info('conecting to DB...')

mongoose.connect(config.MONGODB_URI, { dbName: 'bloglist' })
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

app.use('/api/blogs', blogsRouter)

app.use(middleware.handle404)
app.use(middleware.errorHandler)

module.exports = app
