# QNA — Hỏi Cho Đến Khi Hiểu Dự Án "Tiệm Bánh Bé Yêu"

> **Góc nhìn:** Một người hoàn toàn mù công nghệ, chưa từng viết một dòng code nào, đọc README.md và đặt câu hỏi về mọi thứ mình thấy.

---

## Phần 1: Câu hỏi chung — Dự án này là cái gì?

### Q1. "Tiệm Bánh Bé Yêu" là cái gì?
Tao thấy tên giống một tiệm bánh ngoài đời, nhưng đây là "dự án" — vậy nó là tiệm bánh thật hay là cái gì khác?

### Q2. "Đồ án xây dựng ứng dụng Web thương mại điện tử" nghĩa là gì?
Từng chữ một: "đồ án" là gì? "ứng dụng Web" là gì? "thương mại điện tử" là gì? Mấy cái này có liên quan gì đến tiệm bánh không?

### Q3. "Môn học Lập trình Web / Công nghệ phần mềm" — đây là bài tập trên lớp hả?
Có phải sinh viên được giao làm cái này để nộp cho thầy cô không? Hay đây là một tiệm bánh thật ngoài đời đang cần website?

### Q4. Dự án này dành cho ai dùng?
Tao thấy có "Khách hàng" và "Quản trị viên" — đó là hai loại người khác nhau hả? Họ sẽ dùng cái này như thế nào?

---

## Phần 2: Đọc tiêu đề và dòng mô tả đầu tiên

### Q5. "Hệ thống thương mại điện tử chuyên biệt" là sao?
"Chuyên biệt" ở đây nghĩa là gì? Có phải nó khác với mấy trang như Shopee, Lazada không? Khác chỗ nào?

### Q6. "Bánh kẹo hữu cơ an toàn cho trẻ em" — tại sao phải ghi rõ vậy?
Có phải vì sản phẩm cho trẻ em nên website cần gì đó đặc biệt không? Hay chỉ là chủ đề kinh doanh thôi?

### Q7. "Kiến trúc Client–Server" là cái gì?
Tao thấy cái sơ đồ có hai tầng — "Client" là gì? "Server" là gì? Tại sao phải tách ra làm hai? Một mình một cái không được à?

### Q8. "Tầng giao diện (Frontend)" và "Tầng xử lý nghiệp vụ (Backend)" là gì?
Tao tưởng website chỉ có một thứ là cái trang mình nhìn thấy thôi? Sao lại còn có "tầng xử lý nghiệp vụ" nữa? Nghiệp vụ là cái gì?

### Q9. "Khả năng mở rộng và bảo trì" nghĩa là sao?
Mở rộng cái gì? Bảo trì cái gì? Tại sao tách ra hai tầng thì dễ mở rộng và bảo trì hơn?

### Q10. "Nền tảng bán hàng trực tuyến" — vậy người ta có mua bánh thật không?
Tao vào website này có đặt bánh được giao tới nhà không? Hay chỉ là giả lập để nộp bài?

### Q11. "Luồng nghiệp vụ: duyệt sản phẩm → giỏ hàng → đặt hàng → quản lý đơn hàng" — mỗi bước là làm gì?
- "Duyệt sản phẩm" là gì? Có phải là lướt xem bánh không?
- "Giỏ hàng" là gì? Nó có giống cái giỏ đi chợ không?
- "Đặt hàng" — lúc này mới trả tiền hả?
- "Quản lý đơn hàng" — ai quản lý? Quản lý cái gì?

### Q12. "Phân quyền người dùng" là gì?
Sao phải "phân quyền"? Người dùng không phải ai cũng như nhau à? "Khách hàng" với "Quản trị viên" khác nhau chỗ nào?

### Q13. "Responsive, tương thích đa thiết bị" là sao?
Tao mở website trên điện thoại với trên máy tính có khác gì nhau không? "Responsive" là tiếng Anh — dịch ra là "phản hồi nhanh", nhưng ở đây nó có nghĩa gì?

---

## Phần 3: Đọc sơ đồ kiến trúc (Cái hình vuông vuông kia)

