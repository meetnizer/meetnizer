const meeting = require('../services/meeting')
var Datastore = require('nedb')

test('findById', function () {
  var db = new Datastore({
    autoload: true
  })

  function check (err, ret) {
    expect(err).toBe(null)
    expect(ret).toBe(null)
  }
  meeting.findById(db, 'aaase', check)
})

test('newMetting', function () {
  var db = new Datastore({
    autoload: true
  })

  function validateResultId (err, ret) {
    expect(err).toBe(null)
    expect(ret._id.length).toBeGreaterThan(1)

    meeting.findById(db, ret._id, validateResultName)
  }
  function validateResultName (err, ret) {
    expect(err).toBe(null)
    expect(ret.name).toBe('Team Meeting')
  }
  meeting.newMeeting(db, 'Team Meeting', validateResultId)
})

test('changeMetting', function () {
  var db = new Datastore({
    autoload: true
  })
  var id = ''
  function validateResultId (err, ret) {
    expect(err).toBe(null)
    expect(ret._id.length).toBeGreaterThan(1)
    id = ret._id
    ret.name = 'test'

    meeting.saveMeeting(db, ret, validateUpdatedRecord)
  }
  function validateUpdatedRecord (err, ret) {
    expect(err).toBe(null)
    expect(ret).toBe(1)

    meeting.findById(db, id, checkResult)
  }

  function checkResult (err, ret) {
    expect(err).toBe(null)
    expect(ret.name).toBe('test')
  }

  meeting.newMeeting(db, 'Team Meeting', validateResultId)
})

test('getAllMettings', function () {
  var db = new Datastore({
    autoload: true
  })
  function saveMeeting1 (err, record) {
    expect(err).toBe(null)
    meeting.newMeeting(db, 'Project Meeting', saveMeeting2)
  }
  function saveMeeting2 (err, record) {
    expect(err).toBe(null)
    meeting.getAllMeetings(db, checkResult)
  }
  function checkResult (err, record) {
    expect(err).toBe(null)
    expect(record.length).toBe(2)
  }
  meeting.newMeeting(db, 'Team Meeting', saveMeeting1)
})

test('getAllMettingsNoresult', function () {
  var db = new Datastore({
    autoload: true
  })
  function checkResult (err, record) {
    expect(err).toBe(null)
    expect(record.length).toBe(0)
  }
  meeting.getAllMeetings(db, checkResult)
})
