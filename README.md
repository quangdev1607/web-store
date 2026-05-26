# Project: Tiệm Bánh Bé Yêu

## 1. Bức tranh tổng quan

`build-web-store` là một ứng dụng web thương mại điện tử mô phỏng cửa hàng bánh/kẹo cho trẻ em.

Hệ thống có 2 phần chính:

- `frontend/`: React + TypeScript + Vite + Tailwind CSS. Đây là phần người dùng nhìn thấy trong trình duyệt.
- `backend/`: ASP.NET Core 8 Minimal API + Entity Framework Core + SQLite. Đây là phần xử lý dữ liệu, đăng nhập, đơn hàng, tồn kho, admin.

Các vai trò chính:

- Khách chưa đăng nhập: xem sản phẩm, thêm vào giỏ local, nhưng hiện tại không checkout được vì trang checkout yêu cầu đăng nhập.
- User đã đăng nhập: quản lý hồ sơ, địa chỉ, giỏ local, đặt hàng COD, xem danh sách đơn.
- Admin: xem dashboard, quản lý đơn hàng, sản phẩm, danh mục, người dùng, upload ảnh.

Các cổng local mặc định:

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000/api`
- Swagger UI backend: `http://localhost:5000/` vì `Program.cs` đặt Swagger route prefix là root.
- Health check: `http://localhost:5000/api/health`

## 2. Công nghệ và vai trò từng phần

Frontend:

- React 19: dựng giao diện component-based.
- TypeScript 5.9: type safety cho component, API contract, state.
- Vite 8: dev server và build tool.
- Tailwind CSS 3.4: styling bằng utility classes.
- React Router DOM 7: routing client-side.
- Zustand 5: global auth state, có persist vào localStorage.
- React Context: cart state local.
- Axios: HTTP client gọi backend.
- Radix UI, Lucide React: primitive UI và icon.

Backend:

- ASP.NET Core 8 Minimal APIs: định nghĩa route API bằng endpoint groups.
- Entity Framework Core 8: ORM truy cập SQLite.
- SQLite: database file-based, file local là `backend/tiembanh.db`.
- JWT Bearer Authentication: xác thực bằng token.
- Role-based Authorization: role `Admin` dùng cho `/api/admin/*`.
- Swashbuckle: Swagger/OpenAPI.
- CloudinaryDotNet: upload/xóa ảnh qua Cloudinary.

Quan trọng về bảo mật:

- `backend/appsettings.json` hiện có cấu hình JWT và Cloudinary. Không đưa secret thật vào tài liệu, chat, issue hoặc commit mới.
- Nếu dự án dùng thật, cần rotate Cloudinary credentials đang nằm trong repo và chuyển secret sang user secrets, biến môi trường hoặc secret manager.

## 3. Cách chạy dự án local

Yêu cầu:

- Node.js >= 18
- npm >= 9
- .NET SDK 8

Cách nhanh nhất trên Windows:

```bat
run-dev.bat
```

Script này đi vào `frontend/`, cài `node_modules` nếu thiếu, rồi chạy `npm run dev`.

Cách chạy bằng terminal:

```bash
cd frontend
npm install
npm run dev
```

Lưu ý: trong `frontend/package.json`, script `npm run dev` chạy đồng thời:

```json
"dev": "npx concurrently \"vite\" \"npm run dev:backend\""
```

Nghĩa là nó vừa chạy Vite frontend, vừa chạy backend bằng:

```bash
cd ../backend && dotnet run
```

Nếu muốn chạy riêng từng phần:

```bash
cd backend
dotnet restore
dotnet run
```

Ở terminal khác:

```bash
cd frontend
npx vite
```

Không chạy `dotnet run` riêng rồi lại chạy `npm run dev` nếu không muốn backend bị trùng port `5000`.

## 4. Database, seed data và tài khoản mặc định

Backend dùng SQLite với connection string:

```json
"DefaultConnection": "Data Source=tiembanh.db"
```

Vì backend chạy từ thư mục `backend/`, file DB local là:

```text
backend/tiembanh.db
```

Khi app start, `Program.cs` gọi:

```csharp
await DbSeeder.SeedAsync(context, passwordHasher);
```

Trong `DbSeeder.SeedAsync`:

- Gọi `context.Database.EnsureCreatedAsync()`.
- Seed 3 danh mục nếu bảng `Categories` trống: `Kẹo`, `Bánh`, `Đồ uống`.
- Seed 8 sản phẩm mẫu nếu bảng `Products` trống.
- Seed admin user nếu bảng `Users` trống.
- Seed tỉnh/thành và phường/xã từ `backend/Data/provinces.json`, `backend/Data/wards.json`.

Tài khoản admin mặc định theo code hiện tại:

```text
Email: admin@tiembanh.com
Password: admin123
Role: Admin
```

