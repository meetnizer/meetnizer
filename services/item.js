function addItem (db, meetingId, sessionId, name, owner, time, recurrent, order) {
  if (!order) {
    order = 0
    // const list = await findAll(db, meetingId, sessionId)
  }
  return new Promise((resolve, reject) => {
    db.insert(
      {
        name,
        owner,
        time: Number(time),
        done: false,
        recurrent,
        meetingId,
        sessions: [sessionId],
        comments: [],
        order
      }, (err, recordSet) => {
        if (err) reject(err)
        resolve(recordSet)
      })
  })
}

function findById (db, itemId) {
  return new Promise((resolve, reject) => {
    db.findOne({ _id: itemId }, (err, recordSet) => {
      if (err) reject(err)
      resolve(recordSet)
    })
  })
}

function findAll (db, meetingId, sessionId) {
  return new Promise((resolve, reject) => {
    db.find({ meetingId: meetingId, sessions: { $in: [sessionId] } }).sort({ order: 1 }).exec((err, recordSet) => {
      if (err) reject(err)
      resolve(recordSet)
    })
  })
}

function addToSession (db, itemId, meetingId, sessionId) {
  return new Promise((resolve, reject) => {
    db.update(
      { _id: itemId, meetingId: meetingId },
      { $push: { sessions: sessionId } },
      { upsert: false },
      (err, affectedRows) => {
        if (err) reject(err)
        if (affectedRows === 0) {
          reject(new Error('register.not.found'))
        } else {
          resolve(true)
        }
      })
  })
}

function addComment (db, itemId, comment) {
  return new Promise((resolve, reject) => {
    db.update(
      { _id: itemId },
      { $push: { comments: comment } },
      { upsert: false },
      (err, affectedRows) => {
        if (err) reject(err)
        if (affectedRows === 0) { reject(new Error('register.not.found')) } else { resolve(true) }
      })
  })
}
function changeStatus (db, itemId, status) {
  return new Promise((resolve, reject) => {
    db.update(
      { _id: itemId },
      { status },
      { upsert: false },
      (err, affectedRows) => {
        if (err) reject(err)
        if (affectedRows === 0) {
          reject(new Error('register.not.found'))
        } else {
          resolve(true)
        }
      })
  })
}

function setupNewSession (db, meetingId, sessionId, newSessionId) {
  return new Promise((resolve, reject) => {
    db.update(
      { meetingId: meetingId, sessions: [sessionId], $or: [{ done: false }, { recurrent: true }] },
      { $push: { sessions: newSessionId } },
      {}, (err, affectedRows) => {
        if (err) reject(err)
        if (affectedRows === 0) {
          reject(new Error('setup.new.session.failed'))
        } else {
          resolve(true)
        }
      })
  })
}

module.exports = {
  addItem,
  addToSession,
  findById,
  findAll,
  addComment,
  changeStatus,
  setupNewSession
}
