const mongoose = require('mongoose')
const supertest = require('supertest')
const { response } = require('../app')
const app = require('../app')
const Blog = require('../models/Blog')

const initialBlogs = [
  {
    title: 'ab urbe contita',
    author: 'Titus Livius',
    url: 'testurl1',
    likes: 15
  },
  {
    title: 'bellum troianorum',
    author: 'Homeros',
    url: 'testurl2',
    likes: 78
  },
]

beforeEach(async () => {
  await Blog.deleteMany({})
  let blogObject = new Blog(initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(initialBlogs[1])
  await blogObject.save()
})

const api = supertest(app)

test('correct amount of blogs are returned as json', async () => {
  const res = await api.get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
  expect(res.body).toHaveLength(initialBlogs.length)
})

test('all blogs have identifying id field', async () => {
  const res = await api.get('/api/blogs')
  res.body.forEach(blogToCheck => {
    expect(blogToCheck.id).toBeDefined()
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})