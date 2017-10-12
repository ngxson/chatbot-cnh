### Cài đặt với host riêng

Bạn chỉ cần chỉnh sửa file **custom/const.js**:

**FB_PAGE_VERIFY_TOKEN** và **FB_PAGE_ACCESS_TOKEN** lấy từ facebook (có thể tham khảo cách lấy trong [hướng dẫn cho Heroku](https://raw.githubusercontent.com/ngxson/chatbot-cnh/master/readme/1-TUT-CHATBOT-CNH.pdf))

**HEROKU STUFFS** đặt như sau:

```
APP_NAME : null,
HEROKU_API_KEY : null,
```

**DB_CONFIG**: đặt theo host MySQL của bạn

**Đừng quên import file db_seeder/import_me_via_phpmyadmin.sql vào MySQL để khởi tạo cấu trúc database**

Các phần còn lại có thể tham khảo trong [hướng dẫn cho Heroku](https://raw.githubusercontent.com/ngxson/chatbot-cnh/master/readme/1-TUT-CHATBOT-CNH.pdf) (trang 14), mục các **tùy chọn nâng cao**.
