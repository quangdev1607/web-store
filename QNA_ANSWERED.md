# 📖 QNA

> Mục tiêu: Ngắn, thẳng vào trọng tâm, không lan man. Nếu không hiểu chỗ nào, đọc lại câu ví dụ.

---

## Phần 1: Dự án này là cái gì?

**Q1. "Tiệm Bánh Bé Yêu" là cái gì?**
Không phải tiệm bánh thật ngoài đời. Đây là **một phần mềm (website) mô phỏng** tiệm bánh để người ta có thể xem bánh trên mạng, cho vào giỏ, rồi đặt mua — giống Shopee/Lazada nhưng quy mô nhỏ và đơn giản hơn.

**Q2. "Đồ án xây dựng ứng dụng Web thương mại điện tử" nghĩa là gì?**

- **Đồ án** = bài tập lớn.
- **Ứng dụng Web** = một trang web có tính năng (không chỉ xem).
- **Thương mại điện tử (e-commerce)** = mua bán trên mạng.
  Kết hợp lại: là bài tập lớn làm một trang web để bán hàng online.

**Q3. Đây là bài tập trên lớp hả?**
Đúng. Sinh viên làm để nộp cho thầy cô. Nếu có tiệm bánh thật muốn dùng thì cần sửa thêm một số chỗ (như tích hợp thanh toán thật).

**Q4. Dự án dành cho ai dùng?**

- **Khách hàng**: xem bánh, cho vào giỏ, đặt hàng.
- **Quản trị viên (Admin)**: thêm/sửa bánh, xem đơn hàng, quản lý người dùng.

---

## Phần 2: Tiêu đề và mô tả

**Q5. "Hệ thống thương mại điện tử chuyên biệt" là sao?**
"Chuyên biệt" = không bán đầy đủ thứ như Shopee, mà chỉ bán mỗi bánh kẹo cho trẻ. Giống như thay vì siêu thị lớn, đây là một tiệm nhỏ chuyên bánh.

**Q6. Tại sao ghi rõ "bánh kẹo hữu cơ an toàn cho trẻ em"?**
Chủ yếu là để định hướng giao diện (màu sắc dễ thương, ảnh dễ thương). Về mặt kỹ thuật thì không khác gắng hàng điện tử bình thường.

**Q7. "Kiến trúc Client–Server" là cái gì?**

- **Client** = trang web hiển thị trên máy tính/điện thoại của bạn.
- **Server** = máy tính khác nông công việc “lên lệnh” (lưu dữ liệu, tính toán).
  Tách ra vì: mọi người dùng điện thoại khác nhau (client khác nhau) nhưng dữ liệu chung phải nằm ở một chỗ (server).

**Q8. Frontend và Backend là gì?**

- **Frontend** = những gì bạn nhìn thấy và chạm vào (nút bấm, ảnh bánh, màu sắc).
- **Backend** = bộ não ở sau: kiểm tra mật khẩu, tính tổng tiền, lưu đơn hàng...
  Ví dụ: bạn bấm “Đặt hàng” (frontend) → backend kiểm tra có đủ hàng không, trừ kho, lưu đơn.

**Q9. "Khả năng mở rộng và bảo trì" nghĩa là sao?**

- **Mở rộng**: sau này muốn thêm tính năng (ví dụ: thanh toán Momo) thì dễ sửa hơn.
- **Bảo trì**: sửa lỗi chỗ nào thì không làm hỏng chỗ khác.
  Tách ra 2 tầng giống như tách nhà bếp với nhà khách: sửa bếp không làm bẩn phòng khách.

**Q10. "Nền tảng bán hàng trực tuyến" — có mua bánh thật không?**
Hiện tại chưa. Đây là bài tập. Nhưng nếu cắm vào mạng thật và có tiệm bánh đứng sau thì có.

**Q11. Luồng nghiệp vụ là gì?**

- **Duyệt sản phẩm** = lướt xem bánh.
- **Giỏ hàng** = như cái giỏ đựng tạm những món chọn mua.
- **Đặt hàng** = điền thông tin, xác nhận mua (chưa trả tiền thật, chỉ ghi nhận đơn).
- **Quản lý đơn hàng** = chủ tiệm/admin xem ai đặt gì, đã giao chưa.

