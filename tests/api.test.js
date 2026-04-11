const { test, describe, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')

describe('api tests', () => {
  beforeEach(async () => {
    await Blog.deleteMany()
  
    const blogs = helper.sampleBlogs.map(blog => new Blog(blog))
    const promiseArray = blogs.map(blog => blog.save())
    await Promise.all(promiseArray)
  })
  
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all the blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, helper.sampleBlogs.length)
  })

  test('blogs have a key named id instead of _id', async () => {
    const blogs = await helper.getAllBlogs()

    const blogsKeys = blogs.map(blog => Object.keys(blog))

    assert.strictEqual(blogsKeys[0].includes('id'), true)
    assert.strictEqual(blogsKeys[0].includes('_id'), false)
  })

  test('a new blog can be added successfully and with the intended content', async () => {
    const oldBlogs = await helper.getAllBlogs()

    const newBlog = {
      title: "New Added Blog",
      author: "John Doe",
      url: "https://fullstackopen.com/",
      likes: 50,
    }
    
    const response = await api.post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-type', /application\/json/)
    
    const newBlogs = await helper.getAllBlogs()

    const newBlogWithId = { id: response.body.id, ...newBlog}

    assert.strictEqual(newBlogs.length, oldBlogs.length + 1)
    assert.deepStrictEqual(response.body, newBlogWithId)
  })
  
  after(async () => {
    await mongoose.connection.close()
  })
})
