const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const helper = require('./test_helper')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('the correct amount of blogs are returned', async () => {
  const response = await api.get('/api/blogs')
  assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test('the unique identifier property of the blog posts is named id', async () => {
  const response = await api.get('/api/blogs')
  const firstBlog = response.body[0]
  assert(firstBlog.id) // id property exists
  assert.strictEqual(firstBlog._id, undefined) // _id property doesn't exist
})

test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'Async/await simplifies testing',
    author: 'John Doe',
    url: 'https://fullstackopen.com/',
    likes: 4
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()

  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

  const titles = blogsAtEnd.map((blog) => blog.title)
  assert(titles.includes('Async/await simplifies testing'))
})

test('if the likes property is missing, it defaults to 0', async () => {
  const newBlogMissingLikes = {
    title: 'Testing default likes value',
    author: 'Jane Doe',
    url: 'https://example.com'
  }

  const response = await api
    .post('/api/blogs')
    .send(newBlogMissingLikes)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.likes, 0)
})

test('fails with status code 400 if title is missing', async () => {
  const newBlogMissingTitle = {
    author: 'Jane Doe',
    url: 'https://example.com',
    likes: 5
  }

  await api.post('/api/blogs').send(newBlogMissingTitle).expect(400)
})

test('fails with status code 400 if url is missing', async () => {
  const newBlogMissingUrl = {
    title: 'Testing missing URL',
    author: 'Jane Doe',
    likes: 5
  }

  await api.post('/api/blogs').send(newBlogMissingUrl).expect(400)
})

test('succeeds with status code 204 if id is valid', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToDelete = blogsAtStart[0]

  await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)

  const titles = blogsAtEnd.map((blog) => blog.title)
  assert(!titles.includes(blogToDelete.title))
})

test('succeeds with a valid id and updates the likes', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToUpdate = blogsAtStart[0]

  const updatedBlogData = {
    ...blogToUpdate,
    likes: blogToUpdate.likes + 1
  }

  const response = await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(updatedBlogData)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.likes, blogToUpdate.likes + 1)

  const blogsAtEnd = await helper.blogsInDb()
  const updatedBlogInDb = blogsAtEnd.find((b) => b.id === blogToUpdate.id)
  assert.strictEqual(updatedBlogInDb.likes, blogToUpdate.likes + 1)
})

after(async () => {
  await mongoose.connection.close()
})
