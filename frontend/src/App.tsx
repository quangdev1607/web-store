/**
 * App.tsx - Main application component with routing configuration
 */
import { useEffect } from 'react';
import { Layout } from '@/components/layout';
import { CartProvider } from '@/hooks/use-cart';
import { useAuthStore } from '@/stores/auth-store';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

// Page components
import {
  HomePage,
  ProductsPage,
  CartPage,
  CheckoutPage,
  ProductDetailPage,
  NotFoundPage,
  LoginPage,
  RegisterPage,
  OrdersPage,
  ProfilePage,
  AdminPage,
} from '@/pages';

/**
 * Root application component
 */
function App() {
  // Get auth state - Zustand persist sẽ tự động load từ localStorage
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const checkAuth = useAuthStore((state) => state.checkAuth);

  // Check auth on app load
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <CartProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />

            {/* Auth routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* User routes (requires login) */}
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/order/:id" element={<ProductDetailPage />} />

            {/* Admin routes (requires admin role) */}
            <Route path="/admin" element={<AdminPage />} />

            {/* 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;