**Q12. "Phân quyền người dùng" là gì?**
Không phải ai cũng được vào kho để sửa giá bánh. Khách hàng chỉ mua, Admin mới được sửa. Phân quyền = phân công việc ai được làm gì.

**Q13. "Responsive" là gì?**
Website tự động co giãn cho vừa màn hình: mở trên máy tính thì rộng, mở trên điện thoại thì thu nhỏ lại cho dễ nhìn. Không phải “phản hồi nhanh” đâu.

---

## Phần 3: Sơ đồ kiến trúc

**Q14. Sơ đồ vuông vuông kia là gì?**
Là bản đồ cấu trúc hệ thống. Giống như sơ đồ tổ chức công ty: ai làm gì, liên lạc với ai. Không phải mạch điện.

**Q15. CLIENT LAYER nằm ở đâu?**
Nằm trong trình duyệt (Chrome, Safari) của máy bạn.

**Q16. SERVER LAYER nằm ở đâu?**
Có thể là máy tính khác hoặc chính máy bạn (khi chạy thử). Khi lên mạng thật thì là máy chủ ở trung tâm dữ liệu.

**Q17. HTTPS / REST / JSON là gì?**

- **HTTPS** = đường truyền an toàn (giống đường cao tốc có bảo vệ).
- **REST** = quy tắc để 2 bên nói chuyện (giống ngôn ngữ lịch sự).
- **JSON** = dạng tin nhắn mà 2 bên gửi cho nhau (dạng chữ, dễ đọc).

---

## Phần 4: CLIENT LAYER — Frontend

**Q18. React + TypeScript + Vite + Tailwind là một món hay nhiều món?**
Nhiều món ghép lại:

- **React**: vẽ giao diện.
- **TypeScript**: kiểm tra lỗi chính tả trong code.
- **Vite**: biên dịch code cho trình duyệt hiểu.
- **Tailwind**: giúp viết màu sắc, cạnh viền nhanh hơn.

**Q19. React là gì?**
Thư viện = bộ công cụ. React giúp chia website thành nhiều miếng nhỏ (component), mỗi miếng tự quản lý phần của mình. Ví dụ: nút “Thêm vào giỏ” là một component.

**Q20. TypeScript là gì?**
Là JavaScript cộng thêm “ghim nhãn kiểu dữ liệu”. Nếu bạn nói “đây là số” rồi sau đó gán chữ vào, TypeScript báo lỗi ngay. Giống như kiểm tra chính tả trước khi gửi mail.

**Q21. Vite là gì?**
Công cụ gộp code lại (build) để trình duyệt chạy nhanh. Dev server = máy phục vụ chạy tại chỗ trên máy bạn để xem thay đổi ngay lập tức khi sửa code.

**Q22. Tailwind CSS là gì?**
Bộ class có sẵn. Thay vì viết CSS dài dòng “chiều cao 50px, màu xanh...”, bạn chỉ viết `class="h-50 bg-blue"`. Nhanh và đồng nhất.

**Q23. Routing là gì?**
Điều hướng đến các trang khác nhau: `/san-pham`, `/gio-hang`, `/admin`. Đúng, bấm link chuyển trang đó là routing.

**Q24. State là gì? Auth là gì?**

- **State** = trạng thái hiện tại. Ví dụ: đã đăng nhập chưa? Giỏ có mấy món?
- **Auth** = Authentication (xác thực) = đăng nhập/đăng ký.
- **Global state** = trạng thái dùng chung khắp ứng dụng. **Local state** = chỉ trong một component.

**Q25. Cart state là gì?**
Là thông tin giỏ hàng lúc này: đang rỗng? có 2 hộp bánh? tổng tiền bao nhiêu?

**Q26. Axios là gì? HTTP client là gì?**
Axios là đứa chuyên gửi/nhận tin nhắn giựa frontend và backend qua đường HTTP. Đúng, nó là đứa đưa thư.

