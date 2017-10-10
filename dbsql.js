module.exports = {
	writeToWaitRoom: function (sqlconn, id, gender) {
		var d = new Date();
		sqlconn.query('INSERT INTO waitroom (uid, gender, time) VALUES (?,?,?) ',
			[+id,gender,d.getTime()], function (err, results, fields) {
				if(err) { console.log('__writeToWaitRoom error: ',err); }
			}
		);
	},

	findInWaitRoom: function (sqlconn, id, callback) {
		sqlconn.query('SELECT uid,gender FROM waitroom WHERE uid=?', [id], function (err, results, fields) {
			if (err) {
				console.log('__findInWaitRoom error: ',err);
				callback(false);
			} else if (results.length > 0) {
				callback(true);
			} else {
				callback(false);
			}
		});
	},

	deleteFromWaitRoom: function (sqlconn, id) {
		sqlconn.query('DELETE FROM waitroom WHERE uid=?', [id], function (err, results, fields) {
			if(err) { console.log('__deleteFromWaitRoom error: ',err); }
		});
	},

	getListWaitRoom: function (sqlconn, callback) {
		sqlconn.query('SELECT uid,gender FROM waitroom ORDER BY RAND()', function (err, results, fields) {
			if (err) {
				console.log('__getListWaitRoom error: ',err);
				callback([],[]);
			} else {
				var files = [];
				var genderlist = [];
				results.forEach(function(item, index) {
					files[index] = item.uid+'';
					genderlist[index] = item.gender;
				});
				callback(files, genderlist);
			}
		});
	},

	//chatroom tools
	writeToChatRoom: function (sqlconn, fs, id1, id2, isWantedGender) {
		var d = new Date();
		var genderint = (isWantedGender ? 1 : 0);
		sqlconn.query('INSERT INTO chatroom (id1, id2, starttime, char1, msg1, char2, msg2, genderok) '+
						'VALUES (?,?,?,0,0,0,0,?)',
						[id1,id2,d.getTime(),genderint],
						function (err, results, fields) {
			if(err) {
				console.log('__writeToChatRoom error: ',err);
			}
		});
		//sqlconn.query('DELETE FROM game WHERE id=? OR id=?', [id1,id2], function (err1, results1, fields1) {});//
	},

	//callback(id, haveToReview, role, data);
	findPartnerChatRoom: function (sqlconn, id, callback) {
		sqlconn.query('SELECT id1,id2,msg1,msg2,gamedata,gamemode FROM chatroom WHERE id1=? OR id2=?', [id,id], function (err, results, fields) {
			if (err) {
				console.log('__findPartnerChatRoom error: ',err);
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
	},

	deleteFromChatRoom: function (sqlconn, id, callback) {
		sqlconn.query('SELECT * FROM chatroom WHERE id1=? OR id2=?', [id,id], function (err, results, fields) {
			sqlconn.query('DELETE FROM chatroom WHERE id1=? OR id2=?', [id,id], function (err1, results1, fields1) {});
			if (!err && results[0])
				callback(results[0]);
		});
	},

	getListChatRoom: function (sqlconn, callback) {
		sqlconn.query('SELECT id1,id2,starttime FROM chatroom', function (err, results, fields) {
			if (err) {
				console.log('__getListChatRoom error: ',err);
				callback([]);
			} else {
				callback(results);
			}
		});
	},

	// LAST TALK
	findInLastTalk: function (fs, fn, callback) {
		fs.stat("./lasttalk/"+fn, function(err, stat) {
			if(err == null) {
				callback(true);
			} else {
				callback(false);
			}
		});
	},

	deleteFromLastTalk: function (fs, id) {
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
	},

	getListLastTalk: function (fs, callback) {
		fs.readdir("./lasttalk/", (err, files) => {
			callback(files);
		});
	}
};
