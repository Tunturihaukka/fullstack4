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

module.exports = {
  dummy, 
  likes,
  favouriteBlog
}