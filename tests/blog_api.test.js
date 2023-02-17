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

  expect(res.body).toHaveLength(initialBlogs.length + 1)
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

afterAll(async () => {
  await mongoose.connection.close()
})