Không có user thường mặc định trong `DbSeeder`. User thường được tạo qua form đăng ký hoặc endpoint `POST /api/auth/register`.

Lưu ý về migration:

- Repo có thư mục `backend/Migrations/`, nhưng runtime hiện dùng `EnsureCreatedAsync`, không tự chạy `Database.MigrateAsync`.
- Nếu schema local bị lệch, cách nhanh cho dev là backup rồi xóa `backend/tiembanh.db` để app tạo lại DB từ model hiện tại.
- Nếu muốn quản lý schema nghiêm túc hơn, nên đổi startup sang `Database.MigrateAsync()` và dùng EF migrations nhất quán.

## 5. Cấu trúc thư mục quan trọng

```text
build-web-store/
├── README.md
├── QNA_ANSWERED.md
├── PROJECT_HANDOVER.md
├── product-seed.json
├── run-dev.bat
├── build-web-store.sln
├── backend/
│   ├── Program.cs
│   ├── appsettings.json
│   ├── appsettings.Development.json
│   ├── TiemBanhBeYeu.Api.csproj
│   ├── tiembanh.db
│   ├── Data/
│   │   ├── provinces.json
│   │   └── wards.json
│   ├── Domain/
│   │   ├── Entities/
│   │   └── Settings/
│   ├── DTOs/
│   ├── Extensions/Endpoints/
│   ├── Infrastructure/
│   │   ├── Persistence/
│   │   └── Services/
│   └── Migrations/
└── frontend/
    ├── package.json
    ├── vite.config.ts
    ├── tailwind.config.cjs
    ├── public/
    └── src/
        ├── App.tsx
        ├── main.tsx
        ├── api/
        ├── components/
        ├── config/
        ├── hooks/
        ├── lib/
        ├── mocks/
        ├── pages/
        ├── stores/
        └── types/
```

### Backend folders

- `Domain/Entities`: entity EF Core, ví dụ `Product`, `Category`, `Order`, `User`.
- `Domain/Settings`: config object, hiện có `CloudinarySettings`.
- `DTOs`: request/response record gửi qua API.
- `Extensions/Endpoints`: toàn bộ Minimal API groups.
- `Infrastructure/Persistence`: `AppDbContext`, Fluent API config, seeder.
- `Infrastructure/Services`: JWT, password hashing, Cloudinary.
- `Data`: JSON tỉnh/phường để seed vào DB.

### Frontend folders

- `pages`: component cấp trang, map với route trong `App.tsx`.
- `components/ui`: component UI generic.
- `components/layout`: header, footer, layout shell.
- `components/product`, `components/cart`, `components/auth`: component theo domain.
- `api`: wrapper Axios cho từng module backend.
- `stores`: Zustand store, hiện có auth.
- `hooks`: React Context hook, hiện có cart.
- `types`: TypeScript interfaces khớp DTO backend.
- `lib`: helper format, className merge.
- `config/constants.ts`: base URL, storage keys, sort/status options.

## 6. Backend architecture

Backend entrypoint là `backend/Program.cs`.

Những việc `Program.cs` làm:

1. Cấu hình Kestrel listen port `5000`.
2. Load `JwtSettings` từ config.
3. Add JWT Bearer authentication.
4. Add authorization policy `Admin`.
5. Add Swagger.
6. Add SQLite `AppDbContext`.
7. Add CORS cho `http://localhost:5173`, `http://localhost:3000`.
8. Register services:
    - `IPasswordHasher` -> `PasswordHasher`
    - `IJwtService` -> `JwtService`
    - `ICloudinaryService` -> `CloudinaryService`
9. Seed database.
10. Map endpoint groups:

- Products
- Categories
- Orders
- Auth
- Cart
- Admin
- Images
- Locations
- Dev

### Entity model

`Product`

- `Id`, `Name`, `Description`, `Price`, `StockQuantity`
- `CategoryId`, navigation `Category`
- `InStock` là computed property: `StockQuantity > 0`, không map vào DB.
- `IsActive`: bật/tắt hiển thị/kinh doanh.
- `IsDeleted`, `DeletedAt`: soft delete.
- `Rating`, `CreatedAt`, `UpdatedAt`
- `Images`: danh sách `ProductImage`

`Category`

- `Id`, `Name`, `Slug`, `Description`, `ImageUrl`
- `IsActive`, `DeletedAt`, `CreatedAt`, `UpdatedAt`
- `Products`
- `Slug` unique.

`User`

- `Email`, `PasswordHash`, `FirstName`, `LastName`
- `Phone`, `Address`
- `Province`, `ProvinceName`, `Ward`, `WardName`
- `Roles`: string cách nhau bằng dấu phẩy, ví dụ `User`, `Admin`, `User,Admin`
- `IsActive`
- Helper `GetRoles()` và `HasRole()`

