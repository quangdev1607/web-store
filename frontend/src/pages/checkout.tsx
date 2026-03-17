import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '@/hooks/use-cart';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Image } from '@/components/ui/image';
import { Check, Truck, CreditCard } from 'lucide-react';

interface Province {
  code: number;
  name: string;
}

interface District {
  code: number;
  name: string;
}

interface Ward {
  code: number;
  name: string;
}

interface FormData {
  name: string;
  phone: string;
  email: string;
  province: string;
  district: string;
  ward: string;
  address: string;
}

const initialFormData: FormData = {
  name: '',
  phone: '',
  email: '',
  province: '',
  district: '',
  ward: '',
  address: '',
};

export function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [errors, setErrors] = useState<Partial<FormData>>({});

  useEffect(() => {
    fetch('https://provinces.open-api.vn/api/p/')
      .then(res => res.json())
      .then(data => setProvinces(data))
      .catch(err => console.error('Failed to fetch provinces:', err));
  }, []);

  useEffect(() => {
    if (formData.province) {
      fetch(`https://provinces.open-api.vn/api/p/${formData.province}?depth=2`)
        .then(res => res.json())
        .then(data => setDistricts(data.districts || []))
        .catch(err => console.error('Failed to fetch districts:', err));
    }
  }, [formData.province]);

  useEffect(() => {
    if (formData.district) {
      fetch(`https://provinces.open-api.vn/api/d/${formData.district}?depth=2`)
        .then(res => res.json())
        .then(data => setWards(data.wards || []))
        .catch(err => console.error('Failed to fetch wards:', err));
    }
  }, [formData.district]);

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

    if (!formData.province) {
      newErrors.province = 'Tỉnh/Thành phố là bắt buộc';
    }

    if (!formData.district) {
      newErrors.district = 'Quận/Huyện là bắt buộc';
    }

    if (!formData.ward) {
      newErrors.ward = 'Phường/Xã là bắt buộc';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Địa chỉ là bắt buộc';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    await new Promise(resolve => setTimeout(resolve, 1000));

    clearCart();
    setOrderId(Math.random().toString(36).substring(2, 10).toUpperCase());
    setOrderComplete(true);
    setIsSubmitting(false);
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    if (field === 'province') {
      setFormData({ name: formData.name, phone: formData.phone, email: formData.email, province: value, district: '', ward: '', address: '' });
    } else if (field === 'district') {
      setFormData(prev => ({ ...prev, district: value, ward: '' }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const getProvinceName = (code: string) => {
    return provinces.find(p => p.code.toString() === code)?.name || '';
  };

  const getDistrictName = (code: string) => {
    return districts.find(d => d.code.toString() === code)?.name || '';
  };

  const getWardName = (code: string) => {
    return wards.find(w => w.code.toString() === code)?.name || '';
  };

  const shippingAddress = formData.province
    ? `${formData.address}, ${getWardName(formData.ward)}, ${getDistrictName(formData.district)}, ${getProvinceName(formData.province)}`
    : '';

  if (items.length === 0 && !orderComplete) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Thanh Toán</h1>
        <div className="border rounded-lg p-6">
          <p className="text-center text-muted-foreground py-8">Giỏ hàng của bạn trống</p>
          <div className="text-center">
            <Link to="/products"><Button variant="outline">Tiếp Tục Mua Sắm</Button></Link>
          </div>
        </div>
      </div>
    );
  }

  if (orderComplete) {
    return (
      <div className="max-w-2xl mx-auto text-center space-y-6">
        <div className="border rounded-lg p-12">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Đặt Hàng Thành Công!</h1>
          <p className="text-muted-foreground mb-6">
            Cảm ơn bạn đã đặt hàng. Đơn hàng của bạn đã được tiếp nhận và sẽ được xử lý trong thời gian sớm nhất.
          </p>
          <p className="text-sm text-muted-foreground mb-8">
            Mã đơn hàng: #{orderId}
          </p>
          <div className="flex justify-center space-x-4">
            <Link to="/products"><Button variant="outline">Tiếp Tục Mua Sắm</Button></Link>
            <Link to="/"><Button>Về Trang Chủ</Button></Link>
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
            <div className="border rounded-lg p-6 space-y-4">
              <h2 className="font-semibold text-lg">Thông Tin Liên Hệ</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Họ Và Tên *</label>
                  <Input
                    placeholder="Nhập họ và tên của bạn"
                    value={formData.name}
                    onChange={e => handleInputChange('name', e.target.value)}
                  />
                  {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Số Điện Thoại *</label>
                  <Input
                    placeholder="Nhập số điện thoại"
                    value={formData.phone}
                    onChange={e => handleInputChange('phone', e.target.value)}
                  />
                  {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <label className="text-sm font-medium">Email *</label>
                  <Input
                    type="email"
                    placeholder="Nhập địa chỉ email"
                    value={formData.email}
                    onChange={e => handleInputChange('email', e.target.value)}
                  />
                  {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-6 space-y-4">
              <h2 className="font-semibold text-lg">Địa Chỉ Giao Hàng</h2>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tỉnh/Thành Phố *</label>
                  <Select
                    value={formData.province}
                    onValueChange={value => handleInputChange('province', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn" />
                    </SelectTrigger>
                    <SelectContent>
                      {provinces.map(province => (
                        <SelectItem key={province.code} value={province.code.toString()}>
                          {province.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.province && <p className="text-sm text-red-500">{errors.province}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Quận/Huyện *</label>
                  <Select
                    value={formData.district}
                    onValueChange={value => handleInputChange('district', value)}
                    disabled={!formData.province}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn" />
                    </SelectTrigger>
                    <SelectContent>
                      {districts.map(district => (
                        <SelectItem key={district.code} value={district.code.toString()}>
                          {district.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.district && <p className="text-sm text-red-500">{errors.district}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Phường/Xã *</label>
                  <Select
                    value={formData.ward}
                    onValueChange={value => handleInputChange('ward', value)}
                    disabled={!formData.district}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn" />
                    </SelectTrigger>
                    <SelectContent>
                      {wards.map(ward => (
                        <SelectItem key={ward.code} value={ward.code.toString()}>
                          {ward.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.ward && <p className="text-sm text-red-500">{errors.ward}</p>}
                </div>

                <div className="space-y-2 sm:col-span-3">
                  <label className="text-sm font-medium">Địa Chỉ Chi Tiết *</label>
                  <Input
                    placeholder="Nhập địa chỉ chi tiết (số nhà, đường, v.v.)"
                    value={formData.address}
                    onChange={e => handleInputChange('address', e.target.value)}
                  />
                  {errors.address && <p className="text-sm text-red-500">{errors.address}</p>}
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-6 space-y-4">
              <h2 className="font-semibold text-lg flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Phương Thức Thanh Toán
              </h2>
              <div className="border rounded-lg p-4 bg-primary/5">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full border-2 border-primary bg-primary" />
                  <div>
                    <p className="font-medium">Thanh Toán Khi Nhận Hàng (COD)</p>
                    <p className="text-sm text-muted-foreground">Thanh toán khi nhận được hàng</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="border rounded-lg p-6 space-y-4">
              <h2 className="font-semibold text-lg">Tổng Quan Đơn Hàng</h2>
              <div className="space-y-4 max-h-80 overflow-y-auto">
                {items.map(item => (
                  <div key={item.product.id} className="flex gap-3">
                    <Image
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{item.product.name}</p>
                      <p className="text-sm text-muted-foreground">SL: {item.quantity}</p>
                      <p className="font-medium text-sm">${(item.product.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tạm Tính</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Truck className="w-4 h-4" />
                    Vận Chuyển
                  </span>
                  <span>Miễn Phí</span>
                </div>
                <div className="flex justify-between font-semibold text-lg border-t pt-2">
                  <span>Tổng Cộng</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {shippingAddress && (
              <div className="border rounded-lg p-4 space-y-2">
                <h3 className="font-medium text-sm">Giao hàng đến:</h3>
                <p className="text-sm text-muted-foreground">{formData.name}</p>
                <p className="text-sm text-muted-foreground">{formData.phone}</p>
                <p className="text-sm text-muted-foreground">{shippingAddress}</p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Đang xử lý...' : `Đặt Hàng - $${totalPrice.toFixed(2)}`}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
