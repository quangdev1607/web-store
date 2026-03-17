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

  const handleAddToCart = () => {
    addItem(product, 1);
    setIsAdded(true);
    
    // Reset state after 2 seconds
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-0">
        <Image
          src={product.images[0]}
          alt={product.name}
          className="h-48 w-full object-cover"
        />
      </CardHeader>
      <CardContent className="px-6 pt-0 pb-4">
        <CardTitle className="text-lg font-medium">{product.name}</CardTitle>
        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
          {product.description}
        </p>
        <div className="mt-4 flex flex-col space-y-2">
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
            {isAdded ? 'Added!' : product.inStock ? 'Add to Cart' : 'Out of Stock'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}