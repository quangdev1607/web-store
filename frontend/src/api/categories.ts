/**
 * Categories API endpoints
 */
import axios from '@/api/axios';
import type {
  ApiResponse,
  Category,
  PaginatedCategories,
  CategoryFilters,
} from '@/types';

/**
 * Get paginated categories list
 * GET /api/categories
 */
export async function getCategories(
  filters?: CategoryFilters
): Promise<PaginatedCategories> {
  const response = await axios.get<ApiResponse<PaginatedCategories>>(
    '/categories',
    { params: filters }
  );
  return response.data.data;
}

/**
 * Get all categories (no pagination) for dropdowns
 * GET /api/categories/all
 */
export async function getAllCategories(): Promise<Category[]> {
  const response = await axios.get<ApiResponse<Category[]>>('/categories/all');
  return response.data.data;
}

/**
 * Get single category by ID
 * GET /api/categories/{id}
 */
export async function getCategoryById(id: number): Promise<Category> {
  const response = await axios.get<ApiResponse<Category>>(`/categories/${id}`);
  return response.data.data;
}

/**
 * Get all category names for filtering
 */
export async function getCategoryNames(): Promise<string[]> {
  const categories = await getAllCategories();
  return categories.map((c) => c.name);
}