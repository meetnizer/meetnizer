const item = require('../services/item')
var Datastore = require('nedb')
const sessionId = 'Awdxr'

test('saveItem', function () {
  var db = new Datastore({
    autoload: true
  })

  function getItemId (err, record) {
    expect(err).toBe(null)
    expect(record._id.length).toBeGreaterThan(1)
    expect(record.name).toBe('discuss about open source software')
    expect(record.owner).toBe('Bruno')
    expect(record.time).toBe(5)
    expect(record.sessions.length).toBe(1)
    expect(record.sessions[0]).toBe(sessionId)
    expect(record.done).toBe(false)
  }

  item.addItem(db, sessionId, 'discuss about open source software', 'Bruno', 5, getItemId)
})

test('addItemToSession', function () {
  var db = new Datastore({
    autoload: true
  })
  var itemId = ''
  function getItemId (err, record) {
    expect(err).toBe(null)
    expect(record._id.length).toBeGreaterThan(1)
    itemId = record._id
    item.addToSession(db, record._id, 'df45va325', itemSaved)
  }
  function itemSaved (err, record) {
    expect(err).toBe(null)
    var result = item.findById(db, itemId)
    expect(result.done).toBe(false)
    expect(result.comments.length).toBe(1)
  }

  item.addItem(db, sessionId, 'discuss about open source software', 'Bruno', 5, getItemId)
})

test('getAllItemsForSession', function () {
  var db = new Datastore({
    autoload: true
  })
  function saveItem1 (err, record) {
    expect(err).toBe(null)
    item.addItem(db, sessionId, 'discuss about open source software', 'Fabio', 5, saveItem2)
  }
  function saveItem2 (err, record) {
    expect(err).toBe(null)
    item.findAll(db, sessionId, validateItems)
  }
  function validateItems (err, items) {
    expect(err).toBe(null)
    expect(items.length).toBe(2)
  }
  item.addItem(db, sessionId, 'discuss about open source software', 'Bruno', 5, saveItem1)
})

test('updateItem', function () {
  var db = new Datastore({
    autoload: true
  })
  var itemId = ''
  function saveItem1 (err, record) {
    expect(err).toBe(null)
    itemId = record._id

    item.addComment(db, itemId, 'For the next meeting talk about the nginx server', itemUpdated)
  }

  function itemUpdated (err, record) {
    expect(err).toBe(null)
    expect(record).toBe(1)

    var result = item.findById(db, itemId)
    expect(result.done).toBe(false)
    expect(result.comments.length).toBe(1)
  }

  item.addItem(db, sessionId, 'discuss about open source software', 'Bruno', 5, saveItem1)
})

test('setupNewSession', function () {
  var db = new Datastore({
    // filename: `${__dirname}/mydb.db`,
    autoload: true
  })
  const newSessionId = 'aAeqwda'
  var itemIdToBeChanged = ''
  function saveItem1 (err, records) {
    expect(err).toBe(null)
    item.addItem(db, sessionId, 'discuss about serverless', 'Fabio', 5, saveItem2)
  }
  function saveItem2 (err, records) {
    expect(err).toBe(null)
    itemIdToBeChanged = records._id
    item.findAll(db, sessionId, checkSavedItem)
  }
  function checkSavedItem (err, records) {
    expect(err).toBe(null)
    expect(records.length).toBe(2)
    item.changeStatus(db, itemIdToBeChanged, true, statusChanged)
  }
  function statusChanged (err, affectedRows) {
    expect(err).toBe(null)
    expect(affectedRows).toBe(1)
    item.setupNewSession(db, sessionId, newSessionId, newSessionCreated)
  }
  function newSessionCreated (err, affectedRows) {
    expect(err).toBe(null)
    expect(affectedRows).toBe(1)
    item.findAll(db, newSessionId, validateItems)
  }
  function validateItems (err, records) {
    expect(err).toBe(null)
    expect(records.length).toBe(1)
    expect(records[0].sessions.length).toBe(2)
    expect(records[0].sessions[1]).toBe(newSessionId)
  }

  item.addItem(db, sessionId, 'discuss about open source software', 'Bruno', 5, saveItem1)
})
