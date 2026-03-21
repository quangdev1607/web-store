/**
 * App.tsx - Main application component with routing configuration
 * 
 * This file contains the root component and route definitions.
 * All page components have been moved to the /pages directory for better organization.
 */
import { Layout } from '@/components/shared/layout';
import { CartProvider } from '@/hooks/use-cart';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

// Page components - imported using barrel export
import { HomePage, ProductsPage, CartPage, CheckoutPage, ProductDetailPage, NotFoundPage } from '@/pages';

/**
 * Root application component
 * Wraps the app with CartProvider for global cart state
 * and BrowserRouter for client-side routing
 */
function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
