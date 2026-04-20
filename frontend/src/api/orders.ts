/**
 * Orders API endpoints
 */
import axios from '@/api/axios';
import type {
  ApiResponse,
  Order,
  CreateOrderRequest,
  CreateOrderResponse,
  PaginatedOrders,
  OrderFilters,
} from '@/types';

/**
 * Create a new order
 * POST /api/orders
 */
export async function createOrder(
  data: CreateOrderRequest
): Promise<CreateOrderResponse> {
  const response = await axios.post<ApiResponse<CreateOrderResponse>>(
    '/orders',
    data
  );
  return response.data.data;
}

/**
 * Get order by ID
 * GET /api/orders/{id}
 */
export async function getOrderById(id: number): Promise<Order> {
  const response = await axios.get<ApiResponse<Order>>(`/orders/${id}`);
  return response.data.data;
}

/**
 * Get current user's orders
 * GET /api/orders (for authenticated user)
 */
export async function getMyOrders(
  filters?: OrderFilters
): Promise<PaginatedOrders> {
  // Filter out empty values to ensure API receives valid params
  const params: Record<string, string | number> = {};
  if (filters?.status) params.status = filters.status;
  if (filters?.search) params.search = filters.search;
  if (filters?.sortBy) params.sortBy = filters.sortBy;
  if (filters?.page) params.page = filters.page;
  if (filters?.pageSize) params.pageSize = filters.pageSize;

  const response = await axios.get<ApiResponse<PaginatedOrders>>('/orders', {
    params,
  });
  return response.data.data;
}