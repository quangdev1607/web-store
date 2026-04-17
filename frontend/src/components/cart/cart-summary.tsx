/**
 * Cart Summary Component
 * Displays cart totals and checkout button
 */
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/utils';
import { useCart } from '@/hooks/use-cart';

/**
 * CartSummary displays cart totals with checkout button
 */
export function CartSummary() {
  const { totalItems, totalPrice } = useCart();

  return (
    <div className="bg-muted/30 rounded-lg p-6">
      <h2 className="text-lg font-semibold mb-4">Tổng quan giỏ hàng</h2>

      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Số lượng sản phẩm</span>
          <span className="font-medium">{totalItems}</span>
        </div>
        <div className="flex justify-between text-lg font-semibold">
          <span>Tổng cộng</span>
          <span className="text-primary">{formatPrice(totalPrice)}</span>
        </div>
      </div>

      <Link to="/checkout" className="block mt-6">
        <Button className="w-full rounded-full" size="lg">
          Tiến Hành Đặt Hàng
        </Button>
      </Link>

      <p className="text-xs text-center text-muted-foreground mt-4">
        Miễn phí vận chuyển cho đơn hàng từ 500.000 VNĐ
      </p>
    </div>
  );
}