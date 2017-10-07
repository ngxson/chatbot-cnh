const sql = require('./dbsql');
const cache = require('./dbcache');
var HashTable = require('hashtable');
var cacheReady = false;
var sqlconn_private = null;
var lasttalkdb = new HashTable();

var init = function (sqlcon) {
	if (sqlcon) sqlconn_private = sqlcon;
	cache.fetchToCache(sqlconn_private, function(ok) {
		if (ok) {
			cacheReady = true;
			delete sqlconn_private;
		} else {
			setTimeout(init, 10000);
		}
	})
}

module.exports = {
	init: init,
	cacheReady:cacheReady,

	writeToWaitRoom: function (sqlconn, id, gender) {
		sql.writeToWaitRoom(sqlconn, id, gender);
		var d = new Date();
		cache.wr_write(id, gender, d.getTime());
	},

	findInWaitRoom: function (sqlconn, id, callback) {
		if (cacheReady) {
			cache.wr_find(id, callback)
		} else {
			sql.findInWaitRoom(sqlconn, id, callback)
		}
	},

	deleteFromWaitRoom: function (sqlconn, id) {
		sql.deleteFromWaitRoom(sqlconn, id);
		cache.wr_del(id);
	},

	getListWaitRoom: function (sqlconn, callback) {
		if (cacheReady) {
			cache.wr_read(callback);
		} else {
			sql.getListWaitRoom(sqlconn, callback);
		}
	},

	//chatroom tools
	writeToChatRoom: function (sqlconn, fs, id1, id2, isWantedGender) {
		sql.writeToChatRoom(sqlconn, fs, id1, id2, isWantedGender);
		var d = new Date();
		cache.cr_write(id1, id2, isWantedGender, d.getTime());
	},

	//callback(id, haveToReview, role, data);
	findPartnerChatRoom: function (sqlconn, id, callback) {
		if (cacheReady) {
			cache.cr_find(id, callback)
		} else {
			sql.findPartnerChatRoom(sqlconn, id, callback)
		}
	},

	deleteFromChatRoom: function (sqlconn, id, callback) {
		if (cacheReady) {
			sql.deleteFromChatRoom(sqlconn, id, function(){});
			cache.cr_del(id, callback);
		} else {
			sql.deleteFromChatRoom(sqlconn, id, callback);
			cache.cr_del(id, function(){});
		}
	},

	getListChatRoom: function (sqlconn, callback) {
		if (cacheReady) {
			cache.cr_read(callback);
		} else {
			sql.getListChatRoom(sqlconn, callback)
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