### Q14. Cái sơ đồ to đùng với mấy đường kẻ ngang dọc kia là gì?
Tao nhìn thấy mấy cái hộp lồng vào nhau, mũi tên chỉ xuống. Đây là bản vẽ cái gì? Có phải giống sơ đồ mạch điện không?

### Q15. "CLIENT LAYER" là gì?
Chữ "Layer" nghĩa là "tầng" — vậy Client là một tầng à? Tầng này nằm ở đâu? Trong máy tao hay ở đâu?

### Q16. "SERVER LAYER" là gì?
Server là "máy chủ" — vậy tầng này nằm ở một cái máy tính khác hả? Máy đó ở đâu? Của ai?

### Q17. "HTTPS / REST / JSON" trên cái mũi tên nối giữa Client và Server là gì?
Cái mũi tên đó nghĩa là hai tầng nói chuyện với nhau hả? Chúng nói chuyện bằng gì? "HTTPS", "REST", "JSON" là ngôn ngữ gì vậy?

---

## Phần 4: Đọc cái hộp "CLIENT LAYER" — Frontend

### Q18. "React 19 + TypeScript + Vite + Tailwind CSS" — đây là một món hay nhiều món?
Tao thấy một đống tên viết liền nhau — đây là một thứ hay là nhiều thứ ghép lại? Mỗi thứ làm gì?

### Q19. React là cái gì?
Tao nghe nói "React" là thư viện — nhưng thư viện là gì? Nó có phải là cái app không? Tại sao lại cần nó để làm website?

### Q20. TypeScript là cái gì?
Có phải là một loại "tiếng" để viết code không? Nó khác gì với JavaScript (mà tao nghe nói tới nhiều)? "Kiểm tra kiểu tĩnh" là gì?

### Q21. Vite là cái gì?
"Công cụ build & dev server" — build là xây nhà hả? Dev server là gì? Sao frontend cũng cần server?

### Q22. Tailwind CSS là cái gì?
"Framework CSS utility-first" — CSS tao biết là để trang trí website, còn "utility-first" là gì? Sao không viết CSS bình thường mà phải dùng thêm cái này?

### Q23. "React Router DOM 7 (routing)" — routing là gì?
Có phải là cái làm cho website có nhiều trang khác nhau không? Khi tao bấm vào link thì nó chuyển trang — cái đó là routing hả?

### Q24. "Zustand 5 (global state: auth)" — state là gì? auth là gì?
"State" nghe giống "trạng thái" — trạng thái của cái gì? Mà "global" là toàn cục — vậy có state cục bộ nữa hả? "Auth" là viết tắt của cái gì?

### Q25. "React Context API (cart state)" — cart state là gì?
Cái giỏ hàng cũng có "trạng thái" à? Trạng thái của giỏ hàng là những gì? (đang rỗng? đang có 3 món? v.v.)

### Q26. "Axios (HTTP client)" — Axios là gì? HTTP client là gì?
Nghe như tên một con khủng long. Nó làm gì? "HTTP client" — có phải là thằng đi gửi tin nhắn qua lại với server không?

### Q27. "Radix UI + Lucide React (UI components & icons)" — UI components là gì?
"Components" có phải là mấy miếng ghép nhỏ để ráp thành website không? Giống như lego hả? Còn Lucide React là để lấy biểu tượng (icon) đẹp à?

---

## Phần 5: Đọc cái hộp "SERVER LAYER" — Backend

### Q28. "ASP.NET Core 8 — Minimal APIs" — ASP.NET là cái gì?
Nghe như tên một công ty. Nó là ngôn ngữ lập trình hả? ".NET" là gì? "Core" là gì? "Minimal APIs" là gì?

### Q29. "JWT Bearer Authentication" — đây là cái gì?
Tao thấy chữ "Authentication" là xác thực — nhưng JWT là gì? Bearer là gì? Sao lại gọi là "Bearer" (người mang)?

### Q30. "Role-based Authorization (User / Admin)" — Authorization khác gì Authentication?
Tao thấy có hai chữ na ná nhau — "Authentication" với "Authorization". Khác nhau chỗ nào? Một cái là kiểm tra danh tính, một cái là kiểm tra quyền hả?

