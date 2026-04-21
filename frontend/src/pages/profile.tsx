/**
 * Profile Page
 * User profile management with API integration
 */
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAuthStore } from '@/stores/auth-store';
import { AddressPicker } from '@/components/cart/address-picker';
import { updateProfile } from '@/api/auth';
import { Loader2 } from 'lucide-react';

export function ProfilePage() {
  const { user, isAuthenticated, updateUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
    email: user?.email || '',
    province: user?.province || '',
    provinceName: user?.provinceName || '',
    ward: user?.ward || '',
    wardName: user?.wardName || '',
    address: user?.address || '',
  });

  // Update form when user data changes
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
        email: user.email || '',
        province: user.province || '',
        provinceName: user.provinceName || '',
        ward: user.ward || '',
        wardName: user.wardName || '',
        address: user.address || '',
      });
    }
  }, [user]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveError('');
    setSaveSuccess(false);

    try {
      // Call API to update profile
      const updatedUser = await updateProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        address: formData.address,
        province: formData.province,
        provinceName: formData.provinceName,
        ward: formData.ward,
        wardName: formData.wardName,
      });

      // Update local store with new user data (this will persist to localStorage)
      updateUser(updatedUser);

      setIsEditing(false);
      setSaveSuccess(true);

      // Clear success message after 3 seconds
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      setSaveError(
        error instanceof Error ? error.message : 'Cập nhật thất bại. Vui lòng thử lại.'
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset form to current user data
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
        email: user.email || '',
        province: user.province || '',
        provinceName: user.provinceName || '',
        ward: user.ward || '',
        wardName: user.wardName || '',
        address: user.address || '',
      });
    }
    setIsEditing(false);
    setSaveError('');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Thông tin tài khoản</h1>
        {!isEditing && (
          <Button variant="outline" onClick={() => setIsEditing(true)}>
            Chỉnh sửa
          </Button>
        )}
      </div>

      {saveSuccess && (
        <div className="p-4 bg-green-100 text-green-800 rounded-lg">
          Cập nhật thông tin thành công!
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Thông tin cá nhân</CardTitle>
          <CardDescription>
            Quản lý thông tin cá nhân của bạn
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {saveError && (
              <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-md">
                {saveError}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Họ</label>
                <Input
                  value={formData.firstName}
                  onChange={(e) => handleChange('firstName', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Tên</label>
                <Input
                  value={formData.lastName}
                  onChange={(e) => handleChange('lastName', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input value={formData.email} disabled />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Số điện thoại</label>
              <Input
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Địa chỉ</label>
              <AddressPicker
                province={formData.province}
                ward={formData.ward}
                address={formData.address}
                disabled={!isEditing}
                onProvinceChange={(value, name) => {
                  handleChange('province', value);
                  if (name) handleChange('provinceName', name);
                }}
                onWardChange={(value, name) => {
                  handleChange('ward', value);
                  if (name) handleChange('wardName', name);
                }}
                onAddressChange={(value) => handleChange('address', value)}
              />
            </div>

            {isEditing && (
              <div className="flex gap-2">
                <Button type="submit" className="flex-1" disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Đang lưu...
                    </>
                  ) : (
                    'Lưu thay đổi'
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isSaving}
                >
                  Hủy
                </Button>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}