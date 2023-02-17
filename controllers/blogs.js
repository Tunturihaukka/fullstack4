const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

  
blogsRouter.get('/', async (request, response, next) => {
  try {
    const result = await Blog.find({})
    response.json(result)
  } catch (exception) {
    next(exception)
  }
})
  
blogsRouter.post('/', async (request, response, next) => {
  const blog = new Blog(request.body)

  try {
    const result = await blog.save()
    response.status(201).json(result)
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