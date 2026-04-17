# Backend Project Summary - Tiệm Bánh Bé Yêu API

> **Ngày tạo:** 17/04/2026
> **Framework:** .NET 8.0 Minimal APIs
> **Database:** SQLite với Entity Framework Core 8.0

---

## 1. Cấu trúc dự án (Clean Architecture)

```
backend/
├── Program.cs                          # Entry point, cấu hình services
├── TiemBanhBeYeu.Api.csproj            # Project file (.NET 8)
├── .gitignore                          # Git ignore rules
│
├── Domain/
│   └── Entities/
│       ├── Product.cs                  # Thực thể sản phẩm
│       ├── Category.cs                 # Thực thể danh mục
│       ├── Order.cs                    # Thực thể đơn hàng + OrderStatus enum
│       ├── OrderItem.cs                # Thực thể chi tiết đơn hàng
│       └── ProductImage.cs             # Thực thể hình ảnh sản phẩm
│
├── DTOs/
│   ├── Common/
│   │   └── ApiResponse.cs              # Wrapper response chuẩn + PagedResponse
│   ├── Products/
│   │   └── ProductDto.cs               # Product request/response DTOs
│   ├── Categories/
│   │   └── CategoryDto.cs              # Category request/response DTOs
│   └── Orders/
│       └── OrderDto.cs                 # Order request/response DTOs
│
├── Infrastructure/
│   └── Persistence/
│       ├── AppDbContext.cs              # EF Core DbContext
│       ├── DbSeeder.cs                  # Seed data khởi tạo
│       └── Configurations/
│           └── EntityConfigurations.cs  # EF Core fluent API config
│
└── Extensions/
    └── Endpoints/
        ├── ProductEndpoints.cs          # Product CRUD APIs
        ├── CategoryEndpoints.cs         # Category CRUD APIs
        └── OrderEndpoints.cs            # Order APIs
```

---

## 2. Công nghệ sử dụng

| Package                              | Version | Mục đích                     |
| ------------------------------------ | ------- | ---------------------------- |
| Microsoft.EntityFrameworkCore.Sqlite | 8.0.0   | SQLite database provider     |
| Microsoft.EntityFrameworkCore.Design | 8.0.0   | EF Core migrations & tooling |
| Microsoft.AspNetCore.OpenApi         | 8.0.0   | OpenAPI/Swagger support      |
| Swashbuckle.AspNetCore               | 6.5.0   | Swagger UI                   |

---

## 3. Database Schema

### 3.1 Bảng Products

| Column        | Type          | Description          |
| ------------- | ------------- | -------------------- |
| Id            | int           | Primary key          |
| Name          | string (200)  | Tên sản phẩm         |
| Description   | string (2000) | Mô tả chi tiết       |
| Price         | decimal(18,2) | Giá bán              |
| StockQuantity | int           | Số lượng tồn kho     |
| CategoryId    | int           | FK -> Categories     |
| InStock       | computed      | StockQuantity > 0    |
| IsActive      | bool          | Trạng thái hoạt động |
| IsDeleted     | bool          | Cờ xóa mềm           |
| DeletedAt     | DateTime?     | Thời gian xóa mềm    |
| Rating        | double?       | Đánh giá sao         |
| CreatedAt     | DateTime      | Thời gian tạo        |
| UpdatedAt     | DateTime      | Thời gian cập nhật   |

### 3.2 Bảng Categories

| Column      | Type         | Description                |
| ----------- | ------------ | -------------------------- |
| Id          | int          | Primary key                |
| Name        | string (100) | Tên danh mục               |
| Slug        | string (100) | URL-friendly slug (unique) |
| Description | string (500) | Mô tả danh mục             |
| ImageUrl    | string (500) | Hình ảnh danh mục          |
| IsActive    | bool         | Trạng thái hoạt động       |
| DeletedAt   | DateTime?    | Thời gian xóa mềm          |
| CreatedAt   | DateTime     | Thời gian tạo              |
| UpdatedAt   | DateTime     | Thời gian cập nhật         |

### 3.3 Bảng Orders

| Column        | Type             | Description          |
| ------------- | ---------------- | -------------------- |
| Id            | int              | Primary key          |
| OrderCode     | string (50)      | Mã đơn hàng (unique) |
| CustomerName  | string (100)     | Tên khách hàng       |
| CustomerPhone | string (20)      | Số điện thoại        |
| CustomerEmail | string (100)     | Email                |
| Province      | string (100)     | Tỉnh/TP              |
| District      | string (100)     | Quận/Huyện           |
| Ward          | string (100)     | Phường/Xã            |
| Address       | string (500)     | Địa chỉ chi tiết     |
| TotalAmount   | decimal(18,2)    | Tổng tiền            |
| Status        | OrderStatus enum | Trạng thái đơn hàng  |
| CreatedAt     | DateTime         | Thời gian tạo        |
| UpdatedAt     | DateTime         | Thời gian cập nhật   |

**OrderStatus:** Pending → Confirmed → Shipping → Delivered → Cancelled

### 3.4 Bảng OrderItems

| Column       | Type          | Description                 |
| ------------ | ------------- | --------------------------- |
| Id           | int           | Primary key                 |
| OrderId      | int           | FK -> Orders                |
| ProductId    | int           | FK -> Products              |
| ProductName  | string (200)  | Tên sản phẩm (denormalized) |
| ProductPrice | decimal(18,2) | Giá tại thời điểm đặt       |
| Quantity     | int           | Số lượng                    |

### 3.5 Bảng ProductImages