`Order`

- `OrderCode`
- `UserId` nullable, nhưng hiện tại khi tạo order chưa set `UserId`.
- Customer info: `CustomerName`, `CustomerPhone`, `CustomerEmail`
- Shipping strings: `Province`, `Ward`, `Address`
- `TotalAmount`
- `Status`: enum `Pending`, `Confirmed`, `Shipping`, `Delivered`, `Cancelled`
- `Items`

`OrderItem`

- `OrderId`, `ProductId`
- `ProductName`, `ProductPrice`: denormalized để giữ lịch sử giá/tên tại thời điểm đặt.
- `Quantity`

`Cart`, `CartItem`

- Server-side cart gắn với `UserId`.
- Có unique index `(CartId, ProductId)`.
- Hiện UI chính vẫn dùng cart localStorage, chưa dùng server cart trong luồng mua hàng.

`Province`, `Ward`

- Dữ liệu hành chính Việt Nam seed từ JSON.
- `Province.Id` chính là province code.
- `Ward.Code` unique và `Ward.ProvinceCode` trỏ về `Province.Id`.

### Password hashing

`PasswordHasher` không dùng bcrypt. Code hiện tại dùng:

- PBKDF2: `Rfc2898DeriveBytes`
- SHA256
- Salt 16 bytes
- Hash 32 bytes
- 100000 iterations
- Lưu dạng Base64 của `salt + hash`

### JWT

`JwtService` tạo token với:

- `sub`: user id
- `email`
- `jti`
- role claims: `ClaimTypes.Role`
- expiration từ `JwtSettings.ExpirationMinutes`, mặc định 60 phút.

Frontend lưu token vào localStorage key `auth_token`. Axios interceptor tự gắn:

```text
Authorization: Bearer <token>
```

## 7. Frontend architecture

Frontend entrypoint:

- `frontend/src/main.tsx`: render `<App />` vào `#root`.
- `frontend/src/App.tsx`: bọc app bằng `CartProvider`, `BrowserRouter`, `Layout`, khai báo routes.

Routes hiện tại:

```text
/                 -> HomePage
/products         -> ProductsPage
/product/:id      -> ProductDetailPage
/cart             -> CartPage
/checkout         -> CheckoutPage
/login            -> LoginPage
/register         -> RegisterPage
/profile          -> ProfilePage
/orders           -> OrdersPage
/order/:id        -> ProductDetailPage hiện tại, có vẻ route này đang map sai
/admin            -> AdminPage
*                 -> NotFoundPage
```

Route guard:

- `ProfilePage` và `OrdersPage` tự redirect về `/login` nếu chưa đăng nhập.
- `CheckoutPage` hiển thị yêu cầu đăng nhập nếu chưa đăng nhập.
- `AdminPage` tự redirect về `/` nếu user không có role `Admin`.
- `App.tsx` chưa có protected route wrapper tập trung.

### API client

`frontend/src/api/axios.ts` tạo Axios instance:

- `baseURL`: `VITE_API_URL` hoặc mặc định `http://localhost:5000/api`
- timeout: `10000`
- request interceptor gắn JWT từ `localStorage.auth_token`
- response interceptor xóa token khi gặp `401`

Do baseURL đã có `/api`, các module gọi đường dẫn như `/products`, `/auth/login`, `/admin/orders`.

### Auth state

`frontend/src/stores/auth-store.ts` dùng Zustand + persist.

State chính:

- `user`
- `token`
- `isAuthenticated`
- `isLoading`
- `error`

Actions:

- `login(email, password)`
- `register(data)`
- `logout()`
- `checkAuth()`
- `clearError()`
- `updateUser(user)`

Zustand persist key là `auth-storage`. Token cũng được lưu riêng vào localStorage key `auth_token` để Axios dễ đọc.

Lưu ý: sau login/register, store tạm set `id: 0`, rồi `checkAuth()` có thể gọi `/auth/me` để lấy user thật từ backend.

### Cart state

`frontend/src/hooks/use-cart.tsx` dùng React Context.

Cart hiện tại:

- Lưu trong localStorage key `cart`.
- `addItem(product, quantity)`
- `removeItem(productId)`
- `updateQuantity(productId, quantity)`
- `clearCart()`
- computed `totalItems`, `totalPrice`
- `isInCart(productId)`, `getQuantity(productId)`

Điểm cần nhớ: repo có `frontend/src/api/cart.ts` và backend có `/api/cart`, nhưng UI mua hàng hiện chưa dùng server cart. Cart trên giao diện đang là localStorage cart.

### Theme và UI

Theme nằm ở:

- `frontend/src/index.css`: CSS variables.
- `frontend/tailwind.config.cjs`: map CSS variables sang Tailwind colors.

Font chính: `Nunito`, fallback `system-ui`, `sans-serif`.

