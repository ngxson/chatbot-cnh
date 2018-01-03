var writeToWaitRoom = function (mongo, id, gender) {
	var d = new Date();
	mongo.conn.collection('waitroom').insertOne({uid:+id, gender:gender, time:d.getTime()}, function (err, results, fields) {
			if(err) {
				console.log('__writeToWaitRoom error: ',err);
				setTimeout(function(){writeToWaitRoom(mongo, id, gender)}, 1000);
			}
		}
	);
}

var findInWaitRoom = function (mongo, id, callback) {
	mongo.conn.collection('waitroom').find({uid: +id}).toArray(function (err, results, fields) {
		if (err) {
			console.log('__findInWaitRoom error: ',err);
			callback(false);
		} else if (results.length > 0) {
			callback(true);
		} else {
			callback(false);
		}
	});
}

var deleteFromWaitRoom = function (mongo, id) {
	mongo.conn.collection('waitroom').deleteMany({uid: +id}, function (err, results, fields) {
		if(err) {
			console.log('__deleteFromWaitRoom error: ',err);
			setTimeout(function(){deleteFromWaitRoom(mongo, id)}, 1000);
		}
	});
}

var getListWaitRoom = function (mongo, callback) {
	mongo.conn.collection('waitroom').find().toArray(function (err, results, fields) {
		if (err) {
			console.log('__getListWaitRoom error: ',err);
			callback([],[]);
		} else {
			var files = [];
			var genderlist = [];
			var time = [];
			results.forEach(function(item, index) {
				files[index] = item.uid+'';
				genderlist[index] = item.gender;
				time[index] = item.time;
			});
			callback(files, genderlist, time);
		}
	});
}

//chatroom tools
var writeToChatRoom = function (mongo, fs, id1, id2, isWantedGender) {
	var d = new Date();
	var genderint = (isWantedGender ? 1 : 0);
	mongo.conn.collection('chatroom').insertOne(
		{id1:+id1, id2:+id2, starttime:d.getTime(), char1:0, msg1:0, char2:0, msg2:0, genderok:genderint},
		function (err, results, fields) {
			if(err) {
				console.log('__writeToChatRoom error: ',err);
				setTimeout(function(){writeToChatRoom(mongo, fs, id1, id2, 	isWantedGender)}, 1000);
			}
	});
}

//callback(id, haveToReview, role, data);
var findPartnerChatRoom = function (mongo, id, callback) {
	mongo.conn.collection('chatroom').find({$or:[{id1:+id},{id2:+id}]}).toArray(function (err, results, fields) {
		if (err) {
			console.log('__findPartnerChatRoom error: ',err);
			setTimeout(function(){findPartnerChatRoom(mongo, id, callback)}, 1000);
			//callback(null, false);
		} else if (results.length > 0) {
			//var haveToReview = (results[0].msg1 < 10 || results[0].msg2 < 10);
			var haveToReview = false;
			if (results[0].id1 == id) {
				callback(results[0].id2, haveToReview, 1, results[0]);
			} else {
				callback(results[0].id1, haveToReview, 2, results[0]);
			}
		} else {
			callback(null, false, 1, {});
		}
	});
}

var deleteFromChatRoom = function (mongo, id, callback) {
	mongo.conn.collection('chatroom').find({$or:[{id1:+id},{id2:+id}]}).toArray(function (err, results, fields) {
		mongo.conn.collection('chatroom').deleteMany({$or:[{id1:+id},{id2:+id}]});
		if (!err && results[0])
			callback(results[0]);
		if (err) {
			setTimeout(function(){deleteFromChatRoom(mongo, id, callback)}, 1000);
		}
	});
}

var getListChatRoom = function (mongo, callback) {
	mongo.conn.collection('chatroom').find().toArray(function (err, results, fields) {
		if (err) {
			console.log('__getListChatRoom error: ',err);
			setTimeout(function(){deleteFromChatRoom(mongo, callback)}, 1000);
		} else {
			callback(results);
		}
	});
}

// LAST TALK
var findInLastTalk = function (fs, fn, callback) {
	fs.stat("./lasttalk/"+fn, function(err, stat) {
		if(err == null) {
			callback(true);
		} else {
			callback(false);
		}
	});
}

var deleteFromLastTalk = function (fs, id) {
	fs.readdir("./lasttalk/", (err, files) => {
		var i;
		for (i=0 ; i<files.length ; i++) {
			var fn = files[i];
			if (fn.indexOf("m"+id) !== -1) {
				fs.unlink("./lasttalk/"+fn, function(err) {
					if(err) { console.log(err); }
				});
			}
		}
	});
}

var getListLastTalk = function (fs, callback) {
	fs.readdir("./lasttalk/", (err, files) => {
		callback(files);
	});
}

var tables = ['chatroom', 'waitroom', 'gender', 'version'];
var init = function (mongo, callback) {
	getCollectionNames(mongo, currentTables => {
		var doneAdd = 0;
		var needToAdd = [];
	
		tables.forEach(tableName => {
			if (currentTables.indexOf(tableName) == -1) {
				needToAdd.push(tableName);
			}
		});
	
		if (needToAdd.length == 0) {
			callback();
			return;
		}
	
		needToAdd.forEach(tableName => {
			initTable(tableName);
		});
	
		function initTable(name) {
			mongo.conn.createCollection(name, function(err, res) {
				doneAdd++;
				if (doneAdd == needToAdd.length) {
					mongo.conn.collection('gender').createIndex( { uid: 1 } );
					mongo.conn.collection('waitroom').createIndex( { uid: 1 } , { unique: true });
					mongo.conn.collection('chatroom').createIndex( { id1: 1, id2: 1 } , { unique: true });
					mongo.conn.collection('version').update({name:"version"}, {name:"version", value:"4.0"},{upsert:true});
					callback();
				}
			});
		}
	});
}

function getCollectionNames(mongo, callback) {
	var names = [];
	mongo.conn.collections(function(e, cols) {
		cols.forEach(function(col) {
			names.push(col.collectionName);
		});
		callback(names);
	});
}

module.exports = {
	init:init,
	writeToWaitRoom:writeToWaitRoom,
	findInWaitRoom:findInWaitRoom,
	deleteFromWaitRoom:deleteFromWaitRoom,
	getListWaitRoom:getListWaitRoom,
	writeToChatRoom:writeToChatRoom,
	findPartnerChatRoom:findPartnerChatRoom,
	deleteFromChatRoom:deleteFromChatRoom,
	getListChatRoom:getListChatRoom,
	findInLastTalk:findInLastTalk,
	deleteFromLastTalk:deleteFromLastTalk,
	getListLastTalk:getListLastTalk
};
