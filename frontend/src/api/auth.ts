/**
 * Authentication API endpoints
 */
import axios from '@/api/axios';
import type {
  ApiResponse,
  AuthResponse,
  RegisterRequest,
  LoginRequest,
  UpdateProfileRequest,
  User,
} from '@/types';

/**
 * Register a new user
 * POST /api/auth/register
 */
export async function register(data: RegisterRequest): Promise<AuthResponse> {
  const response = await axios.post<ApiResponse<AuthResponse>>(
    '/auth/register',
    data
  );
  return response.data.data;
}

/**
 * Login with email and password
 * POST /api/auth/login
 */
export async function login(data: LoginRequest): Promise<AuthResponse> {
  const response = await axios.post<ApiResponse<AuthResponse>>('/auth/login', data);
  return response.data.data;
}

/**
 * Get current user profile
 * GET /api/auth/me
 */
export async function getCurrentUser(): Promise<User> {
  const response = await axios.get<ApiResponse<User>>('/auth/me');
  return response.data.data;
}

/**
 * Update user profile
 * PUT /api/auth/me
 */
export async function updateProfile(
  data: UpdateProfileRequest
): Promise<User> {
  const response = await axios.put<ApiResponse<User>>('/auth/me', data);
  return response.data.data;
}

/**
 * Logout user (client-side only - clears token)
 */
export function logout(): void {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user');
}