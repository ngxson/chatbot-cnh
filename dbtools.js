const dbmongo = require('./dbmongo');
const cache = require('./dbcache');
var HashTable = require('hashtable');
var cacheReady = false;
var mongo_private = null;
var lasttalkdb = new HashTable();
lasttalkdb.max_load_factor(10);
lasttalkdb.rehash(80);

var init = function (mongo_) {
	if (mongo_) mongo_private = mongo_;
	cache.fetchToCache(mongo_private, function(ok) {
		if (ok) {
			cacheReady = true;
			delete mongo_private;
		} else {
			setTimeout(init, 10000);
		}
	})
}

module.exports = {
	init: init,
	initMongo: dbmongo.init,
	cacheReady: cacheReady,

	writeToWaitRoom: function (mongo, id, gender) {
		dbmongo.writeToWaitRoom(mongo, id, gender);
		var d = new Date();
		cache.wr_write(id, gender, d.getTime());
	},

	findInWaitRoom: function (mongo, id, callback) {
		if (cacheReady) {
			cache.wr_find(id, callback)
		} else {
			dbmongo.findInWaitRoom(mongo, id, callback)
		}
	},

	deleteFromWaitRoom: function (mongo, id) {
		dbmongo.deleteFromWaitRoom(mongo, id);
		cache.wr_del(id);
	},

	getListWaitRoom: function (mongo, callback) {
		if (cacheReady) {
			cache.wr_read(callback);
		} else {
			dbmongo.getListWaitRoom(mongo, callback);
		}
	},

	//chatroom tools
	writeToChatRoom: function (mongo, fs, id1, id2, isWantedGender) {
		dbmongo.writeToChatRoom(mongo, fs, id1, id2, isWantedGender);
		var d = new Date();
		cache.cr_write(id1, id2, isWantedGender, d.getTime());
	},

	//callback(id, haveToReview, role, data);
	findPartnerChatRoom: function (mongo, id, callback) {
		if (cacheReady) {
			cache.cr_find(id, callback)
		} else {
			dbmongo.findPartnerChatRoom(mongo, id, callback)
		}
	},

	deleteFromChatRoom: function (mongo, id, callback) {
		if (cacheReady) {
			dbmongo.deleteFromChatRoom(mongo, id, function(){});
			cache.cr_del(id, callback);
		} else {
			dbmongo.deleteFromChatRoom(mongo, id, callback);
			cache.cr_del(id, function(){});
		}
	},

	getListChatRoom: function (mongo, callback) {
		if (cacheReady) {
			cache.cr_read(callback);
		} else {
			dbmongo.getListChatRoom(mongo, callback)
		}
	},

	// LAST TALK
	findInLastTalk: function (id1, id2) {
		id1 = id1+'' ; id2 = id2+'';
		if (lasttalkdb.has(id1)) {
			return (lasttalkdb.get(id1) === id2);
		}
	},

	updateLastTalk: function (id1, id2) {
		id1 = id1+'' ; id2 = id2+'';
		lasttalkdb.put(id1, id2);
	},

	getListLastTalk: function (callback) {
		var ret = [];
		lasttalkdb.forEach(function(key, value) {
        ret.push([key,value]);
    });
		callback(ret);
	},

	getStats: function() {
		var temp = cache.getStats();
		temp.cacheReady = cacheReady;
		return temp;
	}
};
