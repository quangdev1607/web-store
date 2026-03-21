# 📖 Contributing Guidelines

> Hướng dẫn đóng góp cho frontend **Tiệm Bánh Bé Yêu**.  
> Áp dụng cho tất cả thành viên team frontend và những ai muốn đóng góp.

---

## 📋 Mục Lục

- [Code Style](#code-style)
- [Naming Conventions](#naming-conventions)
- [Component Patterns](#component-patterns)
- [TypeScript Guidelines](#typescript-guidelines)
- [Git Workflow](#git-workflow)
- [Commit Messages](#commit-messages)
- [Pull Request Process](#pull-request-process)
- [Folder Structure](#folder-structure)

---

## 🎨 Code Style

### General Rules

| Rule | Description |
|------|-------------|
| **Indent** | 2 spaces (không dùng tabs) |
| **Quotes** | Single quotes cho strings (`'text'`) |
| **Semicolons** | Có dùng semicolons |
| **Trailing commas** | Thêm trong multi-line objects/arrays |
| **Max line length** | 100 characters |

### Prettier Configuration

```json
// .prettierrc (nếu có)
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "bracketSpacing": true
}
```

### ESLint

Chạy linting trước khi commit:

```bash
npm run lint
```

---

## 📝 Naming Conventions

### Files

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `ProductCard.tsx` |
| Pages | kebab-case | `product-detail.tsx` |
| Hooks | camelCase + `use` prefix | `use-cart.tsx` |
| Utils/Functions | camelCase | `formatPrice.ts` |
| Constants | SCREAMING_SNAKE_CASE | `API_BASE_URL` |
| Types/Interfaces | PascalCase | `Product.ts` |

### Variables & Functions

```typescript
// ✅ Good
const productName = 'Kẹo mút';
const totalPrice = calculateTotal(items);
const isLoading = false;
const productsList: Product[] = [];

// ❌ Bad
const p = 'Kẹo mút';
const tp = calculateTotal(items);
const loading = false;
const prods: Product[] = [];
```

### Components

```typescript
// ✅ Good - Named export + PascalCase
export function ProductCard({ product }: ProductCardProps) {}

// ❌ Bad
export default function productCard() {}
```

### CSS Classes (Tailwind)

```tsx
// ✅ Good - Tailwind classes properly formatted
<div className="flex items-center justify-between p-4 space-y-2">
  <h1 className="text-2xl font-bold text-primary">Title</h1>
</div>

// ❌ Bad - Inconsistent spacing
<div className="flex items-center justify-between p-4 space-y-2">
  <h1 className="text-2xl font-bold text-primary">
```

---

## 🧩 Component Patterns

### UI Components (`/components/ui/`)

Components generic, reusable, không có business logic.

```tsx
// ✅ Template
import * as React from 'react';
import { cn } from '@/lib/utils';

interface ComponentNameProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export const ComponentName = React.forwardRef<HTMLDivElement, ComponentNameProps>(
  ({ className, variant = 'default', size = 'md', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'base-classes',
          { 'variant-classes': variant === 'outline' },
          { 'size-classes': size === 'lg' },
          className
        )}
        {...props}
      />
    );
  }
);

ComponentName.displayName = 'ComponentName';
```

### Shared Components (`/components/shared/`)

Components có business logic, dùng chung nhiều pages.

```tsx
// ✅ Template
import { Button } from '@/components/ui';
import { useCart } from '@/hooks/use-cart';
import type { Product } from '@/types';

interface ComponentNameProps {
  product: Product;
}

/**
 * Component description - what it does
 */
export function ComponentName({ product }: ComponentNameProps) {
  const { addItem } = useCart();

  // ... logic

  return (
    <div>
      {/* JSX */}
    </div>
  );
}
```

### Page Components (`/pages/`)

Route destinations - chỉ chứa layout và composition.

```tsx
// ✅ Template
/**
 * PageName - Page description
 * 
 * Features:
 * - Feature 1
 * - Feature 2
 */
export function PageName() {
  return (
    <div className="space-y-6">
      {/* Content */}
    </div>
  );
}
```

---

## 🔷 TypeScript Guidelines

### Always Define Types

```typescript
// ✅ Good - Explicit types
interface ProductProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

function ProductCard({ product, onAddToCart }: ProductProps) {}

// ❌ Bad - Implicit any
function ProductCard({ product, onAddToCart }) {}
```

### Use Type Exports

```typescript
// ✅ Good - Explicit export
export interface Product {
  id: string;
  name: string;
}

// ❌ Bad - No export when needed elsewhere
interface Product {
  id: string;
}
```

### Avoid `any`

```typescript
// ✅ Good
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {};

// ❌ Bad
const handleChange = (e: any) => {};
```

### Use Barrel Exports

```typescript
// ✅ Good - Centralized in index.ts
// types/index.ts
export type { Product } from './product';

// ❌ Bad - Import from individual files everywhere
import type { Product } from '@/types/product';
import type { CartItem } from '@/types/cart';
```

---

## 🔀 Git Workflow

### Branch Naming

```
feature/<feature-name>      # feature/user-authentication
bugfix/<bug-description>     # bugfix/fix-cart-quantity
refactor/<what-to-refactor>  # refactor/extract-utils
docs/<what-docs>            # docs/add-api-docs
```

### Workflow

```
1. Create branch from main
   git checkout main
   git pull origin main
   git checkout -b feature/my-feature

2. Make changes & commit
   git add .
   git commit -m "feat: add new feature"

3. Push & create PR
   git push origin feature/my-feature

4. After review & approval, merge via PR
```

---

## 📝 Commit Messages

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

| Type | Description |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation changes |
| `style` | Code style (formatting, semicolons) |
| `refactor` | Code refactoring |
| `perf` | Performance improvements |
| `test` | Adding tests |
| `chore` | Build process, dependencies |

### Examples

```bash
# ✅ Good
git commit -m "feat(cart): add update quantity functionality"
git commit -m "fix(checkout): validate phone number format"
git commit -m "docs: add API documentation"
git commit -m "refactor(product-card): extract formatPrice to utils"

# ❌ Bad
git commit -m "fixed stuff"
git commit -m "WIP"
git commit -m "update"
```

### Rules

- Subject line max 72 characters
- Use imperative mood ("add" not "added")
- Don't end with period
- Reference issues: `Closes #123`

---

## 🔄 Pull Request Process

### Before Creating PR

1. ✅ Chạy `npm run lint` - fix all lint errors
2. ✅ Chạy `npm run build` - ensure build passes
3. ✅ Update documentation nếu cần
4. ✅ Test manually các flows liên quan

### PR Template

```markdown
## Description
Mô tả ngắn gọn thay đổi

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
Mô tả cách test changes

## Screenshots (nếu có UI changes)
```

### Review Checklist

- [ ] Code follows naming conventions
- [ ] Types are properly defined
- [ ] No commented-out code
- [ ] No console.log/debug code
- [ ] JSDoc comments for complex logic
- [ ] Responsive design works

---

## 📁 Folder Structure

```
frontend/src/
│
├── components/           # React components
│   ├── ui/              # Generic UI (Button, Input, Card...)
│   │   ├── index.ts     # Barrel export
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── ...
│   │
│   └── shared/          # Domain components
│       ├── index.ts     # Barrel export
│       ├── layout.tsx
│       └── product-card.tsx
│
├── pages/               # Route pages
│   ├── index.ts        # Barrel export
│   ├── home.tsx
│   ├── products.tsx
│   ├── product-detail.tsx
│   ├── cart.tsx
│   ├── checkout.tsx
│   └── not-found.tsx
│
├── hooks/              # Custom React hooks
│   └── use-cart.tsx
│
├── lib/                # Utilities
│   ├── utils.ts        # Common utils (cn, formatPrice...)
│   └── api-client.ts   # API client (future)
│
├── mocks/              # Mock data
│   └── products.ts
│
├── types/              # TypeScript types
│   ├── index.ts        # Barrel export
│   └── product.ts
│
├── App.tsx             # Main app with routing
├── main.tsx            # Entry point
└── index.css           # Global styles + Tailwind
```

### Import Order

```typescript
// 1. React/core
import { useState } from 'react';

// 2. External libraries
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';

// 3. Internal - components
import { Button, Card } from '@/components/ui';
import { Layout } from '@/components/shared';

// 4. Internal - hooks, lib, types
import { useCart } from '@/hooks/use-cart';
import { formatPrice } from '@/lib/utils';
import type { Product } from '@/types';

// 5. Relative imports (if any)
import { SomeLocalComponent } from './some-local';
```

---

## ✅ Quick Checklist

Trước khi commit/merge:

- [ ] Tên files đúng convention
- [ ] Component có JSDoc comment
- [ ] Types được export đúng cách
- [ ] Không có `any` type
- [ ] Không có `console.log`
- [ ] Code format đúng (2 spaces, single quotes)
- [ ] Lint passes
- [ ] Build passes
- [ ] Commit message đúng format

---

## 📚 Resources

- [React Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Conventional Commits](https://www.conventionalcommits.org/)

---

*Last Updated: March 2026*
