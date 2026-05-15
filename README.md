# Tiệm Bánh Bé Yêu — Tổng Quan Dự Án

> **Đồ án xây dựng ứng dụng Web thương mại điện tử**  
> **Môn học:** Lập trình Web / Công nghệ phần mềm (thay thế tên môn học thực tế nếu cần)  
> **Sinh viên thực hiện:** [Họ tên sinh viên]  
> **Giảng viên hướng dẫn:** [Họ tên giảng viên]

---

## 1. Tổng Quan

**Tiệm Bánh Bé Yêu** là hệ thống thương mại điện tử chuyên biệt dành cho cửa hàng bánh kẹo hữu cơ an toàn cho trẻ em. Hệ thống được xây dựng theo kiến trúc **Client–Server** với tách biệt rõ ràng giữa tầng giao diện (Frontend) và tầng xử lý nghiệp vụ (Backend), đảm bảo khả năng mở rộng và bảo trì.

### Mục tiêu chính
- Cung cấp nền tảng bán hàng trực tuyến với đầy đủ luồng nghiệp vụ: duyệt sản phẩm → giỏ hàng → đặt hàng → quản lý đơn hàng.
- Hỗ trợ phân quyền ngưởi dùng: **Khách hàng** (mua sắm) và **Quản trị viên** (quản lý toàn bộ hệ thống).
- Đảm bảo tính responsive, tương thích đa thiết bị (mobile, tablet, desktop).

---

## 2. Kiến Trúc Hệ Thống

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                         │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  React 19 + TypeScript + Vite + Tailwind CSS          │  │
│  │  • React Router DOM 7 (routing)                        │  │
│  │  • Zustand 5 (global state: auth)                      │  │
│  │  • React Context API (cart state)                      │  │
│  │  • Axios (HTTP client)                                 │  │
│  │  • Radix UI + Lucide React (UI components & icons)    │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────┬───────────────────────────────────┘
                          │ HTTPS / REST / JSON
┌─────────────────────────▼───────────────────────────────────┐
│                        SERVER LAYER                          │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  ASP.NET Core 8 — Minimal APIs                         │  │
│  │  • JWT Bearer Authentication                           │  │
│  │  • Role-based Authorization (User / Admin)             │  │
│  │  • Swagger / OpenAPI (tài liệu API tự động)           │  │
│  │  • CORS (cho phép giao tiếp cross-origin)             │  │
│  └───────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Entity Framework Core 8 (ORM)                         │  │
│  │  • Code-First Migrations                               │  │
│  │  • SQLite (cơ sở dữ liệu file-based, zero-config)     │  │
│  └───────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  External Services                                     │  │
│  │  • Cloudinary CDN (lưu trữ & phân phối hình ảnh)     │  │
│  │  • Vietnam Provinces API (dữ liệu Tỉnh/Thành, Phường/Xã)│  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Công Nghệ Sử Dụng

| Tầng | Công nghệ | Phiên bản | Mục đích |
|------|-----------|-----------|----------|
| **Frontend** | React | 19.2 | Thư viện UI component-based |
| | TypeScript | 5.9 | Kiểm tra kiểu tĩnh, tăng độ tin cậy code |
| | Vite | 8.0 | Công cụ build & dev server hiệu năng cao |
| | Tailwind CSS | 3.4 | Framework CSS utility-first |
| | React Router DOM | 7.13 | Điều hướng client-side |
| | Zustand | 5.0 | Quản lý state toàn cục (auth) |
| | Axios | 1.15 | Giao tiếp HTTP với Backend |
| **Backend** | ASP.NET Core | 8.0 | Web API framework |
| | Entity Framework Core | 8.0 | ORM, trừu tượng hóa truy cập CSDL |
| | SQLite | 3 | Cơ sở dữ liệu nhẹ, không cần cài đặt server |
| | JWT Bearer | 8.0 | Xác thực & phân quyền ngưởi dùng |
| | Swashbuckle | 6.5 | Tạo tài liệu Swagger/OpenAPI |
| | CloudinaryDotNet | 1.24 | Tích hợp upload & quản lý ảnh |

