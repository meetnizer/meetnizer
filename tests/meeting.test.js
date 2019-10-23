const meeting = require('../services/meeting')
var Datastore = require('nedb')

test('findById', async function () {
  var db = new Datastore({
    autoload: true
  })

  const myMeeting = await meeting.findById(db, 'aaase')
  expect(myMeeting).toBe(null)
})

test('newMetting', async function () {
  var db = new Datastore({
    autoload: true
  })

  const myMeeting = await meeting.newMeeting(db, 'Team Meeting')
  expect(myMeeting._id.length).toBeGreaterThan(1)
  const myMeetingFind = await meeting.findById(db, myMeeting._id)
  expect(myMeetingFind.name).toBe('Team Meeting')
  try {
    await meeting.newMeeting(db, 'Team Meeting')
  } catch (err) {
    expect(err.message).toBe('meeting.record.exists')
  }
})
test('changeMetting', async function () {
  var db = new Datastore({
    autoload: true
  })

  const myMeeting = await meeting.newMeeting(db, 'Team Meeting')
  myMeeting.name = 'test'
  const saveResult = await meeting.saveMeeting(db, myMeeting)
  expect(saveResult).toBe(1)
  const findResult = await meeting.findById(db, myMeeting._id)
  expect(findResult.name).toBe('test')
})

test('getAllMettings', async function () {
  var db = new Datastore({
    autoload: true
  })
  await meeting.newMeeting(db, 'Team Meeting')
  await meeting.newMeeting(db, 'Project Meeting')
  const result = await meeting.getAllMeetings(db)
  expect(result.length).toBe(2)
})

test('getAllMettingsNoresult', async function () {
  var db = new Datastore({
    autoload: true
  })
  const result = await meeting.getAllMeetings(db)
  expect(result.length).toBe(0)
})