Màu chủ đạo:

- background kem
- foreground nâu
- primary vàng mật ong
- destructive đỏ

Helper:

- `cn()` trong `frontend/src/lib/utils.ts`: merge class bằng `clsx` + `tailwind-merge`.
- `formatPrice()`: format VND.
- `formatDate()`, `formatDateTime()`, `formatPhone()`, `formatAddress()` trong `frontend/src/lib/format.ts`.

## 8. Luồng nghiệp vụ chính

### 8.1. Duyệt và xem sản phẩm

Frontend:

- `ProductsPage` gọi `getProducts()` và `getProductCategories()`.
- Search/filter/sort hiện xử lý phần lớn ở client trên danh sách đã fetch.
- `ProductCard` đưa user sang `/product/:id`.

Backend:

- `GET /api/products`
- Query hỗ trợ `search`, `category`, `sortBy`, `page`, `pageSize`, `isActive`.
- Chỉ loại `IsDeleted`.
- Nếu không truyền `isActive`, backend hiện trả cả active và inactive.

### 8.2. Chi tiết sản phẩm và thêm giỏ

Frontend:

- `ProductDetailPage` đọc `id` từ URL.
- Gọi `GET /api/products/{id}`.
- Cho chọn quantity và gọi `useCart().addItem(product, quantity)`.

Backend:

- `GET /api/products/{id}` trả `ProductDto`.
- `InStock` tính từ `StockQuantity > 0`.

### 8.3. Giỏ hàng

Frontend:

- `CartPage` đọc cart từ `useCart`.
- Cho tăng/giảm/xóa item.
- Nút checkout đưa sang `/checkout`.

Backend:

- Server-side cart endpoints có tồn tại nhưng không nằm trong luồng UI hiện tại.

### 8.4. Checkout và tạo đơn

Frontend:

- `CheckoutPage` yêu cầu user đã đăng nhập.
- Tự fill họ tên, phone, email từ auth store.
- Địa chỉ lấy từ profile user, không nhập trực tiếp ở checkout.
- Nếu user chưa có `province` hoặc `ward`, bắt cập nhật ở `/profile`.
- Submit gọi `createOrder(orderData)`.
- Sau khi thành công: clear cart local, hiển thị mã đơn, link xem đơn.

Backend:

- `POST /api/orders`
- Validate tên, phone, email, items.
- Load products, kiểm tra tồn kho.
- Trừ tồn kho ngay khi tạo đơn.
- Tính tổng tiền theo giá trong DB, không tin tổng tiền frontend gửi.
- Tạo `OrderCode` dạng `ORD-yyyyMMddHHmmss-random`.
- Status mặc định `Pending`.
- Estimated delivery = UTC now + 3 ngày.

Điểm cần nhớ:

- Endpoint tạo order hiện không yêu cầu auth.
- Nhưng frontend checkout yêu cầu auth.
- `Order.UserId` hiện không được set khi tạo đơn, nên backend chưa có liên kết thật giữa order và user.

### 8.5. Xem đơn hàng

Frontend:

- `OrdersPage` yêu cầu đăng nhập ở client.
- Gọi `GET /api/orders` để lấy danh sách.
- Có filter status, search, sort date, pagination.
- Modal chi tiết gọi `GET /api/orders/{id}`.

Backend:

- `GET /api/orders` hiện không `RequireAuthorization`.
- Endpoint này không lọc theo current user, mà query tất cả orders.
- `GET /api/orders/{id}` cũng public.

Đây là gap bảo mật/nghiệp vụ quan trọng nếu đưa dự án đi xa hơn bài tập local.

### 8.6. Profile và địa chỉ

Frontend:

- `ProfilePage` yêu cầu đăng nhập.
- Cho sửa first name, last name, phone, địa chỉ.
- Email disabled.
- Dùng `AddressPicker`.

AddressPicker:

- Gọi `GET /api/locations/provinces`.
- Khi chọn tỉnh, gọi `GET /api/locations/provinces/{provinceCode}/wards`.
- Lưu code và name về profile:
    - `province`, `provinceName`
    - `ward`, `wardName`

Backend:

- `PUT /api/auth/me` cập nhật profile theo token.

### 8.7. Admin

Frontend `AdminPage` có 5 tab:

- Tổng quan
- Đơn hàng
- Sản phẩm
- Danh mục
- Người dùng

Backend `/api/admin/*` yêu cầu role `Admin` bằng `.RequireAuthorization("Admin")`.

Dashboard:

- Tổng đơn
- Tổng sản phẩm
- Tổng danh mục
- Tổng user
- Doanh thu từ đơn `Delivered`
- Đơn pending
- Đơn completed
- Recent orders

Quản lý đơn:

- List/filter/sort orders.
- Update status: `Pending`, `Confirmed`, `Shipping`, `Delivered`, `Cancelled`.
- Nếu chuyển sang `Cancelled` từ trạng thái khác, backend cộng lại tồn kho.
- UI khóa select nếu đơn đã `Delivered` hoặc `Cancelled`.

Quản lý sản phẩm:

- List products.
- Tạo/sửa/xóa mềm product.
- Upload ảnh Cloudinary qua `/api/images/upload`.
- Update stock.

Quản lý danh mục:

- List categories.
- Tạo/sửa/xóa mềm category.
- Backend yêu cầu slug, frontend hiện chưa gửi slug. Xem mục known gaps.

Quản lý người dùng:

- List/filter users.
- Sửa thông tin, địa chỉ, role.
- Đổi mật khẩu.
- Bật/tắt user.
- Delete user thực chất là deactivate.
- Backend không cho delete admin user.

## 9. API map

Tất cả endpoint dưới đây tính từ backend root `http://localhost:5000`.

### Common response

Đa số API backend trả wrapper:

```json
{
    "success": true,
    "data": {},
    "message": "optional",
    "error": null
}
```

Pagination:

```json
{
    "items": [],
    "totalCount": 0,
    "page": 1,
    "pageSize": 20,
    "totalPages": 0
}
```

Ngoại lệ:

- `/api/locations/*` trả array/object trực tiếp, không bọc `ApiResponse`.
- `/api/images/*` trả object trực tiếp, không bọc `ApiResponse`.

### Auth

```text
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me        Authorization required
PUT  /api/auth/me        Authorization required
```

Register request:

```json
{
    "email": "user@example.com",
    "password": "123456",
    "firstName": "Nguyen",
    "lastName": "A",
    "phone": "0900000000",
    "address": "Số 1",
    "province": "1",
    "provinceName": "Thành phố Hà Nội",
    "ward": "26734",
    "wardName": "Phường ..."
}
```

Login response data:

```json
{
    "token": "...",
    "email": "admin@tiembanh.com",
    "firstName": "Admin",
    "lastName": "User",
    "roles": ["Admin"]
}
```

### Products

```text
GET    /api/products
GET    /api/products/all
GET    /api/products/{id}
GET    /api/products/categories
POST   /api/products
PUT    /api/products/{id}
DELETE /api/products/{id}
PATCH  /api/products/{id}/status
PATCH  /api/products/{id}/stock
PATCH  /api/products/{id}/images
```

Query list:

```text
search?: string
category?: string
sortBy?: price-asc | price-desc | rating | stock | newest/default
page?: number
pageSize?: number, max 100
isActive?: boolean
```

Product payload fields:

```text
id
name
description
price
stockQuantity
category
categoryId
images
inStock
isActive
rating
createdAt
updatedAt
```

### Categories

```text
GET    /api/categories
GET    /api/categories/all
GET    /api/categories/{id}
POST   /api/categories
PUT    /api/categories/{id}
DELETE /api/categories/{id}
PATCH  /api/categories/{id}/status
```

Create/update category backend yêu cầu:

```json
{
    "name": "Bánh",
    "slug": "banh",
    "description": "optional",
    "imageUrl": "optional",
    "isActive": true
}
```

`slug` phải chữ thường, số và dấu gạch ngang.

### Orders

```text
POST /api/orders
GET  /api/orders
GET  /api/orders/{id}
```

Create order request:

```json
{
    "customerInfo": {
        "name": "Nguyen Van A",
        "phone": "0900000000",
        "email": "a@example.com"
    },
    "shippingAddress": {
        "province": "Thành phố Hà Nội",
        "ward": "Phường ...",
        "address": "Số 1, đường ABC"
    },
    "items": [{ "productId": 1, "quantity": 2 }]
}
```

Status hợp lệ:

```text
Pending
Confirmed
Shipping
Delivered
Cancelled
```

Frontend thường dùng lowercase:

```text
pending
confirmed
shipping
delivered
cancelled
```

Backend parse status case-insensitive ở admin update.

### Cart

```text
GET    /api/cart                      Authorization required
POST   /api/cart/items                Authorization required
PUT    /api/cart/items/{productId}    Authorization required
DELETE /api/cart/items/{productId}    Authorization required
DELETE /api/cart                      Authorization required
```

Request:

```json
{ "productId": 1, "quantity": 2 }
```

Nhắc lại: UI chính hiện chưa dùng các endpoint này.

### Admin

