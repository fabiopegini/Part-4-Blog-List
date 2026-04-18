const usersRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')

usersRouter.get('/', async (request, response, next) => {
  try {
    const users = await User.find({}).populate('blogs', { 
      title: 1, author: 1, url: 1
    })
    response.status(200).json(users)

  } catch(error) {
    next(error)
  }
})

usersRouter.post('/', async (request, response, next) => {
  const { username, name, password } = request.body

  if(!name || !password) return response.status(400).json({ error: 'Missing data, a new user must have: Name, Username and Password' })

  if(password.length < 4) return response.status(400).json({ error: 'The Password must have at least 3 characters' })

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const newUser = new User({
    username,
    name,
    passwordHash
  })

  try {
    const savedUser = await newUser.save()
    response.status(201).json(savedUser)

  } catch(error) {
    next(error)
  }
})

module.exports = usersRouter