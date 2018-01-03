var HashTable = require('hashtable');
var waitroom = new HashTable();
waitroom.max_load_factor(10);
waitroom.rehash(5);
var pair1 = new HashTable();
pair1.max_load_factor(10);
pair1.rehash(100);
var pair2 = new HashTable();
pair2.max_load_factor(10);
pair2.rehash(100);
var Partner1 = function(id2, genderok, starttime) {
	this.partner = ''+id2;
	this.id2 = id2;
	this.genderok = genderok;
	this.starttime = starttime;
}

var Partner2 = function(id1, genderok, starttime) {
	this.partner = ''+id1;
	this.id1 = id1;
	this.genderok = genderok;
	this.starttime = starttime;
}

var wr_write = function(id, gender, time) {
	waitroom.put(''+id, {gender:gender, time:time});
}

var wr_find = function(id, callback) {
	if (waitroom.has(''+id)) {
		callback(true);
	} else {
		callback(false);
	}
}

var wr_del = function(id) {
	waitroom.remove(''+id);
}

var wr_read = function(callback) {
	var ids = []; var genders = []; var time = [];
	var db = shuffle(waitroom.keys());
	/*db.sort(function(a,b) {
		if (waitroom[a].time > waitroom[b].time) return 1;
		if (waitroom[a].time < waitroom[b].time) return -1;
		return 0;
	});*/
	for (var i=0 ; i<db.length ; i++) {
		ids.push(db[i]);
		var temp = waitroom.get(db[i]);
		genders.push(temp.gender);
		time.push(temp.time);
	}
	callback(ids, genders, time);
}

var cr_write = function(id1, id2, isWantedGender, starttime) {
	var genderok = isWantedGender ? 1 : 0;
	pair1.put(''+id1, new Partner1(id2, genderok, starttime));
	pair2.put(''+id2, new Partner2(id1, genderok, starttime));
}

var cr_find = function(id, callback) {
	var temp = findInCR(id, pair1, 1);
	if (temp != null) {
		callback(temp[0],temp[1],temp[2],temp[3]);
	} else {
		temp = findInCR(id, pair2, 2);
		if (temp != null) {
			callback(temp[0],temp[1],temp[2],temp[3]);
		} else {
			callback(null, false, 1, {});
		}
	}
}

var cr_del = function(id, callback) {
	if (pair1.has(''+id)) {
		var temp = pair1.get(''+id);
		pair2.remove(temp.partner);
		pair1.remove(''+id);
	} else if (pair2.has(''+id)) {
		var temp = pair2.get(''+id);
		pair1.remove(temp.partner);
		pair2.remove(''+id);
	}
	callback(callback);
}

function findInCR(id, cr, number) {
	if (cr.has(id)) {
		var temp = cr.get(id);
		return [temp.partner, false, number, temp];
	} else {
		return null;
	}
}

var cr_read = function(callback) {
	var ret = [];
	var db = pair1.keys();
	for (var i=0 ; i<db.length ; i++) {
		var temp = pair1.get(db[i]);
		ret.push({'id1':db[i], 'id2':temp.partner, 'starttime':temp.starttime});
	}
	callback(ret);
}

var fetchToCache = function(mongo, callback) {
	mongo.conn.collection('chatroom').find().toArray(function (err, results) {
		if (err) {
			console.log(err);
			callback(false);
		} else {
			results.forEach(function(item, index) {
				cr_write(item.id1, item.id2, item.genderok, item.starttime);
			});
			mongo.conn.collection('waitroom').find().toArray(function (err1, results1) {
				if (err1) {
					console.log(err1);
					callback(false);
				} else {
					results1.forEach(function(item) {
						wr_write(item.uid, item.gender, item.time);
					});
					callback(true);
				}
			});
		}
	});
}

var getStats = function() {
	return {
		waitroom:waitroom.size(),
		pair1:pair1.size(),
		pair2:pair2.size()
	}
}

module.exports = {
	wr_write:wr_write,
	wr_find:wr_find,
	wr_del:wr_del,
	wr_read:wr_read,
	cr_write:cr_write,
	cr_find:cr_find,
	cr_del:cr_del,
	cr_read:cr_read,
	fetchToCache:fetchToCache,
	getStats:getStats
};

function shuffle(array) {
  var m = array.length, t, i;
  while (m) {
    i = Math.floor(Math.random() * m--);
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }
  return array;
}