**Q27. UI components và Lucide là gì?**

- **UI components** = miếng ghập Lego: nút, hộp thoại, thanh chọn...
- **Lucide React** = bộ icon (biểu tượng giỏ hàng, người dùng...).

---

## Phần 5: SERVER LAYER — Backend

**Q28. ASP.NET Core 8 — Minimal APIs là gì?**

- **ASP.NET Core** = nền tảng làm web của Microsoft.
- **Minimal APIs** = viết API ngắn gọn, không rườm rà như kiểu cũ.

**Q29. JWT Bearer Authentication là gì?**
Sau khi đăng nhập, server phát cho bạn một tờ giấy (JWT Token). Mỗi lần bạn xin vào chỗ cấm, bạn đưa tờ giấy ra. “Bearer” nghĩa là “người mang theo token”.

**Q30. Authentication vs Authorization khác nhau?**

- **Authentication** = kiểm tra bạn là ai (đăng nhập).
- **Authorization** = kiểm tra bạn được làm gì (có vào admin được không).

**Q31. Swagger là gì?**
Một trang web tự động liệt kê các API (dạng bảng có nút “Try it out”). Giúp lập trình viên test API nhanh, không cần viết code.

**Q32. CORS là gì?**
Vì bảo mật, trình duyệt mặc định cấm website A gọi server B. CORS là danh sách “cho phép”. Ví dụ: frontend ở `localhost:5173` được quyền nói chuyện với backend ở `localhost:5000`.

**Q33. ORM là gì?**
Object-Relational Mapping = cầu nối giữa code và database. Thay vì viết SQL rắc rối, bạn viết code C# bình thường và ORM tự dịch thành SQL.

**Q34. Code-First Migrations là gì?**
Bạn viết code trước → lệnh `database update` tự tạo/sửa bảng trong database cho khớp. Không cần vào database tay.

**Q35. SQLite là gì?**
Database nhẹ, nằm trong một file duy nhất (`tiembanh.db`). Không cần cài thêm phần mềm database. Mở bằng đôi mắt thường không đọc được nhưng có tool để xem.

**Q36. Cloudinary là gì?**
Dịch vụ lưu ảnh trên mây. Thay vì để ảnh trong ổ cứng server (chậm, tốn dung lượng), đẩy lên Cloudinary để nó phân phối nhanh khắp nơi.

**Q37. Vietnam Provinces API lấy dữ liệu từ đâu?**
Ở đây là file JSON cứng (có sẵn trong thư mục `Data/`). Không cần mạng. Admin không phải tự nhập 63 tỉnh.

---

## Phần 6: Bảng Công Nghệ

**Q38. Sao phải dùng nhiều công nghệ thế?**
Mỗi công nghệ làm một việc riêng. Giống như làm bánh: cần lò nướng, cân, máy đánh trứng — không thể dùng một thứ làm hết.

**Q39. "Kiểm tra kiểu tĩnh" là gì?**
“Tĩnh” = trước khi chạy. TypeScript kiểm tra lỗi ngay khi gõ code. “Động” = kiểm tra khi đang chạy (JavaScript thuần), dễ gây lỗi bất ngờ.

**Q40. "Trừu tượng hóa" là gì?**
Che bớt chi tiết phức tạp đi, chỉ để lại giao diện đơn giản. Ví dụ: ORM giấu SQL phức tạp, bạn chỉ thấy `db.Products.ToList()`.

**Q41. Ai upload ảnh?**
Chỉ Admin upload ảnh bánh lên Cloudinary. Khách hàng chỉ xem.

---

## Phần 7: Cấu trúc thư mục

**Q42. Sao có hai thư mục `backend/` và `frontend/`?**
Hai dự án con, chạy độc lập. Backend không cần frontend vẫn chạy được (test API bằng Swagger). Frontend không có backend thì giống xe không có xăng: nhìn được nhưng không hoạt động.

**Q43. File `.cs` là gì?**
File code C# (C Sharp). Mở bằng Notepad vẫn đọc được chữ, nhưng cần phần mềm lập trình để hiểu câu trúc.

