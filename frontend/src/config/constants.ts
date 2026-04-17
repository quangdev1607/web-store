/**
 * Application configuration and constants
 */

/**
 * API configuration
 */
export const API_CONFIG = {
  /** Backend API base URL */
  baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  /** Request timeout in milliseconds */
  timeout: 10000,
  /** Default page size for pagination */
  defaultPageSize: 20,
} as const;

/**
 * Application information
 */
export const APP_CONFIG = {
  name: 'Bakery Store',
  description: 'Cửa hàng bánh ngọt',
  version: '1.0.0',
} as const;

/**
 * Local storage keys
 */
export const STORAGE_KEYS = {
  authToken: 'auth_token',
  user: 'user',
  cart: 'cart',
} as const;

/**
 * Pagination defaults
 */
export const PAGINATION = {
  defaultPage: 1,
  defaultPageSize: 20,
  maxPageSize: 100,
} as const;

/**
 * Product sort options
 */
export const SORT_OPTIONS = [
  { value: 'newest', label: 'Mới nhất' },
  { value: 'price-asc', label: 'Giá: Thấp đến cao' },
  { value: 'price-desc', label: 'Giá: Cao đến thấp' },
  { value: 'rating', label: 'Đánh giá cao nhất' },
  { value: 'stock', label: 'Còn hàng nhiều nhất' },
] as const;

/**
 * Order status options for admin
 */
export const ORDER_STATUS_OPTIONS = [
  { value: 'pending', label: 'Chờ xác nhận' },
  { value: 'confirmed', label: 'Đã xác nhận' },
  { value: 'shipping', label: 'Đang giao hàng' },
  { value: 'delivered', label: 'Đã giao hàng' },
  { value: 'cancelled', label: 'Đã hủy' },
] as const;