var getReportLinkArg = function(id1, id2) {
	var d = new Date();
	return encodeNui(id1+'.'+id2+'.'+d.getTime());
}

function encodeNui(str) {
	//place your encrypt function here
	return str;
}

module.exports = {
	getReportLinkArg: getReportLinkArg
};
