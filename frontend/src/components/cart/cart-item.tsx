/**
 * Cart Item Component
 * Displays a single item in the shopping cart with quantity controls
 */
import { Minus, Plus, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Image } from '@/components/ui/image';
import { formatPrice } from '@/lib/utils';
import { useCart } from '@/hooks/use-cart';
import type { Product } from '@/types';

interface CartItemProps {
  productId: number;
  product: Product;
  quantity: number;
}

/**
 * CartItem displays a single cart item with quantity controls
 */
export function CartItemCard({ productId, product, quantity }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart();

  const handleIncrement = () => {
    updateQuantity(productId, quantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      updateQuantity(productId, quantity - 1);
    }
  };

  const handleRemove = () => {
    removeItem(productId);
  };

  const subtotal = product.price * quantity;

  return (
    <div className="flex gap-4 py-4 border-b">
      {/* Product Image */}
      <Link to={`/product/${productId}`} className="flex-shrink-0">
        <Image
          src={product.images[0]}
          alt={product.name}
          className="w-20 h-20 object-cover rounded-md"
        />
      </Link>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <Link to={`/product/${productId}`}>
          <h3 className="font-semibold hover:text-primary transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>
        <p className="text-sm text-muted-foreground">{product.category}</p>

        <div className="mt-2 flex items-center justify-between">
          <span className="font-medium">{formatPrice(product.price)}</span>
        </div>
      </div>

      {/* Quantity Controls */}
      <div className="flex flex-col items-end gap-2">
        <div className="flex items-center border rounded-md">
          <Button variant="ghost" size="icon" onClick={handleDecrement}>
            <Minus className="h-4 w-4" />
          </Button>
          <span className="w-8 text-center text-sm font-medium">
            {quantity}
          </span>
          <Button variant="ghost" size="icon" onClick={handleIncrement}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <span className="font-semibold">{formatPrice(subtotal)}</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRemove}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}