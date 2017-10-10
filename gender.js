var setGender = function (sqlconn, id, gender_str, callback) {
	var genderid = 0;
	if (gender_str == 'doituongnam') {
		genderid = 1;
	} else if (gender_str == 'doituongnu') {
		genderid = 2;
	} else if (gender_str == 'doituongkhong') {
		genderid = 0;
	} else {
		callback(-1, id);//no valid value
		return;
	}
	sqlconn.query('INSERT INTO gender (uid, gender) VALUES (?,?) '+
					'ON DUPLICATE KEY UPDATE '+
					'gender=VALUES(gender)', [id, genderid], function (error, results, fields) {
		if (error) {
			callback(-2, id);//ERR writing to db
			console.log(error);
		} else {
			callback(genderid, id);//OK
		}
	});
};

var getGender = function (sqlconn, id, callback, facebook, token) {
	sqlconn.query('SELECT uid,gender FROM gender WHERE uid='+id, function (error, results, fields) {
		if (error) {
			//callback(-1);//ERR reading to db
			callback(0);
			console.log(error);
			//if (REPORT_COUNT<70) postErr(JSON.stringify(error));
		} else {
			if (results.length > 0) {
				callback(results[0].gender);
			} else {
				//callback(0);
				//////////////// if not found, fetch from facebook ////////////////
				facebook.getFbData(token, '/'+id, function(data){
					//console.log(data);
					if (!data.gender) {
						setGender(sqlconn, id, "doituongkhong", function(ret,id){});
						callback(0);
					} else if (data.gender == "male") {
						setGender(sqlconn, id, "doituongnu", function(ret,id){});
						callback(2);
					} else if (data.gender == "female")  {
						setGender(sqlconn, id, "doituongnam", function(ret,id){});
						callback(1);
					}
				});

				////////////////////////////////////////////////////////////////////
			}
		}
	});
}

module.exports = {
	setGender: setGender,
	getGender: getGender
};
