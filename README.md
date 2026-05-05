# Tiệm Bánh Bé Yêu

Website thương mại điện tử bán bánh kẹo hữu cơ dành cho trẻ em. Dự án gồm hai phần chính: **Frontend** (React SPA) và **Backend** (ASP.NET Core Web API).

---

## Công nghệ sử dụng

### Frontend

| Công nghệ             | Mục đích                                                      |
| --------------------- | ------------------------------------------------------------- |
| React 19 + TypeScript | UI framework                                                  |
| Vite 8                | Build tool & dev server                                       |
| Tailwind CSS 3        | Styling                                                       |
| Radix UI              | Bộ UI component headless (dialog, select, dropdown, toast...) |
| Lucide React          | Icon library                                                  |
| React Router DOM 7    | Client-side routing                                           |
| Zustand 5             | Global state management (auth)                                |
| Axios                 | HTTP client                                                   |

### Backend

| Công nghệ                     | Mục đích                                           |
| ----------------------------- | -------------------------------------------------- |
| ASP.NET Core 8 (Minimal APIs) | Web API framework                                  |
| Entity Framework Core 8       | ORM (Object-Relational Mapping)                    |
| SQLite                        | Cơ sở dữ liệu (file-based, không cần cài đặt thêm) |
| JWT Bearer Auth               | Xác thực người dùng                                |
| Swagger / Swashbuckle         | Tài liệu API tự động                               |
| Cloudinary                    | CDN lưu trữ hình ảnh sản phẩm                      |

---

## Tính năng chính

### Dành cho khách hàng

- Duyệt sản phẩm: tìm kiếm, lọc theo danh mục, sắp xếp (giá, đánh giá, mới nhất)
- Xem chi tiết sản phẩm (ảnh, mô tả, giá, tình trạng kho, đánh giá)
- Giỏ hàng (lưu trên localStorage với khách chưa đăng nhập, lưu server với user đã đăng nhập)
- Đặt hàng với form thông tin khách hàng và địa chỉ giao hàng (chọn Tỉnh/Thành, Phường/Xã)
- Đăng ký, đăng nhập, quản lý thông tin cá nhân
- Xem lịch sử đơn hàng
- Giao diện responsive (mobile, tablet, desktop)

### Dành cho quản trị viên (Admin)

- Dashboard tổng quan (số đơn hàng, sản phẩm, danh mục, người dùng, doanh thu)
- Quản lý sản phẩm: thêm, sửa, xóa mềm, bật/tắt trạng thái, cập nhật tồn kho
- Quản lý danh mục: thêm, sửa, xóa, bật/tắt trạng thái
- Quản lý đơn hàng: xem tất cả đơn, cập nhật trạng thái (chờ xác nhận → xác nhận → đang giao → đã giao → hủy), tự động hoàn kho khi hủy đơn
- Quản lý người dùng: xem danh sách, sửa thông tin, đổi mật khẩu, khóa/mở khóa tài khoản
- Upload ảnh sản phẩm lên Cloudinary

---

