import { BrowserRouter, Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';
import { Layout } from '@/components/shared/layout';
import { ProductsPage } from '@/pages/products';
import { CheckoutPage } from '@/pages/checkout';
import { CartProvider, useCart } from '@/hooks/use-cart';
import { Button } from '@/components/ui/button';
import { Image } from '@/components/ui/image';
import { getProductById } from '@/mocks/products';
import { useState } from 'react';
import { Star, Minus, Plus, ShoppingCart, ArrowLeft, CheckCircle } from 'lucide-react';

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

function HomePage() {
  return (
    <div className="space-y-8 text-center">
      <h1 className="text-3xl font-bold">Chào Mừng Đến Với Cửa Hàng Của Chúng Tôi</h1>
      <p className="text-muted-foreground max-w-2xl mx-auto">
        Khám phá những sản phẩm tuyệt vời với giá cả hợp lý. Duyệt qua bộ sưu tập của chúng tôi và tìm chính xác những gì bạn đang tìm kiếm.
      </p>
      <div className="flex justify-center space-x-4">
        <Link to="/products"><Button>Mua Ngay</Button></Link>
        <Link to="/cart"><Button variant="outline">Xem Giỏ Hàng</Button></Link>
      </div>
    </div>
  );
}

function CartPage() {
  const navigate = useNavigate();
  const { items, removeItem, updateQuantity, totalItems, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Giỏ Hàng Của Bạn</h1>
        <div className="border rounded-lg p-6">
          <p className="text-center text-muted-foreground py-8">Giỏ hàng của bạn trống</p>
          <div className="text-center">
            <Link to="/products"><Button variant="outline">Tiếp Tục Mua Sắm</Button></Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Giỏ Hàng Của Bạn ({totalItems} sản phẩm)</h1>
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
                  Xóa
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
          <h2 className="font-semibold text-lg">Tổng Quan Đơn Hàng</h2>
          <div className="flex justify-between">
            <span>Tạm Tính</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Vận Chuyển</span>
            <span>Miễn Phí</span>
          </div>
          <div className="border-t pt-4 flex justify-between font-semibold">
            <span>Tổng Cộng</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
          <Button className="w-full" onClick={() => navigate('/checkout')}>
            Tiến Hành Thanh Toán
          </Button>
        </div>
      </div>
    </div>
  );
}

function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  
  const product = id ? getProductById(id) : undefined;
  
  if (!product) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Không Tìm Thấy Sản Phẩm</h1>
        <div className="border rounded-lg p-6">
          <p className="text-center text-muted-foreground py-8">Sản phẩm bạn đang tìm kiếm không tồn tại.</p>
          <div className="text-center">
            <Link to="/products"><Button variant="outline">Quay Lại Sản Phẩm</Button></Link>
          </div>
        </div>
      </div>
    );
  }
  
  const handleAddToCart = () => {
    addItem(product, quantity);
    setQuantity(1);
  };
  
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };
  
  return (
    <div className="space-y-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Quay Lại
      </button>
      
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
            <Image
              src={product.images[selectedImage]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === idx ? 'border-primary' : 'border-transparent hover:border-gray-300'
                  }`}
                >
                  <Image src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
        
        <div className="space-y-6">
          <div>
            <p className="text-sm text-muted-foreground mb-1">{product.category}</p>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex">{renderStars(product.rating || 0)}</div>
              <span className="text-sm text-muted-foreground">({product.rating?.toFixed(1) || 'Chưa'} đánh giá)</span>
            </div>
          </div>
          
          <div className="text-2xl font-bold">${product.price.toFixed(2)}</div>
          
          <div className="flex items-center gap-2">
            {product.inStock ? (
              <>
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-green-600 font-medium">Còn Hàng</span>
              </>
            ) : (
              <span className="text-red-500 font-medium">Hết Hàng</span>
            )}
          </div>
          
          <p className="text-muted-foreground">{product.description}</p>
          
          {product.inStock && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">Số lượng:</span>
                <div className="flex items-center border rounded-md">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-gray-100 transition-colors"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-12 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 hover:bg-gray-100 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <Button onClick={handleAddToCart} className="w-full sm:w-auto" size="lg">
                <ShoppingCart className="h-5 w-5 mr-2" />
                Thêm Vào Giỏ
              </Button>
            </div>
          )}
          
          {!product.inStock && (
            <Button disabled className="w-full" size="lg">
              Hết Hàng
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 py-12 space-y-6 text-center">
      <h1 className="text-3xl font-bold">404 - Không Tìm Thấy Trang</h1>
      <p className="text-muted-foreground max-w-2xl">
        Xin lỗi, chúng tôi không thể tìm thấy trang bạn đang tìm kiếm.
      </p>
      <div className="flex justify-center space-x-4">
        <Link to="/"><Button>Về Trang Chủ</Button></Link>
        <Link to="/products"><Button variant="outline">Duyệt Sản Phẩm</Button></Link>
      </div>
    </div>
  );
}

export default App
