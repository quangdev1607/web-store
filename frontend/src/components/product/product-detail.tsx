/**
 * Product Detail Component
 * Displays complete product information with add to cart functionality
 */
import { useState } from 'react';
import { Minus, Plus, ShoppingCart, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatPrice } from '@/lib/utils';
import { useCart } from '@/hooks/use-cart';
import type { Product } from '@/types';
import { ProductGallery } from './product-gallery';

interface ProductDetailProps {
  product: Product;
  isLoading?: boolean;
}

/**
 * ProductDetail displays complete product information
 */
export function ProductDetail({ product, isLoading }: ProductDetailProps) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = () => {
    // Convert string id to number if needed
    const productId =
      typeof product.id === 'string' ? parseInt(product.id, 10) : product.id;
    addItem({ ...product, id: productId } as Product, quantity);
    setIsAdded(true);

    setTimeout(() => {
      setIsAdded(false);
      setQuantity(1);
    }, 1500);
  };

  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () => setQuantity((prev) => Math.max(1, prev - 1));

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <Skeleton className="aspect-square w-full" />
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="w-20 h-20" />
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Product Gallery */}
      <ProductGallery images={product.images} productName={product.name} />

      {/* Product Info */}
      <div className="space-y-6">
        <div>
          <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">
            {product.category}
          </span>
        </div>

        <h1 className="text-3xl font-bold">{product.name}</h1>

        <div className="flex items-center space-x-4">
          <span className="text-2xl font-bold text-primary">
            {formatPrice(product.price)}
          </span>
          {product.rating && (
            <div className="flex items-center space-x-1">
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{product.rating.toFixed(1)}</span>
              <span className="text-muted-foreground">({product.rating})</span>
            </div>
          )}
        </div>

        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Mô tả sản phẩm</h2>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground whitespace-pre-line">
              {product.description}
            </p>
          </CardContent>
        </Card>

        {/* Stock status */}
        {!product.inStock && (
          <div className="p-4 bg-destructive/10 text-destructive rounded-lg">
            Sản phẩm hiện tại hết hàng
          </div>
        )}

        {/* Quantity and Add to Cart */}
        {product.inStock && (
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center border rounded-md">
              <Button
                variant="ghost"
                size="icon"
                onClick={decrementQuantity}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-12 text-center font-medium">{quantity}</span>
              <Button variant="ghost" size="icon" onClick={incrementQuantity}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <Button
              onClick={handleAddToCart}
              className="flex-1 rounded-full"
              size="lg"
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              {isAdded
                ? `✓ Đã Thêm (${quantity})`
                : `Thêm Vào Giỏ - ${formatPrice(product.price * quantity)}`}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}