### Q31. "Swagger / OpenAPI (tài liệu API tự động)" — Swagger là gì?
Nghe tên hơi kỳ. Nó là cái gì mà "tự động" tạo tài liệu? Tài liệu gì? Cho ai đọc?

### Q32. "CORS (cho phép giao tiếp cross-origin)" — CORS là gì?
"Cross-origin" là vượt qua nguồn gốc à? Tại sao frontend với backend lại bị cấm nói chuyện với nhau mà phải cần CORS?

### Q33. "Entity Framework Core 8 (ORM)" — ORM là cái gì?
"Entity" là thực thể, "Framework" là khung — vậy nó là cái khung để làm gì? "ORM" viết tắt của cái gì? Tại sao cần nó?

### Q34. "Code-First Migrations" — Migrations là gì?
Nghe như "di cư" — dữ liệu di cư đi đâu? "Code-First" là code trước rồi cái gì sau?

### Q35. "SQLite (cơ sở dữ liệu file-based, zero-config)" — SQLite là gì?
"SQL" là gì? "Lite" là nhẹ — vậy nó là cơ sở dữ liệu bỏ trong một cái file thôi hả? Không cần cài đặt gì hết? Vậy dữ liệu nằm ở đâu?

### Q36. "Cloudinary CDN (lưu trữ & phân phối hình ảnh)" — Cloudinary là gì?
Sao không để ảnh trong máy chủ của mình luôn? Tại sao phải gửi ảnh lên một dịch vụ khác? "CDN" là gì?

### Q37. "Vietnam Provinces API (dữ liệu Tỉnh/Thành, Phường/Xã)" — Cái này lấy dữ liệu từ đâu?
Danh sách tỉnh thành Việt Nam — nó có sẵn trong máy không hay phải đi hỏi một chỗ nào đó trên mạng? Ai cung cấp cái API này?

---

## Phần 6: Đọc bảng "Công Nghệ Sử Dụng"

### Q38. Sao phải dùng nhiều công nghệ thế?
Tao đếm sơ sơ cũng thấy hơn chục thứ khác nhau. Làm một cái website sao phải cần nhiều thứ vậy? Có cái nào thay thế cái nào không?

### Q39. "Kiểm tra kiểu tĩnh" (TypeScript) nghĩa là sao?
"Tĩnh" là đứng yên — vậy kiểm tra kiểu mà đứng yên là sao? Khác gì với "kiểm tra kiểu động"?

### Q40. "ORM, trừu tượng hóa truy cập CSDL" — trừu tượng hóa là gì?
Tao nghe "trừu tượng" là mơ hồ, khó hiểu — vậy "trừu tượng hóa" làm cho dễ hiểu hơn hay khó hiểu hơn? Tại sao phải "trừu tượng" việc truy cập cơ sở dữ liệu?

### Q41. "Tích hợp upload & quản lý ảnh" với Cloudinary — upload ảnh ở đâu? Ai upload?
Khách hàng có được upload ảnh không? Hay chỉ có admin mới upload ảnh bánh lên?

---

## Phần 7: Đọc sơ đồ cấu trúc thư mục

### Q42. Sao có hai thư mục to là `backend/` và `frontend/`?
Hai thư mục này là hai project riêng hả? Có chạy riêng được không? Nếu chạy riêng thì có hoạt động không?

### Q43. Trong `backend/` có file `.cs` — `.cs` là gì?
Tao thấy nhiều file đuôi `.cs` (Product.cs, Order.cs, User.cs...) — đó là file gì? "cs" là viết tắt của cái gì? Mở ra có đọc được không?

### Q44. Trong `frontend/` có file `.tsx` — `.tsx` là gì?
Khác gì với `.ts` hay `.js`? Mấy file như `home.tsx`, `cart.tsx` — mỗi file là một trang trên website hả?

### Q45. "DTOs" là gì?
"Data Transfer Objects" — nghe như "đồ vật chuyển dữ liệu". Tại sao cần mấy "đồ vật" này? Dữ liệu không chuyển trực tiếp được à?

