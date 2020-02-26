const meetingSrv = require('../services/meeting')
const sessionSrv = require('../services/session')
const moment = require('moment')
var Datastore = require('nedb')

test('getSessionById', async function () {
  var db = new Datastore({
    autoload: true
  })

  const myMeeting = await meetingSrv.newMeeting(db, 'Team Meeting')
  expect(myMeeting._id.length).toBeGreaterThan(1)

  const result = sessionSrv.findById(myMeeting, 12)
  expect(result).toBe(null)
})

test('createSession', async function () {
  var db = new Datastore({
    autoload: true
  })
  const myDate = moment('21/10/2019', 'DD/MM/YYYY')

  const myMeeting = await meetingSrv.newMeeting(db, 'Team Meeting')
  const obj = sessionSrv.addSession(myMeeting, 'First monday of the month', myDate.toDate(), 2)
  expect(obj.sessions.length).toBe(1)
  expect(moment(obj.sessions[0].date).format('DD/MM/YYYY')).toBe('21/10/2019')
  expect(obj.sessions[0].name).toBe('First monday of the month')
  expect(obj.sessions[0].durationInMinutes).toBe(2)
  expect(obj.sessions[0].finish).toBe(false)

  await meetingSrv.saveMeeting(db, obj)

  expect(obj._id).toBe(myMeeting._id)

  const result = await meetingSrv.findById(db, myMeeting._id)

  expect(result.sessions.length).toBe(1)
  expect(result.sessions[0].name).toBe('First monday of the month')
  expect(result.sessions[0].durationInMinutes).toBe(2)
  expect(result.sessions[0].finish).toBe(false)

  const sessionResult = sessionSrv.findById(myMeeting, 'First monday of the month')
  expect(sessionResult).not.toBe(null)
})

test('getLastSessionNoData', async function () {
  var db = new Datastore({
    autoload: true
  })

  const myData = await meetingSrv.newMeeting(db, 'Team Meeting')
  const lastSession = sessionSrv.getLastSession(myData)
  expect(lastSession).toBe(null)
})

test('getLastSession', async function () {
  var db = new Datastore({
    autoload: true
  })
  const myMeeting = await meetingSrv.newMeeting(db, 'Team Meeting')

  sessionSrv.addSession(myMeeting, 'test1', moment('21/10/2019', 'DD/MM/YYYY').toDate(), 2)
  sessionSrv.addSession(myMeeting, 'test2', moment('21/01/2019', 'DD/MM/YYYY').toDate(), 2)
  sessionSrv.addSession(myMeeting, 'test3', moment('21/09/2019', 'DD/MM/YYYY').toDate(), 2)

  expect(myMeeting.sessions.length).toBe(3)

  const lastSession = sessionSrv.getLastSession(myMeeting)
  expect(lastSession).not.toBe(null)
  expect(moment(lastSession.date).format('YYYY/MM/DD')).toBe('2019/01/21')
})
test('find by date', async function () {
  var db = new Datastore({
    autoload: true
  })
  let myMeeting = await meetingSrv.newMeeting(db, 'Team Meeting')
  sessionSrv.addSession(myMeeting, 'test 1', moment('21/10/2019', 'DD/MM/YYYY').toDate(), 2)
  sessionSrv.addSession(myMeeting, 'test 2', moment('22/10/2019', 'DD/MM/YYYY').toDate(), 2)
  meetingSrv.saveMeeting(db, myMeeting)

  myMeeting = await meetingSrv.findById(db, myMeeting._id)
  const session = sessionSrv.findByDate(myMeeting, moment('21/10/2019', 'DD/MM/YYYY').toDate())
  expect(session).not.toBe(null)
  expect(session.name).toBe('test 1')
})

test('deleteSession - error cenarios', async function () {
  var db = new Datastore({
    autoload: true
  })
  await meetingSrv.newMeeting(db, 'Project Meeting')
  const meetings = await meetingSrv.getAllMeetings(db)
  expect(meetings.length).toBe(1)

  const myMeeting = await meetingSrv.findById(db, meetings[0]._id)
  expect(myMeeting).not.toBe(null)
  const meetingSessionBefore = myMeeting.sessions

  const result = sessionSrv.deleteSession(myMeeting, 'bbb')
  expect(result.sessions).toBe(meetingSessionBefore)
})

test('deleteSession', async function () {
  var db = new Datastore({
    autoload: true
  })

  await meetingSrv.newMeeting(db, 'Project Meeting')
  const meetings = await meetingSrv.getAllMeetings(db)
  expect(meetings.length).toBe(1)

  let myMeeting = sessionSrv.addSession(meetings[0], 'test 1', moment('21/10/2019', 'DD/MM/YYYY').toDate(), 2)
  meetingSrv.saveMeeting(db, myMeeting)
  myMeeting = await meetingSrv.findById(db, meetings[0]._id)
  expect(myMeeting).not.toBe(null)
  expect(myMeeting.sessions.length).toBe(1)

  myMeeting = await sessionSrv.deleteSession(myMeeting, myMeeting.sessions[0].date)
  expect(myMeeting).not.toBe(null)
  expect(myMeeting.sessions.length).toBe(0)
})
