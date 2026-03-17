# AI Agent Instructions for Web Store Frontend

## Project Context

- **Goal:** Build a UI-only web store frontend using pure React and shadcn/ui.
- **Backend:** .NET Core (To be integrated later. Currently NO backend/database).
- **Architecture:** The frontend must be strictly isolated in a `/frontend` directory to support future Docker containerization.

## Build, Lint, and Test Commands

All commands run from the `/frontend` directory.

### Installation

```bash
cd frontend
npm install
```

### Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Linting & Type Checking

```bash
# Run ESLint
npm run lint

# Run TypeScript type checking
npm run typecheck
```

### Testing (Vitest)

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run a single test file
npm run test -- path/to/test-file.test.tsx

# Run a single test by name
npm run test -- -t "test name"

# Run tests with coverage
npm run test:coverage

# Run tests in UI mode
npm run test:ui
```

## Code Style Guidelines

### General Principles

- **Minimal Code:** Write the least amount of code needed to solve the problem.
- **No Premature Abstraction:** Only extract patterns after they appear 3+ times.
- **Single Responsibility:** Each component/function should do one thing well.
- **Explicit Over Implicit:** Prefer clear, obvious code over clever shortcuts.

### Formatting

- Use **2 spaces** for indentation (no tabs).
- Use **single quotes** for strings in JavaScript/TypeScript.
- Add a **trailing comma** after the last item in objects and arrays.
- Use **semicolons** at the end of statements.
- Maximum line length: **100 characters**.
- Use **Prettier** for automatic formatting (run `npm run format` before committing).
- Format imports automatically using the import organizer.

### Imports

Organize imports in the following order (separate with blank lines):

1. React/Next.js built-ins (e.g., `useState`, `useEffect`)
2. External libraries (e.g., `zod`, `react-hook-form`, `lucide-react`)
3. Internal components (e.g., `../components/...`)
4. Internal utilities/hooks (e.g., `../lib/...`, `../hooks/...`)
5. Type imports (e.g., `import type { ... }`)
6. Style imports (e.g., `import styles from '...`)

```typescript
// Good import order
import { useState, useEffect } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { Loader2, ShoppingCart } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useCart } from '@/hooks/use-cart'
import { formatPrice } from '@/lib/utils'
import type { Product } from '@/types'
```

### Naming Conventions

| Element | Convention | Example |
|---------|------------|---------|
| Components | PascalCase | `ProductCard`, `CartDrawer` |
| Hooks | camelCase with `use` prefix | `useCart`, `useProducts` |
| Utilities | camelCase | `formatPrice`, `cn()` |
| Types/Interfaces | PascalCase | `Product`, `OrderItem` |
| Constants | UPPER_SNAKE_CASE | `MAX_QUANTITY`, `API_BASE_URL` |
| File names | kebab-case | `product-card.tsx`, `use-cart.ts` |
| CSS classes | kebab-case (Tailwind) | `flex items-center gap-4` |

### TypeScript Guidelines

- **Always use explicit types** for function parameters and return types.
- Use `interface` for object shapes, `type` for unions/intersections.
- Avoid `any` - use `unknown` when type is truly unknown.
- Use optional chaining (`?.`) and nullish coalescing (`??`) instead of loose truthiness checks.
- Prefer `enum` for fixed sets of values, or use `as const` for string unions.

```typescript
// Good
interface Product {
  id: string
  name: string
  price: number
  category: Category
  images: string[]
  inStock: boolean
}

type OrderStatus = 'pending' | 'shipping' | 'completed' | 'cancelled'

const fetchProducts = async (): Promise<Product[]> => {
  // ...
}
```

### Component Patterns

- Use functional components with arrow functions or `function` keyword consistently.
- Place component definitions before their usage in the same file.
- Extract complex logic into custom hooks.
- Keep components under 200 lines; split larger components.
- Use composition over inheritance.

```typescript
// Preferred component structure
interface ProductCardProps {
  product: Product
  onAddToCart: (product: Product) => void
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleAdd = async () => {
    setIsLoading(true)
    try {
      await onAddToCart(product)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      {/* ... */}
    </Card>
  )
}
```

### Error Handling

- Use try/catch for async operations with proper error states.
- Display user-friendly error messages in the UI.
- Log errors to console with context for debugging.
- Use error boundaries for component-level error handling.

```typescript
// Good error handling
const [error, setError] = useState<string | null>(null)

const handleSubmit = async (data: FormData) => {
  try {
    setError(null)
    await submitOrder(data)
    router.push('/order-success')
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Something went wrong')
    console.error('Order submission failed:', err)
  }
}
```

### State Management

- Use **React Context** for global state (cart, auth, theme).
- Use **Zustand** for complex client-side state if needed.
- Keep state as close to where it's used as possible.
- Use `useReducer` for complex state logic.