| Column    | Type         | Description     |
| --------- | ------------ | --------------- |
| Id        | int          | Primary key     |
| ProductId | int          | FK -> Products  |
| ImageUrl  | string (500) | URL hình ảnh    |
| SortOrder | int          | Thứ tự hiển thị |

---

## 4. API Endpoints

### 4.1 Products (`/api/products`)

| Method | Endpoint       | Mô tả                                             |
| ------ | -------------- | ------------------------------------------------- |
| GET    | `/`            | Lấy danh sách sản phẩm (phân trang, lọc, sắp xếp) |
| GET    | `/all`         | Lấy tất cả sản phẩm (admin)                       |
| GET    | `/{id}`        | Lấy chi tiết sản phẩm                             |
| GET    | `/categories`  | Lấy danh sách tên danh mục                        |
| POST   | `/`            | Tạo sản phẩm mới                                  |
| PUT    | `/{id}`        | Cập nhật sản phẩm                                 |
| DELETE | `/{id}`        | Xóa mềm sản phẩm                                  |
| PATCH  | `/{id}/status` | Toggle trạng thái hoạt động                       |
| PATCH  | `/{id}/stock`  | Cập nhật số lượng tồn kho                         |
| PATCH  | `/{id}/images` | Cập nhật hình ảnh sản phẩm                        |

**Query Parameters:** `search`, `category`, `sortBy` (price-asc, price-desc, rating, stock), `page`, `pageSize`, `isActive`

### 4.2 Categories (`/api/categories`)

| Method | Endpoint       | Mô tả                                    |
| ------ | -------------- | ---------------------------------------- |
| GET    | `/`            | Lấy danh sách danh mục (phân trang, lọc) |
| GET    | `/all`         | Lấy tất cả danh mục (dropdown)           |
| GET    | `/{id}`        | Lấy chi tiết danh mục                    |
| POST   | `/`            | Tạo danh mục mới                         |
| PUT    | `/{id}`        | Cập nhật danh mục                        |
| DELETE | `/{id}`        | Xóa mềm danh mục                         |
| PATCH  | `/{id}/status` | Toggle trạng thái hoạt động              |

**Query Parameters:** `search`, `isActive`, `page`, `pageSize`

### 4.3 Orders (`/api/orders`)

| Method | Endpoint | Mô tả                 |
| ------ | -------- | --------------------- |
| POST   | `/`      | Tạo đơn hàng mới      |
| GET    | `/{id}`  | Lấy chi tiết đơn hàng |

### 4.4 Health Check

| Method | Endpoint      | Mô tả                      |
| ------ | ------------- | -------------------------- |
| GET    | `/api/health` | Kiểm tra API health status |

---

## 5. Đặc điểm kỹ thuật

### 5.1 API Design

- **Minimal APIs** - Nhẹ, hiệu suất cao, không overhead của MVC
- **RESTful** - Theo chuẩn REST conventions
- **Response Wrapper** - `ApiResponse<T>` chuẩn hóa cho mọi response
- **Pagination** - Hỗ trợ phân trang với `PagedResponse<T>`
- **Swagger/OpenAPI** - Tự động generate documentation

### 5.2 Database

- **SQLite** - Nhẹ, không cần cài đặt, file-based
- **EF Core 8** - Code-first approach
- **Soft Delete** - Không xóa vĩnh viễn, dùng `IsDeleted`/`DeletedAt`
- **Indexes** - Tối ưu query trên các cột thường dùng

### 5.3 Security & Validation

- **Input Validation** - Data Annotations `[Required]`, `[Range]`, `[StringLength]`, `[Url]`
- **Business Logic** - Kiểm tra ràng buộc trước khi xóa (category có sản phẩm active)
- **Slug Unique** - Không cho phép trùng slug danh mục

### 5.4 Cấu hình

- **Port:** 5000
- **CORS:** Cho phép localhost:5173, localhost:3000
- **Database Path:** `tiembanh.db` (trong thư mục backend)
- **Seed Data:** Tự động tạo 3 danh mục + 8 sản phẩm mẫu khi chạy lần đầu

---

## 6. Cách chạy dự án

```bash
# Clone và di chuyển vào thư mục backend
cd backend

# Restore dependencies
dotnet restore

# Chạy app (tự động tạo database + seed data)
dotnet run
```

**API chạy tại:** `http://localhost:5000`
**Swagger UI:** `http://localhost:5000` (root)

---

## 7. Git & Deployment

- **Branch hiện tại:** `build-backend-api`
- **Remote:** `git@github.com:quangdev1607/web-store.git`
- **.gitignore:** Đã cấu hình ignore `bin/`, `obj/`, `*.db`, `appsettings.*.json`

---

## 8. Hạn chế & Cải tiến trong tương lai

### Đã có:

- ✅ CRUD đầy đủ cho Products, Categories, Orders
- ✅ Phân trang, lọc, sắp xếp
- ✅ Soft delete
- ✅ Validation
- ✅ Swagger documentation

## 9. Key Files Reference

| File                   | Mô tả ngắn                            |
| ---------------------- | ------------------------------------- |
| `Program.cs`           | Cấu hình services, middleware, routes |
| `AppDbContext.cs`      | EF Core context, DbSets               |
| `ProductEndpoints.cs`  | ~738 lines - Product CRUD logic       |
| `CategoryEndpoints.cs` | ~417 lines - Category CRUD logic      |
| `OrderEndpoints.cs`    | ~196 lines - Order creation logic     |
| `DbSeeder.cs`          | Tạo dữ liệu mẫu ban đầu               |

---

_Generated on 17/04/2026 - Backend API for Tiệm Bánh Bé Yêu E-commerce_
