/**
 * Product type definition
 * Represents a product in the bakery store
 */
export interface Product {
  /** Unique identifier for the product */
  id: string;
  /** Product display name */
  name: string;
  /** Detailed product description */
  description: string;
  /** Price in Vietnamese Dong (VND) */
  price: number;
  /** Product category (e.g., "Kẹo", "Bánh", "Đồ uống") */
  category: string;
  /** Array of image URLs */
  images: string[];
  /** Whether the product is currently in stock */
  inStock: boolean;
  /** Average customer rating (0-5 stars) */
  rating?: number;
}