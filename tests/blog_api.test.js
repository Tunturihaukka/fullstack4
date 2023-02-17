const mongoose = require('mongoose')
const supertest = require('supertest')
const { response } = require('../app')
const app = require('../app')
const Blog = require('../models/Blog')
const helper = require('./test_helper')

beforeEach(async () => {
  await Blog.deleteMany({})
  let blogObject = new Blog(helper.initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(helper.initialBlogs[1])
  await blogObject.save()
})

const api = supertest(app)

test('correct amount of blogs are returned as json', async () => {
  const res = await api.get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
  expect(res.body).toHaveLength(helper.initialBlogs.length)
})

test('all blogs have identifying id field', async () => {
  const res = await api.get('/api/blogs')
  res.body.forEach(blogToCheck => {
    expect(blogToCheck.id).toBeDefined()
  })
})

test('adding a blog works properly', async () => {
  const newBlog = {
    title: 'summa theologica',
    author: 'Tuomas Akvinolainen',
    url: 'testurl3',
    likes: 57
  }
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const res = await api.get('/api/blogs')

  expect(res.body).toHaveLength(helper.initialBlogs.length + 1)
})

test('likes gets zero if not initialized', async () => {
  const newBlog = {
    title: 'naming of Barabbas',
    author: 'Origenes',
    url: 'testurl4',
  }
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const res = await api.get('/api/blogs')
  expect(res.body[res.body.length-1].likes).toBeDefined()
  expect(res.body[res.body.length-1].likes).toBe(0)

})

test('no given title or url yields 400 Bad Request', async () => {
  const noTitle = {
    author: 'Euripides',
    url: 'testurl5',
    likes: 1
  }
  const noUrl = {
    title: 'Oidipus tarinat',
    author: 'Sofokles',
    likes: 1
  }
  await api.post('/api/blogs')
    .send(noTitle)
    .expect(400)
  await api.post('/api/blogs')
    .send(noUrl)
    .expect(400)

})

test ('deletion of a note', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToDelete = blogsAtStart[0]
  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204)

  const blogsAtEnd = await helper.blogsInDb()

  expect(blogsAtEnd).toHaveLength(
    helper.initialBlogs.length - 1
  )
})

test ('updating likes of a note', async () => {
  const testLikes = 100000
  const blogsAtStart = await helper.blogsInDb()
  const blogToUpdate = blogsAtStart[0]

  expect(blogToUpdate.likes).not.toBe(testLikes)
  const updatedBlog = {
    title: blogToUpdate.title,
    author: blogToUpdate.author,
    url: blogToUpdate.url,
    likes: testLikes
  }
  await api
    .put(`/api/blogs/${blogToUpdate.id}`).send(updatedBlog)
    .expect(200)

  const blogsAtEnd = await helper.blogsInDb()
  const blogToCheck = blogsAtEnd[0]
  
  expect(blogToCheck.likes).toBe(testLikes)
})

afterAll(async () => {
  await mongoose.connection.close()
})