/**
 * User type definitions
 * Matches backend API response structure
 */

/**
 * User entity from the backend
 */
export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  phone?: string;
  address?: string;
  province: string;
  provinceName?: string;
  ward: string;
  wardName?: string;
  isActive: boolean;
  createdAt: string;
}

/**
 * User filters for admin API
 */
export interface UserFilters {
  search?: string;
  isActive?: boolean;
  role?: string;
  page?: number;
  pageSize?: number;
}

/**
 * Update user request payload (admin)
 */
export interface UpdateUserRequest {
  firstName: string;
  lastName: string;
  phone?: string;
  address?: string;
  province?: string;
  provinceName?: string;
  ward?: string;
  wardName?: string;
  roles?: string[];
}

/**
 * Update user password request (admin)
 */
export interface UpdateUserPasswordRequest {
  newPassword: string;
}

/**
 * Auth response from login/register API
 */
export interface AuthResponse {
  token: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  phone?: string;
  address?: string;
  province: string;
  provinceName?: string;
  ward: string;
  wardName?: string;
}

/**
 * Registration request payload
 */
export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  province: string;
  provinceName?: string;
  ward: string;
  wardName?: string;
}

/**
 * Login request payload
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Profile update request payload
 */
export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  province?: string;
  provinceName?: string;
  ward?: string;
  wardName?: string;
}

/**
 * User roles
 */
export type UserRole = 'User' | 'Admin';

/**
 * Check if user has specific role
 */
export function hasRole(user: User | null, role: UserRole): boolean {
  if (!user) return false;
  return user.roles.includes(role);
}

/**
 * Check if user is admin
 */
export function isAdmin(user: User | null): boolean {
  return hasRole(user, 'Admin');
}