**Q44. File `.tsx` là gì?**
TypeScript + JSX (cúc phập viết HTML trong code React). Mỗi file thường là một trang hoặc một component.

**Q45. DTO là gì?**
Data Transfer Object = gói quà đựng dữ liệu gửi đi. Ví dụ: khi trả về sản phẩm, không gửi hết thông tin nhạy cảm (như mật khẩu), chỉ gửi những gì cần thiết.

**Q46. Endpoint là gì?**
Đúng, là đường dẫn như `/api/products`. Mỗi endpoint là một “cửa hậu” để frontend gọi vào xin dữ liệu. Groups = nhóm các cửa cùng chủ đề lại.

**Q47. Infrastructure là gì?**
Chứa mấy thứ “hậu trường”: kết nối database, lưu file, gửi mail. Không phải nghiệp vụ chính nhưng không có thì chết.

**Q48. `appsettings.json` là gì?**
File cấu hình: chỗ nào lưu database, secret key, tên cloud... Mở bằng Notepad đọc được.

**Q49. `Program.cs` là gì?**
Đúng, là điểm bắt đầu chạy. Nơi cấu hình tất cả dịch vụ và khởi động server.

**Q50. `.csproj` và `.sln` khác nhau?**

- `.csproj` = thông tin một project (dự án con).
- `.sln` (Solution) = hộp đựng nhiều project. Ở đây chỉ có 1 project nên solution hơi thừa.

**Q51. `package.json` là gì?**
Danh sách thư viện cần tải. Giống menu đặt món: ghi rõ cần gì, npm sẽ đi mua về.

**Q52. `vite.config.ts` và `tailwind.config.cjs` để làm gì?**
File cấu hình riêng cho Vite và Tailwind. Không có thì cứng nhắc cũng chạy được nhưng không đúng ý muốn.

**Q53. Mock data là gì?**
Dữ liệu giả để test. Ví dụ: tạo 5 cái bánh để xem giao diện đẹp chưa, không cần chờ backend xong.

**Q54. `ApiResponse.cs` để làm gì?**
Mọi câu trả lời từ server đều có chung mẫu: `success: true/false`, `data: ...`, `error: ...`. Giống như phong bì thư chuẩn.

---

## Phần 8: Module nghiệp vụ

**Q55. Module là gì?**
Đúng, là một khối chức năng riêng: module sản phẩm, module đơn hàng, module xác thực. Tách ra để dễ quản lý.

**Q56. CRUD là gì?**
Đúng, viết tắt: **C**reate (Thêm), **R**ead (Đọc), **U**pdate (Sửa), **D**elete (Xóa). 4 thao tác cơ bản trên mọi dữ liệu.

**Q57. Xóa mềm (soft delete) là gì?**
Thay vì xóa hẳn (hard delete), chỉ gắn nhãn “đã xóa”. Lợi ích: không làm mất lịch sử đơn hàng cũ, có thể khôi phục.

**Q58. localStorage là gì?**
Chỗ lưu trữ trong trình duyệt của bạn. Đổi máy tính thì mất, xóa cookie/cache thì mất.

**Q59. Đồng bộ giỏ hàng khi đăng nhập là sao?**
Bạn có 2 món trong giỏ (localStorage). Đăng nhập xong, hệ thống gửi 2 món lên server gộp vào giỏ cũ (nếu có). localStorage thường được xóa sau đó để tránh trùng.

**Q60. Sao phải chọn Tỉnh rồi Phường?**
Để giảm sai sốt. Gõ tay dễ sai chính tả, dẫn đến giao hàng nhầm. Dữ liệu chính xác vì lấy từ file chuẩn.

**Q61. Guest checkout là gì?**
Đúng, không cần đăng ký vẫn mua được. Nhiều người ngại đăng ký nên cho mua luôn để tăng doanh thu.

**Q62. Luồng trạng thái đơn hàng?**
Một dây chuyền xử lý đơn:

