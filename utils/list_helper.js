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

module.exports = {
  dummy, 
  likes
}