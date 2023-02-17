const Blog = require('../models/blog')

const initialBlogs = [
  {
    title: 'ab urbe condita',
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

const nonExistingId = async () => {
  const blog = new Blog({ title: 'will be', url: 'removed' })
  await blog.save()
  await blog.remove()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  
  return blogs
}

module.exports = {
  initialBlogs, nonExistingId, blogsInDb
}