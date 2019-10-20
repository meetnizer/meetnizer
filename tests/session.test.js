const meeting = require('../services/meeting');
const session = require('../services/session');
var Datastore = require('nedb');

test('getSessionById', function() {
    var db =  new Datastore({ 
        autoload: true
    });
    
    function meetingSaved(record) {
        expect(record._id.length).toBeGreaterThan(1);

        const result = session.id(record, 12);
        expect(result).toBe(null);
    }

    meeting.new(db, "Team Meeting", meetingSaved)
});

test('createSession', function() {
    var db =  new Datastore({ 
        autoload: true
    });
    var id = "";

    function meetingSaved(record) {
        expect(record._id.length).toBeGreaterThan(1);
        id = record._id;
        var obj = session.new(db, record, 'First monday of the month','21/10/2019', 2);
        expect(obj.sessions.length).toBe(1);
        expect(obj.sessions[0].date).toBe('21/10/2019');
        expect(obj.sessions[0].name).toBe('First monday of the month');
        expect(obj.sessions[0].durationInHours).toBe(2);
        expect(obj.sessions[0].finish).toBe(false);
        meeting.save(db, obj, meetingChanged);
    }
    function meetingChanged(record) {
        expect(record).toBe(1);
        meeting.id(db, id, checkResult);
    }
    function checkResult(record) {
        expect(record.sessions.length).toBe(1);
        expect(record.sessions[0].date).toBe('21/10/2019');
        expect(record.sessions[0].name).toBe('First monday of the month');
        expect(record.sessions[0].durationInHours).toBe(2);
        expect(record.sessions[0].finish).toBe(false);
    }

    meeting.new(db, "Team Meeting", meetingSaved)
});