---

## 4. Cấu Trúc Dự Án

```
build-web-store/
├── backend/                          # ASP.NET Core Web API
│   ├── Domain/
│   │   ├── Entities/                 # Các thực thể nghiệp vụ
│   │   │   ├── Product.cs
│   │   │   ├── Category.cs
│   │   │   ├── Order.cs, OrderItem.cs
│   │   │   ├── User.cs
│   │   │   ├── Cart.cs, CartItem.cs
│   │   │   ├── Province.cs, Ward.cs
│   │   │   └── ProductImage.cs
│   │   └── Settings/                 # Cấu hình ứng dụng (JWT, Cloudinary)
│   ├── DTOs/                         # Data Transfer Objects (tách biệt contract API)
│   │   ├── Products/
│   │   ├── Orders/
│   │   ├── Auth/
│   │   ├── Cart/
│   │   ├── Categories/
│   │   ├── Locations/
│   │   ├── Admin/
│   │   └── Common/ApiResponse.cs
│   ├── Extensions/
│   │   └── Endpoints/                # Minimal API Endpoint Groups
│   │       ├── ProductEndpoints.cs
│   │       ├── OrderEndpoints.cs
│   │       ├── AuthEndpoints.cs
│   │       ├── CartEndpoints.cs
│   │       ├── CategoryEndpoints.cs
│   │       ├── AdminEndpoints.cs
│   │       ├── ImageEndpoints.cs
│   │       └── LocationEndpoints.cs
│   ├── Infrastructure/
│   │   ├── Persistence/
│   │   │   ├── AppDbContext.cs       # DbContext EF Core
│   │   │   ├── Configurations/       # Fluent API entity configurations
│   │   │   └── DbSeeder.cs           # Seed dữ liệu mẫu
│   │   └── Services/
│   │       ├── JwtService.cs
│   │       ├── PasswordHasher.cs
│   │       └── CloudinaryService.cs
│   ├── Migrations/                   # EF Core Migrations
│   ├── Data/
│   │   └── provinces.json, wards.json
│   ├── appsettings.json
│   ├── Program.cs
│   └── TiemBanhBeYeu.Api.csproj
│
├── frontend/                         # React SPA
│   ├── src/
│   │   ├── pages/                    # Các trang theo route
│   │   │   ├── home.tsx
│   │   │   ├── products.tsx
│   │   │   ├── product-detail.tsx
│   │   │   ├── cart.tsx
│   │   │   ├── checkout.tsx
│   │   │   ├── login.tsx, register.tsx
│   │   │   ├── profile.tsx, orders.tsx
│   │   │   └── admin/index.tsx
│   │   ├── components/
│   │   │   ├── ui/                   # Primitive UI components (Button, Input, Modal...)
│   │   │   ├── layout/               # Header, Footer, Layout wrapper
│   │   │   ├── product/              # ProductCard, ProductGrid, ProductFilter...
│   │   │   ├── cart/                 # CartItem, CartSummary, AddressPicker
│   │   │   └── auth/                 # LoginForm, RegisterForm
│   │   ├── api/                      # API client modules (axios instances + endpoint calls)
│   │   ├── hooks/                    # Custom React hooks (use-cart)
│   │   ├── stores/                   # Zustand stores (auth-store)
│   │   ├── types/                    # TypeScript interfaces
│   │   ├── lib/                      # Utilities (formatPrice, cn, ...)
│   │   └── mocks/                    # Mock data (development)
│   ├── public/                       # Static assets & product images
│   ├── index.html
│   ├── vite.config.ts
│   ├── tailwind.config.cjs
│   └── package.json
│
├── build-web-store.sln               # Visual Studio Solution
└── README.md                         # File này
```

---

## 5. Các Module Nghiệp Vụ Chính

