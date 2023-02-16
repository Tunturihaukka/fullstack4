const logger = require('./logger')
const _ = require('lodash')

const dummy = () => {
  return 1
}

const likes = (blogs) => {
  const likeSum = blogs.reduce(
    (accumulator, current) => accumulator + current.likes,
    0
  )
  return likeSum
}

const favouriteBlog = (blogs) => {
  const mostLikes = (lastFav, current) => {
    if (lastFav.likes < current.likes) {
      return current
    }
    return lastFav
  }
  return blogs.reduce(mostLikes, {likes: -1})
}

const mostBlogs = (blogs) => {
  const blogStatistics = _.entries(_.countBy(blogs, 'author'))
  const highestCount = _.maxBy(blogStatistics, _.last)
  const toObject = {
    author: highestCount[0],
    blogs: highestCount[1]
  }
  
  return toObject
}

// Note that a brute force solution using 'let x' is used here

const mostLikes = (blogs) => {
  const blogsByAuthor =_.groupBy(blogs, 'author')
  let likes = []
  for (const key in blogsByAuthor){
    const likeSum = blogsByAuthor[key].reduce(
      (likes, currentObj) => likes + currentObj.likes,
      0
    )
    likes = likes.concat(likeSum)
  }
  let authors = []
  const keys = Object.keys(blogsByAuthor)
  for (let i = 0; i < likes.length; i++){
    authors = authors.concat({author: keys[i], likes: likes[i]})
  }

  const highestCount = _.maxBy(authors, 'likes')

  return highestCount
}
/* # For testing purposes
const blogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0
  },
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    __v: 0
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    __v: 0
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    __v: 0
  }  
]
logger.info(mostLikes(blogs))
*/
module.exports = {
  dummy, 
  likes,
  favouriteBlog,
  mostBlogs,
  mostLikes
}