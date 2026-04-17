/**
 * Product type definition
 * Represents a product in the bakery store
 * Compatible with backend API
 */
export interface Product {
  /** Unique identifier for the product */
  id: number | string;
  /** Product display name */
  name: string;
  /** Detailed product description */
  description: string;
  /** Price in Vietnamese Dong (VND) */
  price: number;
  /** Product category (e.g., "Kẹo", "Bánh", "Đồ uống") */
  category: string;
  /** Category ID from backend */
  categoryId?: number;
  /** Array of image URLs */
  images: string[];
  /** Whether the product is currently in stock */
  inStock: boolean;
  /** Whether product is active */
  isActive?: boolean;
  /** Average customer rating (0-5 stars) */
  rating?: number;
  /** Stock quantity available */
  stockQuantity?: number;
  /** Creation timestamp */
  createdAt?: string;
  /** Last update timestamp */
  updatedAt?: string;
}

/**
 * Convert product ID to number
 */
export function getProductId(product: Product): number {
  return typeof product.id === 'string' ? parseInt(product.id, 10) : product.id;
}