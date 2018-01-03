/*
 * Module gửi broadcast_messages
sendBroadcast(access_token, text, function(success) {
	//success = true nếu gửi thành công
	//success = false nếu gửi lỗi
})
 */
var request = require('request');

var sendBroadcast = function(access_token, text, callback) {
	request({
		url: 'https://graph.facebook.com/v2.11/me/message_creatives?access_token='+access_token,
		method: 'POST',
		json: {
			"messages": [{
				"text": text
			}]
		}
	},(err, res,body)=> {
		if(err){callback(false); return;}
		if(res && res.body && res.body["message_creative_id"]) {
			handleCreativeId(access_token, res.body["message_creative_id"], callback);
		} else {
			console.log(JSON.stringify(res.body));
			callback(false);
		}
	});
};

var send = function(access_token, message,custom_label_id) {
    var promise = new Promise((resolve,reject)=>{
        getCreativeId(access_token,message).then(creative_id=>{
            if(!creative_id){
                reject();
                return;
            }
            var data = {
                message_creative_id: creative_id
            };
            if(custom_label_id)data.custom_label_id = custom_label_id;
            request({
		url: 'https://graph.facebook.com/v2.11/me/broadcast_messages?access_token='+access_token,
		method: 'POST',
		json: data
            },(err, res,body)=> {
                    if(err){
                        reject();
                        return;
                    }
                    if(res && res.body && res.body["broadcast_id"]) {
                            resolve({
                                success: true,
                                broadcast_id: res.body.broadcast_id
                            });
                    } else {
                            reject();
                    }
            });
        });
    });
    
    return promise;
};

var getCreativeId = function(access_token,message){
    var promise = new Promise((resolve,reject)=>{
        request({
		url: 'https://graph.facebook.com/v2.11/me/message_creatives?access_token='+access_token,
		method: 'POST',
		json: {
			"messages": [message]
		}
	},(err, res,body)=> {
		if(err){
                    reject();
                    return;
                }
		if(res && res.body && res.body["message_creative_id"]) {
			resolve(res.body["message_creative_id"]);
		} else {
			console.log(JSON.stringify(res.body));
			reject();
		}
	});
    });
    return promise;
};

function handleCreativeId(access_token, cid, callback) {
        
	request({
		url: 'https://graph.facebook.com/v2.11/me/broadcast_messages?access_token='+access_token,
		method: 'POST',
		json: {
			"message_creative_id": cid
		}
	},(err, res,body)=> {
		if(err){callback({
                            success: false,
                            error: 'Something went wrong! Try again later!'
                        }); return;}
		if(res && res.body && res.body["broadcast_id"]) {
			callback({
                            success: true,
                            broadcast_id: res.body.broadcast_id
                        });
		} else {
			callback({
                            success: false,
                            error: 'Something went wrong! Try again later!'
                        });
		}
	});
}

module.exports = {
    sendBroadcast: sendBroadcast,
    send: send
};
