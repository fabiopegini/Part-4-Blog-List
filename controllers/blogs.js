const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', (request, response, next) => {
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs)
    })
    .catch(error => next(error))
})

blogsRouter.get('/:id', (request, response, next) => {
  const { id } = request.params

  Blog.findById(id)
    .then(result => response.status(200).json(result))
    .catch(error => next(error))
})

blogsRouter.post('/', (request, response, next) => {
  const body = request.body

  if (!body.title || !body.author || !body.url) return response.status(400).send({ error: 'Missing data. A new blog must have a Title, an Author, and a URL. Also, may or may not have the amount of Likes it has' })

  const newBlog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes ?? 0
  })

  newBlog
    .save()
    .then(result => {
      response.status(201).json(result)
    })
    .catch(error => next(error))
})

blogsRouter.delete('/:id', (request, response, next) => {
  const { id } = request.params

  Blog.findByIdAndDelete(id)
    .then(result => response.status(200).json({ success: `The blog ${result.title} was successfully deleted` }))
    .catch(error => next(error))
})

blogsRouter.put('/:id', (request, response, next) => {
  const { id } = request.params
  const body = request.body

  const isEmpty = () => Object.keys(body).length === 0

  if(isEmpty(body)) return response.status(400).send({ error: 'You did not provide any updates for the resource' })

  Blog.findByIdAndUpdate(id, body, { returnDocument: 'after' })
    .then(result => response.status(200).json({success: `The blog: ${result.title}, was successfully modified`, result}))
    .catch(error => next(error))
})

module.exports = blogsRouter