const Util = require('./util')

function findById (meeting, sessionId) {
  for (var i = 0; i < meeting.sessions.length; i++) {
    if (meeting.sessions[i].name === sessionId) {
      return meeting.sessions[i]
    }
  }
  return null
}

function findByDate (meeting, sessionDate) {
  for (var i = 0; i < meeting.sessions.length; i++) {
    if (new Date(meeting.sessions[i].date).getTime() === sessionDate.getTime()) {
      return meeting.sessions[i]
    }
  }
  return null
}

function addSession (meeting, name, date, durationInMinutes) {
  Util.isValidDate(date)

  const session = {
    name,
    date: date,
    durationInMinutes,
    finish: false
  }
  meeting.sessions.push(session)
  return meeting
}

function getLastSession (meeting) {
  if (meeting.sessions.length === 0) {
    return null
  }
  var sessions = meeting.sessions
  sessions.sort((a, b) => {
    a = new Date(a.date)
    b = new Date(b.date)
    return a > b ? -1 : a < b ? 1 : 0
  })
  return sessions[sessions.length - 1]
}

function deleteSession (meetingObj, sessionId) {
  if (!meetingObj.sessions || meetingObj.sessions.length === 0) {
    return meetingObj
  }
  var newArray = []
  for (let i = 0; i < meetingObj.sessions.length; i++) {
    if (meetingObj.sessions[i].date !== sessionId) {
      newArray.push(meetingObj.sessions[i])
    }
  }
  meetingObj.sessions = newArray
  return meetingObj
}

module.exports = {
  findById,
  addSession,
  getLastSession,
  findByDate,
  deleteSession
}
