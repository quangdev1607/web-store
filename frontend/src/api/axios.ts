/**
 * Axios instance configuration with interceptors
 */
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { API_CONFIG, STORAGE_KEYS } from '@/config/constants';

/**
 * Create axios instance with default configuration
 */
const axiosInstance = axios.create({
  baseURL: API_CONFIG.baseUrl,
  timeout: API_CONFIG.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request interceptor - adds auth token to requests
 */
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get token from localStorage
    const token = localStorage.getItem(STORAGE_KEYS.authToken);

    // Add token to authorization header if it exists
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor - handles common errors
 */
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response) {
      const status = error.response.status;

      // Handle 401 Unauthorized - clear auth data
      if (status === 401) {
        localStorage.removeItem(STORAGE_KEYS.authToken);
        localStorage.removeItem(STORAGE_KEYS.user);

        // Optionally redirect to login
        // window.location.href = '/login';
      }

      // Handle 403 Forbidden
      if (status === 403) {
        console.error('Access forbidden');
      }

      // Handle 500+ server errors
      if (status >= 500) {
        console.error('Server error - please try again later');
      }
    }

    return Promise.reject(error);
  }
);

export { axiosInstance };

export default axiosInstance;