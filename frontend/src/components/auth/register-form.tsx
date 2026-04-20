/**
 * Register Form Component
 * User registration form with all required fields
 */
import { AddressPicker } from "@/components/cart/address-picker";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/stores/auth-store";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

interface RegisterFormProps {
    /** Callback on successful registration */
    onSuccess?: () => void;
}

/**
 * RegisterForm handles new user registration
 */
export function RegisterForm({ onSuccess }: RegisterFormProps) {
    const navigate = useNavigate();
    const { register, isLoading, error, clearError } = useAuthStore();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        firstName: "",
        lastName: "",
        phone: "",
        province: "",
        ward: "",
        address: "",
    });

    const [validationError, setValidationError] = useState("");

    const handleChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        clearError();
        setValidationError("");

        // Validation
        if (formData.password !== formData.confirmPassword) {
            setValidationError("Mật khẩu xác nhận không khớp");
            return;
        }

        if (formData.password.length < 6) {
            setValidationError("Mật khẩu phải có ít nhất 6 ký tự");
            return;
        }

        try {
            await register({
                email: formData.email,
                password: formData.password,
                firstName: formData.firstName,
                lastName: formData.lastName,
                phone: formData.phone,
                address: formData.address,
                province: formData.province,
                ward: formData.ward,
            });
            onSuccess?.();
            navigate("/");
        } catch {
            // Error is handled by the store
        }
    };

    const hasError = error || validationError;

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold">Đăng ký</CardTitle>
                <CardDescription>Tạo tài khoản mới để mua sắm</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {hasError && (
                        <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-md">
                            {validationError || error}
                        </div>
                    )}

                    {/* Name fields */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label htmlFor="firstName" className="text-sm font-medium">
                                Họ
                            </label>
                            <Input
                                id="firstName"
                                placeholder="Nguyen"
                                value={formData.firstName}
                                onChange={(e) => handleChange("firstName", e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="lastName" className="text-sm font-medium">
                                Tên
                            </label>
                            <Input
                                id="lastName"
                                placeholder="Van A"
                                value={formData.lastName}
                                onChange={(e) => handleChange("lastName", e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium">
                            Email
                        </label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="email@example.com"
                            value={formData.email}
                            onChange={(e) => handleChange("email", e.target.value)}
                            required
                        />
                    </div>

                    {/* Phone */}
                    <div className="space-y-2">
                        <label htmlFor="phone" className="text-sm font-medium">
                            Số điện thoại
                        </label>
                        <Input
                            id="phone"
                            type="tel"
                            placeholder="09xxxxxxxx"
                            value={formData.phone}
                            onChange={(e) => handleChange("phone", e.target.value)}
                            required
                        />
                    </div>

                    {/* Password fields */}
                    <div className="space-y-2">
                        <label htmlFor="password" className="text-sm font-medium">
                            Mật khẩu
                        </label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="Nhập mật khẩu"
                            value={formData.password}
                            onChange={(e) => handleChange("password", e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="confirmPassword" className="text-sm font-medium">
                            Xác nhận mật khẩu
                        </label>
                        <Input
                            id="confirmPassword"
                            type="password"
                            placeholder="Nhập lại mật khẩu"
                            value={formData.confirmPassword}
                            onChange={(e) => handleChange("confirmPassword", e.target.value)}
                            required
                        />
                    </div>

                    {/* Address */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Địa chỉ</label>
                        <AddressPicker
                            province={formData.province}
                            ward={formData.ward}
                            address={formData.address}
                            onProvinceChange={(value) => handleChange("province", value)}
                            onWardChange={(value) => handleChange("ward", value)}
                            onAddressChange={(value) => handleChange("address", value)}
                        />
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? "Đang đăng ký..." : "Đăng ký"}
                    </Button>
                </form>

                <div className="mt-4 text-center text-sm">
                    <span className="text-muted-foreground">Đã có tài khoản? </span>
                    <Link to="/login" className="text-primary hover:underline">
                        Đăng nhập
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
}