1. Khách đặt → **Chờ xác nhận**
2. Admin bấm xác nhận → **Đang giao**
3. Giao xong → **Đã giao**
   Hoặc admin bấm **Hủy** → hoàn kho (cộng lại số lượng bánh vào kho).

**Q63. bcrypt hashing là gì?**
Bạn nhập `123456` → hệ thống biến thành chuỗi như `aB$9xK...` rồi lưu. Lần sau nhập lại, biến y chang rồi so sánh. Nếu hacker lấy được database cũng không biết mật khẩu thật.

**Q64. JWT Access Token 60 phút là gì?**
Tờ giấy thông hành. Hết 60 phút thì vô hiệu, phải đăng nhập lại. Mục đích: nếu ai đó lấy được token thì cũng chỉ dùng được trong 1 giờ.

**Q65. Header `Authorization: Bearer` là gì?**
Header = phần đầu thư điện tử gửi đi. Bearer = “Tôi mang theo token đây”. Server nhìn vào là biết bạn là ai.

**Q66. Dashboard là gì?**
Đúng, bảng điều khiển. Admin vào là thấy: hôm nay có bao nhiêu đơn, doanh thu bao nhiêu, hết hàng món gì...

**Q67. Autocomplete địa chỉ là gì?**
Đúng, gõ “Hà” thì hiện “Hà Nội, Hà Tĩnh...”. Dữ liệu lấy từ server (file JSON đã seed). Cần mạng chỉ khi lấy từ API ngoài; ở đây không cần vì lưu sẵn.

---

## Phần 9: Cơ sở dữ liệu

**Q68. Database là gì?**
Đúng, giống tủ hồ sơ điện tử. Lưu mọi thông tin: bánh có gì, giá bao nhiêu, ai đặt hàng...

**Q69. Bảng trong database là gì?**
Đúng, như bảng tính Excel: mỗi hàng là một bánh, mỗi cột là một thuộc tính (tên, giá, tồn kho).

**Q70. SQLite nằm ở đâu?**
File `tiembanh.db` trong thư mục `backend/`. Có thể mở bằng tool DB Browser for SQLite.

**Q71. N-1, 1-N, 1-1 là gì?**

- **N-1**: nhiều sản phẩm thuộc 1 danh mục.
- **1-N**: 1 người có nhiều đơn hàng.
- **1-1**: 1 người có 1 giỏ hàng.
  Ghi ra để code không bị lộn xộn.

**Q72. Tồn kho được cập nhật khi nào?**
Khi khách đặt hàng → trừ kho. Hết hàng thì hiện “Hết hàng”, không cho thêm vào giỏ. Admin có thể nhập thêm.

**Q73. Soft Delete với `IsDeleted` và `DeletedAt`?**
Đúng, gắn nhãn “đã xóa” + ghi ngày giờ. Có thể khôi phục bất cứ lúc nào.

**Q74. Seed data là gì?**
Đúng, gieo sẵn dữ liệu mẫu: 5-6 cái bánh, 2 tài khoản test, vài tỉnh thành. Khỏi phải nhập tay từ đầu.

---

## Phần 10: Hướng dẫn cài đặt

**Q75. Sao phải "cài đặt"? Vào website không được luôn à?**
Vì đây là code chưa chạy trên mạng. Bạn phải tự biên dịch và chạy trên máy mình. Giống như mua nguyên liệu về nấu ăn thay vì vào quăn sẵn.

**Q76. Node.js là gì?**
Máy ảo chạy JavaScript. Trình duyệt cũng chạy JS nhưng chỉ ở giao diện. Node.js giúp chạy JS ở hậu trường (ví dụ: gộp file, tải thư viện).

**Q77. npm là gì?**
Node Package Manager = App Store cho code. Nó tải các thư viện mà dự án cần về máy.

**Q78. .NET SDK là gì?**
Bộ đồ nghề làm phần mềm .NET. Cài vào máy để biên dịch và chạy code C#.

**Q79. `dotnet restore` làm gì?**
Tải thư viện NuGet (bên .NET) về máy. Đúng, tương đương `npm install` bên frontend.

