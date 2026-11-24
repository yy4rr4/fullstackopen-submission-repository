const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const sumOfLikes = blogs.reduce((sum, current) => sum + current.likes, 0)
  return sumOfLikes
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null

  return blogs.reduce((favorite, current) =>
    current.likes > favorite.likes ? current : favorite,
  )
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null

  const counts = _.countBy(blogs, 'author')

  const authorList = _.map(counts, (blogs, author) => ({
    author,
    blogs,
  }))

  return _.maxBy(authorList, 'blogs')
}

const mostLikes = (blogs) => {
  const groupedBlogs = _.groupBy(blogs, 'author')

  const authorLikes = _.map(groupedBlogs, (authorBlogs, author) => ({
    author,
    likes: _.sumBy(authorBlogs, 'likes'),
  }))

  // console.log(groupedBlogs)
  // console.log(authorLikes)
  console.log(_.max(authorLikes, 'likes'))

  return _.max(authorLikes, 'likes')
}

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes }
