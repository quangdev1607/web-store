# 🏗️ Tiệm Bánh Bé Yêu - System Architecture

> **Document này dành cho Backend Team**  
> Mô tả kiến trúc hệ thống, API specifications, và data models để backend có thể thiết kế database schema và API endpoints.

---

## 📋 Mục Lục

- [Tổng Quan Hệ Thống](#tổng-quan-hệ-thống)
- [Architecture Overview](#architecture-overview)
- [Data Models](#data-models)
- [API Specifications](#api-specifications)
- [Frontend Integration Points](#frontend-integration-points)
- [Cart & Session Management](#cart--session-management)
- [Authentication (Future)](#authentication-future)

---

## 🌐 Tổng Quan Hệ Thống

```
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│                 │      │                 │      │                 │
│    Frontend     │◄────►│     Backend     │◄────►│    Database     │
│   (React 19)    │      │   (ASP.NET 8)   │      │    (SQLite)     │
│                 │      │                 │      │                 │
└─────────────────┘      └─────────────────┘      └─────────────────┘
        │                        │
        │                        ▼
        │                ┌─────────────────┐
        │                │  External APIs  │
        │                │ (Vietnam Prov.) │
        └───────────────►└─────────────────┘
```

### Technology Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 19 + TypeScript + Vite + Tailwind CSS |
| **Backend** | ASP.NET Core 8 (Minimal APIs) |
| **Database** | SQLite |
| **Address API** | Vietnam Provinces Open API |

---

## 🏛️ Architecture Overview

### Frontend Structure

```
frontend/src/
├── pages/                    # Route destinations
│   ├── home.tsx             # Landing page
│   ├── products.tsx         # Product listing (search, filter, sort)
│   ├── product-detail.tsx   # Single product view
│   ├── cart.tsx             # Shopping cart
│   └── checkout.tsx          # Checkout & order
│
├── components/
│   ├── ui/                  # Generic UI components (shadcn-like)
│   └── shared/              # Domain components (Layout, ProductCard)
│
├── hooks/
│   └── use-cart.tsx         # Cart state management (Context API)
│
├── lib/
│   └── utils.ts             # Utilities (formatPrice, cn)
│
├── mocks/
│   └── products.ts          # Mock data (REPLACE WITH API CALLS)
│
└── types/
    └── product.ts           # TypeScript interfaces
```

### State Management

- **Cart State**: React Context API (`CartProvider`)
- **Server State**: Tươ lai nên dùng React Query hoặc SWR
- **Form State**: Local useState

---

## 📦 Data Models

### Product

```typescript
// Frontend TypeScript Interface
interface Product {
  id: string;           // UUID
  name: string;         // "Kẹo mút trị ho hữu cơ cho bé"
  description: string;  // Detailed product description
  price: number;        // Price in VND (e.g., 35000)
  category: string;      // "Kẹo" | "Bánh" | "Đồ uống"
  images: string[];     // Array of image URLs
  inStock: boolean;      // Stock availability
  rating?: number;      // 0-5 (optional)
}
```

### Database Schema (SQLite)

```sql
-- Products Table
CREATE TABLE Products (
    Id TEXT PRIMARY KEY,                    -- UUID (stored as TEXT in SQLite)
    Name TEXT NOT NULL,
    Description TEXT,
    Price REAL NOT NULL,                    -- SQLite uses REAL for decimal
    CategoryId INTEGER NOT NULL,
    InStock INTEGER NOT NULL DEFAULT 1,     -- SQLite uses INTEGER (0/1)
    Rating REAL,                            -- 0.00 - 5.00
    CreatedAt TEXT DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (CategoryId) REFERENCES Categories(Id)
);

-- Product Images Table
CREATE TABLE ProductImages (
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
    ProductId TEXT NOT NULL,
    ImageUrl TEXT NOT NULL,
    SortOrder INTEGER DEFAULT 0,
    FOREIGN KEY (ProductId) REFERENCES Products(Id)
);

-- Categories Table
CREATE TABLE Categories (
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
    Name TEXT NOT NULL,                     -- "Kẹo", "Bánh", "Đồ uống"
    Slug TEXT NOT NULL UNIQUE
);

-- Index for faster product queries
CREATE INDEX idx_products_category ON Products(CategoryId);
CREATE INDEX idx_products_rating ON Products(Rating);
```

### Cart Item (Frontend)

```typescript
// Frontend TypeScript Interface
interface CartItem {
  product: Product;    // Product details
  quantity: number;    // Quantity in cart
}

// Cart Context API
interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, quantity: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}
```

### Order (Checkout)

```typescript
// Frontend TypeScript Interface
interface Order {
  id: string;                    // Generated on backend
  items: CartItem[];             // Products ordered
  customerInfo: CustomerInfo;     // Customer details
  shippingAddress: ShippingAddress;
  totalAmount: number;           // Calculated on backend
  status: OrderStatus;           // "pending" | "confirmed" | "shipped" | "delivered"
  createdAt: Date;
}

interface CustomerInfo {
  name: string;      // "Nguyễn Văn A"
  phone: string;     // "0912345678"
  email: string;     // "email@example.com"
}

interface ShippingAddress {
  provinceCode: string;    // "01" (Hà Nội)
  provinceName: string;     // "Hà Nội"
  districtCode: string;     // "001"
  districtName: string;    // "Ba Đình"
  wardCode: string;         // "00001"
  wardName: string;         // "Phường Điện Biên"
  address: string;          // "Số 123, Đường ABC"
}
```

### Database Schema (Orders - SQLite)

```sql
-- Orders Table
CREATE TABLE Orders (
    Id TEXT PRIMARY KEY,                     -- UUID
    CustomerName TEXT NOT NULL,
    CustomerPhone TEXT NOT NULL,
    CustomerEmail TEXT NOT NULL,
    
    ProvinceCode TEXT NOT NULL,
    ProvinceName TEXT NOT NULL,
    DistrictCode TEXT NOT NULL,
    DistrictName TEXT NOT NULL,
    WardCode TEXT NOT NULL,
    WardName TEXT NOT NULL,
    AddressDetail TEXT NOT NULL,
    
    TotalAmount REAL NOT NULL,
    Status TEXT NOT NULL DEFAULT 'pending', -- pending, confirmed, shipped, delivered
    CreatedAt TEXT DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Order Items Table
CREATE TABLE OrderItems (
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
    OrderId TEXT NOT NULL,
    ProductId TEXT NOT NULL,
    ProductName TEXT NOT NULL,              -- Denormalized for history
    ProductPrice REAL NOT NULL,              -- Price at time of order
    Quantity INTEGER NOT NULL,
    FOREIGN KEY (OrderId) REFERENCES Orders(Id),
    FOREIGN KEY (ProductId) REFERENCES Products(Id)
);

-- Index for faster order lookups
CREATE INDEX idx_orders_customer ON Orders(CustomerEmail);
CREATE INDEX idx_orders_status ON Orders(Status);
CREATE INDEX idx_orderitems_order ON OrderItems(OrderId);
```

---

## 🔌 API Specifications

### Base URL

```
Development: http://localhost:5000/api
Production:  /api
```

### Response Format

```typescript
// Success Response
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}

// Error Response
{
  "success": false,
  "error": {
    "code": "PRODUCT_NOT_FOUND",
    "message": "Sản phẩm không tồn tại"
  }
}
```

---

### 1. Products API

#### GET /api/products
Get all products with optional filtering.

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `search` | string | No | Search by name or description |
| `category` | string | No | Filter by category name |
| `sortBy` | string | No | `price-asc`, `price-desc`, `rating` |
| `page` | int | No | Page number (default: 1) |
| `pageSize` | int | No | Items per page (default: 20) |

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "1",
        "name": "Kẹo mút trị ho hữu cơ cho bé",
        "description": "Kẹo mút trị ho...",
        "price": 35000,
        "category": "Kẹo",
        "images": ["/img/keo-mut-tri-ho-1.jpg"],
        "inStock": true,
        "rating": 4.5
      }
    ],
    "totalCount": 6,
    "page": 1,
    "pageSize": 20,
    "totalPages": 1
  }
}
```

#### GET /api/products/:id
Get single product by ID.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "1",
    "name": "Kẹo mút trị ho hữu cơ cho bé",
    "description": "Kẹo mút trị ho...",
    "price": 35000,
    "category": "Kẹo",
    "images": [
      "/img/kẹo mút trị ho/keo-mut-tri-ho-1.jpg",
      "/img/kẹo mút trị ho/keo-mut-tri-ho-2.jpg"
    ],
    "inStock": true,
    "rating": 4.5
  }
}
```

#### GET /api/products/categories
Get all product categories.

**Response:**
```json
{
  "success": true,
  "data": ["Kẹo", "Bánh", "Đồ uống"]
}
```

---

### 2. Cart API (Future - Optional)

> **Note:** Frontend hiện tại dùng local state (Context API).  
> API cart là optional - chỉ cần nếu muốn persist cart across devices.

#### Endpoints (Optional)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cart` | Get user's cart |
| POST | `/api/cart/items` | Add item to cart |
| PUT | `/api/cart/items/:productId` | Update quantity |
| DELETE | `/api/cart/items/:productId` | Remove item |
| DELETE | `/api/cart` | Clear cart |

---

### 3. Orders API

#### POST /api/orders
Create a new order (checkout).

**Request Body:**
```json
{
  "customerInfo": {
    "name": "Nguyễn Văn A",
    "phone": "0912345678",
    "email": "email@example.com"
  },
  "shippingAddress": {
    "provinceCode": "01",
    "districtCode": "001",
    "wardCode": "00001",
    "address": "Số 123, Đường ABC"
  },
  "items": [
    { "productId": "1", "quantity": 2 },
    { "productId": "3", "quantity": 1 }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "orderId": "ORD-ABC12345",
    "totalAmount": 110000,
    "estimatedDelivery": "2026-03-24"
  },
  "message": "Đặt hàng thành công!"
}
```

#### GET /api/orders/:id (Future)
Get order details by ID.

---

### 4. Address API (Vietnam Provinces)

> **Note:** Frontend hiện tại dùng external API `https://provinces.open-api.vn/api/`  
> Backend có thể cache hoặc replicate API này.

#### Backend Option A: Proxy External API
```csharp
app.MapGet("/api/addresses/provinces", async () =>
{
    // Proxy to external API or return from cache
});
```

#### Backend Option B: Own Database (SQLite)
```sql
-- Provinces Table
CREATE TABLE Provinces (
    Code TEXT PRIMARY KEY,                  -- e.g., "01"
    Name TEXT NOT NULL                       -- e.g., "Hà Nội"
);

-- Districts Table  
CREATE TABLE Districts (
    Code TEXT PRIMARY KEY,                  -- e.g., "001"
    ProvinceCode TEXT NOT NULL,              -- Foreign key to Provinces
    Name TEXT NOT NULL,                     -- e.g., "Ba Đình"
    FOREIGN KEY (ProvinceCode) REFERENCES Provinces(Code)
);

-- Wards Table
CREATE TABLE Wards (
    Code TEXT PRIMARY KEY,                  -- e.g., "00001"
    DistrictCode TEXT NOT NULL,              -- Foreign key to Districts
    Name TEXT NOT NULL,                     -- e.g., "Phường Điện Biên"
    FOREIGN KEY (DistrictCode) REFERENCES Districts(Code)
);

-- Indexes for faster address lookups
CREATE INDEX idx_districts_province ON Districts(ProvinceCode);
CREATE INDEX idx_wards_district ON Wards(DistrictCode);
```

**API Endpoints:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/addresses/provinces` | Get all provinces |
| GET | `/api/addresses/provinces/:code/districts` | Get districts by province |
| GET | `/api/addresses/districts/:code/wards` | Get wards by district |

---

## 🔗 Frontend Integration Points

### Current Mock Data Usage

Frontend hiện tại sử dụng mock data từ `/src/mocks/products.ts`:

```typescript
// Current mock data structure
export const mockProducts: Product[] = [...];

export const getProductById = (id: string): Product | undefined => {...};
export const getProductsByCategory = (category: string): Product[] => {...};
```

### Migration Path

1. **Phase 1: Replace Mock with API**
   ```typescript
   // src/mocks/products.ts → src/api/products.ts
   import { apiClient } from '@/lib/api-client';
   
   export const getProducts = async (): Promise<Product[]> => {
     const response = await apiClient.get('/products');
     return response.data.items;
   };
   ```

2. **Phase 2: Add React Query/SWR** (optional)

### API Client Pattern

```typescript
// src/lib/api-client.ts
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiClient {
  private baseUrl = API_BASE_URL;

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const url = new URL(`${this.baseUrl}${endpoint}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) url.searchParams.append(key, String(value));
      });
    }
    const response = await fetch(url.toString());
    if (!response.ok) throw new ApiError(response);
    return response.json();
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new ApiError(response);
    return response.json();
  }
}

export const apiClient = new ApiClient();
```

---

## 🛒 Cart & Session Management

### Current Approach (Local State)

```typescript
// use-cart.tsx - Current implementation uses React Context
const CartContext = createContext<CartContextType | undefined>(undefined);
```

### Future Enhancement Options

| Option | Pros | Cons |
|--------|------|------|
| **LocalStorage + Context** | Simple, no backend needed | Can't sync across devices |
| **Session-based Cart API** | Persistent, syncable | More complex |
| **JWT + Database Cart** | Full user accounts | Significant complexity |

---

## 🔐 Authentication (Future)

> **Not implemented yet** - Frontend is currently public (no login required).

### Suggested Auth Flow

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  addresses: ShippingAddress[];
}

// Auth Endpoints (Future)
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
```

---

## 📊 Summary for Backend Team

> **Database**: SQLite  
> **ORM Recommendation**: Entity Framework Core with SQLite provider

### Must Have (MVP)

| API | Method | Endpoint | Priority |
|-----|--------|----------|----------|
| Products List | GET | `/api/products` | 🔴 High |
| Product Detail | GET | `/api/products/:id` | 🔴 High |
| Categories | GET | `/api/products/categories` | 🔴 High |
| Create Order | POST | `/api/orders` | 🔴 High |

### Should Have

| API | Method | Endpoint | Priority |
|-----|--------|----------|----------|
| Address Lookup | GET | `/api/addresses/provinces` | 🟡 Medium |
| Address Districts | GET | `/api/addresses/provinces/:code/districts` | 🟡 Medium |
| Address Wards | GET | `/api/addresses/districts/:code/wards` | 🟡 Medium |

### Nice to Have (Future)

| API | Description | Priority |
|-----|-------------|----------|
| Cart API | Sync cart across devices | 🟢 Low |
| Order History | View past orders | 🟢 Low |
| User Authentication | Login/Register | 🟢 Low |
| Product Reviews | Add ratings | 🟢 Low |

---

## 📝 Notes

1. **Database**: SQLite - Key differences from SQL Server:
   - Use `TEXT` instead of `NVARCHAR` (SQLite doesn't have VARCHAR/NVARCHAR)
   - Use `INTEGER` for auto-increment primary keys (`AUTOINCREMENT`)
   - Use `REAL` instead of `DECIMAL` for floating-point numbers
   - Use `INTEGER` for boolean values (0 = false, 1 = true)
   - Use `TEXT` for datetime (ISO 8601 format: `YYYY-MM-DD HH:MM:SS`)
   - Foreign keys require `PRAGMA foreign_keys = ON` to be enforced

2. **Images**: Frontend expect image URLs as strings. Can be relative paths (`/img/...`) or full URLs.

3. **Price Currency**: All prices in Vietnamese Dong (VND). Frontend formats as `35,000 VNĐ`.

4. **Error Handling**: All APIs should return consistent error format with meaningful messages.

5. **CORS**: Configure CORS to allow frontend origin (default: `http://localhost:5173` for dev).

---

*Last Updated: March 2026*
