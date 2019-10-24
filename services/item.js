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
      }, (err, record) => {
        if (err) reject(err)
        resolve(record)
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
    db.findOne({ _id: itemId }, (err, recordSet) => {
      if (err) reject(err)
      console.log(itemId, recordSet);
      if (!recordSet) reject(new Error('register.not.found'))

      recordSet.sessions.push(sessionId)

      db.update({ _id: itemId }, recordSet, (err, result) => {
        if (err) reject(err)
        resolve(result)
      })
    })
  })
}

function addComment (db, itemId, comment) {
  return new Promise((resolve, reject) => {
    db.findOne({ _id: itemId }, (err, recordSet) => {
      if (err) reject(err)
      if (!recordSet) reject(new Error('register.not.found'))

      db.update(
        { _id: itemId },
        { $push: { comments: comment } },
        { upsert: false },
        (err1, recordSet1) => {
          if (err1) reject(err1)
          resolve(recordSet1)
        })
    })
  })
}
function changeStatus (db, itemId, status) {
  return new Promise((resolve, reject) => {
    db.findOne({ _id: itemId }, (err, recordSet) => {
      if (err) reject(err)
      if (!recordSet) reject(new Error('register.not.found'))

      recordSet.status = status
      db.update({ _id: itemId }, recordSet, {}, (err1, affectRows) => {
        if (err1) reject(err1)
        resolve(affectRows)
      })
    })
  })
}

function setupNewSession (db, sessionId, newSessionId) {
  return new Promise((resolve, reject) => {
    db.update(
      { sessions: [sessionId], $or: [{ done: false }, { recurrent: true }] },
      { $push: { sessions: newSessionId } },
      {}, (err, recordSet) => {
        if (err) reject(err)
        resolve(recordSet)
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
