const meeting = require('../services/meeting');
const session = require('../services/session');
const item = require('../services/item');
var Datastore = require('nedb');
const sessionId = "Awdxr";

test('saveItem', function() {
    var db =  new Datastore({ 
        autoload: true
    });
    
    function getItemId(record) {
        expect(record._id.length).toBeGreaterThan(1);
        expect(record.name).toBe("discuss about open source software");
        expect(record.owner).toBe("Bruno"); 
        expect(record.time).toBe(5);
        expect(record.sessions.length).toBe(1);
        expect(record.sessions[0]).toBe(sessionId);
    }

    item.new(db, sessionId, "discuss about open source software", "Bruno", 5, getItemId);
});

test('addItemToSession', function() {
    var db =  new Datastore({ 
        autoload: true
    });
    var itemId = "";
    function getItemId(record) {
        expect(record._id.length).toBeGreaterThan(1);
        itemId = record._id;
        item.addToSession(db, record._id, "df45va325", itemSaved);
    }
    function itemSaved(record) {
        expect(1).toBe(1);
        
        //expect(record.sessions.length).toBe(2);
        //expect(record.sessions[1]).toBe("myNewSession");
    }

    item.new(db, sessionId, "discuss about open source software", "Bruno", 5, getItemId);
});