### Q46. "Minimal API Endpoint Groups" — Endpoint là gì?
Nghe như "điểm cuối" — điểm cuối của cái gì? Có phải mấy cái đường dẫn như `/api/products` không? Groups là nhóm lại à?

### Q47. "Infrastructure" là thư mục gì?
Dịch ra là "cơ sở hạ tầng" — trong project phần mềm thì cơ sở hạ tầng là gì? Khác gì với mấy thư mục khác?

### Q48. `appsettings.json` là file gì?
Đây có phải là chỗ để cài đặt (settings) cho app không? "json" là định dạng gì? Mở ra có đọc được không?

### Q49. `Program.cs` là gì?
Có phải đây là file quan trọng nhất, là chỗ bắt đầu chạy chương trình không?

### Q50. `.csproj` và `.sln` là file gì?
"csproj" là viết tắt của C# Project? ".sln" là Solution — vậy Solution với Project khác nhau chỗ nào?

### Q51. `package.json` trong frontend là file gì?
Nghe như "gói hàng" — nó liệt kê tất cả thư viện cần dùng cho frontend hả?

### Q52. `vite.config.ts` và `tailwind.config.cjs` — mấy file config này để làm gì?
Sao phải có file riêng để cấu hình cho Vite và Tailwind? Không có mấy file này thì có chạy được không?

### Q53. Thư mục `mocks/` — "mock data" là gì?
"Mock" là giả — vậy dữ liệu giả để làm gì? Khi nào dùng dữ liệu giả, khi nào dùng dữ liệu thật?

### Q54. `ApiResponse.cs` trong Common — đây là gì?
Mọi response từ API đều có chung một định dạng hả? Để làm gì?

---

## Phần 8: Đọc các module nghiệp vụ

### Q55. "Module" là gì?
Trong phần mềm, "module" là một khối chức năng riêng hả? Có phải mỗi module là một phần việc riêng không?

### Q56. Module Sản Phẩm: "CRUD sản phẩm" — CRUD là gì?
Tao thấy chữ này nhiều lần — là viết tắt của Create, Read, Update, Delete hả? Có phải là 4 thao tác cơ bản trên dữ liệu không?

### Q57. "Xóa mềm (soft delete)" là gì?
"Xóa" mà còn "mềm" là sao? Có phải là không xóa hẳn mà chỉ đánh dấu là đã xóa không? Tại sao phải làm vậy?

### Q58. Module Giỏ Hàng: "localStorage" là gì?
Nghe như "lưu trữ cục bộ" — lưu ở đâu? Trong máy của tao hả? Nếu tao đổi máy thì giỏ hàng có còn không?

### Q59. "Đồng bộ server khi đăng nhập" nghĩa là sao?
Khi chưa đăng nhập, giỏ hàng nằm trong máy tao. Khi đăng nhập, nó được gửi lên server — vậy nếu tao có đồ trong giỏ trước khi đăng nhập, đăng nhập xong nó vẫn còn chứ?

### Q60. "Dropdown Tỉnh/Thành → Phường/Xã" — sao phải chọn hai lần?
Tại sao không gõ thẳng địa chỉ luôn? Mà dữ liệu này lấy từ đâu ra? Có chính xác không?

### Q61. "Guest checkout" là gì?
"Checkout" là thanh toán — vậy khách không cần đăng ký tài khoản vẫn mua được hàng hả? Tiện vậy sao?

### Q62. "Luồng trạng thái đơn hàng: Chờ xác nhận → Xác nhận → Đang giao → Đã giao / Hủy" — đây là quy trình gì?
Mỗi bước ai làm? Khách hàng có thấy đơn hàng của mình đang ở bước nào không? "Tự động hoàn kho khi hủy đơn" — hoàn kho là gì?

### Q63. Module Xác Thực: "bcrypt hashing" — hashing là gì?
Tao nhập mật khẩu là "123456", nó lưu thành "123456" trong database luôn hả? Hay nó biến thành một chuỗi khác? "Bcrypt" là công thức biến đổi à? Tại sao phải làm vậy?

