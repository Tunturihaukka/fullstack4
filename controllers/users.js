require('express-async-error')
const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')
const Blog = require('../models/blog')


usersRouter.post('/', async (request, response, next) => {
  const { username, password, name } = request.body
  if (typeof password !== 'undefined') {
    if (password.length < 3) { 
      response.status(400).json('password needs to be at least 3 characters long')
      return
    }
  }
  
  if (typeof password === 'undefined') {
    response.status(400).json('password is required')
    return
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    passwordHash,
    name
  })

  try {
    const savedUser = await user.save()
    response.status(201).json(savedUser)
  } catch (exception) {
    next(exception)
  }
})

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs')
  response.json(users)
})

module.exports = usersRouter