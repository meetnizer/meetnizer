const meeting = require('../services/meeting');
const session = require('../services/session');
const momment = require('moment');
var Datastore = require('nedb');

test('getSessionById', function() {
    var db =  new Datastore({ 
        autoload: true
    });
    
    function meetingSaved(record) {
        expect(record._id.length).toBeGreaterThan(1);

        const result = session.findById(record, 12);
        expect(result).toBe(null);
    }

    meeting.newMeeting(db, "Team Meeting", meetingSaved)
});

test('createSession', function() {
    var db =  new Datastore({ 
        autoload: true
    });
    var id = "";
    var myDate = momment('21/10/2019', 'dd/MM/yyyy');
    function meetingSaved(record) {
        expect(record._id.length).toBeGreaterThan(1);
        id = record._id;
        var obj = session.addSession(db, record, 'First monday of the month',myDate, 2);
        expect(obj.sessions.length).toBe(1);
        expect(obj.sessions[0].date).toBe('21/10/2019');
        expect(obj.sessions[0].name).toBe('First monday of the month');
        expect(obj.sessions[0].durationInHours).toBe(2);
        expect(obj.sessions[0].finish).toBe(false);
        meeting.saveMeeting(db, obj, meetingChanged);
    }
    function meetingChanged(record) {
        expect(record).toBe(1);
        meeting.findById(db, id, checkResult);
    }
    function checkResult(record) {
        expect(record.sessions.length).toBe(1);

        var d = record.sessions[0].date;
        expect(moment(d).format('yyyy/MM/dd')).toBe('2019/10/21');

        expect(record.sessions[0].name).toBe('First monday of the month');
        expect(record.sessions[0].durationInHours).toBe(2);
        expect(record.sessions[0].finish).toBe(false);
    }

    meeting.newMeeting(db, "Team Meeting", meetingSaved)
});