### Q64. "JWT Access Token với thời hạn 60 phút" — Token là gì?
Sau khi đăng nhập, tao được phát một cái "token" (thẻ) — cái thẻ này dùng để làm gì? Hết 60 phút thì sao? Phải đăng nhập lại à?

### Q65. "Header Authorization: Bearer ***" — cái này nghĩa là gì?
Mỗi lần gửi yêu cầu lên server, tao phải gửi kèm cái token trong "header" — header là cái gì? Giống như tiêu đề thư à? "Bearer" là gì?

### Q66. Module Quản Trị: "Dashboard tổng quan" — Dashboard là gì?
Có phải là một trang tổng hợp số liệu không? Giống như bảng điều khiển xe hơi, nhìn vô là thấy hết mọi thứ?

### Q67. Module Địa Chỉ: "Autocomplete địa chỉ" — autocomplete là gì?
Tao gõ "Hà" thì nó tự gợi ý "Hà Nội" hả? Cái này lấy dữ liệu từ đâu? Có cần mạng không?

---

## Phần 9: Đọc phần Cơ Sở Dữ Liệu

### Q68. Cơ sở dữ liệu là cái gì?
Tao nghe nói "database" là nơi chứa dữ liệu — vậy nó giống như cái tủ đựng hồ sơ không? Ai muốn lấy gì thì vào đó tìm?

### Q69. "Bảng" trong database là gì?
"Bảng Products", "Bảng Users" — có phải giống như bảng tính Excel không? Mỗi hàng là một sản phẩm, mỗi cột là một thuộc tính?

### Q70. "SQLite" — database này nằm ở đâu?
Tao đọc thấy nó là "file-based" — vậy cả database là một cái file duy nhất hả? File đó tên là gì? Nằm ở đâu? Có mở ra xem được không?

### Q71. Mối quan hệ N-1, 1-N, 1-1 trong database là gì?
Tao thấy ghi "Product ↔ Category (N-1)" — N-1 nghĩa là nhiều sản phẩm thuộc về một danh mục hả? Còn "User ↔ Cart (1-1)" là mỗi người dùng có đúng một giỏ hàng? Sao phải ghi mấy cái quan hệ này ra?

### Q72. "Tồn kho" (StockQuantity) là gì? Nó được cập nhật khi nào?
Khi khách đặt hàng, số lượng tồn kho có giảm xuống không? Nếu hết hàng thì có báo cho khách biết không? Admin có được thêm hàng vào kho không?

### Q73. "Soft Delete" — cột `IsDeleted` và `DeletedAt` để làm gì?
Thay vì xóa hẳn sản phẩm khỏi database, mình chỉ đánh dấu "đã xóa" kèm ngày giờ xóa? Vậy lỡ mai muốn khôi phục thì được hả?

### Q74. "Seed dữ liệu mẫu" — seed data là gì?
"Seed" là gieo hạt — vậy gieo dữ liệu vào database nghĩa là sao? Có phải là tạo sẵn vài sản phẩm, vài tài khoản để test không?

---

## Phần 10: Đọc phần Hướng Dẫn Cài Đặt

### Q75. Sao phải "cài đặt"? Vào website không được luôn à?
Tao tưởng website thì gõ địa chỉ vào trình duyệt là xong — sao còn phải cài Node.js, .NET SDK các kiểu? Cái này chưa có trên mạng hả?

### Q76. "Node.js >= 18.0.0" — Node.js là cái gì?
Nghe nói Node.js để chạy JavaScript trên máy tính — nhưng sao frontend lại cần cài Node.js? Không phải JavaScript chạy trên trình duyệt à?

### Q77. "npm >= 9.0.0" — npm là cái gì?
Có phải là "Node Package Manager" — thằng quản lý thư viện cho Node.js không? Nó giống như App Store nhưng cho code hả?

### Q78. ".NET SDK 8.0" — SDK là gì?
"Software Development Kit" — bộ đồ nghề để phát triển phần mềm? Tại sao cần "bộ đồ nghề" này? Nó cài vào đâu?

### Q79. "dotnet restore" — restore cái gì?
Có phải là tải thư viện về không? Giống `npm install` bên frontend hả?

