/**
 * Products API endpoints
 */
import axios from '@/api/axios';
import type {
  ApiResponse,
  Product,
  PaginatedResponse,
  ProductFilters,
} from '@/types';

/**
 * Get paginated products list
 * GET /api/products
 */
export async function getProducts(
  filters?: ProductFilters
): Promise<PaginatedResponse<Product>> {
  const response = await axios.get<ApiResponse<PaginatedResponse<Product>>>(
    '/products',
    { params: filters }
  );
  return response.data.data;
}

/**
 * Get single product by ID
 * GET /api/products/{id}
 */
export async function getProductById(id: number): Promise<Product> {
  const response = await axios.get<ApiResponse<Product>>(`/products/${id}`);
  return response.data.data;
}

/**
 * Get category names for filtering
 * GET /api/products/categories
 */
export async function getProductCategories(): Promise<string[]> {
  const response = await axios.get<ApiResponse<string[]>>(
    '/products/categories'
  );
  return response.data.data;
}

/**
 * Search products
 * GET /api/products?search={query}
 */
export async function searchProducts(
  query: string,
  page = 1,
  pageSize = 20
): Promise<PaginatedResponse<Product>> {
  const response = await axios.get<
    ApiResponse<PaginatedResponse<Product>>
  >('/products', {
    params: {
      search: query,
      page,
      pageSize,
    },
  });
  return response.data.data;
}

/**
 * Get products by category
 * GET /api/products?category={category}
 */
export async function getProductsByCategory(
  category: string,
  page = 1,
  pageSize = 20
): Promise<PaginatedResponse<Product>> {
  const response = await axios.get<
    ApiResponse<PaginatedResponse<Product>>
  >('/products', {
    params: {
      category,
      page,
      pageSize,
    },
  });
  return response.data.data;
}