/**
 * Order type definitions
 * Matches backend API response structure
 */

/**
 * Order status enum
 */
export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'shipping'
  | 'delivered'
  | 'cancelled';

/**
 * Shipping address for an order
 */
export interface ShippingAddress {
  province: string;
  district: string;
  ward: string;
  address: string;
}

/**
 * Customer information for an order
 */
export interface CustomerInfo {
  name: string;
  phone: string;
  email: string;
}

/**
 * Order item details
 */
export interface OrderItem {
  productId: number;
  productName: string;
  productPrice: number;
  quantity: number;
}

/**
 * Order entity from the backend
 */
export interface Order {
  id: number;
  orderCode: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  shippingAddress: ShippingAddress;
  totalAmount: number;
  status: OrderStatus;
  items: OrderItem[];
  createdAt: string;
}

/**
 * Create order request payload
 */
export interface CreateOrderRequest {
  customerInfo: CustomerInfo;
  shippingAddress: ShippingAddress;
  items: Array<{
    productId: number;
    quantity: number;
  }>;
}

/**
 * Create order response from API
 */
export interface CreateOrderResponse {
  orderId: number;
  orderCode: string;
  totalAmount: number;
  estimatedDelivery: string;
}

/**
 * Paginated orders response
 */
export interface PaginatedOrders {
  items: Order[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

/**
 * Order status display mapping
 */
export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Chờ xác nhận',
  confirmed: 'Đã xác nhận',
  shipping: 'Đang giao hàng',
  delivered: 'Đã giao hàng',
  cancelled: 'Đã hủy',
};

/**
 * Order status color mapping for UI
 */
export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  pending: 'warning',
  confirmed: 'info',
  shipping: 'info',
  delivered: 'success',
  cancelled: 'destructive',
};

/**
 * Get display label for order status
 */
export function getOrderStatusLabel(status: OrderStatus): string {
  return ORDER_STATUS_LABELS[status] || status;
}