/**
 * Category type definitions
 * Matches backend API response structure
 */

/**
 * Category entity from the backend
 */
export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  isActive: boolean;
  productCount: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Category with minimal info for dropdowns
 */
export interface CategoryOption {
  id: number;
  name: string;
  slug: string;
}

/**
 * Paginated category response
 */
export interface PaginatedCategories {
  items: Category[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}