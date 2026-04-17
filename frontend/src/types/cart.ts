/**
 * Cart type definitions
 * Matches backend API response structure
 */

/**
 * Cart item entity
 */
export interface CartItem {
  id: number;
  productId: number;
  productName: string;
  productImage: string;
  productPrice: number;
  quantity: number;
  subtotal: number;
}

/**
 * Cart entity from the backend
 */
export interface Cart {
  id: number;
  userId: number;
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
  updatedAt: string;
}

/**
 * Add to cart request payload
 */
export interface AddToCartRequest {
  productId: number;
  quantity: number;
}

/**
 * Update cart item request payload
 */
export interface UpdateCartItemRequest {
  quantity: number;
}

/**
 * Cart item for local state (before adding to backend)
 */
export interface LocalCartItem {
  productId: number;
  productName: string;
  productImage: string;
  productPrice: number;
  quantity: number;
}

/**
 * Local cart state (for guest users or before sync)
 */
export interface LocalCart {
  items: LocalCartItem[];
  totalItems: number;
  totalAmount: number;
}

/**
 * Calculate cart totals from items
 */
export function calculateCartTotals(items: LocalCartItem[]): {
  totalItems: number;
  totalAmount: number;
} {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = items.reduce(
    (sum, item) => sum + item.productPrice * item.quantity,
    0
  );
  return { totalItems, totalAmount };
}