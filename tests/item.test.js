const itemSrv = require('../services/item')
var Datastore = require('nedb')
const sessionId = 'Awdxr'
const meetingId = 'myMeetingId'

test('saveItem', async function () {
  var db = new Datastore({
    autoload: true
  })

  const result = await itemSrv.addItem(db, meetingId, sessionId, 'discuss about open source software', 'Bruno', 5, false)

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

  const result = await itemSrv.addItem(db, meetingId, sessionId, 'discuss about open source software', 'Bruno', 5, false)
  await itemSrv.addToSession(db, result._id, meetingId, 'df45va325')
  const resultUpdated = await itemSrv.findById(db, result._id)
  expect(resultUpdated.sessions.length).toBe(2)
})

test('getAllItemsForSession', async function () {
  var db = new Datastore({
    autoload: true
  })

  await itemSrv.addItem(db, meetingId, sessionId, 'discuss about open source software', 'Bruno', 5, false)
  await itemSrv.addItem(db, meetingId, sessionId, 'discuss about open source software', 'Fabio', 5, false)
  const list = await itemSrv.findAll(db, meetingId, sessionId)
  expect(list.length).toBe(2)
})

test('updateItem', async function () {
  var db = new Datastore({
    autoload: true
  })

  const resultSaved = await itemSrv.addItem(db, meetingId, sessionId, 'discuss about open source software', 'Bruno', 5, false)
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

  await itemSrv.addItem(db, meetingId, sessionId, 'discuss about open source software', 'Bruno', 5, false)
  await itemSrv.addItem(db, meetingId, sessionId, 'discuss about open source software', 'Bruno1', 5, false)
  const record = await itemSrv.addItem(db, meetingId, sessionId, 'discuss about serverless', 'Fabio', 5, false)
  const listResult = await itemSrv.findAll(db, meetingId, sessionId)
  expect(listResult.length).toBe(3)
  expect(listResult[0].order).toBe(0)
  expect(listResult[1].order).toBe(1)
  expect(listResult[2].order).toBe(2)
  await itemSrv.changeStatus(db, record._id, true)
  await itemSrv.setupNewSession(db, meetingId, sessionId, newSessionId)
  const listNewSession = await itemSrv.findAll(db, meetingId, newSessionId)
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
    await itemSrv.addToSession(db, 'aaa', meetingId, 'bbb')
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

test('changeStatusExists', async function () {
  var db = new Datastore({
    autoload: true
  })

  await itemSrv.addItem(db, meetingId, sessionId, 'discuss about open source software', 'Bruno', 5, false)
  var result = await itemSrv.findAll(db, meetingId, sessionId)
  expect(result.length).toBe(1)
  expect(result[0].done).toBe(false)
  await itemSrv.changeStatus(db, result[0]._id, true)
  result = await itemSrv.findAll(db, meetingId, sessionId)
  expect(result[0].done).toBe(true)
  expect(result.length).toBe(1)
})

test('setupNewSession', async function () {
  var db = new Datastore({
    autoload: true
  })
  const fakeSession = 'aAeqwda'

  try {
    await itemSrv.addItem(db, meetingId, sessionId, 'discuss about open source software', 'Bruno', 5, false)
    await itemSrv.setupNewSession(db, meetingId, fakeSession, 'newSession')
  } catch (err) {
    expect(err.message).toBe('setup.new.session.failed')
  }
})

test('change item order - up', async function () {
  var db = new Datastore({
    autoload: true
  })
  await itemSrv.addItem(db, meetingId, sessionId, 'discuss about open source software', 'Bruno', 5, false)
  await itemSrv.addItem(db, meetingId, sessionId, 'discuss about open source software', 'Bruno1', 5, false)
  await itemSrv.addItem(db, meetingId, sessionId, 'discuss about serverless', 'Fabio', 5, false)
  var listResult = await itemSrv.findAll(db, meetingId, sessionId)
  expect(listResult.length).toBe(3)
  expect(listResult[0].order).toBe(0)
  expect(listResult[1].order).toBe(1)
  expect(listResult[2].order).toBe(2)

  var result = await itemSrv.changeOrder(db, meetingId, sessionId, listResult[0]._id, true)
  expect(result).toBe(false)
  listResult = await itemSrv.findAll(db, meetingId, sessionId)
  expect(listResult.length).toBe(3)
  expect(listResult[0].order).toBe(0)
  expect(listResult[1].order).toBe(1)
  expect(listResult[2].order).toBe(2)

  const originalOrder = [
    listResult[0]._id,
    listResult[1]._id,
    listResult[2]._id
  ]
  result = await itemSrv.changeOrder(db, meetingId, sessionId, listResult[1]._id, true)
  expect(result).toBe(true)
  var listResultChanged = await itemSrv.findAll(db, meetingId, sessionId)
  expect(listResultChanged.length).toBe(3)
  expect(listResultChanged[0].order).toBe(0)
  expect(listResultChanged[1].order).toBe(1)
  expect(listResultChanged[2].order).toBe(2)

  const changedOrder = [
    listResultChanged[0]._id,
    listResultChanged[1]._id,
    listResultChanged[2]._id
  ]

  expect(changedOrder[0]).toBe(originalOrder[1])
  expect(changedOrder[1]).toBe(originalOrder[0])
  expect(changedOrder[2]).toBe(originalOrder[2])
})

test('change item order - down', async function () {
  var db = new Datastore({
    autoload: true
  })
  await itemSrv.addItem(db, meetingId, sessionId, 'discuss about open source software', 'Bruno', 5, false)
  await itemSrv.addItem(db, meetingId, sessionId, 'discuss about open source software', 'Bruno1', 5, false)
  await itemSrv.addItem(db, meetingId, sessionId, 'discuss about serverless', 'Fabio', 5, false)
  var listResult = await itemSrv.findAll(db, meetingId, sessionId)
  expect(listResult.length).toBe(3)
  expect(listResult[0].order).toBe(0)
  expect(listResult[1].order).toBe(1)
  expect(listResult[2].order).toBe(2)

  const originalOrder = [
    listResult[0]._id,
    listResult[1]._id,
    listResult[2]._id
  ]
  var result = await itemSrv.changeOrder(db, meetingId, sessionId, listResult[1]._id, false)
  expect(result).toBe(true)
  var listResultChanged = await itemSrv.findAll(db, meetingId, sessionId)
  expect(listResultChanged.length).toBe(3)
  expect(listResultChanged[0].order).toBe(0)
  expect(listResultChanged[1].order).toBe(1)
  expect(listResultChanged[2].order).toBe(2)

  const changedOrder = [
    listResultChanged[0]._id,
    listResultChanged[1]._id,
    listResultChanged[2]._id
  ]

  expect(changedOrder[0]).toBe(originalOrder[0])
  expect(changedOrder[2]).toBe(originalOrder[1])
  expect(changedOrder[1]).toBe(originalOrder[2])

  result = await itemSrv.changeOrder(db, meetingId, sessionId, listResultChanged[2]._id, false)
  expect(result).toBe(false)
})

test('remove item', async function () {
  var db = new Datastore({
    autoload: true
  })
  await itemSrv.addItem(db, meetingId, sessionId, 'discuss about open source software', 'Bruno', 5, false)
  await itemSrv.addItem(db, meetingId, sessionId, 'discuss about open source software', 'Bruno1', 5, false)
  await itemSrv.addItem(db, meetingId, sessionId, 'discuss about serverless', 'Fabio', 5, false)
  var listResult = await itemSrv.findAll(db, meetingId, sessionId)
  expect(listResult.length).toBe(3)
  await itemSrv.remove(db, 'adsasdsa')
  listResult = await itemSrv.findAll(db, meetingId, sessionId)
  expect(listResult.length).toBe(3)
  await itemSrv.remove(db, listResult[0]._id)
  listResult = await itemSrv.findAll(db, meetingId, sessionId)
  expect(listResult.length).toBe(2)
})
