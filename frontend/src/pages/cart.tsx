import { Button } from '@/components/ui/button';
import { Image } from '@/components/ui/image';
import { formatPrice } from '@/lib/utils';
import { useCart } from '@/hooks/use-cart';
import { Link, useNavigate } from 'react-router-dom';

/**
 * CartPage - Shopping cart page
 * Displays all items in cart, allows quantity updates, removal, and checkout
 */
export function CartPage() {
  const navigate = useNavigate();
  const { items, removeItem, updateQuantity, totalItems, totalPrice } = useCart();

  // Empty cart state
  if (items.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Giỏ Kẹo Của Bé</h1>
        <div className="border rounded-2xl p-6">
          <p className="text-center text-muted-foreground py-8">Giỏ bánh còn trống lắm!</p>
          <div className="text-center">
            <Link to="/products">
              <Button variant="outline" className="rounded-full">
                Mua Bánh Thôi!
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Giỏ Bánh Của Bé ({totalItems} món)</h1>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.product.id}
              className="flex gap-4 border rounded-2xl p-4 bg-card"
            >
              <Image
                src={item.product.images[0]}
                alt={item.product.name}
                className="w-24 h-24 object-cover rounded-xl"
              />
              <div className="flex-1">
                <h3 className="font-medium">{item.product.name}</h3>
                <p className="text-muted-foreground text-sm">{item.product.category}</p>
                <p className="font-semibold mt-2 text-primary-foreground">
                  {formatPrice(item.product.price)}
                </p>
              </div>
              <div className="flex flex-col items-end justify-between">
                {/* Remove button */}
                <button
                  onClick={() => removeItem(item.product.id)}
                  className="text-destructive text-sm hover:underline"
                >
                  Xóa
                </button>

                {/* Quantity controls */}
                <div className="flex items-center gap-2 bg-secondary/30 rounded-full px-2">
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                    className="w-8 h-8 rounded-full hover:bg-secondary transition-colors flex items-center justify-center"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-semibold">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                    className="w-8 h-8 rounded-full hover:bg-secondary transition-colors flex items-center justify-center"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="border rounded-2xl p-6 h-fit space-y-4 bg-card">
          <h2 className="font-semibold text-lg">Tổng Kết</h2>
          <div className="flex justify-between">
            <span>Tạm Tính</span>
            <span className="font-semibold">{formatPrice(totalPrice)}</span>
          </div>
          <div className="flex justify-between">
            <span>Giao Hàng</span>
            <span className="text-green-600 font-semibold">Miễn Phí</span>
          </div>
          <div className="border-t pt-4 flex justify-between font-bold text-lg">
            <span>Tổng Cộng</span>
            <span className="text-primary-foreground">{formatPrice(totalPrice)}</span>
          </div>
          <Button
            className="w-full rounded-full"
            onClick={() => navigate('/checkout')}
          >
            Thanh Toán Ngay
          </Button>
        </div>
      </div>
    </div>
  );
}
