/**
 * API type definitions
 * Common API response structures
 */

/**
 * Standard API error response
 */
export interface ApiError {
  code: string;
  message: string;
}

/**
 * Standard API response wrapper
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: ApiError;
}

/**
 * Paginated response structure
 */
export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

/**
 * Product sort options
 */
export type ProductSortOption =
  | 'price-asc'
  | 'price-desc'
  | 'rating'
  | 'stock'
  | 'newest';

/**
 * Product filter parameters
 */
export interface ProductFilters {
  search?: string;
  category?: string;
  sortBy?: ProductSortOption;
  page?: number;
  pageSize?: number;
  isActive?: boolean;
}

/**
 * Category filter parameters
 */
export interface CategoryFilters {
  search?: string;
  isActive?: boolean;
  page?: number;
  pageSize?: number;
}

/**
 * Order filter parameters
 */
export interface OrderFilters {
  status?: string;
  search?: string;
  sortBy?: string;
  page?: number;
  pageSize?: number;
}

/**
 * Admin dashboard stats
 */
export interface DashboardStats {
  totalOrders: number;
  totalProducts: number;
  totalCategories: number;
  totalUsers: number;
  totalRevenue: number;
  pendingOrders: number;
  completedOrders: number;
  recentOrders: Array<{
    id: number;
    orderCode: string;
    customerName: string;
    totalAmount: number;
    status: string;
    createdAt: string;
  }>;
}

/**
 * Request options for API calls
 */
export interface RequestConfig {
  headers?: Record<string, string>;
  timeout?: number;
}

/**
 * Auth token payload (decoded JWT)
 */
export interface TokenPayload {
  userId: number;
  email: string;
  roles: string[];
  exp: number;
  iat: number;
}