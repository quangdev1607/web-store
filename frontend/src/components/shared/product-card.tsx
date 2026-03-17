import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
    
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <Link to={`/product/${product.id}`}>
      <Card className="hover:shadow-md transition-shadow h-full cursor-pointer flex flex-col">
        <CardHeader className="pb-0">
          <Image
            src={product.images[0]}
            alt={product.name}
            className="h-48 w-full object-cover"
          />
        </CardHeader>
        <CardContent className="px-6 pt-0 pb-4 flex-1 flex flex-col">
          <CardTitle className="text-lg font-medium">{product.name}</CardTitle>
          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
            {product.description}
          </p>
          <div className="mt-auto pt-4 flex flex-col space-y-2">
            <div className="flex justify-between items-baseline">
              <span className="text-xl font-semibold">${product.price.toFixed(2)}</span>
              {product.rating && (
                <div className="flex items-center space-x-1 text-sm text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <span key={i}>
                      {i < (product.rating ?? 0) ? '★' : '☆'}
                    </span>
                  ))}
                  <span className="ml-1 text-muted-foreground">
                    ({product.rating})
                  </span>
                </div>
              )}
            </div>
            <Button
              variant={isAdded ? 'outline' : 'default'}
              className="w-full"
              onClick={handleAddToCart}
              disabled={!product.inStock}
            >
              {isAdded ? 'Đã Thêm!' : product.inStock ? 'Thêm Vào Giỏ' : 'Hết Hàng'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}