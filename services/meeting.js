function newMeeting (db, name) {
  return new Promise((resolve, reject) => {
    db.find({ name: name }, (err, recordSet) => {
      if (err) reject(err)

      if (recordSet.length) {
        reject(new Error('meeting.record.exists'))
      }

      var data = {
        name: name,
        sessions: []
      }

      db.insert(data, (err, recordSet) => {
        if (err) reject(err)

        resolve(recordSet)
      })
    })
  })
}

function findById (db, id) {
  return new Promise((resolve, reject) => {
    db.findOne({ _id: id }, (err, recordSet) => {
      if (err) reject(err)
      resolve(recordSet)
    })
  })
}

function saveMeeting (db, obj) {
  return new Promise((resolve, reject) => {
    db.update({ _id: obj._id }, obj, {}, (err, affectedRows) => {
      if (err) reject(err)
      if (affectedRows === 0) { reject(new Error('meeting.not.found')) } else { resolve(true) }
    })
  })
}

function getAllMeetings (db) {
  return new Promise((resolve, reject) => {
    db.find({}, (err, recordSet) => {
      if (err) reject(err)
      resolve(recordSet)
    })
  })
}
module.exports = {
  newMeeting,
  findById,
  saveMeeting,
  getAllMeetings
}
