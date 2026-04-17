# Backend API Summary - For Frontend Development

## Project Structure

```
backend/
├── Domain/Entities/          # Database entities
│   ├── User.cs
│   ├── Product.cs
│   ├── Category.cs
│   ├── Order.cs, OrderItem.cs
│   └── Cart.cs, CartItem.cs
├── DTOs/                     # Data Transfer Objects (API request/response)
│   ├── Auth/AuthDto.cs
│   ├── Products/ProductDto.cs
│   ├── Categories/CategoryDto.cs
│   ├── Orders/OrderDto.cs
│   ├── Cart/CartDto.cs
│   └── Common/ApiResponse.cs
├── Extensions/Endpoints/     # API endpoint definitions
│   ├── AuthEndpoints.cs
│   ├── ProductEndpoints.cs
│   ├── CategoryEndpoints.cs
│   ├── OrderEndpoints.cs
│   ├── CartEndpoints.cs
│   └── AdminEndpoints.cs
└── Infrastructure/           # Database, services
    ├── Persistence/
    └── Services/
```

## Entities (Database Models)

### User
| Field | Type | Description |
|-------|------|-------------|
| Id | int | Primary key |
| Email | string | Unique email |
| PasswordHash | string | Hashed password |
| FirstName | string | First name |
| LastName | string | Last name |
| Phone | string? | Phone number |
| Address | string? | Address |
| Province | string | Province/City |
| District | string | District |
| Ward | string | Ward/Commune |
| Roles | string | "User" or "Admin" (comma-separated) |
| CreatedAt | DateTime | Creation timestamp |
| IsActive | bool | Account active status |

### Product
| Field | Type | Description |
|-------|------|-------------|
| Id | int | Primary key |
| Name | string | Product name |
| Description | string | Product description |
| Price | decimal | Price (VND) |
| StockQuantity | int | Available stock |
| CategoryId | int | Foreign key to Category |
| InStock | bool | Computed (StockQuantity > 0) |
| IsActive | bool | Active status |
| IsDeleted | bool | Soft delete flag |
| Rating | double? | Product rating (1-5) |
| Images | ICollection<ProductImage> | List of images |

### Category
| Field | Type | Description |
|-------|------|-------------|
| Id | int | Primary key |
| Name | string | Category name |
| Slug | string | URL-friendly slug (e.g., "banh-ngot") |
| Description | string? | Category description |
| ImageUrl | string? | Category image URL |
| IsActive | bool | Active status |
| Products | ICollection<Product> | Products in category |

### Order
| Field | Type | Description |
|-------|------|-------------|
| Id | int | Primary key |
| OrderCode | string | Unique order code (ORD-yyyyMMddHHmmss-xxxx) |
| CustomerName | string | Customer name |
| CustomerPhone | string | Customer phone |
| CustomerEmail | string | Customer email |
| Province | string | Shipping province |
| District | string | Shipping district |
| Ward | string | Shipping ward |
| Address | string | Shipping address |
| TotalAmount | decimal | Total order amount |
| Status | OrderStatus | Order status enum |
| Items | ICollection<OrderItem> | Order items |

**OrderStatus**: `Pending` → `Confirmed` → `Shipping` → `Delivered` | `Cancelled`

### Cart & CartItem
- Cart: One-to-one with User
- CartItem: Product + Quantity

---

## API Endpoints

### Authentication (`/api/auth`)

#### POST /api/auth/register
**Request:**
```json
{
  "email": "user@example.com",
  "password": "123456",
  "firstName": "Nguyen",
  "lastName": "Van A",
  "phone": "0912345678",
  "address": "123 Street",
  "province": "TP HCM",
  "district": "Quan 1",
  "ward": "Phuong Ben Nghe"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJ...",
    "email": "user@example.com",
    "firstName": "Nguyen",
    "lastName": "Van A",
    "roles": ["User"],
    "phone": "0912345678",
    "address": "123 Street",
    "province": "TP HCM",
    "district": "Quan 1",
    "ward": "Phuong Ben Nghe"
  }
}
```

#### POST /api/auth/login
**Request:**
```json
{
  "email": "user@example.com",
  "password": "123456"
}
```

**Response:** Same as register (with token)

#### GET /api/auth/me
- Requires Authorization header (Bearer token)
- Returns current user info

#### PUT /api/auth/me
**Request:**
```json
{
  "firstName": "NewFirstName",
  "lastName": "NewLastName",
  "phone": "0912345678",
  "address": "456 Street",
  "province": "TP HCM",
  "district": "Quan 2",
  "ward": "Phuong Thao Dien"
}
```

---

### Products (`/api/products`)

