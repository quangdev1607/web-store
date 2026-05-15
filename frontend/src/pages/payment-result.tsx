import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Check, Loader2, TriangleAlert, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getOrderPaymentStatus } from '@/api/orders';
import { formatPrice } from '@/lib/utils';
import { useCart } from '@/hooks/use-cart';
import type { PaymentStatusResponse } from '@/types/order';

export function PaymentResultPage() {
  const [searchParams] = useSearchParams();
  const { clearCart } = useCart();
  const orderId = Number(searchParams.get('orderId'));
  const isCancelled = searchParams.get('cancelled') === 'true';

  const [payment, setPayment] = useState<PaymentStatusResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!orderId) {
      setError('Không tìm thấy mã đơn hàng để kiểm tra thanh toán.');
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    const loadStatus = async () => {
      try {
        const result = await getOrderPaymentStatus(orderId);
        if (cancelled) return;

        setPayment(result);
        if (result.paymentStatus === 'paid') {
          clearCart();
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Không kiểm tra được trạng thái thanh toán.');
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    loadStatus();
    const intervalId = window.setInterval(loadStatus, 5000);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, [clearCart, orderId]);

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto text-center space-y-6">
        <div className="border rounded-2xl p-10">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <h1 className="text-2xl font-bold">Đang kiểm tra thanh toán</h1>
          <p className="text-muted-foreground mt-2">
            Hệ thống đang xác nhận giao dịch từ payOS.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <PaymentResultShell
        icon={<TriangleAlert className="w-10 h-10 text-yellow-500" />}
        title="Chưa kiểm tra được thanh toán"
        message={error}
      />
    );
  }

  if (payment?.paymentStatus === 'paid') {
    return (
      <PaymentResultShell
        icon={<Check className="w-10 h-10 text-green-500" />}
        title="Thanh toán thành công"
        message={`Đơn hàng #${payment.orderCode} đã được ghi nhận với tổng tiền ${formatPrice(payment.totalAmount)}.`}
        orderId={payment.orderId}
      />
    );
  }

  if (isCancelled || payment?.paymentStatus === 'cancelled') {
    return (
      <PaymentResultShell
        icon={<XCircle className="w-10 h-10 text-destructive" />}
        title="Thanh toán đã hủy"
        message="Đơn hàng vẫn được lưu ở trạng thái chờ thanh toán. Bạn có thể quay lại đơn hàng để xử lý tiếp."
        orderId={payment?.orderId}
      />
    );
  }

  return (
    <PaymentResultShell
      icon={<Loader2 className="w-10 h-10 animate-spin text-primary" />}
      title="Đang chờ xác nhận thanh toán"
      message="Nếu bạn đã chuyển khoản, trạng thái sẽ tự cập nhật khi webhook payOS được xử lý."
      orderId={payment?.orderId}
    />
  );
}

function PaymentResultShell({
  icon,
  title,
  message,
  orderId,
}: {
  icon: ReactNode;
  title: string;
  message: string;
  orderId?: number;
}) {
  return (
    <div className="max-w-2xl mx-auto text-center space-y-6">
      <div className="border rounded-2xl p-10">
        <div className="w-20 h-20 bg-secondary/50 rounded-full flex items-center justify-center mx-auto mb-6">
          {icon}
        </div>
        <h1 className="text-2xl font-bold mb-3">{title}</h1>
        <p className="text-muted-foreground mb-8">{message}</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link to="/products">
            <Button variant="outline" className="rounded-full">
              Tiếp Tục Mua Hàng
            </Button>
          </Link>
          <Link to={orderId ? '/orders' : '/checkout'}>
            <Button className="rounded-full">
              {orderId ? 'Xem Đơn Hàng' : 'Quay Lại Thanh Toán'}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
