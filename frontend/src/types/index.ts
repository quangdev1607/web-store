// User types
export type {
  User,
  AuthResponse,
  RegisterRequest,
  LoginRequest,
  UpdateProfileRequest,
  UserRole,
  UserFilters,
  UpdateUserRequest,
  UpdateUserPasswordRequest,
  hasRole,
  isAdmin,
} from './user';

// Product types (existing)
export type { Product } from './product';

// Category types
export type {
  Category,
  CategoryOption,
  PaginatedCategories,
} from './category';

// Cart types
export type {
  CartItem,
  Cart,
  AddToCartRequest,
  UpdateCartItemRequest,
  LocalCartItem,
  LocalCart,
  calculateCartTotals,
} from './cart';

// Order types
export type {
  OrderStatus,
  ShippingAddress,
  CustomerInfo,
  OrderItem,
  Order,
  CreateOrderRequest,
  CreateOrderResponse,
  PaginatedOrders,
  ORDER_STATUS_LABELS,
  ORDER_STATUS_COLORS,
  getOrderStatusLabel,
} from './order';

// API types
export type {
  ApiError,
  ApiResponse,
  PaginatedResponse,
  ProductSortOption,
  ProductFilters,
  CategoryFilters,
  OrderFilters,
  DashboardStats,
  RequestConfig,
  TokenPayload,
} from './api';