### 5.1. Module Sản Phẩm (Products)
- **Khách hàng:** Duyệt danh sách, tìm kiếm theo tên, lọc theo danh mục, sắp xếp theo giá/đánh giá/mới nhất, xem chi tiết sản phẩm (ảnh, mô tả, tồn kho).
- **Admin:** CRUD sản phẩm, cập nhật tồn kho, bật/tắt trạng thái, xóa mềm (soft delete), upload ảnh lên Cloudinary.

### 5.2. Module Giỏ Hàng & Đặt Hàng (Cart & Orders)
- **Giỏ hàng:** Lưu trữ localStorage cho khách vãng lai; đồng bộ server khi đăng nhập.
- **Đặt hàng:** Form thu thập thông tin khách hàng (họ tên, SĐT, email), chọn địa chỉ giao hàng qua dropdown Tỉnh/Thành → Phường/Xã (dữ liệu từ file JSON địa phương), tính tổng tiền.
- **Quản lý đơn hàng (Admin):** Xem toàn bộ đơn hàng, cập nhật trạng thài theo luồng:  
  `Chờ xác nhận → Xác nhận → Đang giao → Đã giao / Hủy`. Tự động hoàn kho khi hủy đơn.

### 5.3. Module Xác Thực & Phân Quyền (Authentication)
- Đăng ký, đăng nhập bằng email/mật khẩu (bcrypt hashing).
- JWT Access Token với thờ hạn 60 phút, gửi kèm header `Authorization: Bearer <token>`.
- Phân quyền Role-based: `User` (mua hàng) và `Admin` (quản trị).
- Khách hàng có thể đặt hàng không cần đăng nhập (guest checkout).

### 5.4. Module Quản Trị (Admin Dashboard)
- Dashboard tổng quan: thống kê số đơn hàng, sản phẩm, danh mục, ngưởi dùng, doanh thu.
- Quản lý ngưởi dùng: xem danh sách, sửa thông tin, đổi mật khẩu, khóa/mở khóa tài khoản.

### 5.5. Module Địa Chỉ (Locations)
- Cung cấp API trả về danh sách Tỉnh/Thành và Phường/Xã từ Việt Nam (dữ liệu static JSON + seed vào SQLite).
- Hỗ trợ autocomplete địa chỉ trong form checkout.

---

## 6. Cơ Sở Dữ Liệu (SQLite)

| Bảng | Mô tả |
|------|-------|
| **Products** | Thông tin sản phẩm (tên, mô tả, giá, tồn kho, trạng thái, đánh giá, xóa mềm) |
| **Categories** | Danh mục sản phẩm (tên, mô tả, trạng thái) |
| **ProductImages** | Ảnh sản phẩm (URL, public ID Cloudinary) |
| **Users** | Tài khoản ngưởi dùng (email, password hash, họ tên, địa chỉ, roles) |
| **Orders** | Đơn hàng (mã đơn, thông tin khách, địa chỉ, tổng tiền, trạng thái) |
| **OrderItems** | Chi tiết đơn hàng (sản phẩm, số lượng, đơn giá) |
| **Carts** | Giỏ hàng của ngưởi dùng đã đăng nhập |
| **CartItems** | Chi tiết giỏ hàng (sản phẩm, số lượng) |
| **Provinces** | Danh sách Tỉnh/Thành |
| **Wards** | Danh sách Phường/Xã (liên kết Province) |

> **Lưu ý:** Mối quan hệ chính: `Product` ↔ `Category` (N-1), `Order` ↔ `OrderItem` (1-N), `OrderItem` ↔ `Product` (N-1), `User` ↔ `Order` (1-N), `User` ↔ `Cart` (1-1), `Province` ↔ `Ward` (1-N).

---

## 7. Hướng Dẫn Cài Đặt & Chạy Dự Án

