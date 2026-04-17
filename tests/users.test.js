const { describe, test, after } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')
const helper = require('../tests/test_helper')

const api = supertest(app)

describe('all users api tests', () => {
  
  test('add new user, returns status 201, and check if was actually added to db', async () => {
    await User.deleteMany({})

    const prevAllUsers = await helper.getAllUsers()

    const newUser = helper.userSample

    const response = await api.post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-type', /application\/json/)

    const returnedUser = response.body
    
    const returnedUserStringified = JSON.stringify(returnedUser)

    const newAllUsers = await helper.getAllUsers()

    const newUserFound = newAllUsers.some(user => {
      return JSON.stringify(user) === returnedUserStringified})

    assert.strictEqual(newAllUsers.length, prevAllUsers.length + 1)
    assert(newUserFound)
  })

  test('add an existing user, returns status 400, an error msg and check if didnt add to db', async () => {
    const prevAllUsers = await helper.getAllUsers()

    const newUser = helper.userSample

    const response = await api.post('/api/users')
    .send(newUser)

    const newAllUsers = await helper.getAllUsers()

    assert.strictEqual(newAllUsers.length, prevAllUsers.length)
    assert.strictEqual(response.statusCode, 400)
    assert.strictEqual(response.error.text.includes('username already exists'), true)
  })
  
  test('add a user with no username, returns status 400, an error msg and check if didnt add to db', async () => {
    const prevAllUsers = await helper.getAllUsers()

    const newUser = {
      name: 'John',
      password: 'pass2345'
    }

    const response = await api.post('/api/users')
    .send(newUser)

    const newAllUsers = await helper.getAllUsers()

    assert.strictEqual(newAllUsers.length, prevAllUsers.length)
    assert.strictEqual(response.statusCode, 400)
    assert.strictEqual(response.error.text.includes('is required'), true)
  })

  test('add a user with a username with less than 3 char, returns status 400, an error msg and check if didnt add to db', async () => {
    const prevAllUsers = await helper.getAllUsers()

    const newUser = {
      username: 'jo',
      name: 'John',
      password: 'pass2345'
    }

    const response = await api.post('/api/users')
    .send(newUser)

    const newAllUsers = await helper.getAllUsers()

    assert.strictEqual(newAllUsers.length, prevAllUsers.length)
    assert.strictEqual(response.statusCode, 400)
    assert.strictEqual(response.error.text.includes('is shorter than the minimum allowed length (3)'), true)
  })

  test('add a user with a password with less than 3 char, returns status 400, an error msg and check if didnt add to db', async () => {
    const prevAllUsers = await helper.getAllUsers()

    const newUser = {
      username: 'johndoe2',
      name: 'John',
      password: 'pa'
    }

    const response = await api.post('/api/users')
    .send(newUser)

    const newAllUsers = await helper.getAllUsers()

    assert.strictEqual(newAllUsers.length, prevAllUsers.length)
    assert.strictEqual(response.statusCode, 400)
    assert.strictEqual(response.error.text.includes('at least 3 characters'), true)
  })

})

after(async () => {
  await mongoose.connection.close()
})
