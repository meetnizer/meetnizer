const itemSrv = require('../services/item')
var Datastore = require('nedb')
const sessionId = 'Awdxr'

test('saveItem', async function () {
  var db = new Datastore({
    autoload: true
  })

  const result = await itemSrv.addItem(db, sessionId, 'discuss about open source software', 'Bruno', 5, false)

  const record = await itemSrv.findById(db, result._id)

  expect(record._id.length).toBeGreaterThan(1)
  expect(record.name).toBe('discuss about open source software')
  expect(record.owner).toBe('Bruno')
  expect(record.time).toBe(5)
  expect(record.sessions.length).toBe(1)
  expect(record.sessions[0]).toBe(sessionId)
  expect(record.done).toBe(false)
})

test('addItemToSession', async function () {
  var db = new Datastore({
    autoload: true
  })

  const result = await itemSrv.addItem(db, sessionId, 'discuss about open source software', 'Bruno', 5, false)
  await itemSrv.addToSession(db, result._id, 'df45va325')
  const resultUpdated = await itemSrv.findById(db, result._id)
  expect(resultUpdated.sessions.length).toBe(2)
})

test('getAllItemsForSession', async function () {
  var db = new Datastore({
    autoload: true
  })

  await itemSrv.addItem(db, sessionId, 'discuss about open source software', 'Bruno', 5, false)
  await itemSrv.addItem(db, sessionId, 'discuss about open source software', 'Fabio', 5, false)
  const list = await itemSrv.findAll(db, sessionId)
  expect(list.length).toBe(2)
})

test('updateItem', async function () {
  var db = new Datastore({
    autoload: true
  })

  const resultSaved = await itemSrv.addItem(db, sessionId, 'discuss about open source software', 'Bruno', 5, false)
  await itemSrv.addComment(db, resultSaved._id, 'For the next meeting talk about the nginx server', false)
  const result = await itemSrv.findById(db, resultSaved._id)
  expect(result.done).toBe(false)
  expect(result.comments.length).toBe(1)
})

test('setupNewSession', async function () {
  var db = new Datastore({
    autoload: true
  })
  const newSessionId = 'aAeqwda'

  await itemSrv.addItem(db, sessionId, 'discuss about open source software', 'Bruno', 5, false)
  const record = await itemSrv.addItem(db, sessionId, 'discuss about serverless', 'Fabio', 5, false)
  const listResult = await itemSrv.findAll(db, sessionId)
  expect(listResult.length).toBe(2)
  await itemSrv.changeStatus(db, record._id, true)
  await itemSrv.setupNewSession(db, sessionId, newSessionId)
  const listNewSession = await itemSrv.findAll(db, newSessionId)
  expect(listNewSession.length).toBe(1)
  expect(listNewSession[0].sessions.length).toBe(2)
  expect(listNewSession[0].sessions[0]).toBe(sessionId)
  expect(listNewSession[0].sessions[1]).toBe(newSessionId)
})

test('addToSessionNotExists', async function () {
  var db = new Datastore({
    autoload: true
  })
  try {
    await itemSrv.addToSession(db, 'aaa', 'bbb')
  } catch (err) {
    expect(err.message).toBe('register.not.found')
  }
})

test('addCommentNotExists', async function () {
  var db = new Datastore({
    autoload: true
  })
  try {
    await itemSrv.addComment(db, 'aaa', 'my comment')
  } catch (err) {
    expect(err.message).toBe('register.not.found')
  }
})

test('changeStatusNotExists', async function () {
  var db = new Datastore({
    autoload: true
  })
  try {
    await itemSrv.changeStatus(db, 'dasdsa', false)
  } catch (err) {
    expect(err.message).toBe('register.not.found')
  }
})

test('setupNewSession', async function () {
  var db = new Datastore({
    autoload: true
  })
  const fakeSession = 'aAeqwda'

  try {
    await itemSrv.addItem(db, sessionId, 'discuss about open source software', 'Bruno', 5, false)
    await itemSrv.setupNewSession(db, fakeSession, 'newSession')
  } catch (err) {
    expect(err.message).toBe('setup.new.session.failed')
  }
})
