const { beforeEach, test, after, describe } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const app = require('../app')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const mongoose = require('mongoose')
const User = require('../models/user')

const api = supertest(app)

describe('when there is initially some blogs saved', () => {
  let token

  beforeEach(async () => {
    await User.deleteMany({})
    await Blog.deleteMany({})

    const passwordHash = await bcrypt.hash('salainen', 10)

    const user = new User({
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      passwordHash,
    })

    const savedUser = await user.save()

    const blogObjects = helper.initialBlogs.map(
      (blog) => new Blog({ ...blog, user: savedUser._id }),
    )
    const promiseArray = blogObjects.map((blog) => blog.save())
    await Promise.all(promiseArray)

    const userForToken = {
      username: savedUser.username,
      id: savedUser._id,
    }

    token = jwt.sign(userForToken, process.env.SECRET)
  })

  test('returns the correct amount of blog posts in the JSON format', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('unique identifier property of the blog posts is named id', async () => {
    const response = await api.get('/api/blogs')
    const blogToTest = response.body[0]
    assert.notStrictEqual(blogToTest.id, undefined)
    assert.strictEqual(blogToTest._id, undefined)
  })

  test('it successfully creates a new blog post', async () => {
    const newBlog = {
      title: 'Angular',
      author: 'Yarik Ser',
      url: 'https://angular.com/',
      likes: 23,
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map((b) => b.title)
    assert(titles.includes('Angular'))
  })

  test('if the likes property is missing from the request, it will default to the value 0', async () => {
    const blogWithoutLikes = {
      title: 'Zero likes',
      author: 'Nulevoy',
      url: 'https://neti.com',
    }

    const response = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(blogWithoutLikes)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.likes, 0)
  })
  test('backend responds with 400 Bad Request if title is missing', async () => {
    const newBlog = {
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com',
      likes: 10,
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })

  test('backend responds with 400 Bad Request if url is missing', async () => {
    const newBlog = {
      title: 'Clean Architecture',
      author: 'Robert C. Martin',
      likes: 10,
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })

  test('updating single note', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]

    const updatedData = {
      ...blogToUpdate,
      likes: blogToUpdate.likes + 1,
    }

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updatedData)
      .expect(200)

    const blogsAtEnd = await helper.blogsInDb()
    assert.deepStrictEqual(blogsAtEnd[0].likes, blogToUpdate.likes + 1)
  })

  describe('deletion of a note', () => {
    test('succeeds with status code 204 if id is valid', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtStart.length, blogsAtEnd.length + 1)
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})
