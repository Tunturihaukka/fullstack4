const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

test('correct amount of blogs are returned as json', async () => {
  const res = await api.get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
  expect(res.body).toHaveLength(2)
})

afterAll(async () => {
  await mongoose.connection.close()
})