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
  
  after(async () => {
    await mongoose.connection.close()
  })
})
