
<img src="https://raw.githubusercontent.com/ngxson/chatbot-cnh/master/readme/github_cover.png" width="100%">

# Chatbot CNH - Version 4.1
---
### Lời nói đầu

> **(15/06/2019) Lưu ý**: Do mình bận nên không có tgian duy trì dự án này nữa. Các bạn có thể dùng phiên bản của @hieplpvip tại đây: [https://github.com/ptnkchat/ptnkchat](https://github.com/ptnkchat/ptnkchat)

Bonjour à tous,

Mình là Nui. Mình lập ra chatbot này với mục đích ban đầu là để thử thách bản thân, cũng như giúp mọi người có 1 nơi lành mạnh để giải tỏa tinh thần.

Vì nó được làm từ lúc kinh nghiệm của mình còn ít ỏi, phong cách code sẽ khá xấu. Tuy nhiên, mình muốn tập trung nhiều vào việc tối ưu hóa, trong khi phải giảm tối đa chi phí hoạt động (thực tế mình chưa phải bỏ ra đồng nào để duy trì nó :smiley: ). Đồng thời mình cũng đã thử nghiệm 1 vài phương pháp thống kê thông qua dữ liệu thu được. Điều này rất ý nghĩa với mình vì nó giúp mình có 1 cái nhìn tổng quát hơn về nhu cầu của người sử dụng.

Mình mong rằng với source code này, các bạn, không kể là học sinh CNH hay không, có thể tự tạo 1 chatbot hoàn hảo của riêng mình.

Merci et bonne chance!

P/S: Bạn có thể ghé thăm **website chính thức** của Nui tại đây: [https://ngxson.com/](https://ngxson.com/)

### Tính năng

Ngoài tính năng nói chuyện ẩn danh mà hầu hết các chatbot cơ bản đều có, Chatbot CNH còn có 1 vài tính năng thú vị như:

* Ghép cặp theo nam - nữ
* Gửi ảnh chó/mèo bất kỳ khi gõ meow hoặc gauw
* Nút báo cáo cho admin được đặt tại các vị trí cần thiết, tránh để người dùng sử dụng nút report của facebook => page dễ bị xóa
* Các thông báo lỗi rõ ràng, người dùng dễ hiểu (ví dụ như inbox ko gửi được do "đối" chat đã block page/deactive facebook...)
* Có giao diện cho admin quản lý
* Tối ưu hóa trong hệ thống như:
  * Có cache để đỡ truy vấn SQL nhiều lần (các bạn dùng heroku hay c9 sẽ gặp vấn đề là server chính với server SQL ở xa nhau, độ trễ sẽ lớn. Vì vậy, có cache sẽ giúp giảm rất rất nhiều lượt query)
  * Cache sử dụng native c++ hashtable
  * Đối với heroku, tự động reset app để lấy IP khác nếu IP hiện tại bị facebook chặn.
  * Hạn chế tối đa việc sử dụng try... catch

### Hướng dẫn cài đặt

  Các bạn hãy xem hướng dẫn kèm ảnh chi tiết tại đây (dùng host Heroku): [click here](https://raw.githubusercontent.com/ngxson/chatbot-cnh/master/readme/1-TUT-CHATBOT-CNH.pdf)

  Đối với các bạn dùng C9 hay host riêng: [click here](https://github.com/ngxson/chatbot-cnh/blob/master/readme/TUT_NON_HEROKU.md)

  (Bạn nên in hướng dẫn này ra cho dễ nhìn, chỉ có 16 trang thôi mà :smiley: )

  **UPDATE** Hãy tham gia group để báo lỗi cũng như nhận các bản cập nhật trong tương lai: [click here](https://www.facebook.com/groups/857516637754308)

### Sơ đồ hoạt động

Trăm nghe không bằng 1 thấy. Mình nghĩ sơ đồ sau sẽ giúp bạn có cái nhìn tổng quát hơn về những gì mình đã làm:

<img src="https://raw.githubusercontent.com/ngxson/chatbot-cnh/master/readme/diagram_index.png" width="100%">

Trong sơ đồ còn 1 vài phần mình chưa biểu diễn đc:

* facebook.js: chứa tools để giao tiếp với facebook
* extension/gifts.js: công cụ chọn ảnh chó/mèo random
* extension/logger.js: công cụ lưu lại ID các cặp vào Google Form
* extension/broadcast.js: công cụ gửi tin nhắn tới tất cả người dùng
* extension/admin.js: công cụ giao tiếp với giao diện admin
* extension/cronjob.js: cronjob tự động kick người dùng khỏi hàng chờ nếu phải chờ quá lâu
* dbmongo.js: tools để giao tiếp với MongoDB
* dbcache.js: tools để giao tiếp với cache

### Thanks to

Mã nguồn của mình có dựa vào source của @jw84: [click here](https://github.com/jw84/messenger-bot-tutorial)