```text
GET    /api/admin/dashboard
GET    /api/admin/orders
GET    /api/admin/orders/{id}
PATCH  /api/admin/orders/{id}/status

GET    /api/admin/products
GET    /api/admin/products/{id}
POST   /api/admin/products
PUT    /api/admin/products/{id}
DELETE /api/admin/products/{id}
PATCH  /api/admin/products/{id}/status
PATCH  /api/admin/products/{id}/stock

GET    /api/admin/categories
GET    /api/admin/categories/{id}
POST   /api/admin/categories
PUT    /api/admin/categories/{id}
DELETE /api/admin/categories/{id}
PATCH  /api/admin/categories/{id}/status

GET    /api/admin/users
GET    /api/admin/users/{id}
PUT    /api/admin/users/{id}
PATCH  /api/admin/users/{id}/password
PATCH  /api/admin/users/{id}/status
DELETE /api/admin/users/{id}
```

Tất cả `/api/admin/*` cần JWT có role `Admin`.

### Images

```text
POST   /api/images/upload
DELETE /api/images/{publicId}
```

Upload:

- `multipart/form-data`
- field file đầu tiên trong form.
- query `folder`, default `products`.
- file types: JPEG, PNG, GIF, WebP.
- max size: 10MB.
- Cloudinary folder thực tế: `tiembanhbeyeu/{folder}`.

Lưu ý: endpoint images hiện `.AllowAnonymous()`. Nếu production, cần khóa lại bằng admin auth.

### Locations

```text
GET /api/locations/provinces
GET /api/locations/provinces/{provinceCode}/wards
GET /api/locations/wards/{wardCode}
```

Không yêu cầu auth.

### Dev endpoints

```text
DELETE /api/dev/clear-data
DELETE /api/dev/clear-categories
POST   /api/dev/seed-products
```

Cảnh báo:

- Các endpoint này không yêu cầu auth.
- `clear-data` và `clear-categories` xóa dữ liệu thật trong DB local.
- `seed-products` đang hard-code path `/home/quang-penguin/Code/web-store/product-seed.json`, không khớp workspace hiện tại `/home/quangtdf/Code/build-web-store`, nên khả năng cao không chạy đúng nếu chưa sửa.
- Không bật nhóm endpoint này ở production.

## 10. Data model và quan hệ DB

Bảng chính:

```text
Categories
Products
ProductImages
Users
Orders
OrderItems
Carts
CartItems
Provinces
Wards
```

Quan hệ:

- Category 1-n Product
- Product 1-n ProductImage
- Order 1-n OrderItem
- OrderItem n-1 Product
- User 1-1 Cart
- Cart 1-n CartItem
- CartItem n-1 Product
- Province 1-n Ward

Ràng buộc đáng nhớ:

- `Categories.Slug` unique.
- `Users.Email` unique.
- `Orders.OrderCode` unique.
- `Cart.UserId` unique.
- `(CartId, ProductId)` trong `CartItems` unique.
- `Wards.Code` unique.
- Product delete là soft delete: `IsDeleted = true`, `DeletedAt = now`.
- Category delete là soft delete: `DeletedAt = now`, `IsActive = false`.
- User delete trong admin là deactivate: `IsActive = false`.

## 11. Những điểm lệch giữa docs cũ và code hiện tại

Đọc phần này kỹ trước khi sửa bug, vì đây là nơi dễ mất thời gian nhất.

1. README cũ ghi Swagger ở `/swagger`, nhưng code đặt Swagger UI ở root `http://localhost:5000/`.
2. README cũ ghi admin password `Admin@123`, nhưng seeder hiện là `admin123`.
3. README/QNA có nói user mặc định, nhưng `DbSeeder` chỉ tạo admin nếu bảng users trống.
4. QNA nói bcrypt, nhưng code dùng PBKDF2 SHA256 custom.
5. Tài liệu cũ nói guest checkout, nhưng frontend checkout hiện yêu cầu đăng nhập.
6. Tài liệu cũ nói đồng bộ cart local lên server khi login, nhưng UI hiện chưa làm sync này.
7. `GET /api/orders` được comment là "current user's orders", nhưng backend chưa auth và chưa lọc theo user.
8. `Order.UserId` có trong entity nhưng chưa được set khi tạo order.
9. `/order/:id` trong frontend đang map tới `ProductDetailPage`, không phải order detail page.
10. Frontend admin category create/update chưa gửi `slug`, trong khi backend yêu cầu `slug`.
11. Endpoint image upload/delete đang anonymous, dù về nghiệp vụ chỉ admin nên dùng.
12. Dev endpoints đang anonymous và có endpoint xóa dữ liệu.
13. `product-seed.json` ở root có nhiều `images: []`; nếu seed từ file này, sản phẩm có thể thiếu ảnh.
14. `.gitignore` hiện rất ít rule, chưa ignore rõ `node_modules`, `bin`, `obj`, `dist`, `*.db`. Cần cẩn thận khi add file.

## 12. Known gaps nên ưu tiên nếu tiếp tục phát triển

### Bảo mật/nghiệp vụ

