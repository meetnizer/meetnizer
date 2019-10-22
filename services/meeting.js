function newMeeting (db, name, callback) {
  db.find({ name: name }, (err, recordSet) => {
    if (err) return callback(err, null)

    if (recordSet.length) {
      throw new Error('meeting.record.exists')
    }

    var data = {
      name: name,
      sessions: []
    }

    db.insert(data, (err, recordSet) => {
      if (err) return callback(err, null)

      callback(null, recordSet)
    })
  })
}

function findById (db, id, callback) {
  db.findOne({ _id: id }, (err, recordSet) => {
    if (err) return callback(err, null)

    callback(null, recordSet)
  })
}

function saveMeeting (db, obj, callback) {
  db.update({ _id: obj._id }, obj, {}, (err, recordSet) => {
    if (err) callback(err, null)
    callback(null,recordSet)
  })
}
function getAllMeetings (db, callback) {
  db.find({}, (err, recordSet) => {
    if (err) callback(err, null)
    callback(null, recordSet)
  })
}
module.exports = {
  newMeeting,
  findById,
  saveMeeting,
  getAllMeetings
}
