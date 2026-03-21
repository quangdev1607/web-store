# 🧁 Tiệm Bánh Bé Yêu - Frontend

Một ứng dụng web thương mại điện tử (e-commerce) dành cho cửa hàng bánh kẹo hữu cơ dành riêng cho trẻ em.

![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css)

## 📖 Mục Lục

- [Giới Thiệu](#giới-thiệu)
- [Tính Năng](#tính-năng)
- [Công Nghệ Sử Dụng](#công-nghệ-sử-dụng)
- [Cấu Trúc Dự Án](#cấu-trúc-dự-án)
- [Hướng Dẫn Cài Đặt](#hướng-dẫn-cài-đặt)
- [Scripts](#scripts)
- [Design System](#design-system)
- [Contributing](#contributing)

---

## 🎯 Giới Thiệu

**Tiệm Bánh Bé Yêu** là một ứng dụng web e-commerce được xây dựng với mục tiêu cung cấp trải nghiệm mua sắm bánh kẹo hữu cơ an toàn và thân thiện cho trẻ em. Giao diện được thiết kế với màu sắc ấm áp, dễ thương, phù hợp với đối tượng phụ huynh có con nhỏ.

### Đối Tượng Sử Dụng

- 👨‍👩‍👧 Phụ huynh có con em trong độ tuổi ăn dặm và phát triển
- 🛒 Người mua sắm quan tâm đến sản phẩm hữu cơ, an toàn cho trẻ em

---

## ✨ Tính Năng

| Tính năng | Mô tả |
|-----------|-------|
| 🛍️ **Danh sách sản phẩm** | Xem, tìm kiếm, lọc và sắp xếp sản phẩm theo nhiều tiêu chí |
| 🔍 **Tìm kiếm** | Tìm kiếm sản phẩm theo tên và mô tả |
| 📂 **Lọc theo danh mục** | Lọc sản phẩm theo loại (Kẹo, Bánh, Đồ uống...) |
| ⭐ **Sắp xếp** | Theo giá (cao → thấp, thấp → cao), đánh giá |
| 🛒 **Giỏ hàng** | Thêm/bớt sản phẩm, cập nhật số lượng |
| 📦 **Chi tiết sản phẩm** | Xem hình ảnh, mô tả, giá, đánh giá |
| 💳 **Thanh toán** | Form đặt hàng với địa chỉ giao hàng (API Tỉnh/Quận/Xã) |
| 📱 **Responsive** | Tương thích mobile, tablet, desktop |

---

## 🛠️ Công Nghệ Sử Dụng

### Core Technologies

| Công nghệ | Phiên bản | Mục đích |
|-----------|----------|----------|
| **React** | 19.2.4 | Thư viện UI chính |
| **TypeScript** | 5.9 | Type safety |
| **Vite** | 8.0 | Build tool & dev server |
| **Tailwind CSS** | 3.4 | Styling framework |

### State Management

- **React Context API** - Quản lý state giỏ hàng toàn cục
- **Local State (useState)** - Quản lý state cục bộ của components

### UI Components

| Thư viện | Mục đích |
|----------|----------|
| **Radix UI** | Các primitive components (Select, Dropdown, Dialog...) |
| **Lucide React** | Icon library |
| **clsx + tailwind-merge** | Class name utilities |

### Routing

- **React Router DOM** v7 - Client-side routing

### Development Tools

| Tool | Mục đích |
|------|----------|
| **ESLint** | Code linting |
| **Vitest** | Testing framework |

---

## 📁 Cấu Trúc Dự Án

```
frontend/
├── public/                          # Static assets (không qua build)
│   ├── img/                        # Hình ảnh sản phẩm theo danh mục
│   ├── logo.png                    # Logo cửa hàng
│   └── background.jpg              # Hình nền trang chủ
│
├── src/                            # Source code chính
│   ├── components/                 # React components
│   │   ├── ui/                    # Generic UI components (reusable)
│   │   │   ├── button.tsx         # Button component
│   │   │   ├── card.tsx           # Card component
│   │   │   ├── input.tsx          # Input component
│   │   │   ├── select.tsx         # Select dropdown
│   │   │   └── image.tsx          # Image component với fallback
│   │   └── shared/                # Domain-specific shared components
│   │       ├── layout.tsx         # Main layout (header + main content)
│   │       └── product-card.tsx    # Product display card
│   │
│   ├── pages/                      # Page components (route destinations)
│   │   ├── home.tsx               # Trang chủ
│   │   ├── products.tsx           # Danh sách sản phẩm
│   │   ├── product-detail.tsx     # Chi tiết sản phẩm
│   │   ├── cart.tsx               # Trang giỏ hàng
│   │   ├── checkout.tsx            # Trang thanh toán
│   │   └── not-found.tsx          # Trang 404
│   │
│   ├── hooks/                     # Custom React hooks
│   │   └── use-cart.tsx           # Cart state management hook
│   │
│   ├── lib/                       # Utilities và helpers
│   │   └── utils.ts               # Common utilities (cn, formatPrice...)
│   │
│   ├── mocks/                     # Mock data cho development
│   │   └── products.ts            # Danh sách sản phẩm mẫu
│   │
│   ├── types/                     # TypeScript type definitions
│   │   └── product.ts             # Product interface
│   │
│   ├── App.tsx                    # Main app component với routing
│   ├── main.tsx                   # Entry point
│   └── index.css                  # Global styles + Tailwind config
│
├── index.html                      # HTML entry point
├── package.json                    # Dependencies
├── tsconfig.json                   # TypeScript configuration
├── vite.config.ts                  # Vite configuration
├── tailwind.config.cjs             # Tailwind configuration
└── eslint.config.js               # ESLint configuration
```

### Quy Ước Đặt Tên Files

| Loại | Quy ước | Ví dụ |
|------|---------|-------|
| Components | PascalCase | `ProductCard.tsx`, `Layout.tsx` |
| Hooks | camelCase + prefix `use` | `useCart.tsx` |
| Utils/Functions | camelCase | `utils.ts`, `formatPrice()` |
| Pages | kebab-case | `product-detail.tsx`, `not-found.tsx` |
| Constants | SCREAMING_SNAKE_CASE | `API_BASE_URL` |

---

## 🚀 Hướng Dẫn Cài Đặt

### Yêu Cầu

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0 (hoặc yarn/pnpm)

### Các Bước Cài Đặt

```bash
# 1. Di chuyển vào thư mục frontend
cd frontend

# 2. Cài đặt dependencies
npm install

# 3. Chạy development server
npm run dev

# 4. Mở trình duyệt
# http://localhost:5173
```

### Build Cho Production

```bash
# Build production bundle
npm run build

# Preview production build
npm run preview
```

---

## 📜 Scripts

| Script | Mô tả |
|--------|-------|
| `npm run dev` | Khởi chạy development server với HMR |
| `npm run build` | Build production bundle (type-check + Vite build) |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Chạy ESLint để kiểm tra code style |

---

## 🎨 Design System

### Color Palette (CSS Variables)

```css
/* Sử dụng trong code: bg-primary, text-primary-foreground */

--primary:          /* Vàng mật ong - Màu chính của thương hiệu */
--primary-foreground: /* Nâu đậm - Text trên nền primary */
--background:       /* Kem nhạt - Nền chính */
--foreground:       /* Nâu - Text chính */
--secondary:        /* Kem đậm - Nền secondary */
--muted:            /* Xám nhạt - Text muted */
--destructive:      /* Đỏ - Thông báo lỗi */
--border:           /* Viền nhẹ */
```

### Typography

- **Font Family**: Nunito (Google Fonts)
- **Headings**: Bold, sizes từ xl đến 4xl
- **Body**: Regular, text-sm đến text-lg

### Spacing & Layout

- **Container**: `max-w-7xl`, centered
- **Padding**: `px-4 sm:px-6 lg:px-8`
- **Border Radius**: `rounded-2xl` (16px) làm mặc định

### Component Patterns

#### 1. UI Components (`/components/ui/`)

Các components generic, có thể tái sử dụng ở bất kỳ đâu:

```tsx
// Ví dụ sử dụng Button
import { Button } from '@/components/ui/button';

<Button variant="default" size="lg">Text</Button>
```

**Variants**: `default`, `destructive`, `outline`, `secondary`, `ghost`, `link`
**Sizes**: `default`, `sm`, `lg`, `icon`

#### 2. Shared Components (`/components/shared/`)

Components domain-specific, gắn liền với business logic:

```tsx
// Ví dụ ProductCard
import { ProductCard } from '@/components/shared/product-card';

<ProductCard product={product} />
```

#### 3. Page Components (`/pages/`)

Components đại diện cho một trang/route:

```tsx
// App.tsx
<Route path="/products" element={<ProductsPage />} />
```

---

## 🔌 API Integration

### External APIs

| API | Mục đích | Endpoint |
|-----|----------|----------|
| **Vietnam Provinces API** | Lấy danh sách Tỉnh/Quận/Xã cho checkout | `https://provinces.open-api.vn/api/` |

### Internal Data

- **Mock Products**: Dữ liệu sản phẩm mẫu trong `/src/mocks/products.ts`
- **Cart State**: Quản lý bằng React Context (`useCart` hook)

---

## 📝 Contributing

Xem [CONTRIBUTING.md](./CONTRIBUTING.md) để biết thêm chi tiết về:

- Code style conventions
- Naming conventions  
- Git commit message format
- Pull request process

---

## 📚 Tài Liệu Thêm

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Chi tiết về kiến trúc và design patterns
- [CONTRIBUTING.md](./CONTRIBUTING.md) - Hướng dẫn đóng góp

---

## 👥 Team

Frontend được phát triển và bảo trì bởi team development.

---

## 📄 License

Private project - All rights reserved.
