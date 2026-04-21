/**
 * Auth Store - State management for authentication
 * Uses Zustand for global state
 */
import * as authApi from '@/api/auth';
import type { User } from '@/types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Auth state interface
 */
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone: string;
    address: string;
    province: string;
    provinceName: string;
    ward: string;
    wardName: string;
  }) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  clearError: () => void;
  updateUser: (user: User) => void;
}

/**
 * Create auth store with persistence
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      /**
       * Login action
       */
      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });

        try {
          const response = await authApi.login({ email, password });

          // Store token and user
          localStorage.setItem('auth_token', response.token);

          set({
            user: {
              id: 0,
              email: response.email,
              firstName: response.firstName,
              lastName: response.lastName,
              roles: response.roles,
              phone: response.phone,
              address: response.address,
              province: response.province,
              provinceName: response.provinceName,
              ward: response.ward,
              wardName: response.wardName,
              isActive: true,
              createdAt: new Date().toISOString(),
            },
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });

          // Handle different error status codes
          if (error && typeof error === 'object' && 'response' in error) {
            const axiosError = error as { response?: { status: number; data?: { message?: string } } };
            const status = axiosError.response?.status;
            const message = axiosError.response?.data?.message;

            if (status === 400) {
              // Account disabled
              set({ error: message });
            } else if (status === 401) {
              // Invalid credentials
              set({ error: message });
            } else {
              set({ error: message });
            }
          } else {
            set({
              error:
                error instanceof Error
                  ? error.message
                  : 'Đăng nhập thất bại',
            });
          }
          throw error;
        }
      },

      /**
       * Register action
       */
      register: async (data) => {
        set({ isLoading: true, error: null });

        try {
          const response = await authApi.register(data);

          // Store token and user
          localStorage.setItem('auth_token', response.token);

          set({
            user: {
              id: 0,
              email: response.email,
              firstName: response.firstName,
              lastName: response.lastName,
              roles: response.roles,
              phone: response.phone,
              address: response.address,
              province: response.province,
              provinceName: response.provinceName,
              ward: response.ward,
              wardName: response.wardName,
              isActive: true,
              createdAt: new Date().toISOString(),
            },
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({
            isLoading: false,
            error:
              error instanceof Error
                ? error.message
                : 'Đăng ký thất bại',
          });
          throw error;
        }
      },

      /**
       * Logout action
       */
      logout: () => {
        localStorage.removeItem('auth_token');
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });
      },

      /**
       * Check authentication status
       */
      checkAuth: async () => {
        const token = localStorage.getItem('auth_token');
        if (!token) {
          set({ isAuthenticated: false, user: null, token: null });
          return;
        }

        set({ isLoading: true });

        try {
          const user = await authApi.getCurrentUser();
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch {
          localStorage.removeItem('auth_token');
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },

/**
        * Clear error
        */
       clearError: () => {
         set({ error: null });
       },

      /**
       * Update user data in store
       */
      updateUser: (user: User) => {
        set({ user });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

/**
 * Selector for checking if user is admin
 */
export const selectIsAdmin = (state: AuthState) =>
  state.user?.roles.includes('Admin') ?? false;

/**
 * Selector for getting user full name
 */
export const selectUserFullName = (state: AuthState) =>
  state.user ? `${state.user.firstName} ${state.user.lastName}` : '';
