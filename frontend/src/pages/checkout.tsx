/**
 * Checkout Page
 * Order checkout with user info auto-fill and API integration
 */
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Image } from '@/components/ui/image';
import { Input } from '@/components/ui/input';
import { formatPrice } from '@/lib/utils';
import { useCart } from '@/hooks/use-cart';
import { useAuthStore } from '@/stores/auth-store';
import { createOrder } from '@/api/orders';
import { Check, CreditCard, Truck, Loader2 } from 'lucide-react';

// ============================================================================
// Type Definitions
// ============================================================================

/** Checkout form data structure */
interface FormData {
  name: string;
  phone: string;
  email: string;
}

/**
 * CheckoutPage - Order checkout and payment page
 */
export function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const { isAuthenticated, user } = useAuthStore();

  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    email: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderResult, setOrderResult] = useState<{
    orderId: number;
    orderCode: string;
    totalAmount: number;
  } | null>(null);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [apiError, setApiError] = useState<string>('');

  // Auto-fill user info when authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      setFormData((prev) => ({
        ...prev,
        name: `${user.firstName} ${user.lastName}`.trim(),
        phone: user.phone || '',
        email: user.email,
      }));
    }
  }, [isAuthenticated, user]);

  // Get user's saved address
  const userAddress = user
    ? {
        address: user.address || '',
        ward: user.wardName || user.ward || '',
        province: user.provinceName || user.province || '',
      }
    : null;

  const fullAddress = userAddress?.province
    ? `${userAddress.address}, ${userAddress.ward}, ${userAddress.province}`
    : '';

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Tên là bắt buộc';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Số điện thoại là bắt buộc';
    } else if (!/^\d{10,11}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Số điện thoại không hợp lệ';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email là bắt buộc';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Địa chỉ email không hợp lệ';
    }

    // Check if user has address
    if (!userAddress?.province || !userAddress?.ward) {
      setApiError('Vui lòng cập nhật địa chỉ giao hàng trong trang thông tin tài khoản');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0 && !!userAddress?.province && !!userAddress?.ward;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setApiError('');

    try {
      // Prepare order data according to backend API
      const orderData = {
        customerInfo: {
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
        },
        shippingAddress: {
          province: userAddress!.province,
          ward: userAddress!.ward,
          address: userAddress!.address,
        },
        items: items.map((item) => ({
          productId: Number(item.product.id),
          quantity: item.quantity,
        })),
      };

      // Call backend API
      const result = await createOrder(orderData);

      // Clear cart and show success
      clearCart();
      setOrderResult(result);
      setOrderComplete(true);
    } catch (error) {
      console.error('Order failed:', error);
      setApiError(
        error instanceof Error ? error.message : 'Đặt hàng thất bại. Vui lòng thử lại.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Thanh Toán</h1>
        <div className="border rounded-2xl p-6 text-center">
          <p className="text-muted-foreground py-4">
            Vui lòng đăng nhập để tiếp tục thanh toán
          </p>
          <Link to="/login">
            <Button className="rounded-full">Đăng Nhập</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Empty cart
  if (items.length === 0 && !orderComplete) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Thanh Toán</h1>
        <div className="border rounded-2xl p-6">
          <p className="text-center text-muted-foreground py-8">
            Giỏ kẹo còn trống lắm!
          </p>
          <div className="text-center">
            <Link to="/products">
              <Button variant="outline" className="rounded-full">
                Mua Kẹo Thôi!
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Order success
  if (orderComplete && orderResult) {
    return (
      <div className="max-w-2xl mx-auto text-center space-y-6">
        <div className="border rounded-2xl p-12">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold mb-2 text-green-500">
            Đặt Hàng Thành Công! 🎉
          </h1>
          <p className="text-muted-foreground mb-4">
            Cảm ơn ba/mẹ đã quan tâm đến bé! Đơn hàng sẽ được giao nhanh nhất
            có thể!
          </p>
          <p className="text-sm text-muted-foreground mb-8">
            Mã đơn hàng:{' '}
            <span className="font-bold">#{orderResult.orderCode}</span>
          </p>
          <div className="flex justify-center space-x-4">
            <Link to="/products">
              <Button variant="outline" className="rounded-full">
                Mua Thêm
              </Button>
            </Link>
            <Link to="/orders">
              <Button className="rounded-full">Xem Đơn Hàng</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Thanh Toán</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Info */}
            <div className="border rounded-2xl p-6 space-y-4">
              <h2 className="font-semibold text-lg">Thông Tin Liên Hệ</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Họ Và Tên *</label>
                  <Input
                    placeholder="Nhập họ và tên"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="rounded-xl"
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">{errors.name}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Số Điện Thoại *</label>
                  <Input
                    placeholder="Nhập số điện thoại"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="rounded-xl"
                  />
                  {errors.phone && (
                    <p className="text-sm text-destructive">{errors.phone}</p>
                  )}
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <label className="text-sm font-medium">Email *</label>
                  <Input
                    type="email"
                    placeholder="Nhập địa chỉ email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="rounded-xl"
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Shipping Address - Display only from user profile */}
            <div className="border rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-lg">Địa Chỉ Giao Hàng</h2>
                <Link to="/profile" className="text-sm text-primary hover:underline">
                  Thay đổi
                </Link>
              </div>
              
              {fullAddress ? (
                <div className="p-4 bg-secondary/30 rounded-xl">
                  <p className="font-medium">{formData.name}</p>
                  <p className="text-sm text-muted-foreground">{formData.phone}</p>
                  <p className="text-sm mt-2">{fullAddress}</p>
                </div>
              ) : (
                <div className="p-4 bg-destructive/10 text-destructive rounded-xl">
                  <p>Bạn chưa có địa chỉ giao hàng.</p>
                  <Link to="/profile" className="text-primary hover:underline">
                    Cập nhật ngay
                  </Link>
                </div>
              )}
            </div>

            {/* Payment Method */}
            <div className="border rounded-2xl p-6 space-y-4">
              <h2 className="font-semibold text-lg flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Phương Thức Thanh Toán
              </h2>
              <div className="border-2 border-primary/30 rounded-xl p-4 bg-primary/5">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full border-2 border-primary bg-primary" />
                  <div>
                    <p className="font-medium">Thanh Toán Khi Nhận Hàng (COD)</p>
                    <p className="text-sm text-muted-foreground">
                      Trả tiền mặt khi nhận được kẹo
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <div className="border rounded-2xl p-6 space-y-4">
              <h2 className="font-semibold text-lg">Đơn Hàng Của Bé</h2>
              <div className="space-y-4 max-h-80 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.product.id} className="flex gap-3">
                    <Image
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded-xl"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">
                        {item.product.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        SL: {item.quantity}
                      </p>
                      <p className="font-medium text-sm text-primary">
                        {formatPrice(item.product.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tạm Tính</span>
                  <span className="font-medium">{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Truck className="w-4 h-4" />
                    Giao Hàng
                  </span>
                  <span className="text-green-600 font-medium">Miễn Phí</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Tổng Cộng</span>
                  <span className="text-primary">{formatPrice(totalPrice)}</span>
                </div>
              </div>
            </div>

            {/* API Error */}
            {apiError && (
              <div className="p-4 bg-destructive/10 text-destructive rounded-lg">
                {apiError}
              </div>
            )}

            <Button
              type="submit"
              className="w-full rounded-full"
              size="lg"
              disabled={isSubmitting || !fullAddress}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                `Đặt Hàng Ngay - ${formatPrice(totalPrice)}`
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}