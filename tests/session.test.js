const meeting = require('../services/meeting')
const session = require('../services/session')
const moment = require('moment')
var Datastore = require('nedb')

test('getSessionById', function () {
  var db = new Datastore({
    autoload: true
  })

  function meetingSaved (err, record) {
    expect(err).toBe(null)
    expect(record._id.length).toBeGreaterThan(1)

    const result = session.findById(record, 12)
    expect(result).toBe(null)
  }

  meeting.newMeeting(db, 'Team Meeting', meetingSaved)
})

test('createSession', function () {
  var db = new Datastore({
    autoload: true
  })
  var id = ''
  const myDate = moment('21/10/2019', 'DD/MM/YYYY')
  function meetingSaved (err, record) {
    expect(err).toBe(null)
    expect(record._id.length).toBeGreaterThan(1)
    id = record._id

    var obj = session.addSession(db, record, 'First monday of the month', myDate, 2)
    expect(obj.sessions.length).toBe(1)

    expect(moment(obj.sessions[0].date).format('DD/MM/YYYY')).toBe('21/10/2019')
    expect(obj.sessions[0].name).toBe('First monday of the month')
    expect(obj.sessions[0].durationInHours).toBe(2)
    expect(obj.sessions[0].finish).toBe(false)

    meeting.saveMeeting(db, obj, meetingChanged)
  }
  function meetingChanged (err, record) {
    expect(err).toBe(null)
    expect(record).toBe(1)
    meeting.findById(db, id, checkResult)
  }
  function checkResult (err, record) {
    expect(err).toBe(null)
    expect(record.sessions.length).toBe(1)
    expect(record.sessions[0].name).toBe('First monday of the month')
    expect(record.sessions[0].durationInHours).toBe(2)
    expect(record.sessions[0].finish).toBe(false)
  }

  meeting.newMeeting(db, 'Team Meeting', meetingSaved)
})

test('getLastSessionNoData', function () {
  var db = new Datastore({
    autoload: true
  })

  function meetingSaved (err, record) {
    expect(err).toBe(null)
    expect(record._id.length).toBeGreaterThan(1)
    const lastSession = session.getLastSession(record)
    expect(lastSession).toBe(null)
  }
  meeting.newMeeting(db, 'Team Meeting', meetingSaved)
})

test('getLastSession', function () {
  var db = new Datastore({
    autoload: true
  })

  function meetingSaved (err, record) {
    expect(err).toBe(null)
    expect(record._id.length).toBeGreaterThan(1)

    session.addSession(db, record, 'test1', moment('21/10/2019', 'DD/MM/YYYY'), 2)
    session.addSession(db, record, 'test2', moment('21/01/2019', 'DD/MM/YYYY'), 2)
    session.addSession(db, record, 'test3', moment('21/09/2019', 'DD/MM/YYYY'), 2)

    expect(record.sessions.length).toBe(3)

    const lastSession = session.getLastSession(record)
    expect(lastSession).not.toBe(null)
    expect(moment(lastSession.date).format('YYYY/MM/DD')).toBe('2019/01/21')
  }
  meeting.newMeeting(db, 'Team Meeting', meetingSaved)
})
