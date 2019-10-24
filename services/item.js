function addItem (db, sessionId, name, owner, time, recurrent) {
  return new Promise((resolve, reject) => {
    db.insert(
      {
        name,
        owner,
        time,
        done: false,
        recurrent,
        sessions: [sessionId],
        comments: []
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

function findAll (db, sessionId) {
  return new Promise((resolve, reject) => {
    db.find({ sessions: { $in: [sessionId] } }, (err, recordSet) => {
      if (err) reject(err)
      resolve(recordSet)
    })
  })
}

function addToSession (db, itemId, sessionId) {
  return new Promise((resolve, reject) => {
    db.update(
      { _id: itemId },
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

function setupNewSession (db, sessionId, newSessionId) {
  return new Promise((resolve, reject) => {
    db.update(
      { sessions: [sessionId], $or: [{ done: false }, { recurrent: true }] },
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
