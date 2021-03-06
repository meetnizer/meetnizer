const meetingSrv = require('../services/meeting')
var Datastore = require('nedb')

test('findById', async function () {
  var db = new Datastore({
    autoload: true
  })

  const myMeeting = await meetingSrv.findById(db, 'aaase')
  expect(myMeeting).toBe(null)
})

test('newMetting', async function () {
  var db = new Datastore({
    autoload: true
  })

  const myMeeting = await meetingSrv.newMeeting(db, 'Team Meeting')
  expect(myMeeting._id.length).toBeGreaterThan(1)
  const myMeetingFind = await meetingSrv.findById(db, myMeeting._id)
  expect(myMeetingFind.name).toBe('Team Meeting')
  try {
    await meetingSrv.newMeeting(db, 'Team Meeting')
  } catch (err) {
    expect(err.message).toBe('meeting.record.exists')
  }
})
test('changeMetting', async function () {
  var db = new Datastore({
    autoload: true
  })

  const myMeeting = await meetingSrv.newMeeting(db, 'Team Meeting')
  myMeeting.name = 'test'
  const saveResult = await meetingSrv.saveMeeting(db, myMeeting)
  expect(saveResult).toBe(true)
  const findResult = await meetingSrv.findById(db, myMeeting._id)
  expect(findResult.name).toBe('test')
})

test('getAllMettings', async function () {
  var db = new Datastore({
    autoload: true
  })
  await meetingSrv.newMeeting(db, 'Team Meeting')
  await meetingSrv.newMeeting(db, 'Project Meeting')
  const result = await meetingSrv.getAllMeetings(db)
  expect(result.length).toBe(2)
})

test('getAllMettingsNoresult', async function () {
  var db = new Datastore({
    autoload: true
  })
  const result = await meetingSrv.getAllMeetings(db)
  expect(result.length).toBe(0)
})

test('changeMettingNotExists', async function () {
  var db = new Datastore({
    autoload: true
  })
  try {
    await meetingSrv.saveMeeting(db, { _id: 'aaaa' })
  } catch (err) {
    expect(err.message).toBe('meeting.not.found')
  }
})