### Q80. "dotnet ef database update" — lệnh này làm gì?
"ef" là Entity Framework? "database update" — nó tạo database từ code hả? Làm sao code biến thành database được?

### Q81. "Mặc định port 5000" và "port 5173" — port là gì?
Tao thấy backend chạy ở `localhost:5000`, frontend ở `localhost:5173` — "5000" và "5173" là số cổng hả? Cổng là gì? Sao lại cần số cổng?

### Q82. "localhost" là gì?
Có phải là "máy local" — nghĩa là chạy trên chính máy tính của mình không? Khác gì với website trên mạng?

### Q83. "Swagger UI" — cái này để làm gì?
Tao vào `localhost:5000/swagger` thì thấy gì? Có phải là danh sách tất cả API kèm nút "Try it out" không?

### Q84. Tài khoản mặc định `admin@tiembanh.com` / `Admin@123` — đây là tài khoản test hả?
Có phải đây là tài khoản có sẵn để mình vào thử không? Nếu deploy lên mạng thật thì có đổi mật khẩu không?

### Q85. "Nếu chưa có seed data, cần tạo tài khoản qua endpoint `/api/auth/register`" — endpoint là gì?
Tao vào đường dẫn `/api/auth/register` trên trình duyệt để tạo tài khoản hả? Hay phải dùng tool gì khác?

---

## Phần 11: Đọc phần Tài Liệu API

### Q86. API là cái gì?
Tao thấy chữ "API" khắp nơi — "Application Programming Interface" — dịch ra là "giao diện lập trình ứng dụng". Nhưng nó thực sự là cái gì? Có phải là cách để frontend nói chuyện với backend không?

### Q87. "GET/POST /api/products" — GET và POST là gì?
Tao thấy có GET, POST, PUT — đây là "động từ" của API hả? GET là lấy dữ liệu, POST là gửi dữ liệu mới, PUT là sửa? Sao không dùng tiếng Việt luôn?

### Q88. REST API là gì?
"REST" là viết tắt của cái gì? Có phải là một kiểu thiết kế API không? Nó phổ biến không?

### Q89. "Endpoint yêu cầu role Admin" nghĩa là sao?
Có những API chỉ admin mới gọi được — nếu khách hàng thường gọi vào thì sao? Bị chặn lại và báo lỗi hả?

---

## Phần 12: Đọc phần Ghi Chú Kỹ Thuật

### Q90. "Server Components readiness, Actions" — React 19 có gì mới?
Tao không biết React 18 ra sao — nhưng React 19 có gì mà tác giả muốn tận dụng? "Server Components" với "Actions" là tính năng gì?

### Q91. "Minimal APIs giảm boilerplate" — boilerplate là gì?
Nghe như "tấm kim loại" — trong code, boilerplate là code lặp đi lặp lại nhàm chán hả? Minimal APIs giúp code ít hơn à?

### Q92. "SQLite phù hợp cho môi trường demo" — vậy nếu làm thật thì dùng database gì?
Tao nghe nói có PostgreSQL, MySQL, SQL Server — mấy cái đó khác SQLite chỗ nào? Khi nào cần nâng cấp?

### Q93. "Cloudinary CDN toàn cầu" — CDN là gì?
"Content Delivery Network" — mạng phân phối nội dung? Có phải là ảnh được lưu ở nhiều máy chủ khắp thế giới để ai ở đâu cũng tải nhanh không?

### Q94. "Soft Delete đảm bảo toàn vẹn dữ liệu đơn hàng lịch sử" — tại sao?
Nếu xóa hẳn sản phẩm, mấy đơn hàng cũ có sản phẩm đó sẽ bị lỗi hả? Vậy soft delete giúp giữ lại lịch sử mua hàng?

### Q95. "Guest Cart" hoạt động thế nào khi vừa có localStorage vừa có server?
Nếu tao thêm đồ vào giỏ khi chưa đăng nhập (lưu localStorage), rồi đăng nhập (đồng bộ lên server) — vậy localStorage có bị xóa không? Cơ chế đồng bộ hoạt động ra sao?

