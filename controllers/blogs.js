const blogsRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Blog = require('../models/blog')
const User = require('../models/user')

const getTokenFrom = (request) => {
  const authorization = request.get('authorization')
  if(authorization && authorization.startsWith('Bearer ')) return authorization.replace('Bearer ', '')
  
  return null
}

blogsRouter.get('/', async (request, response, next) => {
  try {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
    return response.json(blogs)

  } catch(error) {
    next(error)
  }
})

blogsRouter.get('/:id', async (request, response, next) => {
  const { id } = request.params

  try {
    const blog = await Blog.findById(id).populate('user', { username: 1, name: 1 })
    return response.status(200).json(blog)

  } catch(error) {
    next(error)
  }
})

blogsRouter.post('/', async (request, response, next) => {
  const body = request.body

  if (!body.title || !body.author || !body.url) return response.status(400).send({ error: 'Missing data. A new blog must have a Title, an Author, and a URL. Also, may or may not have the amount of Likes it has' })

  const tokenFromReq = getTokenFrom(request)
  const decodedToken = jwt.verify(tokenFromReq, process.env.SECRET)

  if(!decodedToken.id) return response.status(401).json({ error: 'invalid token' })

  try {
    const user = await User.findById(decodedToken.id)

    const newBlog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes ?? 0,
      user: user.id
    })

    const savedBlog = await newBlog.save()

    await User.findByIdAndUpdate(user.id, { blogs: [savedBlog._id, ...user.blogs] })

    return response.status(201).json(savedBlog)
    
  } catch(error) {
    next(error)
  }
})

blogsRouter.delete('/:id', async (request, response, next) => {
  const { id } = request.params

  try {
    const result = await Blog.findByIdAndDelete(id)
    return response.status(200).json({ success: `The blog ${result.title} was successfully deleted` })

  } catch(error) {
    next(error)
  }
})

blogsRouter.put('/:id', async (request, response, next) => {
  const { id } = request.params
  const body = request.body

  const isEmpty = () => Object.keys(body).length === 0

  if(isEmpty(body)) return response.status(400).send({ error: 'You did not provide any updates for the resource' })

  try {
    const result = await Blog.findByIdAndUpdate(id, body, { returnDocument: 'after' })
    return response.status(200).json({ success: `The blog: ${result.title}, was successfully modified`, result })

  } catch(error) {
    next(error)
  }
})

module.exports = blogsRouter