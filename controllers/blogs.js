require('express-async-error')
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const config = require('../utils/config')

  
blogsRouter.get('/', async (request, response, next) => {
  try {
    const result = await Blog.find({}).populate('user', { username: 1, name: 1 })
    response.json(result)
  } catch (exception) {
    next(exception)
  }
})

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}
  
blogsRouter.post('/', async (request, response, next) => {
  const body = request.body
  try {
    const decodedToken = jwt.verify(getTokenFrom(request), config.SECRET)
    console.log('tok', decodedToken)
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid' })
    }
    const user = await User.findById(decodedToken.id)

    //const userData = await User.find({})
    //const user = userData[0]
    const firstEncounteredId = user.id
    const blogBody = {
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes,
      user: firstEncounteredId
    }

    const blog = new Blog(blogBody)
  
    const result = await blog.save()
    response.status(201).json(result)
    const userToUpdate = await User.findById(firstEncounteredId)
    userToUpdate.blogs = userToUpdate.blogs.concat(result.id)
    await userToUpdate.save()
  } catch(exception) {
    next(exception)
  }

  
})

blogsRouter.get('/:id', async (request, response, next) => {
  try {
    const blog = await Blog.findById(request.params.id)
    if (blog) {
      response.status(204).json(blog)
    } else {
      response.status(404).end()
    }
  } catch(exception) {
    next(exception)
  }
})

blogsRouter.delete('/:id', async (request, response, next) => {
  try {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
  } catch (exception) {

    next(exception)
  }
})

blogsRouter.put('/:id', async (request, response, next) => {
  const blog = {
    title: request.body.title,
    author: request.body.author,
    url: request.body.url,
    likes: request.body.likes
  }

  try {
    const updatedPerson = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    response.json(updatedPerson)
  } catch (exception) {
    next(exception)
  }
})

module.exports = blogsRouter