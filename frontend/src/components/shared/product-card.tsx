import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Image } from '@/components/ui/image';
import { useCart } from '@/hooks/use-cart';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
    setIsAdded(true);
    
    setTimeout(() => setIsAdded(false), 1500);
  };

  return (
    <Link to={`/product/${product.id}`}>
      <Card className="hover:shadow-lg hover:border-primary/30 transition-all duration-300 h-full cursor-pointer flex flex-col overflow-hidden group">
        <CardHeader className="p-0">
          <div className="relative overflow-hidden">
            <Image
              src={product.images[0]}
              alt={product.name}
              className="h-48 w-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-full">
              {product.category}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 flex-1 flex flex-col">
          <h3 className="font-bold text-lg line-clamp-1 group-hover:text-primary transition-colors">{product.name}</h3>
          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground flex-1">
            {product.description}
          </p>
          <div className="mt-4 flex flex-col space-y-3">
            <div className="flex justify-between items-baseline">
              <span className="text-xl font-bold text-primary">{product.price.toFixed(0)} VNĐ</span>
              {product.rating && (
                <div className="flex items-center space-x-1 text-sm">
                  <span className="text-yellow-400">★</span>
                  <span className="font-medium">{product.rating.toFixed(1)}</span>
                </div>
              )}
            </div>
            <Button
              variant={isAdded ? 'secondary' : 'default'}
              className="w-full rounded-full font-semibold"
              onClick={handleAddToCart}
              disabled={!product.inStock}
            >
              {isAdded ? '✓ Đã Thêm!' : product.inStock ? 'Thêm Vào Giỏ' : 'Hết Hàng'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
