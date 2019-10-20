const meeting = require('../services/meeting');
var Datastore = require('nedb');

test('findById', function() {
    var db =  new Datastore({ 
        autoload: true
    });
    
    function check(ret) {
        expect(ret).toBe(null);
    }
    meeting.findById(db,'aaase', check)
});

test('newMetting', function () {
    var db =  new Datastore({ 
        autoload: true
    });

    function validateResultId(ret) {
        expect(ret._id.length).toBeGreaterThan(1);

        meeting.findById(db, ret._id, validateResultName)
    }
    function validateResultName(ret) {
        expect(ret.name).toBe('Team Meeting');
    }
    meeting.newMeeting(db, 'Team Meeting',validateResultId);
});

test('changeMetting', function () {
    var db =  new Datastore({ 
        autoload: true
    });
    var id = "";
    function validateResultId(ret) {
        expect(ret._id.length).toBeGreaterThan(1);
        id = ret._id;
        ret.name = "test";

        meeting.saveMeeting(db, ret, validateUpdatedRecord)
    }
    function validateUpdatedRecord(ret) {
        expect(ret).toBe(1);

        meeting.findById(db, id, checkResult);
    }

    function checkResult(ret) {
        expect(ret.name).toBe("test");
    }

    meeting.newMeeting(db, 'Team Meeting',validateResultId);
});
