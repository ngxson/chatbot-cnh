var MAX_CAT_IMG = 10229;
var MAX_DOG_IMG = 5250;
const facebook = require('../facebook');

function sendCatPic(id, id2, notInChat) {
	getCatData(function(data) {
		if (notInChat) data["quick_replies"] = facebook.quickbtns;
		//else data["quick_replies"] = facebook.quickbtns_mini;
		facebook.sendFacebookApi(id, id, data, {});
		if (id2 != null) facebook.sendFacebookApi(id2, id2, data, {});
	});
}

function sendDogPic(id, id2, notInChat) {
	getDogData(function(data) {
		if (notInChat) data["quick_replies"] = facebook.quickbtns;
		//else data["quick_replies"] = facebook.quickbtns_mini;
		facebook.sendFacebookApi(id, id, data, {});
		if (id2 != null) facebook.sendFacebookApi(id2, id2, data, {});
	});
}

var getCatData = function(callback) {
	var img=randomIntFromInterval(1,MAX_CAT_IMG);
	var url='';
	if (img <= 9360) {
		url='nuimeow.github.io/jpg/'+img+'.jpg';
	} else {
		url='nuimeow.github.io/gif/'+img+'.gif';
	}
	callback({
		"attachment":{"type":"image",
		"payload":{
			"url":'https://'+url
		}}
	});
}

var getDogData = function(callback) {
	var img=randomIntFromInterval(1,MAX_DOG_IMG);
	var url='';
	if (img <= 5169) {
		url='nuimeow.github.io/dog/jpg/'+img+'.jpg';
	} else {
		url='nuimeow.github.io/dog/gif/'+img+'.gif';
	}
	callback({
		"attachment":{"type":"image",
		"payload":{
			"url":'https://'+url
		}}
	});
}

module.exports = {
	sendCatPic: sendCatPic,
	sendDogPic: sendDogPic,
	getCatData: getCatData,
	getDogData: getDogData
};

function randomIntFromInterval(min,max) {
    return Math.floor(Math.random()*(max-min+1)+min);
}