#### GET /api/products
- Query params: `search`, `category`, `sortBy`, `page`, `pageSize`, `isActive`
- `sortBy`: `price-asc`, `price-desc`, `rating`, `stock`, `newest` (default)
- Returns paginated list

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": 1,
        "name": "Bánh Sinh Nhật",
        "description": "...",
        "price": 250000,
        "stockQuantity": 10,
        "category": "Bánh Ngọt",
        "categoryId": 1,
        "images": ["url1", "url2"],
        "inStock": true,
        "isActive": true,
        "rating": 4.5,
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-01T00:00:00Z"
      }
    ],
    "page": 1,
    "pageSize": 20,
    "totalCount": 50,
    "totalPages": 3
  }
}
```

#### GET /api/products/{id}
- Returns single product details

#### GET /api/products/categories
- Returns list of category names for filtering

---

### Categories (`/api/categories`)

#### GET /api/categories
- Query params: `search`, `isActive`, `page`, `pageSize`

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": 1,
        "name": "Bánh Ngọt",
        "slug": "banh-ngot",
        "description": "...",
        "imageUrl": "https://...",
        "isActive": true,
        "productCount": 15,
        "createdAt": "...",
        "updatedAt": "..."
      }
    ],
    "page": 1,
    "pageSize": 20,
    "totalCount": 5,
    "totalPages": 1
  }
}
```

#### GET /api/categories/all
- Returns all categories (no pagination) - for dropdowns

---

### Orders (`/api/orders`)

#### POST /api/orders
**Request:**
```json
{
  "customerInfo": {
    "name": "Nguyen Van A",
    "phone": "0912345678",
    "email": "user@example.com"
  },
  "shippingAddress": {
    "province": "TP HCM",
    "district": "Quan 1",
    "ward": "Phuong Ben Nghe",
    "address": "123 Duong ABC"
  },
  "items": [
    { "productId": 1, "quantity": 2 },
    { "productId": 3, "quantity": 1 }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "orderId": 1,
    "orderCode": "ORD-20240417120000-1234",
    "totalAmount": 500000,
    "estimatedDelivery": "2024-04-20T00:00:00Z"
  }
}
```

#### GET /api/orders/{id}
- Returns order details with items

---

### Cart (`/api/cart`) - Requires Auth

#### GET /api/cart

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "userId": 1,
    "items": [
      {
        "id": 1,
        "productId": 1,
        "productName": "Bánh Sinh Nhật",
        "productImage": "https://...",
        "productPrice": 250000,
        "quantity": 2,
        "subtotal": 500000
      }
    ],
    "totalItems": 2,
    "totalAmount": 500000,
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

#### POST /api/cart/items
**Request:**
```json
{
  "productId": 1,
  "quantity": 2
}
```

#### PUT /api/cart/items/{productId}
**Request:**
```json
{
  "quantity": 3
}
```

#### DELETE /api/cart/items/{productId}
- Remove single item

#### DELETE /api/cart
- Clear entire cart

---

### Admin (`/api/admin`) - Requires Admin Role

#### GET /api/admin/dashboard
- Returns stats: totalOrders, totalProducts, totalCategories, totalUsers, totalRevenue, pendingOrders, completedOrders, recentOrders

#### GET /api/admin/orders
- Query params: `status`, `search`, `page`, `pageSize`

#### PATCH /api/admin/orders/{id}/status
**Request:**
```json
{
  "status": "Confirmed" // Pending, Confirmed, Shipping, Delivered, Cancelled
}
```

#### GET /api/admin/products
#### GET /api/admin/categories
#### GET /api/admin/users
- All support pagination and filtering

---

## Common API Response Format

```json
{
  "success": true,
  "data": { ... },
  "message": "Success message",
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description"
  }
}
```

---

## Frontend TypeScript Interface Notes

### User Interface
```typescript
interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  phone?: string;
  address?: string;
  province: string;
  district: string;
  ward: string;
  createdAt: string;
}
```

### Product Interface
```typescript
interface Product {
  id: number;
  name: string;
  description: string;
  price: number; // VND
  stockQuantity: number;
  category: string;
  categoryId: number;
  images: string[]; // Array of image URLs
  inStock: boolean;
  isActive: boolean;
  rating?: number;
  createdAt: string;
  updatedAt: string;
}
```

### Order Interface
```typescript
interface Order {
  id: number;
  orderCode: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  shippingAddress: {
    province: string;
    district: string;
    ward: string;
    address: string;
  };
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'shipping' | 'delivered' | 'cancelled';
  createdAt: string;
  items: {
    productId: number;
    productName: string;
    productPrice: number;
    quantity: number;
  }[];
}
```

### Address Fields
Frontend should provide address picker with:
- Province/Tỉnh
- District/Quận/Huyện
- Ward/Phường/Xã
- Address detail (street, number)

---

## Authentication

- JWT Token in Authorization header: `Authorization: Bearer <token>`
- Token contains: userId, email, roles
- Protected endpoints require valid token
- Admin endpoints require role "Admin"

---

## Image Handling

- Products have multiple images stored as URLs
- First image (SortOrder=0) is primary
- Frontend should handle image loading/fallback
- Categories can have optional ImageUrl