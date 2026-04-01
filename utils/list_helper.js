const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const arrWithLikes = blogs.map(blog => blog.likes)

  return arrWithLikes.reduce((acc, likes) => acc + likes, 0)
}

const favoriteBlog = (blogs) => {
  let mostLikesYet = 0
  let mostLikedBlog = undefined

  for(const blog of blogs) {
    if(mostLikesYet > blog.likes) continue
    mostLikesYet = blog.likes
    mostLikedBlog = { title: blog.title, author: blog.author, likes: blog.likes }
  }

  return mostLikedBlog
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}