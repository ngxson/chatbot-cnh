'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()
const co = require('./custom/const');

app.set('port', (process.env.PORT || 5000))

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.get('/', function (req, res) {
	res.send('')
})

app.post('/webhook/', function (req, res) {
	let messaging_events = req.body.entry[0].messaging
	for (let i = 0; i < messaging_events.length; i++) {
		let event = req.body.entry[0].messaging[i]
		let sender = event.sender.id
		sendTextMessage(sender, "*Chatbot:* Có lỗi xảy ra với chatbot. Tin nhắn của bạn chưa được xử lý. Bạn hãy thử lại sau 1 phút nữa nhé.")
		admin.database().ref("crashed/"+co.PAGE_ID+"/"+sender).set(1);
	}
	res.sendStatus(200)
})

const token = process.env.FB_PAGE_ACCESS_TOKEN;

function sendTextMessage(sender, text) {
	let messageData = { text:text }
	
	request({
		url: 'https://graph.facebook.com/v2.6/me/messages',
		qs: {access_token:token},
		method: 'POST',
		json: {
			recipient: {id:sender},
			message: messageData,
		}
	}, function(error, response, body) {
		if (error) {
			console.log('Error sending messages: ', error)
		} else if (response.body.error) {
			console.log('Error: ', response.body.error)
		}
	})
}

// spin spin sugar
app.listen(app.get('port'), function() {
	console.log('running on port', app.get('port'))
})

sendTextMessage(co.DEV_ID, co.APP_NAME+' CRASH!!!');

//auto exit after 12 secs
setTimeout(function() {
	process.exit(1);
}, 8000);