import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Layout } from '@/components/shared/layout';
import { ProductsPage } from '@/pages/products';
import { CartProvider, useCart } from '@/hooks/use-cart';
import { Button } from '@/components/ui/button';
import { Image } from '@/components/ui/image';

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </CartProvider>
  );
}

function HomePage() {
  return (
    <div className="space-y-8 text-center">
      <h1 className="text-3xl font-bold">Welcome to Our Store</h1>
      <p className="text-muted-foreground max-w-2xl mx-auto">
        Discover amazing products at unbeatable prices. Browse our collection and find exactly what you're looking for.
      </p>
      <div className="flex justify-center space-x-4">
        <Link to="/products"><Button>Shop Now</Button></Link>
        <Link to="/cart"><Button variant="outline">View Cart</Button></Link>
      </div>
    </div>
  );
}

function CartPage() {
  const { items, removeItem, updateQuantity, totalItems, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Your Cart</h1>
        <div className="border rounded-lg p-6">
          <p className="text-center text-muted-foreground py-8">Your cart is empty</p>
          <div className="text-center">
            <Link to="/products"><Button variant="outline">Continue Shopping</Button></Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Your Cart ({totalItems} items)</h1>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.product.id} className="flex gap-4 border rounded-lg p-4">
              <Image
                src={item.product.images[0]}
                alt={item.product.name}
                className="w-24 h-24 object-cover rounded"
              />
              <div className="flex-1">
                <h3 className="font-medium">{item.product.name}</h3>
                <p className="text-muted-foreground text-sm">{item.product.category}</p>
                <p className="font-semibold mt-2">${item.product.price.toFixed(2)}</p>
              </div>
              <div className="flex flex-col items-end justify-between">
                <button
                  onClick={() => removeItem(item.product.id)}
                  className="text-red-500 text-sm hover:underline"
                >
                  Remove
                </button>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                    className="w-8 h-8 border rounded hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                    className="w-8 h-8 border rounded hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="border rounded-lg p-6 h-fit space-y-4">
          <h2 className="font-semibold text-lg">Order Summary</h2>
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>Free</span>
          </div>
          <div className="border-t pt-4 flex justify-between font-semibold">
            <span>Total</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
          <Button className="w-full">Proceed to Checkout</Button>
        </div>
      </div>
    </div>
  );
}

function ProductDetailPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Product Details</h1>
      <div className="border rounded-lg p-6">
        <p className="text-center text-muted-foreground py-8">Product details coming soon</p>
        <div className="text-center">
          <Link to="/products"><Button variant="outline">Back to Products</Button></Link>
        </div>
      </div>
    </div>
  );
}

function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 py-12 space-y-6 text-center">
      <h1 className="text-3xl font-bold">404 - Page Not Found</h1>
      <p className="text-muted-foreground max-w-2xl">
        Sorry, we couldn't find the page you're looking for.
      </p>
      <div className="flex justify-center space-x-4">
        <Link to="/"><Button>Go Home</Button></Link>
        <Link to="/products"><Button variant="outline">Browse Products</Button></Link>
      </div>
    </div>
  );
}

export default App
