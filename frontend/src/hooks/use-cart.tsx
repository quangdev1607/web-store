/**
 * Cart Context Hook
 * Provides global shopping cart state management using React Context
 * Supports both guest and authenticated users
 *
 * Usage:
 * const { items, addItem, removeItem, totalItems, totalPrice } = useCart();
 */
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Product, LocalCartItem } from '@/types';
import { STORAGE_KEYS } from '@/config/constants';

// ============================================================================
// Type Definitions
// ============================================================================

/** Represents a single item in the shopping cart */
interface CartItem {
  product: Product;
  quantity: number;
}

/** Cart context shape with all available methods and state */
interface CartContextType {
  /** Array of items currently in the cart */
  items: CartItem[];
  /** Add a product to the cart */
  addItem: (product: Product, quantity: number) => void;
  /** Remove a product from the cart */
  removeItem: (productId: number) => void;
  /** Update the quantity of a product in the cart */
  updateQuantity: (productId: number, quantity: number) => void;
  /** Clear all items from the cart */
  clearCart: () => void;
  /** Total number of items in the cart (sum of quantities) */
  totalItems: number;
  /** Total price of all items in the cart */
  totalPrice: number;
  /** Check if product is in cart */
  isInCart: (productId: number) => boolean;
  /** Get quantity of a specific product in cart */
  getQuantity: (productId: number) => number;
}

// ============================================================================
// Context Creation
// ============================================================================

const CartContext = createContext<CartContextType | undefined>(undefined);

// ============================================================================
// Hook
// ============================================================================

/**
 * Hook to access cart context
 * @throws Error if used outside of CartProvider
 * @returns CartContextType with cart state and actions
 */
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

// ============================================================================
// Provider Props
// ============================================================================

interface CartProviderProps {
  children: React.ReactNode;
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Compare two product IDs (handle both number and string)
 */
function isSameProductId(id1: number | string, id2: number | string): boolean {
  return Number(id1) === Number(id2);
}

// ============================================================================
// Provider Component
// ============================================================================

/**
 * Cart Provider Component
 * Wraps the app to provide cart state and actions via Context
 * Persists cart to localStorage for guest users
 *
 * @example
 * <CartProvider>
 *   <App />
 * </CartProvider>
 */
export function CartProvider({ children }: CartProviderProps) {
  const [items, setItems] = useState<CartItem[]>(() => {
    // Load from localStorage on mount
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEYS.cart);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return [];
        }
      }
    }
    return [];
  });

  // Save to localStorage when cart changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(items));
  }, [items]);

  /**
   * Add a product to cart or increase quantity if already exists
   * @param product - Product to add
   * @param quantity - Quantity to add (default: 1)
   */
  const addItem = (product: Product, quantity: number = 1) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => isSameProductId(item.product.id, product.id)
      );

      if (existingItem) {
        return prevItems.map((item) =>
          isSameProductId(item.product.id, product.id)
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prevItems, { product, quantity }];
      }
    });
  };

  /**
   * Remove a product from cart completely
   * @param productId - ID of product to remove (number)
   */
  const removeItem = (productId: number) => {
    setItems((prevItems) =>
      prevItems.filter((item) => !isSameProductId(item.product.id, productId))
    );
  };

  /**
   * Update quantity of a product in cart
   * Automatically removes item if quantity <= 0
   * @param productId - ID of product to update (number)
   * @param quantity - New quantity value
   */
  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }

    setItems((prevItems) =>
      prevItems.map((item) =>
        isSameProductId(item.product.id, productId) ? { ...item, quantity } : item
      )
    );
  };

  /** Remove all items from cart */
  const clearCart = () => {
    setItems([]);
  };

  /** Total number of items (sum of all quantities) */
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  /** Total price of all items in cart */
  const totalPrice = items.reduce(
    (sum, item) => item.product.price * item.quantity + sum,
    0
  );

  /**
   * Check if product is in cart
   */
  const isInCart = (productId: number) => {
    return items.some((item) => isSameProductId(item.product.id, productId));
  };

  /**
   * Get quantity of a specific product in cart
   */
  const getQuantity = (productId: number) => {
    const item = items.find((item) => isSameProductId(item.product.id, productId));
    return item?.quantity ?? 0;
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        isInCart,
        getQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}