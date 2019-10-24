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

function addToSession (db, itemId, sessionId) {
  return new Promise((resolve, reject) => {
    db.findOne({ _id: itemId }, (err, recordSet) => {
      if (err) reject(err)

      if (!recordSet) reject(new Error('item.record.not.`exists'))

      recordSet.sessions.push(sessionId)

      db.update({ _id: itemId }, recordSet, (err, result) => {
        if (err) reject(err)
        resolve(result)
      })
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

function addComment (db, itemId, comment) {
  return new Promise((resolve, reject) => {
    const record = findById(db, itemId)
    if (!record) throw Error('register.not.found')
    resolve(record)
  }).then(function (result) {
    return new Promise((resolve, reject) => {
      db.update(
        { _id: itemId },
        { $push: { comments: comment } },
        { upsert: false },
        (err, recordSet) => {
          if (err) reject(err)
          resolve(recordSet)
        })
    })
  })
}
function changeStatus (db, itemId, status) {
  return new Promise((resolve, reject) => {
    const record = findById(db, itemId)
    if (!record) throw Error('register.not.found')
    resolve(record)
  }).then(function (result) {
    return new Promise((resolve, reject) => {
      result.status = status
      db.update({ _id: itemId }, result, {}, (err, affectRows) => {
        if (err) reject(err)
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
