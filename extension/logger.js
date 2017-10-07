const co = require('../custom/const');


function postLog(data) {
  postGGForm(co.POST_LOG_ID, co.POST_LOG_ENTRY1, data[1], co.POST_LOG_ENTRY2, data[0]);
}

function postGGForm(id, entry, str, entry2=null, str2=null) {
	var data = "entry."+entry+"=" + str;
  if (entry2 != null) {
    data += "&entry."+entry2+"=" + str2;
  }

	// Set up the request
	var requ = require('https').request({
	host: 'docs.google.com',
	port: '443',
	path: '/forms/d/e/'+id+'/formResponse',
	method: 'POST',
	headers: {
		'Content-Type': 'application/x-www-form-urlencoded',
		'Content-Length': data.length
	}
	});
	requ.write(data);
	requ.end();
}

module.exports = {
	postGGForm: postGGForm,
  postLog: postLog
};