- Khóa `/api/images/*` bằng admin auth.
- Tắt hoặc bảo vệ `/api/dev/*`.
- Sửa orders API:
    - `POST /api/orders` nếu user đăng nhập thì set `UserId`.
    - `GET /api/orders` phải `RequireAuthorization`.
    - User thường chỉ thấy order của mình.
    - Admin dùng `/api/admin/orders` để xem tất cả.
- Không để Cloudinary secret trong repo.
- Cân nhắc refresh token hoặc UX login lại khi JWT hết hạn.

### Frontend correctness

- Sửa route `/order/:id` sang trang order detail thật hoặc xóa route.
- Hoàn thiện admin category form: thêm slug field hoặc auto-generate slug.
- Tích hợp server cart hoặc xóa API cart nếu quyết định chỉ dùng local cart.
- Nếu muốn guest checkout, cho checkout nhập thông tin/địa chỉ mà không cần auth.
- Nếu muốn checkout bắt login như hiện tại, cập nhật README/QNA cũ.
- Khi admin edit product, giữ đầy đủ nhiều ảnh cũ, không chỉ ảnh đầu.
- Thống nhất sort value frontend với backend:
    - frontend products page đang dùng `price-low-high`, `price-high-low`
    - backend dùng `price-asc`, `price-desc`
    - hiện trang products sort client-side nên vẫn chạy, nhưng contract không thống nhất.

### Database/devops

- Chọn một chiến lược DB startup:
    - `EnsureCreatedAsync` cho demo đơn giản, hoặc
    - `MigrateAsync` cho app có migration thật.
- Mở rộng `.gitignore`.
- Không commit DB local trừ khi cố ý dùng làm seed artifact.
- Thêm test cơ bản cho backend service/endpoints và frontend critical flows.

## 13. Quy ước khi sửa code

Backend:

- Thêm entity ở `Domain/Entities`.
- Thêm config EF ở `Infrastructure/Persistence/Configurations/EntityConfigurations.cs`.
- Thêm DTO ở đúng folder trong `DTOs`.
- Thêm API ở `Extensions/Endpoints/{Module}Endpoints.cs`.
- Map endpoint group trong `Program.cs`.
- Với API trả về cho frontend, dùng `ApiResponse<T>` trừ khi có lý do đặc biệt.
- Không trả password hash hoặc secret ra API.
- Khi thay đổi schema, tạo migration hoặc ghi rõ nếu đang chấp nhận recreate DB.

Frontend:

- API call đặt trong `src/api/{module}.ts`, không gọi Axios trực tiếp lung tung trong page trừ trường hợp nhỏ như `AddressPicker` hiện tại.
- Type contract đặt trong `src/types`.
- Page component ở `src/pages`.
- Component dùng lại ở `src/components`.
- UI primitive ở `src/components/ui`.
- Dùng alias `@/` thay vì relative path dài.
- Dùng `formatPrice`, `formatDate` thay vì format thủ công.
- Auth state lấy từ `useAuthStore`.
- Cart UI hiện lấy từ `useCart`.

Naming:

- React component: PascalCase.
- Page file hiện đang dùng kebab-case hoặc lowercase, ví dụ `product-detail.tsx`, `checkout.tsx`.
- Hooks: prefix `use`, ví dụ `use-cart.tsx`.
- Type/interface: PascalCase.

## 14. Checklist khi thêm tính năng mới

Trước khi code:

- Tính năng thuộc frontend, backend hay cả hai?
- Có cần thay đổi DB không?
- Có ảnh hưởng auth/role không?
- Có ảnh hưởng order/stock/payment không?
- Có cần cập nhật docs này không?

Khi thêm API:

- Tạo request/response DTO.
- Validate input.
- Xác định endpoint public, user auth hay admin auth.
- Dùng transaction nếu thay đổi nhiều bảng hoặc thay đổi tồn kho.
- Trả lỗi có `ApiError.Code` rõ ràng.
- Cập nhật frontend `src/api`.
- Cập nhật `src/types`.

Khi thêm UI:

- Có loading state.
- Có empty state.
- Có error state.
- Có disabled state khi đang submit.
- Không tin dữ liệu client cho các nghiệp vụ tiền/tồn kho.

Khi sửa order/stock:

- Tạo order phải kiểm tra stock trong DB.
- Tổng tiền tính ở backend.
- Hủy order phải hoàn kho đúng một lần.
- Không cho user thường sửa trạng thái order.
- Ghi rõ status transition hợp lệ nếu siết nghiệp vụ.

## 15. Troubleshooting nhanh

### Frontend gọi API lỗi CORS

Kiểm tra:

- Backend có chạy port `5000` không?
- Frontend có chạy ở `5173` hoặc `3000` không?
- `backend/appsettings.json` có origin tương ứng trong `Cors:AllowedOrigins` không?

### Frontend báo 401 sau một lúc

