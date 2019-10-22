function addItem (db, sessionId, name, owner, time, callback) {
  db.insert(
    {
      name,
      owner,
      time,
      done: false,
      sessions: [sessionId],
      comments: []
    }, (err, record) => {
      if (err) callback(err, null)

      callback(null, record)
    })
}
function findById (db, itemId, callback) {
  db.findOne({ _id: itemId }, (err, recordSet) => {
    if (err) callback(err, null)

    callback(null, recordSet)
  })
}

function addToSession (db, itemId, sessionId, callback) {
  db.findOne({ _id: itemId }, (err, recordSet) => {
    if (err) callback(err, null)

    if (recordSet === null || recordSet === undefined) {
      throw new Error('item.record.notexists')
    }

    recordSet.sessions.push(sessionId)

    db.update({ _id: itemId }, recordSet, (err, result) => {
      if (err) callback(err, null)

      callback(null, result)
    })
  })
}

function findAll (db, sessionId, callback) {
  db.find({ sessions: { $in: [sessionId] }}, (err, recordSet) => {
    if (err) callback(err, null)

    callback(null, recordSet)
  })
}
function addComment (db, itemId, comment, callback) {
  findById(db, itemId, (err,record) => {
    if (err) callback(err, null)
    if (record === null || record === undefined) {
      throw Error("register.not.found");
    }
    db.update({ _id: itemId }, { $push: {comments: comment}}, { upsert: false }, (err, recordSet) => {
      if (err) callback(err, null)
      callback(null, recordSet)
    })
  })
}
function changeStatus (db, itemId, status, callback) {
  findById(db, itemId, (err,recordSet) => {
    if (err) callback(err, null)
    if (recordSet === null || recordSet === undefined) throw Error("register.not.found");
    
    recordSet.done = status;
    
    db.update({ _id: itemId }, recordSet, {}, (err, affectRows) => {
       if (err) callback(err, null)
       callback(null, affectRows)
     })
    
  })
}
function setupNewSession (db, sessionId, newSessionId, callback) {
  db.update(
    { sessions: [sessionId], done: false },
    { $push: { sessions: newSessionId } },
    {}, (err, recordSet) => {
      if (err) callback(err, null)

      callback(null, recordSet)
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
