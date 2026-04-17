const { test, describe, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')

const api = supertest(app)

const Blog = require('../models/blog')

describe('api tests with some blogs already in the db', () => {
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


  describe('add one blog tests', () => {
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

    test('default value for a blog\'s likes is 0', async () => {
      const newBlog = {
        title: "A blog that is added without a likes key",
        author: "Jane Doe",
        url: "https://fullstackopen.com/",
      }

      const response = await api.post('/api/blogs')
      .send(newBlog)

      assert.strictEqual(response.body.likes, 0)
    })

    test('trying to add an incomplete blog receive a response with status code 400 Bad Request', async () => {
      const newBlogNoAuthor = {
        title: "No author blog",
        url: "https://fullstackopen.com/",
        likes: 0
      }

      const newBlogNoTitle = {
        author: "Jane Doe, No title blog",
        url: "https://fullstackopen.com/",
        likes: 0
      }

      const newBlogNoUrl = {
        title: 'Blog without a url',
        author: "Jane Doe, No title blog",
        likes: 0
      }

      const noAuthorResponse = await api.post('/api/blogs')
      .send(newBlogNoAuthor)
      const noTitleResponse = await api.post('/api/blogs')
      .send(newBlogNoTitle)
      const noUrlResponse = await api.post('/api/blogs')
      .send(newBlogNoUrl)

      assert.strictEqual(noAuthorResponse.statusCode, 400)
      assert.strictEqual(noTitleResponse.statusCode, 400)
      assert.strictEqual(noUrlResponse.statusCode, 400)
    })
  })

  test('delete one blog', async () => {
    const oldBlogs = await helper.getAllBlogs()
    const blogToDelete = oldBlogs[0]

    await api.delete('/api/blogs/' + blogToDelete.id)
    .expect(200)

    const blogsAfter = await helper.getAllBlogs()

    assert.strictEqual(blogsAfter.length, oldBlogs.length - 1)
    assert.strictEqual(blogsAfter.includes(blogToDelete), false)
  })

  describe('modifiy one blog', async () => {
    const allBlogs = await helper.getAllBlogs()

    const blogToModify = allBlogs[0]

    test('title can be modified', async () => {
      const modifiedData = { title: 'This blog was modified' }

      const response = await api.put('/api/blogs/' + blogToModify.id)
      .send(modifiedData)
      .expect(200)
      
      assert.strictEqual(response.body.result.title, modifiedData.title)
    })
    
    test('author can be modified', async () => {
      const modifiedData = { author: 'This author\'s blog was modified' }

      const response = await api.put('/api/blogs/' + blogToModify.id)
      .send(modifiedData)
      .expect(200)
      
      assert.strictEqual(response.body.result.author, modifiedData.author)
    })

    test('url can be modified', async () => {
      const modifiedData = { url: 'This url\'s blog was modified' }

      const response = await api.put('/api/blogs/' + blogToModify.id)
      .send(modifiedData)
      .expect(200)
      
      assert.strictEqual(response.body.result.url, modifiedData.url)
    })

    test('likes can be modified', async () => {
      const modifiedData = { likes: 999 }

      const response = await api.put('/api/blogs/' + blogToModify.id)
      .send(modifiedData)
      .expect(200)
      
      assert.strictEqual(response.body.result.likes, modifiedData.likes)
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})
