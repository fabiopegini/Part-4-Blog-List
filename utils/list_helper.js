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

const mostBlogs = (blogs) => {
  const repeatedAuthors = blogs.map(blog => blog.author)

  const authors = []

  repeatedAuthors.forEach(repeatedAuthor => {
    const index = authors.findIndex(({ author }) => author === repeatedAuthor)
    const isAlready = index >= 0

    if(isAlready) authors[index].blogs += 1
    if(!isAlready) authors.push({ author: repeatedAuthor, blogs: 1 })
  })

  let authorWithMostBlogs = undefined

  for(const author of authors) {
    if(authorWithMostBlogs > author.blogs) continue
    authorWithMostBlogs = author
  }

  return authorWithMostBlogs
}

const mostLikes = (blogs) => {
  const repeatedAuthors = blogs.map(blog => blog.author)

  const authors = []

  repeatedAuthors.forEach(repeatedAuthor => {
    const index = authors.findIndex(({ author }) => author === repeatedAuthor)
    const isAlready = index >= 0

    if(!isAlready) authors.push({ author: repeatedAuthor, likes: 0})
  })

  const authorsWithLikes = authors.map(({author, likes}) => {
    const authorLikes = blogs.reduce((acc, blog) => {
      if(author === blog.author) acc += blog.likes
      return acc
    }, 0)

    likes = authorLikes

    return { author, likes }
  })

  let mostLikes = 0
  let mostLikedAuthor = undefined

  for(const author of authorsWithLikes) {
    if(author.likes < mostLikes) continue

    mostLikes = author.likes
    mostLikedAuthor = author
  }

  return mostLikedAuthor
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}