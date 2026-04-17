/**
 * Shared Components barrel export
 * Re-exports domain-specific shared components
 *
 * These components are tied to business logic and are used across multiple pages
 *
 * Usage:
 * import { Layout, ProductCard } from '@/components/shared';
 */
export { Layout } from '@/components/layout';
export { ProductCard } from '@/components/product/product-card';
export { ProductGrid } from '@/components/product/product-grid';
export { ProductFilter } from '@/components/product/product-filter';
export { ProductGallery } from '@/components/product/product-gallery';
export { ProductDetail } from '@/components/product/product-detail';
export { CartItemCard, CartSummary, AddressPicker } from '@/components/cart';
export { LoginForm, RegisterForm } from '@/components/auth';