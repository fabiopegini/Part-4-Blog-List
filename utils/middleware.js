const logger = require('./logger')

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:', request.path)
  logger.info('Body:', request.body)
  logger.info('---')
  next()
}

const handle404 = (request, response) => {
  return response.status(404).send({error: 'unknown endpoint'})
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if(error.name === 'CastError') return response.status(404).send({ error: 'The given id has a wrong format' })
  if(error.name === 'ValidationError') return response.status(400).send({ error: error.message })
  if(error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) return response.status(400).send({ error: 'username already exists' })
  if(error.name === 'JsonWebTokenError') return response.status(401).send({ error: 'invalid token' })
  if(error.name === 'TokenExpiredError') return response.status(401).send({ error: 'token expired' })
    
  next(error)
}

module.exports = { 
  requestLogger, 
  handle404, 
  errorHandler
}