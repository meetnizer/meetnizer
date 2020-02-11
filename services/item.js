function addItem (db, meetingId, sessionId, name, owner, time, recurrent) {
  return new Promise((resolve, reject) => {
    db.find({ meetingId: meetingId, sessions: { $in: [sessionId] } }).sort({ order: 1 }).exec((errFindAll, recordSetFindAll) => {
      if (errFindAll) reject(errFindAll)
      var orderTmp = recordSetFindAll.length
      if (recurrent) {
        orderTmp = -10000
      }
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
          order: orderTmp,
          removed: false
        }, (err, recordSet) => {
          if (err) reject(err)
          resolve(recordSet)
        })
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
    db.find({ meetingId: meetingId, sessions: { $in: [sessionId] }, removed: false }).sort({ order: 1 }).exec((err, recordSet) => {
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
      { $set: { done: status } },
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

function changeOrder (db, meetingId, sessionId, itemId, up) {
  return new Promise((resolve, reject) => {
    db
      .find({ meetingId: meetingId, sessions: { $in: [sessionId] } })
      .sort({ order: 1 }).exec((errFindAll, recordSetFindAll) => {
        if (errFindAll) reject(errFindAll)
        for (var i = 0; i < recordSetFindAll.length; i++) {
          if (recordSetFindAll[i]._id === itemId) {
            if (up && i === 0) {
              resolve(false)
              return
            }
            const update1Index = up ? i : i
            const update2Index = up ? (i - 1) : (i + 1)
            const factor = up ? 1 : -1
            if (!up && update2Index >= recordSetFindAll.length) {
              resolve(false)
              return
            }

            db.update(
              { _id: recordSetFindAll[update1Index]._id },
              { $set: { order: (recordSetFindAll[update1Index].order - factor) } },
              { upsert: false }, (err, affectedRows) => {
                if (err) {
                  console.log('error processing itemId step 1' + recordSetFindAll[i]._id + '. Err: ' + err)
                  resolve(false)
                  return
                }

                db.update(
                  { _id: recordSetFindAll[update2Index]._id },
                  { $set: { order: (recordSetFindAll[update2Index].order + factor) } },
                  { upsert: false }, (err, affectedRows) => {
                    if (err) {
                      console.log('error processing itemId step 2' + recordSetFindAll[i - 1]._id + '. Err: ' + err)
                      resolve(false)
                      return
                    }
                    resolve(true)
                  })
              })

            break
          }
        }
      })
  })
}

function remove (db, itemId) {
  return new Promise((resolve, reject) => {
    db.update(
      { _id: itemId },
      { $set: { removed: true } },
      { upsert: false },
      (err, affectedRows) => {
        if (err) reject(err)
        if (affectedRows === 0) {
          resolve(false)
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
  setupNewSession,
  changeOrder,
  remove
}
