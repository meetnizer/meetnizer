function newItem(db, sessionId, name, owner, time, callback) {
    db.insert(
        {
            name,
            owner,
            time,
            sessions: [sessionId]
        }, (err, record) => {
            if (err) callback(err);

            callback(record);
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

module.exports = {
    new: newItem,
    addToSession:addToSession
}