**Q80. `dotnet ef database update` làm gì?**
Nhìn vào code các class (Product, User...) rồi tự tạo bảng tương ứng trong file SQLite. Code → cấu trúc database.

**Q81. Port 5000 và 5173 là gì?**
Cổng giao tiếp. Máy tính có nhiều cổng để phân biệt chương trình: backend nghe ở cổng 5000, frontend ở 5173. Như cửa số khác nhau trong nhà.

**Q82. localhost là gì?**
Chính máy bạn. `localhost:5000` = “máy mình, cổng 5000”. Khác website thật ở chỗ chỉ bạn thấy, người ngoài không vào được.

**Q83. Swagger UI là gì?**
Trang liệt kê API có nút “Try it out”. Giúp test nhanh không cần frontend.

**Q84. Tài khoản mặc định?**
Đúng, tài khoản test có sẵn. Nếu lên mạng thật thì phải đổi mật khẩu ngay.

**Q85. `/api/auth/register` là gì?**
Không vào trình duyệt được dễ dàng (là API không phải trang web). Cần dùng Postman/Thunder Client hoặc form đăng ký trên frontend.

---

## Phần 11: Tài liệu API

**Q86. API là gì?**
Đúng, là cách frontend nói chuyện với backend. Ví dụ: “Cho tôi danh sách bánh”, “Lưu đơn hàng này”.

**Q87. GET, POST, PUT là gì?**

- **GET** = lấy dữ liệu (xem bánh).
- **POST** = tạo mới (đặt hàng).
- **PUT** = sửa (đổi địa chỉ).
  Là tiếng Anh chuẩn quốc tế, không có tiếng Việt thay thế.

**Q88. REST API là gì?**
Representational State Transfer = quy ước thiết kế API dựa trên các động từ (GET/POST...) và đường dẫn rõ ràng. Phổ biến nhất hiện nay.

**Q89. Endpoint yêu cầu Admin?**
Nếu khách thường gọi vào API xóa sản phẩm, server từ chối và báo lỗi 403 (Forbidden). Giống như khách hàng muốn vào kho hàng bị bảo vệ chặn lại.

---

## Phần 12: Ghi chú kỹ thuật

**Q90. React 19 có gì mới?**
React 19 cải tiến về Server Components (chạy ở server rồi gửi HTML về, nhanh hơn) và Actions (xử lý form dễ hơn). Ở đây chủ yếu dùng Client Components thôi.

**Q91. Boilerplate là gì?**
Code lặp đi lặp lại, nhàm chán, bắt buộc phải có nhưng không mang giá trị nghiệp vụ. Minimal APIs giảm bớt.

**Q92. SQLite vs PostgreSQL/MySQL/SQL Server?**

- SQLite: 1 file, nhẹ, chạy trên máy cá nhân.
- PostgreSQL/MySQL: chạy riêng một chương trình, mạnh, cho nhiều người truy cập.
  Khi nào lên mạng thật với nhiều khách thì nâng cấp.

**Q93. CDN là gì?**
Content Delivery Network = mạng máy chủ đặt khắp thế giới. Ảnh được sao chép đến máy gần người xem nhất, tải nhanh hơn.

**Q94. Soft Delete và toàn vẹn dữ liệu?**
Nếu xóa hẳn sản phẩm “Bánh quế”, các đơn hàng cũ có món đó sẽ bị lỗi không hiển thị. Soft delete giữ lại để lịch sử đơn hàng vẫn đọc được.

**Q95. Guest Cart hoạt động thế nào?**

- Chưa đăng nhập: lưu trong trình duyệt (localStorage).
- Đăng nhập: gửi lên server gộp với giỏ cũ, rồi xóa localStorage.

**Q96. Auto Stock Recovery?**
Admin bấm Hủy đơn → hệ thống tự cộng lại số lượng bánh vào kho. Không cần admin làm thêm. Nếu đơn đã giao thì không thể hủy nữa.

**Q97. Thanh toán kiểu gì?**
Hiện tại chỉ ghi nhận đơn (COD - tiền mặt khi nhận hàng). Chưa cắm ví điện tử.

