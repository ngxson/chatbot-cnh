const co = require('../custom/const');
const la = require('../custom/lang');
const request = require('request');
var tools;
var sqlconn;
var sendButtonMsg;

var everyMinute = function() {
  var d = new Date();
  tools.getListWaitRoom(sqlconn, function(list, genderlist, timelist) {
    timelist.forEach(function(time, i) {
      if (d.getTime() - time > co.MAX_WAIT_TIME_MINUTES*60000) {
        sendButtonMsg(list[i], la.END_CHAT_FORCE, true, true);
        tools.deleteFromWaitRoom(sqlconn, list[i]);
      }
    });
  })
}

var every15mins = function() {
  request({
		url: 'http://cors-proxy.htmldriven.com/?url=https://'+co.APP_NAME+'.herokuapp.com/',
		method: 'GET'
	}, function(error, response, body) {})
}

var init = function(toolsObj, sqlconnObj, sendButtonMsgObj) {
  if (co.MAX_WAIT_TIME_MINUTES > 0) {
    tools = toolsObj;
    sqlconn = sqlconnObj;
    sendButtonMsg = sendButtonMsgObj;
    setInterval(everyMinute, 60000);
    setTimeout(everyMinute, 5000);
  }

  if (co.APP_NAME && co.KEEP_APP_ALWAYS_ON) {
    setInterval(every15mins, 15*60000);
  }
}

module.exports = {
  init:init
};