## Yêu cầu môi trường

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0 (đi kèm Node.js)
- **.NET SDK** 8.0 ([tải tại đây](https://dotnet.microsoft.com/en-us/download/dotnet/8.0))
- SQLite được hỗ trợ sẵn trong .NET, không cần cài đặt riêng

---

## Cài đặt và chạy

### 1. Backend (ASP.NET Core 8)

```bash
cd backend
dotnet restore
dotnet run
```

Backend sẽ chạy tại **http://localhost:5000**. Lần chạy đầu tiên tự động tạo database SQLite (`tiembanh.db`) và seed dữ liệu mẫu (danh mục, sản phẩm, tài khoản admin, danh sách tỉnh/phường Việt Nam).

Swagger UI có sẵn tại **http://localhost:5000/swagger**.

### 2. Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev
```

Frontend sẽ chạy tại **http://localhost:5173**.

### Chạy production

```bash
# Frontend production build
cd frontend
npm run build
npm run preview

# Backend production
cd backend
dotnet run --environment Production
```

---

## Cấu hình

### Backend (`backend/appsettings.json`)

| Cấu hình                              | Mô tả                                | Giá trị mặc định                   |
| ------------------------------------- | ------------------------------------ | ---------------------------------- |
| `ConnectionStrings:DefaultConnection` | Đường dẫn SQLite DB file             | `Data Source=tiembanh.db`          |
| `Cors:AllowedOrigins`                 | Origins cho phép CORS                | `localhost:5173`, `localhost:3000` |
| `JwtSettings:Secret`                  | Khóa bí mật JWT (tối thiểu 32 ký tự) | _(có sẵn, thay đổi khi deploy)_    |
| `JwtSettings:ExpirationMinutes`       | Thời gian hết hạn token              | `60`                               |
| `CloudinarySettings:*`                | Thông tin Cloudinary cho upload ảnh  | _(có sẵn)_                         |

### Frontend (`frontend/src/config/constants.ts`)

| Biến môi trường | Mô tả                | Mặc định                    |
| --------------- | -------------------- | --------------------------- |
| `VITE_API_URL`  | Backend API base URL | `http://localhost:5000/api` |

Tạo file `.env` trong thư mục `frontend` để ghi đè:

```
VITE_API_URL=http://localhost:5000/api
```

---

## Tài khoản mặc định

### Tài khoản Admin

- **Email:** `admin@tiembanh.com`
- **Mật khẩu:** `admin123`

> **Lưu ý:** Đổi mật khẩu admin ngay sau khi triển khai thực tế.

---

## Cấu trúc thư mục

```
build-web-store/
├── frontend/                        # React frontend
│   ├── index.html                   # Entry point HTML
│   ├── vite.config.ts               # Cấu hình Vite (alias @ → src/)
│   ├── tailwind.config.cjs          # Tailwind theme (màu sắc, font Nunito)
│   ├── public/                      # Static assets (logo, ảnh background, favicon)
│   └── src/
│       ├── main.tsx                 # React entry
│       ├── App.tsx                  # Root component (router + layout)
│       ├── api/                     # API client modules (axios instance, auth, products, cart, orders, admin)
│       ├── components/
│       │   ├── ui/                  # Generic UI components (Button, Card, Input, Modal, Toast...)
│       │   ├── layout/              # Header, Footer, MainLayout
│       │   ├── product/             # ProductCard, ProductFilter, ProductGallery...
│       │   ├── auth/                # LoginForm, RegisterForm
│       │   └── cart/                # CartItem, CartSummary, AddressPicker
│       ├── pages/                   # Route pages (Home, Products, Cart, Checkout, Login, Admin...)
│       ├── hooks/                   # Custom hooks (useCart)
│       ├── stores/                  # Zustand stores (authStore)
│       ├── config/                  # App constants (API URL, sort options...)
│       ├── types/                   # TypeScript type definitions
│       └── lib/                     # Utilities (cn, formatPrice...)
│
└── backend/                         # ASP.NET Core Web API
    ├── Program.cs                   # Entry point (DI, middleware, endpoints, CORS, JWT, Swagger)
    ├── appsettings.json             # Cấu hình chính
    ├── Domain/
    │   ├── Entities/                # EF Core entity classes (Product, Category, Order, User, Cart...)
    │   └── Settings/                # CloudinarySettings
    ├── Infrastructure/
    │   ├── Persistence/             # AppDbContext, entity configurations, DbSeeder
    │   └── Services/                # JwtService, PasswordHasher, CloudinaryService
    ├── DTOs/                        # Data Transfer Objects (request/response models)
    ├── Extensions/Endpoints/        # Minimal API endpoint definitions (CRUD cho từng entity)
    ├── Data/                        # Seed data JSON files (provinces.json, wards.json)
    └── Migrations/                  # EF Core database migrations
```

---

## Các lệnh hữu ích

| Lệnh                             | Mô tả                                |
| -------------------------------- | ------------------------------------ |
| `cd frontend && npm run dev`     | Chạy frontend dev server             |
| `cd frontend && npm run build`   | Build production (type-check + Vite) |
| `cd frontend && npm run preview` | Preview production build             |
| `cd frontend && npm run lint`    | Kiểm tra code ESLint                 |
| `cd backend && dotnet run`       | Chạy backend                         |
| `cd backend && dotnet build`     | Build backend                        |
| `cd backend && dotnet watch run` | Chạy backend với hot-reload          |

---

## API Endpoints chính

| Nhóm         | Endpoint                                                                   | Auth                                     |
| ------------ | -------------------------------------------------------------------------- | ---------------------------------------- |
| **Sản phẩm** | `GET/POST /api/products` `GET/PUT/DELETE /api/products/{id}`               | Public (GET) / Admin (POST, PUT, DELETE) |
| **Danh mục** | `GET/POST /api/categories`                                                 | Public (GET) / Admin (CRUD)              |
| **Xác thực** | `POST /api/auth/register` `POST /api/auth/login` `GET/PUT /api/auth/me`    | Public (register/login) / JWT (profile)  |
| **Giỏ hàng** | `GET/POST/PUT/DELETE /api/cart`                                            | JWT required                             |
| **Đơn hàng** | `POST /api/orders` `GET /api/orders` `GET /api/orders/{id}`                | Public (create) / JWT (history)          |
| **Địa giới** | `GET /api/locations/provinces` `GET /api/locations/provinces/{code}/wards` | Public                                   |
| **Hình ảnh** | `POST /api/images/upload` `DELETE /api/images/{publicId}`                  | Admin                                    |
| **Admin**    | `GET /api/admin/dashboard` + CRUD orders/products/categories/users         | Admin role                               |
| **Health**   | `GET /api/health`                                                          | Public                                   |

Tài liệu API đầy đủ có sẵn tại Swagger UI: **http://localhost:5000/swagger**