**Q98. Redis và Caching là gì?**

- **Cache** = lưu tạm kết quả. Ví dụ: lần 1 hỏi “danh sách bánh” mất 0.5 giây, lưu vào cache; lần 2 chỉ mất 0.05 giây.
- **Redis** = kho lưu tạm siêu nhanh ở ngoài database chính.

**Q99. WebSocket là gì?**
Cổng nói chuyện hai chiều. Thay vì bạn phải tự refresh để xem đơn hàng đã giao chưa, server tự đẩy thông báo đến bạn ngay lập tức.

**Q100. Pagination vs Infinite scroll?**

- Pagination: nút chuyển trang 1, 2, 3...
- Infinite scroll: lướt xuống đâu tự tải thêm đến đó.
  Trang bánh nên dùng pagination cho dễ đến đúng trang cần tìm.

**Q101. Testing là gì?**
Viết thêm code để máy tự kiểm tra code chính. Ví dụ: “Nếu thêm bánh vào giỏ, tổng tiền phải = giá x số lượng”. Không có test thì dễ có lỗi lâu không phát hiện.

---

## Phần 13: Tổng hợp cuối

**Q102. Ai làm ra dự án này?**
Theo README thì là sinh viên làm đồ án môn học. Có thể làm 1 mình hoặc nhóm nhỏ.

**Q103. Dự án đã hoàn thành chưa?**
Chưa 100%. Còn thiếu: thanh toán thật, cache, real-time, test đầy đủ. Nhưng luồng chính (mua bánh + quản lý) đã chạy được.

**Q104. Có tiệm bánh thật dùng không?**
Chưa. Là bài tập. Nếu tiệm thật muốn dùng thì cần: mua tên miền, thuê server, tích hợp thanh toán, bảo mật thêm.

**Q105. Mất bao lâu để một người mù công nghệ hiểu hết?**
Nếu đọc hết file này: khoảng 1-2 giờ để nắm được bức tranh lớn. Học lập trình thực sự thì tháng đầu tiên.

**Q106. Làm sao biết dự án có “tốt” không?**
Tiêu chí sinh viên thường gồm:

1. Chạy được không lỗi.
2. Đầy đủ luồng nghiệp vụ cơ bản.
3. Code sạch, có chia tầng rõ ràng.
4. Có tài liệu (README, Swagger).
5. Có xử lý lỗi và bảo mật cơ bản.

**Q107. Muốn chạy thử trên máy thì làm gì?**
Bước 1: Cài Node.js và .NET SDK 8.
Bước 2: Vào thư mục `backend`, chạy `dotnet run`.
Bước 3: Vào thư mục `frontend`, chạy `npm install` rồi `npm run dev`.
Bước 4: Mở trình duyệt vào `http://localhost:5173`.
Mất khoảng 10-15 phút nếu mạnh.

**Q108. Có bao nhiêu trang?**

- Khách: Trang chủ, Danh sách bánh, Chi tiết bánh, Giỏ hàng, Thanh toán, Đăng nhập/Đăng ký, Hồ sơ, Lịch sử đơn hàng.
- Admin: Trang tổng quan (dashboard).

**Q109. Dữ liệu sản phẩm từ đâu?**
Tự tạo (seed data). Có khoảng 5-6 sản phẩm. Ảnh bánh để trong thư mục `frontend/public/img/`.

**Q110. Nếu website bị lỗi thì sao?**

- Developer (sinh viên) sửa.
- Biết lỗi qua: log lỗi trên server, người dùng phản hồi.
- Chưa có hệ thống tự động báo lỗi (Sentry...) vì là bài tập.

---

> **Kết luận cho Alan:** Cả dự án chỉ là một tiệm bánh online được xây bằng 2 phần: phần nhìn (React) và phần não (.NET). Khách vào xem bánh → cho vào giỏ → đặt hàng. Admin ngồi sau xem đơn và giao hàng. Mọi thứ khác chỉ là công cụ để làm được 3 việc đó. Đừng sợ mấy cái tên kỳ cục — chúng chỉ là tên gọi của đồ nghề thôi.
