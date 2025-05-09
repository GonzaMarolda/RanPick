const jwt = require('jsonwebtoken')

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

const tokenExtractor = (request, response, next) => {
    const authorization = request.get('Authorization')
    if (authorization && authorization.startsWith('Bearer ')) {
      request.token = authorization.replace('Bearer ', '')
    }
    next()
}

const userExtractor = (request, response, next) => {
    if (request.token) {
        request.user = jwt.verify(request.token, process.env.SECRET)
    }
    next()
}

const unknownEndpoint = (request, response) => {
    if (request.path.startsWith('/api')) {
        response.status(404).send({ error: 'unknown endpoint' })
    }
}

const errorHandler = (error, request, response, next) => {
    return response.status(500).json({ error: error.message })
}

module.exports = {
    requestLogger,
    unknownEndpoint,
    errorHandler,
    tokenExtractor,
    userExtractor
}