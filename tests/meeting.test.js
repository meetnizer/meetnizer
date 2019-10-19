const meeting = require('../services/meeting');
var Datastore = require('nedb');
const appLocalPath = __dirname;
const fs = require('fs');

test('findById', function() {
    var db =  new Datastore({ 
        autoload: true
    });
    
    function check(ret) {
        expect(ret).toBe(null);
    }
    meeting.getById(db,'aaase', check)
});

test('newMetting', function () {
    var db =  new Datastore({ 
        autoload: true
    });

    function validateResultId(ret) {
        expect(ret._id.length).toBeGreaterThan(0);

        meeting.getById(db, ret._id, validateResultName)
    }
    function validateResultName(ret) {
        expect(ret.name).toBe('Team Meeting');
    }
    meeting.new(db, 'Team Meeting',validateResultId);
});

test('changeMetting', function () {
    var db =  new Datastore({ 
        autoload: true
    });

    function validateResultId(ret) {
        expect(ret._id.length).toBeGreaterThan(0);
        
        ret.name = "test";

        meeting.save(db, ret, validateUpdatedRecord)
    }
    function validateUpdatedRecord(ret) {
        expect(ret).toBe(1);
    }

    meeting.new(db, 'Team Meeting',validateResultId);
});