### Tailwind CSS

- Use Tailwind's utility classes directly in components.
- Avoid creating custom CSS unless necessary.
- Use `cn()` utility (from `@/lib/utils`) for conditional class merging.
- Group related classes logically (layout → spacing → visual).

```typescript
import { cn } from '@/lib/utils'

<div className={cn(
  "flex items-center justify-between",
  isActive && "bg-primary text-primary-foreground",
  className
)} />
```

### Form Handling

- Use **react-hook-form** with **zod** for validation.
- Define schemas separately from components.
- Show inline validation errors.
- Disable submit button while submitting.

```typescript
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginForm = z.infer<typeof loginSchema>
```

### Testing Guidelines

- Write tests using **Vitest** and **React Testing Library**.
- Test user interactions, not implementation details.
- Use `screen.getByRole` and `screen.getByText` for queries.
- Mock external dependencies and API calls.
- Aim for meaningful test coverage on critical paths.

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

describe('ProductCard', () => {
  it('adds product to cart when button clicked', async () => {
    const mockAddToCart = vi.fn()
    render(<ProductCard product={mockProduct} onAddToCart={mockAddToCart} />)
    
    await fireEvent.click(screen.getByRole('button', { name: /add to cart/i }))
    
    expect(mockAddToCart).toHaveBeenCalledWith(mockProduct)
  })
})
```

### Git Conventions

- Use meaningful commit messages: `feat: add product search`, `fix: cart quantity bug`.
- Run `npm run lint` and `npm run typecheck` before committing.
- Run tests to ensure nothing is broken before committing.

## Core Directives & Constraints

### 1. Design & UI/UX Rules

- **Frameworks:** Use React (Vite is recommended), Tailwind CSS, and shadcn/ui.
- **Color Palette:** Limit to a maximum of 3 bright, fresh primary colors.
- **Secondary Colors:** Must be tones or shades of the primary colors.
- **Strict Prohibitions:** DO NOT use any gradients. ABSOLUTELY NO purple gradients (to avoid the "vibe code" aesthetic).
- **Responsiveness:** All components must be mobile-first and fully responsive across all screen sizes.

### 2. State Management & Mock Data

- **No Real Backend:** All dynamic data must use mock JSON files or localized state management (React Context or Zustand) to simulate user interactions.
- **Data Persistence:** Simulate database operations (CRUD) purely in the frontend state for the time being.

### 3. Folder Structure Requirements

- All code must reside inside a `/frontend` root folder.
- Maintain a modular hierarchy:
    - `/src/components/ui` (shadcn components)
    - `/src/components/shared` (reusable layouts, navbars)
    - `/src/pages` (route components)
    - `/src/lib` (utils, API fetchers)
    - `/src/mocks` (static JSON data)

## Feature Implementation Guide

### Module 1: Product & Category Management (Admin/Public)

- **Listing:** Create a grid/list view for products with pagination, search bars, and category/price filters.
- **Forms:** Build Add/Edit forms using `react-hook-form` and `zod` for validation. Include fields for Name, Description, Price, Stock, Category, Images, and Status.
- **Deletion:** Implement soft-delete (hide/disable) UI toggles and hard-delete confirmation modals.

### Module 2: Customer Account

- **Placeholder:** Create a clean, branded "Coming Soon" page for the `/login` and `/register` routes. Do not implement complex authentication logic yet.

### Module 3: Product & Cart View

- **Product Details:** Build a PDP (Product Detail Page) showcasing multiple images, descriptions, and category tags.
- **Cart Actions:** Include an "Add to Cart" button that updates a global cart state.
- **Cart Drawer/Page:** Allow users to view items, update quantities, and remove items. Calculate mock subtotals.

### Module 4: Checkout Process

- **Vietnamese Address Integration:** Use the Open API for Vietnam provinces (`https://provinces.open-api.vn/api/v2/redoc`).
- **Address Logic:** Implement cascaded dropdowns: Select Province -> Fetch & Select District -> Fetch & Select Ward.
- **Payment:** Hardcode "Cash on Delivery (COD)" as the default and only active payment method.
- **Order Summary:** Display a final review section (Customer info, Products, Total, Shipping Address) before generating a mock "Order Success" state.

### Module 5: Order Management

- **Customer View:** Create a simple table/list showing mock past orders and their statuses.
- **Admin Dashboard:** Build a comprehensive data table to list, search, and filter all store orders.
- **Admin Actions:** Add a dropdown to mock updating order statuses (Pending, Shipping, Completed, Cancelled).

## Preconfigured `.gitignore`

- Ensure the following `.gitignore` is applied at the root of the `/frontend` directory:
