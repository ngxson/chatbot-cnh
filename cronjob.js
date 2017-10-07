const la = require('./custom/lang');

const WAIT_TOO_LONG = 10*60000;
const WAIT_FORCE_END = 45*60000;
const MUSIC_LIST = ["bach-phan/mia-sebastians-theme-piano-cover-bach-phan",
"keithkenniff/receives",
"koolpianist/chuyen-cua-mua-dong-instrument",
"m7studio/rain-drops-and-yellow-lights",
"bach-phan/because-its-you-piano-cover-bachphan",
"toilavu/muamuangaunamcanh",
"ffoanh/mo-tank27-cover",
"ngot/cahoi",
"ch-n-chaly/outro",
"bach-phan/summer-scent-bach-phan",
"bach-phan/tinh-yeu-toi-hat-bach-phan-ft",
"bach-phan/nhung-khung-cua-so-uot-mua-bachphan",
"ch-n-chaly/mademoiselle-why-dont-you-come",
"funnybatmusic/say-goodbye",
"h-kin-1/ng-y-t-m-tr-ng-sinh-ra-t-ng-nh",
"phamtoanthang/to-n-th-ng-ch-m-live-demo",
"bach-phan/deep-ocean",
"thinhe1/le-cat-trong-ly-chenh-venh-live-in-church",
"thinhe1/le-cat-trong-ly-di-qua-bong-dem",
"he-is-we/our-july-in-the-rain-acoustic",
"20121997/song",
"angelo-mikha/lost-stars-begin-again-ost-instrumental-cover",
"loichimdoquyen/cao-hon-vi-sao",
"officialbirdy/skinny-love",
"flodyaaay/flod-aichoai-feat-m",
"ch-n-chaly/ch-ng-trai-m-c-o-xanh",
"ch-n-chaly/mademoiselle-loanh-quanh",
"trang-music/hay-bao-nang-ve-di-piano-ver-phung-khanh-linh-sang-tac-trang",
"thinhe1/le-cat-trong-ly-em-dung-tren-canh-dong-live-in-church-1",
"ericvn/the-la-thoi-ngo-hoang-huy",
"orangeakatoanlee/nhin-xem-cam",
"orangeakatoanlee/cho-ai-feat-qqq-cam",
"susuuuuu/la-pham-dinh-thai-ngan",
"fukurou-first/cu-khoang-ha",
"phamthai/chuyen-xe",
"iwasbornfree/solim",
"marzuz/mai",
"doanminhquan/em-1",
"phamtoanthang/pham-toan-thang-cu-the-demo",
"phamtoanthang/pham-toan-thang-chi-mot-cau-demo",
"the5050/official-mp3-nhung-ngay-he-ay-chuot-tho-cam-ft-d-crown",
"dcrownnguyen/bang-khuang-crying-over-you-mashup-acoustic-cover",
"phamtoanthang/linh-phi-sang-toi",
"quancartoon/cham-demo",
"quancartoon/nguoi-ta-thuong-noi",
"quancartoon/thang4",
"atlanticrecords/christina-perri-jar-of-hearts"];

var sendButtonMsg = null;
var sqlconn = null;

var doInBackground = function() {
	var d = new Date();
	//console.log("time="+d.getTime());
	sqlconn.query('SELECT uid,gender,time FROM waitroom', function (err, results, fields) {
		if (err) {
			console.log('__waiting.getListWaitRoom error: ',err);
		} else {
			results.forEach(function(e) {
				if (d.getTime() - e.time > WAIT_TOO_LONG-50 &&
					d.getTime() - e.time < WAIT_TOO_LONG+60050) {
						sendButtonMsg(e.uid, (la.WAITING_TOO_LONG + MUSIC_LIST[randomInt(0,MUSIC_LIST.length-1)]),
							false, true, false);
				} else if (d.getTime() - e.time >= WAIT_FORCE_END) {
					sqlconn.query('DELETE FROM waitroom WHERE uid='+e.uid, function (err, results, fields) {});
					sendButtonMsg(e.uid, la.WAITING_FORCE_END, true, true);
				}
			});
		}
	});
}

function randomInt(min,max) {
    return Math.floor(Math.random()*(max-min+1)+min);
}

module.exports = {
	init: function(sendButtonMsgObj, sqlconnObj) {
		sendButtonMsg = sendButtonMsgObj;
		sqlconn = sqlconnObj;
		setTimeout(doInBackground, 1000);
		setInterval(doInBackground, 60000);
	}
};