### Q96. "Auto Stock Recovery" — hoàn kho tự động là sao?
Admin bấm "Hủy đơn" — hệ thống tự cộng lại số lượng sản phẩm vào kho? Có cần admin làm gì thêm không? Lỡ đơn đã giao rồi mà hủy thì sao?

### Q97. "Chưa tích hợp cổng thanh toán" — vậy thanh toán kiểu gì?
Khách đặt hàng xong thì trả tiền làm sao? Tiền mặt khi giao hàng (COD) hả? Hay chỉ ghi nhận đơn rồi thôi, không có thanh toán thật?

### Q98. "Chưa áp dụng Redis hoặc Output Caching" — Redis là gì? Caching là gì?
"Cache" là bộ nhớ tạm — vậy caching API là lưu tạm kết quả để lần sau không phải tính lại hả? Redis là gì mà liên quan?

### Q99. "Chưa có WebSocket/Socket.IO" — WebSocket là gì?
Có phải là công nghệ để server chủ động gửi tin nhắn cho client không? (Thay vì client phải hỏi liên tục?) Nếu có WebSocket thì làm được gì hay?

### Q100. "Pagination" và "Infinite scroll" — khác nhau thế nào?
"Pagination" là chia trang (trang 1, 2, 3...) còn "infinite scroll" là lướt xuống hoài nó tự tải thêm? Cái nào tốt hơn cho website bán bánh?

### Q101. "Vitest + Testing Library" — testing là gì?
Tao nghe nói "test" là kiểm thử — vậy kiểm thử code là sao? Máy tự kiểm tra code hay người ngồi bấm thử? Chưa có test thì có sao không?

---

## Phần 13: Những câu hỏi tổng hợp cuối cùng

### Q102. Toàn bộ dự án này — ai làm ra?
Một sinh viên làm một mình hay cả nhóm? Làm trong bao lâu? Đây là đồ án tốt nghiệp hay đồ án môn học thông thường?

### Q103. Dự án đã hoàn thành chưa?
Tao thấy có mục "Hạn chế & Hướng phát triển" — vậy là chưa xong hết hả? Còn thiếu những gì? Khi nào thì coi là "xong"?

### Q104. Có tiệm bánh thật nào đang dùng cái này không?
Hay đây chỉ là project để nộp bài? Nếu có tiệm bánh thật muốn dùng thì cần làm thêm gì?

### Q105. Mất bao lâu để một người mù công nghệ như tao hiểu hết những thứ trong file README này?
Tao cần học những gì trước? Bắt đầu từ đâu?

### Q106. Làm sao để biết dự án này có "tốt" hay không?
Có tiêu chí gì để đánh giá một đồ án sinh viên? Chạy được là tốt hay còn cần gì nữa?

### Q107. Nếu tao muốn tự chạy thử dự án này trên máy tao, tao cần làm gì?
Tao mù công nghệ — có hướng dẫn từng bước một không? Cần cài gì? Bấm gì? Mất bao lâu?

### Q108. Có bao nhiêu "trang" trên website này?
Liệt kê tất cả các trang mà khách hàng và admin có thể thấy — mỗi trang làm gì?

### Q109. Dữ liệu sản phẩm (bánh kẹo) từ đâu ra?
Tự bịa ra hay lấy từ tiệm bánh thật? Có bao nhiêu sản phẩm? Ảnh bánh ở đâu?

### Q110. Nếu website bị lỗi thì sao?
Ai sửa? Làm sao biết bị lỗi? Có cách nào để người dùng báo lỗi không?

---

> **Tổng kết:** File này chứa **110 câu hỏi** được đặt ra từ góc nhìn của một người hoàn toàn mù công nghệ khi đọc README.md của dự án "Tiệm Bánh Bé Yêu". Mỗi câu hỏi nhắm vào một khái niệm, thuật ngữ, hoặc chi tiết mà một người không có kiến thức nền tảng về lập trình sẽ thắc mắc. Nếu trả lời hết được những câu hỏi này, người đó sẽ có một bức tranh khá toàn diện về dự án — từ "đây là cái gì", "nó hoạt động ra sao", cho đến "làm thế nào để chạy nó" và "nó còn thiếu những gì".