JWT mặc định hết hạn sau 60 phút. Axios interceptor sẽ xóa token khỏi localStorage khi nhận 401. Đăng nhập lại.

### Login admin không được

Kiểm tra DB đang dùng có user admin hay chưa. Seeder chỉ tạo admin nếu bảng `Users` trống. Nếu trước đó DB đã có users nhưng không có admin, seeder sẽ không tạo thêm admin.

Cách dev nhanh:

- Backup DB nếu cần.
- Xóa `backend/tiembanh.db`.
- Chạy lại backend để seed lại.

### Không thấy ảnh sản phẩm

Nguồn ảnh có thể là:

- URL Cloudinary nếu upload qua admin.
- Path local `/img/...` từ seed cũ.

Một số path seed trong `DbSeeder` có thể không khớp cấu trúc `frontend/public/img` hiện tại. Kiểm tra response `images` của API và file có tồn tại trong `frontend/public` hay không.

### Admin tạo danh mục bị lỗi

Backend yêu cầu `slug`, frontend form hiện chưa nhập/gửi slug. Sửa một trong hai cách:

- Thêm input slug vào form admin category.
- Hoặc backend tự generate slug từ name nếu request thiếu slug.

### Orders page thấy đơn của người khác

Đây là bug backend hiện tại. `GET /api/orders` không lọc theo user. Cần sửa trước khi dùng thật.

### `POST /api/dev/seed-products` báo không thấy file

Endpoint đang hard-code path cũ. Sửa path sang root repo hiện tại hoặc dùng `AppContext.BaseDirectory`/configuration.

### Chạy `npm run dev` bị backend port conflict

Do `npm run dev` tự chạy backend. Dừng tiến trình `dotnet run` đang chạy riêng, hoặc chạy frontend bằng `npx vite`.

## 16. Lệnh thường dùng

Frontend:

```bash
cd frontend
npm install
npm run dev
npm run build
npm run lint
npm run preview
```

Backend:

```bash
cd backend
dotnet restore
dotnet run
```

EF Core, nếu đã cài dotnet-ef:

```bash
cd backend
dotnet ef migrations add TenMigrationMoi
dotnet ef database update
```

Kiểm tra nhanh API:

```bash
curl http://localhost:5000/api/health
curl http://localhost:5000/api/products
```

## 17. Test coverage hiện tại

Repo có dependency test ở frontend (`vitest`, `@testing-library/react`) nhưng hiện chưa thấy test source thực tế trong `frontend/src`.

Backend hiện chưa có test project trong solution.

Nếu thêm test, ưu tiên:

1. Backend order creation: kiểm tra trừ kho, thiếu stock, total amount.
2. Backend cancel order: hoàn kho đúng.
3. Auth: register/login/me.
4. Admin authorization: user thường không gọi được `/api/admin/*`.
5. Frontend cart hook: add/update/remove/clear.
6. Checkout: không cho submit nếu thiếu address, clear cart khi thành công.

## 18. Hướng phát triển nếu biến demo thành sản phẩm thật

Tối thiểu cần làm:

- Secret management đúng chuẩn.
- Auth/order authorization đúng.
- Payment thật hoặc quy trình COD rõ.
- Logging và error monitoring.
- Backup DB.
- Dùng DB server như PostgreSQL/SQL Server thay vì SQLite nếu nhiều người dùng.
- CI chạy lint/build/test.
- Upload image chỉ cho admin.
- Rate limit cho login/upload.
- Validate file upload kỹ hơn.
- Seed/dev endpoints chỉ bật ở Development.
- Cập nhật chính sách `.gitignore`.

## 19. Người mới nên đọc code theo thứ tự này

1. `PROJECT_HANDOVER.md`
2. `backend/Program.cs`
3. `backend/Infrastructure/Persistence/AppDbContext.cs`
4. `backend/Infrastructure/Persistence/Configurations/EntityConfigurations.cs`
5. `backend/Infrastructure/Persistence/DbSeeder.cs`
6. `backend/Domain/Entities/*.cs`
7. `backend/Extensions/Endpoints/AuthEndpoints.cs`
8. `backend/Extensions/Endpoints/ProductEndpoints.cs`
9. `backend/Extensions/Endpoints/OrderEndpoints.cs`
10. `backend/Extensions/Endpoints/AdminEndpoints.cs`
11. `frontend/src/App.tsx`
12. `frontend/src/api/axios.ts`
13. `frontend/src/stores/auth-store.ts`
14. `frontend/src/hooks/use-cart.tsx`
15. `frontend/src/pages/products.tsx`
16. `frontend/src/pages/product-detail.tsx`
17. `frontend/src/pages/cart.tsx`
18. `frontend/src/pages/checkout.tsx`
19. `frontend/src/pages/profile.tsx`
20. `frontend/src/pages/orders.tsx`
21. `frontend/src/pages/admin/index.tsx`
