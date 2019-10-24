function findById (meeting, sessionId) {
  for (var i = 0; i < meeting.sessions.length; i++) {
    if (meeting.sessions[i].name === sessionId) {
      return meeting.sessions[i]
    }
  }
  return null
}

function addSession (db, meeting, name, date, durationInHours) {
  const session = {
    name,
    date,
    durationInHours,
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
  sessions.sort(function (a, b) {
    a = new Date(a.date)
    b = new Date(b.date)
    return a > b ? -1 : a < b ? 1 : 0
  })
  return sessions[sessions.length - 1]
}

module.exports = {
  findById,
  addSession,
  getLastSession
}
