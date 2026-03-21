import { Button } from '@/components/ui/button';
import { Image } from '@/components/ui/image';
import { formatPrice } from '@/lib/utils';
import { useCart } from '@/hooks/use-cart';
import { getProductById } from '@/mocks/products';
import { ArrowLeft, CheckCircle, Minus, Plus, ShoppingCart, Star } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

/**
 * ProductDetailPage - Detailed view of a single product
 * Shows product images, description, price, rating, and add-to-cart functionality
 */
export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const product = id ? getProductById(id) : undefined;

  // Product not found state
  if (!product) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Không Tìm Thấy Sản Phẩm</h1>
        <div className="border rounded-2xl p-6">
          <p className="text-center text-muted-foreground py-8">Ồ! Sản phẩm này đi đâu mất rồi!</p>
          <div className="text-center">
            <Link to="/products">
              <Button variant="outline" className="rounded-full">
                Quay Lại
              </Button>
            </Link>
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
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-muted-foreground hover:text-primary transition-colors font-medium"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Quay Lại
      </button>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="aspect-square rounded-2xl overflow-hidden bg-secondary/20">
            <Image
              src={product.images[selectedImage]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Thumbnail Gallery */}
          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-colors ${
                    selectedImage === idx
                      ? 'border-primary'
                      : 'border-transparent hover:border-secondary'
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${product.name} ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {/* Category & Name */}
          <div>
            <p className="text-sm text-muted-foreground mb-1 font-medium">{product.category}</p>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            {/* Rating */}
            <div className="flex items-center gap-4 mt-2">
              <div className="flex">{renderStars(product.rating || 0)}</div>
              <span className="text-sm text-muted-foreground">
                ({product.rating?.toFixed(1) || 'Chưa'} sao)
              </span>
            </div>
          </div>

          {/* Price */}
          <div className="text-3xl font-bold text-primary-foreground">
            {formatPrice(product.price)}
          </div>

          {/* Stock Status */}
          <div className="flex items-center gap-2">
            {product.inStock ? (
              <>
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-green-600 font-medium">Còn Hàng</span>
              </>
            ) : (
              <span className="text-destructive font-medium">Hết Hàng</span>
            )}
          </div>

          {/* Description */}
          <p className="text-muted-foreground">{product.description}</p>

          {/* Add to Cart Section */}
          {product.inStock && (
            <div className="space-y-4">
              {/* Quantity Selector */}
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">Số lượng:</span>
                <div className="flex items-center border rounded-full bg-secondary/30">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-secondary transition-colors rounded-l-full"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-12 text-center font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 hover:bg-secondary transition-colors rounded-r-full"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <Button
                onClick={handleAddToCart}
                className="w-full sm:w-auto rounded-full"
                size="lg"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Thêm Vào Giỏ
              </Button>
            </div>
          )}

          {/* Out of Stock Button */}
          {!product.inStock && (
            <Button disabled className="w-full rounded-full" size="lg">
              Hết Hàng
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