### 7.1. Yêu cầu môi trường
- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **.NET SDK** 8.0 ([tải tại đây](https://dotnet.microsoft.com/en-us/download/dotnet/8.0))

### 7.2. Backend

```bash
cd backend

# Khôi phục package NuGet
dotnet restore

# Áp dụng migration & tạo CSDL (nếu chưa có)
dotnet ef database update

# Chạy server (mặc định port 5000)
dotnet run
```

- API sẽ chạy tại: `http://localhost:5000`
- Swagger UI: `http://localhost:5000/swagger`

### 7.3. Frontend

```bash
cd frontend

# Cài đặt dependencies
npm install

# Chạy dev server (mặc định port 5173)
npm run dev
```

- Website sẽ chạy tại: `http://localhost:5173`

### 7.4. Tài khoản mặc định (sau khi seed)

| Vai trò | Email | Mật khẩu |
|---------|-------|----------|
| Admin | `admin@tiembanh.com` | `Admin@123` |
| User | `user@tiembanh.com` | `User@123` |

> *Lưu ý: Nếu chưa có seed data, cần tạo tài khoản qua endpoint `/api/auth/register`.*

---

## 8. Tài Liệu API

Khi backend đang chạy, tài liệu API đầy đủ có thể truy cập qua **Swagger UI**:

```
http://localhost:5000/swagger
```

Các nhóm endpoint chính:
- `GET/POST /api/products` — Sản phẩm
- `GET/POST /api/orders` — Đơn hàng
- `POST /api/auth/register|login` — Xác thực
- `GET/PUT /api/auth/me` — Thông tin cá nhân
- `GET/POST /api/cart` — Giỏ hàng
- `GET/POST /api/categories` — Danh mục
- `GET /api/locations/*` — Địa chỉ Việt Nam
- `GET/POST /api/admin/*` — Quản trị (yêu cầu role Admin)

---

## 9. Ghi Chú Kỹ Thuật cho Giảng Viên

### 9.1. Lý do chọn công nghệ
- **React 19 + Vite:** Tận dụng hiệu năng build nhanh và các cải tiến mới nhất của React (Server Components readiness, Actions, v.v.).
- **Minimal APIs (.NET 8):** Giảm boilerplate so với MVC truyền thống, tập trung vào Endpoint Groups giúp code gọn gàng, dễ đọc cho dự án vừa và nhỏ.
- **SQLite:** Phù hợp cho môi trường demo và phát triển; không yêu cầu cài đặt server CSDL riêng, dễ chia sẻ file `tiembanh.db` giữa các thành viên.
- **Cloudinary:** Giảm tải lưu trữ static asset cho server, tận dụng CDN toàn cầu để tối ưu tốc độ tải ảnh.

### 9.2. Điểm nổi bật về thiết kế
- **Soft Delete:** Sản phẩm sử dụng cờ `IsDeleted` + `DeletedAt` thay vì xóa vật lý, đảm bảo toàn vẹn dữ liệu đơn hàng lịch sử.
- **Guest Cart:** Giỏ hàng hỗ trợ cả khách vãng lai (localStorage) và user đã đăng nhập (server-side), tạo trải nghiệm mượt mà không bắt buộc đăng nhập ngay từ đầu.
- **Auto Stock Recovery:** Khi admin hủy đơn hàng, hệ thống tự động hoàn trả số lượng tồn kho về `Product.StockQuantity`.

### 9.3. Hạn chế & Hướng phát triển
- **Thanh toán:** Hiện tại chỉ ghi nhận đơn hàng, chưa tích hợp cổng thanh toán thực (Momo, VNPay, Stripe).
- **Caching:** Chưa áp dụng Redis hoặc Output Caching cho API; có thể bổ sung khi lượng truy cập tăng.
- **Real-time:** Chưa có WebSocket/Socket.IO để cập nhật trạng thái đơn hàng real-time.
- **Pagination:** Frontend products page đã có pagination; có thể mở rộng infinite scroll.
- **Testing:** Hiện có cấu trúc sẵn cho Vitest + Testing Library, cần bổ sung thêm test cases unit/integration.

---

## 10. Liên Hệ & Hỗ Trợ

- **Source code:** [GitHub Repository](https://github.com/[username]/build-web-store) *(thay bằng link thực tế)*
- **Báo cáo lỗi:** Vui lòng tạo Issue trên GitHub hoặc liên hệ trực tiếp sinh viên thực hiện.

---

*Được xây dựng với ❤️ bằng React & ASP.NET Core.*
