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
  const obj = sessionSrv.addSession(db, myMeeting, 'First monday of the month', myDate, 2)
  expect(obj.sessions.length).toBe(1)
  expect(moment(obj.sessions[0].date).format('DD/MM/YYYY')).toBe('21/10/2019')
  expect(obj.sessions[0].name).toBe('First monday of the month')
  expect(obj.sessions[0].durationInHours).toBe(2)
  expect(obj.sessions[0].finish).toBe(false)

  await meetingSrv.saveMeeting(db, obj)

  expect(obj._id).toBe(myMeeting._id)

  const result = await meetingSrv.findById(db, myMeeting._id)

  expect(result.sessions.length).toBe(1)
  expect(result.sessions[0].name).toBe('First monday of the month')
  expect(result.sessions[0].durationInHours).toBe(2)
  expect(result.sessions[0].finish).toBe(false)
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

  sessionSrv.addSession(db, myMeeting, 'test1', moment('21/10/2019', 'DD/MM/YYYY'), 2)
  sessionSrv.addSession(db, myMeeting, 'test2', moment('21/01/2019', 'DD/MM/YYYY'), 2)
  sessionSrv.addSession(db, myMeeting, 'test3', moment('21/09/2019', 'DD/MM/YYYY'), 2)

  expect(myMeeting.sessions.length).toBe(3)

  const lastSession = sessionSrv.getLastSession(myMeeting)
  expect(lastSession).not.toBe(null)
  expect(moment(lastSession.date).format('YYYY/MM/DD')).toBe('2019/01/21')
})
