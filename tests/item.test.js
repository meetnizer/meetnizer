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
        expect(record.done).toBe(false);
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
        item.getById(db, itemId, getItem);
    }
    function getItem(record) {
        expect(record.sessions.length).toBe(2);
        expect(record.sessions[1]).toBe("df45va325");
    }

    item.new(db, sessionId, "discuss about open source software", "Bruno", 5, getItemId);
});

test('getAllItemsForSession', function() {
    var db =  new Datastore({ 
        autoload: true
    });
    function saveItem1(record) {
        item.new(db, sessionId, "discuss about open source software", "Fabio", 5, saveItem2);    
    }
    function saveItem2(record) {
        item.getAll(db, sessionId, validateItems);
    }
    function validateItems(items) {
        expect(items.length).toBe(2);
    }
    item.new(db, sessionId, "discuss about open source software", "Bruno", 5, saveItem1);
});

test('updateItem', function() {
    var db =  new Datastore({ 
        autoload: true
    });
    var itemId = "";
    function saveItem1(record) {
        itemId = record._id;

        item.addComment(db, itemId, "For the next meeting talk about the nginx server", itemUpdated);
    }

    function itemUpdated(record) {
        expect(record).toBe(1);

        item.getById(db,itemId,getItem);
    }

    function getItem(record) {
        expect(record.done).toBe(false);
        expect(record.comments.length).toBe(1);

        //item.update(db, itemId);
    }

    item.new(db, sessionId, "discuss about open source software", "Bruno", 5, saveItem1);
});