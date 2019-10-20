function newItem(db, sessionId, name, owner, time, callback) {
    db.insert(
        {
            name,
            owner,
            time,
            done: false,
            sessions: [sessionId],
            comments: []
        }, (err, record) => {
            if (err) callback(err);

            callback(record);
    });
}
function getById(db, itemId, callback) {
    db.findOne({_id: itemId}, (err,recordSet) => {
        if (err) callback(err);

        callback(recordSet);
    });
}
function addToSession(db, itemId, sessionId, callback) {
    db.findOne({_id: itemId}, (err,recordSet) => {
        if (err) callback(err);

        if (recordSet === null || recordSet === undefined) {
            throw new Error("item.record.notexists");
        }

        recordSet.sessions.push(sessionId);

        db.update({_id: itemId}, recordSet, (err,result) => {
            if (err) callback(err);
            
            callback(result);
        });
    })
}

function findAll(db, sessionId, callback) {
    db.find({sessions:[sessionId]}, (err, recordSet) => {
        if (err) callback(err);

        callback(recordSet);
    });
}
function addComment(db, itemId, comment, callback) {
    getById(db,itemId,(record) => {
        record.comments.push(comment);
        db.update({ _id: itemId}, record, {}, (err,recordSet) => {
            if (err) callback(err);
            callback(recordSet);
        })
    });
}
module.exports = {
    new: newItem,
    addToSession: addToSession,
    getById: getById,
    getAll: findAll,
    addComment:addComment
}