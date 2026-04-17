/**
 * Admin API endpoints
 * Requires Admin role
 */
import axios from '@/api/axios';
import type {
  ApiResponse,
  DashboardStats,
  Order,
  PaginatedOrders,
  OrderFilters,
  Product,
  PaginatedResponse,
  ProductFilters,
  Category,
  PaginatedCategories,
  CategoryFilters,
  User,
} from '@/types';

/**
 * Get admin dashboard statistics
 * GET /api/admin/dashboard
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  const response = await axios.get<ApiResponse<DashboardStats>>(
    '/admin/dashboard'
  );
  return response.data.data;
}

/**
 * Get all orders (admin view)
 * GET /api/admin/orders
 */
export async function getAdminOrders(
  filters?: OrderFilters
): Promise<PaginatedOrders> {
  const response = await axios.get<ApiResponse<PaginatedOrders>>(
    '/admin/orders',
    { params: filters }
  );
  return response.data.data;
}

/**
 * Update order status
 * PATCH /api/admin/orders/{id}/status
 */
export async function updateOrderStatus(
  id: number,
  status: string
): Promise<Order> {
  const response = await axios.patch<ApiResponse<Order>>(
    `/admin/orders/${id}/status`,
    { status }
  );
  return response.data.data;
}

/**
 * Get all products (admin view)
 * GET /api/admin/products
 */
export async function getAdminProducts(
  filters?: ProductFilters
): Promise<PaginatedResponse<Product>> {
  const response = await axios.get<ApiResponse<PaginatedResponse<Product>>>(
    '/admin/products',
    { params: filters }
  );
  return response.data.data;
}

/**
 * Get all categories (admin view)
 * GET /api/admin/categories
 */
export async function getAdminCategories(
  filters?: CategoryFilters
): Promise<PaginatedCategories> {
  const response = await axios.get<ApiResponse<PaginatedCategories>>(
    '/admin/categories',
    { params: filters }
  );
  return response.data.data;
}

/**
 * Get all users
 * GET /api/admin/users
 */
export async function getAdminUsers(
  page = 1,
  pageSize = 20
): Promise<{
  items: User[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}> {
  const response = await axios.get<
    ApiResponse<{
      items: User[];
      page: number;
      pageSize: number;
      totalCount: number;
      totalPages: number;
    }>
  >('/admin/users', {
    params: { page, pageSize },
  });
  return response.data.data;
}

// ============================================
// PRODUCTS CRUD
// ============================================

/**
 * Create a new product
 * POST /api/admin/products
 */
export async function createProduct(
  data: Partial<Product>
): Promise<Product> {
  const response = await axios.post<ApiResponse<Product>>(
    '/admin/products',
    data
  );
  return response.data.data;
}

/**
 * Update a product
 * PUT /api/admin/products/{id}
 */
export async function updateProduct(
  id: number,
  data: Partial<Product>
): Promise<Product> {
  const response = await axios.put<ApiResponse<Product>>(
    `/admin/products/${id}`,
    data
  );
  return response.data.data;
}

/**
 * Delete a product
 * DELETE /api/admin/products/{id}
 */
export async function deleteProduct(id: number): Promise<void> {
  await axios.delete(`/admin/products/${id}`);
}

// ============================================
// CATEGORIES CRUD
// ============================================

/**
 * Create a new category
 * POST /api/admin/categories
 */
export async function createCategory(
  data: Partial<Category>
): Promise<Category> {
  const response = await axios.post<ApiResponse<Category>>(
    '/admin/categories',
    data
  );
  return response.data.data;
}

/**
 * Update a category
 * PUT /api/admin/categories/{id}
 */
export async function updateCategory(
  id: number,
  data: Partial<Category>
): Promise<Category> {
  const response = await axios.put<ApiResponse<Category>>(
    `/admin/categories/${id}`,
    data
  );
  return response.data.data;
}

/**
 * Delete a category
 * DELETE /api/admin/categories/{id}
 */
export async function deleteCategory(id: number): Promise<void> {
  await axios.delete(`/admin/categories/${id}`);
}

// ============================================
// IMAGES
// ============================================

/**
 * Upload image to Cloudinary
 * POST /api/images/upload
 */
export async function uploadImage(
  file: File,
  folder?: string
): Promise<{
  publicId: string;
  url: string;
  format: string;
  width: number;
  height: number;
}> {
  const formData = new FormData();
  formData.append('file', file);
  if (folder) {
    formData.append('folder', folder);
  }

  const response = await axios.post<{
    publicId: string;
    url: string;
    format: string;
    width: number;
    height: number;
  }>('/images/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    params: folder ? { folder } : undefined,
  });
  return response.data;
}