const mongoose = require('mongoose')
// This can be added in case the timeout issue is not solved with adding timeout in test
// mongoose.set("bufferTimeoutMS", 30000)
const app = require('../app')
const supertest = require('supertest')
const api = supertest(app)

const Note = require('../models/note')
const helper = require('./test_helper')

// this is run before every single test
beforeEach(async () => {
  await Note.deleteMany({}) // We clear the database at the beginning to ensure it is in the same state before running tests

  const noteObjects = helper.initialNotes.map((note) => new Note(note)) // create an array of Mongoose objects
  const promiseArray = noteObjects.map((note) => note.save()) // create an array consisting of promises
  await Promise.all(promiseArray) // Promise.all method will transform an array of promises into a single promise
  // because Promise.all executes promises in parallel, we need a for...of loop if we want to execute in a particular order
  /*
beforeEach(async () => {
  await Note.deleteMany({})
  for (let note of helper.initialNotes) {
    let noteObject = new Note(note)
    await noteObject.save()
  }
}
*/
})

describe('when there is initially some notes saved', () => {
  test('notes are returned as json', async () => {
    console.log('entered test')
    await api
      .get('/api/notes')
      .expect(200)
      .expect('Content-Type', /application\/json/) //regular expression (regex) which starts and ends with a slash
  }, 100000) // 100000 is optional. It's added to sets the timeout to 100000 ms

  // the following tests inspect the response data stored in response.body property
  test('all notes are returned', async () => {
    const response = await api.get('/api/notes')

    expect(response.body).toHaveLength(helper.initialNotes.length)
  })

  test('a specific note is within the returned notes', async () => {
    const response = await api.get('/api/notes')

    const contents = response.body.map((r) => r.content)
    expect(contents).toContain('Browser can execute only JavaScript')
  })
})

describe('viewing a specific note', () => {
  test('a specific note can be viewed', async () => {
    const notesAtStart = await helper.notesInDb()
    const noteToView = notesAtStart[0]

    const resultNote = await api
      .get(`/api/notes/${noteToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(resultNote.body).toEqual(noteToView)
  })

  test('fails with status code 404 if note does not exist', async () => {
    const validNonExisitingId = await helper.nonExistingID()

    await api.get(`/api/notes/${validNonExisitingId}`).expect(404)
  })

  test('fails with status code 400 if id is invalid', async () => {
    const invalidId = '5a3d5da59070081a82a3445'

    await api.get(`/api/notes/${invalidId}`).expect(400)
  })
})

describe('addition of a new note', () => {
  test('a valid note can be added', async () => {
    const newNote = {
      content: 'async/await simplifies making async calls',
      important: true,
    }

    await api
      .post('/api/notes')
      .send(newNote)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const notesAtEnd = await helper.notesInDb()
    expect(notesAtEnd).toHaveLength(helper.initialNotes.length + 1)

    const contents = notesAtEnd.map((r) => r.content)
    expect(contents).toContain('async/await simplifies making async calls')
  })

  test('fails with status code 400 if data invalid', async () => {
    const newNote = {
      important: true,
    }
    await api.post('/api/notes').send(newNote).expect(400)

    const notesAtEnd = await helper.notesInDb()
    expect(notesAtEnd).toHaveLength(helper.initialNotes.length)
  })
})

describe('deletion of a note', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const notesAtStart = await helper.notesInDb()
    const noteToDelete = notesAtStart[0]

    await api.delete(`/api/notes/${noteToDelete.id}`).expect(204)

    const notesAtEnd = await helper.notesInDb()
    expect(notesAtEnd).toHaveLength(helper.initialNotes.length - 1)

    const contents = notesAtEnd.map((r) => r.content)
    expect(contents).not.toContain(noteToDelete.content)
  })
})

// once all tests are done, we need to close the database connection with the Jest's method - afterAll
afterAll(async () => {
  await mongoose.connection.close()
})
