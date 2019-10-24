const item = require('../services/item')
var Datastore = require('nedb')
const sessionId = 'Awdxr'

test('saveItem', async function () {
  var db = new Datastore({
    autoload: true
  })

  const result = await item.addItem(db, sessionId, 'discuss about open source software', 'Bruno', 5, false)

  const record = await item.findById(db, result._id)

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

  const result = await item.addItem(db, sessionId, 'discuss about open source software', 'Bruno', 5, false)
  await item.addToSession(db, result._id, 'df45va325')
  const resultUpdated = await item.findById(db, result._id)
  expect(resultUpdated.sessions.length).toBe(2)
})

test('getAllItemsForSession', async function () {
  var db = new Datastore({
    autoload: true
  })

  await item.addItem(db, sessionId, 'discuss about open source software', 'Bruno', 5, false)
  await item.addItem(db, sessionId, 'discuss about open source software', 'Fabio', 5, false)
  const list = await item.findAll(db, sessionId)
  expect(list.length).toBe(2)
})

test('updateItem', async function () {
  var db = new Datastore({
    autoload: true
  })

  const resultSaved = await item.addItem(db, sessionId, 'discuss about open source software', 'Bruno', 5, false)
  await item.addComment(db, resultSaved._id, 'For the next meeting talk about the nginx server', false)
  const result = await item.findById(db, resultSaved._id)
  expect(result.done).toBe(false)
  expect(result.comments.length).toBe(1)
})

test('setupNewSession', async function () {
  var db = new Datastore({
    autoload: true
  })
  const newSessionId = 'aAeqwda'

  await item.addItem(db, sessionId, 'discuss about open source software', 'Bruno', 5, false)
  const record = await item.addItem(db, sessionId, 'discuss about serverless', 'Fabio', 5, false)
  const listResult = await item.findAll(db, sessionId)
  expect(listResult.length).toBe(2)
  await item.changeStatus(db, record._id, true)
  await item.setupNewSession(db, sessionId, newSessionId)
  const listNewSession = await item.findAll(db, newSessionId)
  expect(listNewSession.length).toBe(1)
  expect(listNewSession[0].sessions.length).toBe(2)
  expect(listNewSession[0].sessions[0]).toBe(sessionId)
  expect(listNewSession[0].sessions[1]).toBe(newSessionId)
})
/*

test('changeItemStatus', async function() {
  await item.changeStatus(db, result._id, true);
  const result1 = await item.findById(db, result._id);
  expect(result1.done).toBe(true)
  expect(result1.comments.length).toBe(1)
})
*/
