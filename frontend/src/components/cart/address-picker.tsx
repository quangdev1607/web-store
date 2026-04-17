/**
 * Address Picker Component
 * Province/District/Ward selection for shipping address
 */
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AddressPickerProps {
  /** Selected province */
  province?: string;
  /** Selected district */
  district?: string;
  /** Selected ward */
  ward?: string;
  /** Detailed address */
  address?: string;
  /** Callback when province changes */
  onProvinceChange?: (value: string) => void;
  /** Callback when district changes */
  onDistrictChange?: (value: string) => void;
  /** Callback when ward changes */
  onWardChange?: (value: string) => void;
  /** Callback when address detail changes */
  onAddressChange?: (value: string) => void;
}

/**
 * Vietnamese provinces data (simplified - in production, fetch from API)
 */
const VIETNAM_PROVINCES = [
  'TP Hồ Chí Minh',
  'Hà Nội',
  'Đà Nẵng',
  'Hải Phòng',
  'Cần Thơ',
  'An Giang',
  'Bà Rịa - Vũng Tàu',
  'Bắc Giang',
  'Bắc Kạn',
  'Bạc Liêu',
  'Bắc Ninh',
  'Bến Tre',
  'Bình Định',
  'Bình Dương',
  'Bình Phước',
  'Bình Thuận',
  'Cà Mau',
  'Cao Bằng',
  'Đắk Lắk',
  'Đắk Nông',
  'Điện Biên',
  'Đồng Nai',
  'Đồng Tháp',
  'Gia Lai',
  'Hà Giang',
  'Hà Nam',
  'Hà Tĩnh',
  'Hải Dương',
  'Hậu Giang',
  'Hòa Bình',
  'Hưng Yên',
  'Khánh Hòa',
  'Kiên Giang',
  'Kon Tum',
  'Lai Châu',
  'Lâm Đồng',
  'Lạng Sơn',
  'Lào Cai',
  'Long An',
  'Nam Định',
  'Nghệ An',
  'Ninh Bình',
  'Ninh Thuận',
  'Phú Thọ',
  'Phú Yên',
  'Quảng Bình',
  'Quảng Nam',
  'Quảng Ngãi',
  'Quảng Ninh',
  'Quảng Trị',
  'Sóc Trăng',
  'Sơn La',
  'Tây Ninh',
  'Thái Bình',
  'Thái Nguyên',
  'Thanh Hóa',
  'Thừa Thiên Huế',
  'Tiền Giang',
  'Trà Vinh',
  'Tuyên Quang',
  'Vĩnh Long',
  'Vĩnh Phúc',
  'Yên Bái',
];

// Sample districts by province
const DISTRICTS: Record<string, string[]> = {
  'TP Hồ Chí Minh': [
    'Quận 1',
    'Quận 3',
    'Quận 4',
    'Quận 5',
    'Quận 6',
    'Quận 7',
    'Quận 8',
    'Quận 10',
    'Quận 11',
    'Quận 12',
    'Bình Thạnh',
    'Gò Vấp',
    'Phú Nhuận',
    'Tân Bình',
    'Tân Phú',
    'Thủ Đức',
    'Hóc Môn',
    'Củ Chi',
    'Nhà Bè',
    'Bình Chánh',
    'Cần Giờ',
  ],
  'Hà Nội': [
    'Quận Ba Đình',
    'Quận Hoàn Kiếm',
    'Quận Đống Đa',
    'Quận Cầu Giấy',
    'Quận Than Xuân',
    'Quận Long Biên',
    'Quận Nam Từ Liêm',
    'Quận Bắc Từ Liêm',
    'Quận Hà Đông',
    'Quận Hai Bà Trưng',
    'Quận Thanh Xuân',
    'Quận Hoàng Mai',
    'Quận Đông Anh',
    'Quận Gia Lâm',
    'Quận Sơn Tây',
    'Quận Thường Tín',
    'Quận Phú Xuyên',
    'Quận Sóc Sơn',
    'Quận Mỹ Đức',
    'Quận Chương Mỹ',
    'Quận Thanh Oai',
    'Quận Quốc Oai',
    'Quận Phúc Thọ',
    'Quận Đan Phượng',
    'Quận Hoài Đức',
    'Huyện Tây Hồ',
    'Huyện Ba Vì',
    'Huyện Phúc Thọ',
    'Huyện Thạch Thất',
    'Huyện Quốc Oai',
    'Huyện Chương Mỹ',
    'Huyện Đan Phượng',
    'Huyện Hoài Đức',
  ],
};

// Get wards (simplified - in production would be more detailed)
const WARDS = [
  'Phường 1',
  'Phường 2',
  'Phường 3',
  'Phường 4',
  'Phường 5',
  'Phường 6',
  'Phường 7',
  'Phường 8',
  'Phường 9',
  'Phường 10',
  'Phường 11',
  'Phường 12',
  'Phường 13',
  'Phường 14',
  'Phường 15',
];

/**
 * AddressPicker provides province/district/ward selection
 */
export function AddressPicker({
  province,
  district,
  ward,
  address,
  onProvinceChange,
  onDistrictChange,
  onWardChange,
  onAddressChange,
}: AddressPickerProps) {
  const [selectedProvince, setSelectedProvince] = useState(province || '');
  const [selectedDistrict, setSelectedDistrict] = useState(district || '');

  const handleProvinceChange = (value: string) => {
    setSelectedProvince(value);
    setSelectedDistrict('');
    onProvinceChange?.(value);
  };

  const handleDistrictChange = (value: string) => {
    setSelectedDistrict(value);
    onDistrictChange?.(value);
  };

  const districts = DISTRICTS[selectedProvince] || [];

  return (
    <div className="space-y-4">
      {/* Province */}
      <div>
        <label className="text-sm font-medium">Tỉnh/Thành phố</label>
        <Select value={province} onValueChange={handleProvinceChange}>
          <SelectTrigger>
            <SelectValue placeholder="Chọn tỉnh/thành phố" />
          </SelectTrigger>
          <SelectContent>
            {VIETNAM_PROVINCES.map((p) => (
              <SelectItem key={p} value={p}>
                {p}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* District */}
      {selectedProvince && (
        <div>
          <label className="text-sm font-medium">Quận/Huyện</label>
          <Select value={district} onValueChange={onDistrictChange}>
            <SelectTrigger>
              <SelectValue placeholder="Chọn quận/huyện" />
            </SelectTrigger>
            <SelectContent>
              {districts.map((d) => (
                <SelectItem key={d} value={d}>
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Ward */}
      {selectedDistrict && (
        <div>
          <label className="text-sm font-medium">Phường/Xã</label>
          <Select value={ward} onValueChange={onWardChange}>
            <SelectTrigger>
              <SelectValue placeholder="Chọn phường/xã" />
            </SelectTrigger>
            <SelectContent>
              {WARDS.map((w) => (
                <SelectItem key={w} value={w}>
                  {w}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Address detail */}
      <div>
        <label className="text-sm font-medium">Địa chỉ chi tiết</label>
        <Input
          placeholder="Số nhà, tên đường..."
          value={address}
          onChange={(e) => onAddressChange?.(e.target.value)}
        />
      </div>
    </div>
  );
}