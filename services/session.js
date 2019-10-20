function findById(meeting, sessionId) {
    meeting.sessions.map(item => {
        if (item._id = sessionId) {
            return item;
        }
    });

    return null;
}

function newSession(db, meeting, name, date, durationInHours) {
    const session = {
        name,
        date,
        durationInHours,
        finish: false
    };
    meeting.sessions.push(session);
    return meeting;
}

module.exports = {
    findById: findById,
    new: newSession
}