/**
 * Address Picker Component
 * Province/Ward selection for shipping address
 * Fetches data from backend API
 */
import { useState, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { axiosInstance } from '@/api/axios';

interface Province {
  id: number;
  name: string;
  divisionType: string;
  codeName: string;
  phoneCode: number;
}

interface Ward {
  id: number;
  name: string;
  code: number;
  divisionType: string;
  codeName: string;
  provinceCode: number;
}

interface AddressPickerProps {
  /** Selected province code */
  province?: string;
  /** Selected ward code */
  ward?: string;
  /** Detailed address */
  address?: string;
  /** Callback when province changes */
  onProvinceChange?: (value: string, name?: string) => void;
  /** Callback when ward changes */
  onWardChange?: (value: string, name?: string) => void;
  /** Callback when address detail changes */
  onAddressChange?: (value: string) => void;
}

async function fetchProvinces(): Promise<Province[]> {
  const response = await axiosInstance.get('/locations/provinces');
  return response.data;
}

async function fetchWards(provinceCode: number): Promise<Ward[]> {
  const response = await axiosInstance.get(`/locations/provinces/${provinceCode}/wards`);
  return response.data;
}

export function AddressPicker({
  province,
  ward,
  address,
  onProvinceChange,
  onWardChange,
  onAddressChange,
}: AddressPickerProps) {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);

  const [loadingProvinces, setLoadingProvinces] = useState(true);
  const [loadingWards, setLoadingWards] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [selectedProvinceCode, setSelectedProvinceCode] = useState<string>(province || '');
  const [selectedWardCode, setSelectedWardCode] = useState<string>(ward || '');

  // Fetch provinces on mount
  useEffect(() => {
    let mounted = true;

    async function loadProvinces() {
      try {
        setLoadingProvinces(true);
        setError(null);
        const data = await fetchProvinces();
        if (mounted) {
          setProvinces(data);
        }
      } catch (err) {
        if (mounted) {
          setError('Không thể tải danh sách tỉnh/thành phố');
          console.error('Error fetching provinces:', err);
        }
      } finally {
        if (mounted) {
          setLoadingProvinces(false);
        }
      }
    }

    loadProvinces();

    return () => {
      mounted = false;
    };
  }, []);

  // Fetch wards when province changes
  useEffect(() => {
    if (!selectedProvinceCode) {
      setWards([]);
      return;
    }

    let mounted = true;

    async function loadWards() {
      try {
        setLoadingWards(true);
        setError(null);
        const data = await fetchWards(Number(selectedProvinceCode));
        if (mounted) {
          setWards(data);
          // Set initial ward if provided and province matches
          if (ward) {
            setSelectedWardCode(ward);
          }
        }
      } catch (err) {
        if (mounted) {
          setError('Không thể tải danh sách phường/xã');
          console.error('Error fetching wards:', err);
        }
      } finally {
        if (mounted) {
          setLoadingWards(false);
        }
      }
    }

    loadWards();

    return () => {
      mounted = false;
    };
  }, [selectedProvinceCode]);

  // Sync with props
  useEffect(() => {
    if (province) {
      setSelectedProvinceCode(province);
    }
  }, [province]);

  useEffect(() => {
    if (ward) {
      setSelectedWardCode(ward);
    }
  }, [ward]);

  const handleProvinceChange = useCallback((value: string) => {
    setSelectedProvinceCode(value);
    setSelectedWardCode('');
    const province = provinces.find(p => p.id === Number(value));
    onProvinceChange?.(value, province?.name);
  }, [onProvinceChange, provinces]);

  const handleWardChange = useCallback((value: string) => {
    setSelectedWardCode(value);
    const ward = wards.find(w => w.code === Number(value));
    onWardChange?.(value, ward?.name);
  }, [onWardChange, wards]);

  const selectedProvince = provinces.find(p => p.id === Number(selectedProvinceCode));
  const selectedWard = wards.find(w => w.code === Number(selectedWardCode));

  return (
    <div className="space-y-4">
      {error && (
        <div className="text-sm text-red-500 p-2 bg-red-50 rounded">
          {error}
        </div>
      )}

      {/* Province */}
      <div>
        <label className="text-sm font-medium">Tỉnh/Thành phố</label>
        <Select
          value={selectedProvinceCode}
          onValueChange={handleProvinceChange}
          disabled={loadingProvinces}
        >
          <SelectTrigger>
            <SelectValue
              placeholder={
                loadingProvinces
                  ? 'Đang tải...'
                  : province && selectedProvince
                  ? selectedProvince.name
                  : 'Chọn tỉnh/thành phố'
              }
            />
          </SelectTrigger>
          <SelectContent>
            {provinces.map((p) => (
              <SelectItem key={p.id} value={String(p.id)}>
                {p.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Ward */}
      {selectedProvinceCode && (
        <div>
          <label className="text-sm font-medium">Phường/Xã</label>
          <Select
            value={selectedWardCode}
            onValueChange={handleWardChange}
            disabled={loadingWards}
          >
            <SelectTrigger>
              <SelectValue
                placeholder={
                  loadingWards
                    ? 'Đang tải...'
                    : ward && selectedWard
                    ? selectedWard.name
                    : 'Chọn phường/xã'
                }
              />
            </SelectTrigger>
            <SelectContent>
              {wards.map((w) => (
                <SelectItem key={w.code} value={String(w.code)}>
                  {w.name}
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
