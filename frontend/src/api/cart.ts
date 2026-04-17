/**
 * Cart API endpoints
 * Requires authentication
 */
import axios from '@/api/axios';
import type {
  ApiResponse,
  Cart,
  AddToCartRequest,
  UpdateCartItemRequest,
} from '@/types';

/**
 * Get current user's cart
 * GET /api/cart
 */
export async function getCart(): Promise<Cart> {
  const response = await axios.get<ApiResponse<Cart>>('/cart');
  return response.data.data;
}

/**
 * Add item to cart
 * POST /api/cart/items
 */
export async function addToCart(data: AddToCartRequest): Promise<Cart> {
  const response = await axios.post<ApiResponse<Cart>>('/cart/items', data);
  return response.data.data;
}

/**
 * Update cart item quantity
 * PUT /api/cart/items/{productId}
 */
export async function updateCartItem(
  productId: number,
  data: UpdateCartItemRequest
): Promise<Cart> {
  const response = await axios.put<ApiResponse<Cart>>(
    `/cart/items/${productId}`,
    data
  );
  return response.data.data;
}

/**
 * Remove item from cart
 * DELETE /api/cart/items/{productId}
 */
export async function removeFromCart(productId: number): Promise<Cart> {
  const response = await axios.delete<ApiResponse<Cart>>(
    `/cart/items/${productId}`
  );
  return response.data.data;
}

/**
 * Clear entire cart
 * DELETE /api/cart
 */
export async function clearCart(): Promise<void> {
  await axios.delete('/cart');
}