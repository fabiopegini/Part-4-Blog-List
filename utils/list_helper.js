const dummy = (blogs) => {
  return 1
}

const totalLikes = (listOfBlogs) => {
  const arrWithLikes = listOfBlogs.map(blog => blog.likes)

  return arrWithLikes.reduce((acc, likes) => acc + likes, 0)
}

module.exports = {
  dummy,
  totalLikes
}