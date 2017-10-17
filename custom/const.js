module.exports = {
	DEBUG : false,

	//FACEBOOK TOKEN
	FB_PAGE_VERIFY_TOKEN : 'passsword_dang_yeu_nhat_qua_dat', // đặt 1 mã bất kỳ
	FB_PAGE_ACCESS_TOKEN : '',

	//HEROKU STUFFS
	APP_NAME : '',
	HEROKU_API_KEY : '',

	//MYSQL SETUP
	DB_CONFIG : {
		host     : '',
		user     : '',
		password : '',
		database : ''
	},

	//ANALYTICS
	HAS_POST_LOG : false,
	POST_LOG_ID : '',
	POST_LOG_ENTRY1 : '',
	POST_LOG_ENTRY2 : '',

	//GOOGLE FORMS
	REPORT_LINK : "https://goo.gl/forms/FlqtshjdI9bMesSN2",

	//OTHERS
	//(không bắt buộc) Cách bật tính năng hiện đã xem (seen): https://goo.gl/xjw9nP
	MAX_PEOPLE_WAITROOM : 7, //Số người tối đa trong phòng chờ
	MAX_WAIT_TIME_MINUTES : 60, //Số phút tối đa 1 người đc phép trong phòng chờ.
	                            //Đặt 0 để cho phép đợi bao lâu cũng đc

	//ADMIN UI
	ADMIN_PASSWORD : "" //password để login vào trang admin
};
