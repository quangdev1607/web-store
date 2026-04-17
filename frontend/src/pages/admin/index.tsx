/**
 * Admin Dashboard Page
 * Admin dashboard with statistics and management
 */
import { useState, useEffect, useCallback } from 'react';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/modal';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuthStore } from '@/stores/auth-store';
import { RotateCcwIcon, PlusIcon, PencilIcon, TrashIcon } from 'lucide-react';
import { formatPrice, formatDate } from '@/lib/format';
import { getOrderStatusLabel } from '@/types/order';
import {
  getDashboardStats,
  getAdminOrders,
  updateOrderStatus,
  getAdminProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getAdminCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  uploadImage,
} from '@/api/admin';
import type {
  DashboardStats,
  Order,
  OrderStatus,
  PaginatedOrders,
  OrderFilters,
  Product,
  ProductFilters,
  Category,
  CategoryFilters,
} from '@/types';

// Label component for forms
function Label({ children, htmlFor, className }: { children: React.ReactNode; htmlFor?: string; className?: string }) {
  return (
    <label htmlFor={htmlFor} className={className || 'text-sm font-medium'}>
      {children}
    </label>
  );
}

// Textarea component for forms
function Textarea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={className || 'flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50'}
      {...props}
    />
  );
}

// Default empty stats
const DEFAULT_STATS: DashboardStats = {
  totalOrders: 0,
  totalProducts: 0,
  totalCategories: 0,
  totalUsers: 0,
  totalRevenue: 0,
  pendingOrders: 0,
  completedOrders: 0,
  recentOrders: [],
};

type TabType = 'dashboard' | 'orders' | 'products' | 'categories';

export function AdminPage() {
  const { user, isAuthenticated } = useAuthStore();
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [stats, setStats] = useState<DashboardStats>(DEFAULT_STATS);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [orderFilters, setOrderFilters] = useState<OrderFilters>({
    page: 1,
    pageSize: 20,
  });
  const [, setStatsError] = useState<string | null>(null);
  const [, setOrdersError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch dashboard stats
  const fetchStats = useCallback(async () => {
    try {
      setStatsError(null);
      const data = await getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
      setStatsError('Không thể tải dữ liệu thống kê');
    }
  }, []);

  // Fetch orders
  const fetchOrders = useCallback(async () => {
    try {
      setIsLoading(true);
      setOrdersError(null);
      const data: PaginatedOrders = await getAdminOrders(orderFilters);
      setOrders(data.items);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      setOrdersError('Không thể tải danh sách đơn hàng');
    } finally {
      setIsLoading(false);
    }
  }, [orderFilters]);

  // Refresh all data
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await Promise.all([fetchStats(), fetchOrders()]);
    setIsRefreshing(false);
  }, [fetchStats, fetchOrders]);

  // Initial data fetch
  useEffect(() => {
    fetchStats();
    fetchOrders();
  }, [fetchStats, fetchOrders]);

  // Check if user is admin
  if (!isAuthenticated || !user?.roles.includes('Admin')) {
    return <Navigate to="/" replace />;
  }

  // Handle status change
  const handleStatusChange = useCallback(
    async (orderId: number, status: OrderStatus) => {
      try {
        await updateOrderStatus(orderId, status);
        // Refresh orders after status update
        fetchOrders();
      } catch (error) {
        console.error('Failed to update order status:', error);
      }
    },
    [fetchOrders]
  );

  const tabs = [
    { id: 'dashboard', label: 'Tổng quan' },
    { id: 'orders', label: 'Đơn hàng' },
    { id: 'products', label: 'Sản phẩm' },
    { id: 'categories', label: 'Danh mục' },
  ] as const;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Quản trị viên</h1>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RotateCcwIcon
              className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`}
            />
            {isRefreshing ? 'Đang tải...' : 'Làm mới'}
          </Button>
          <p className="text-muted-foreground">
            Xin chào, {user?.firstName} {user?.lastName}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
              activeTab === tab.id
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && <DashboardContent stats={stats} />}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <OrdersContent
          orders={orders}
          isLoading={isLoading}
          onStatusChange={handleStatusChange}
        />
      )}

      {/* Products Tab */}
      {activeTab === 'products' && (
        <ProductsContent />
      )}

      {/* Categories Tab */}
      {activeTab === 'categories' && (
        <CategoriesContent />
      )}
    </div>
  );
}

/**
 * Dashboard statistics content
 */
function DashboardContent({ stats }: { stats: DashboardStats }) {
  const statCards = [
    { title: 'Tổng đơn hàng', value: stats.totalOrders, color: 'blue' },
    { title: 'Đơn chờ xử lý', value: stats.pendingOrders, color: 'yellow' },
    { title: 'Đơn hoàn thành', value: stats.completedOrders, color: 'green' },
    { title: 'Tổng sản phẩm', value: stats.totalProducts, color: 'purple' },
    { title: 'Tổng danh mục', value: stats.totalCategories, color: 'orange' },
    { title: 'Tổng khách hàng', value: stats.totalUsers, color: 'pink' },
  ];

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">{stat.title}</p>
              <p className="text-2xl font-bold mt-1">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Revenue */}
      <Card>
        <CardHeader>
          <CardTitle>Doanh thu</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-primary">
            {formatPrice(stats.totalRevenue)}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * Orders management content
 */
function OrdersContent({
  orders,
  isLoading,
  onStatusChange,
}: {
  orders: Order[];
  isLoading: boolean;
  onStatusChange: (orderId: number, status: OrderStatus) => Promise<void>;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Quản lý đơn hàng</h2>
      </div>

      {isLoading ? (
        <div className="text-center py-8">Đang tải...</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          Chưa có đơn hàng nào
        </div>
      ) : (
        <div className="space-y-2">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{order.orderCode}</span>
                      <Badge variant={getBadgeVariant(order.status)}>
                        {getOrderStatusLabel(order.status)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {order.customerName} • {order.customerPhone} •
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-semibold">
                      {formatPrice(order.totalAmount)}
                    </span>
                    <select
                      className="border rounded-md px-2 py-1 text-sm"
                      value={order.status}
                      onChange={(e) =>
                        onStatusChange(order.id, e.target.value as OrderStatus)
                      }
                    >
                      <option value="pending">Chờ xác nhận</option>
                      <option value="confirmed">Đã xác nhận</option>
                      <option value="shipping">Đang giao</option>
                      <option value="delivered">Đã giao</option>
                      <option value="cancelled">Đã hủy</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Products management content with CRUD
 */
function ProductsContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    categoryId: '',
    imageUrl: '',
    inStock: true,
    stockQuantity: '',
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const fetchProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getAdminProducts({ pageSize: 100 });
      setProducts(data.items);
    } catch (err) {
      console.error('Failed to fetch products:', err);
      setError('Không thể tải danh sách sản phẩm');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const data = await getAdminCategories({ pageSize: 100 });
      setCategories(data.items);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await fetchProducts();
    setIsRefreshing(false);
  }, [fetchProducts]);

  const openModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      const categoryIdValue = product.categoryId?.toString() || '';
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price?.toString() || '',
        categoryId: categoryIdValue,
        imageUrl: product.images?.[0] || '',
        inStock: product.inStock ?? true,
        stockQuantity: product.stockQuantity?.toString() || '0',
      });
      setImagePreviews(product.images || []);
      setSelectedFiles([]);
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        categoryId: '',
        imageUrl: '',
        inStock: true,
        stockQuantity: '0',
      });
      setImagePreviews([]);
      setSelectedFiles([]);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setSelectedFiles([]);
    setImagePreviews([]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setSelectedFiles((prev) => [...prev, ...files]);
      const newPreviews = files.map((file) => URL.createObjectURL(file));
      setImagePreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsUploading(true);
      
      let imageUrls: string[] = [];
      
      if (selectedFiles.length > 0) {
        for (const file of selectedFiles) {
          const result = await uploadImage(file, 'products');
          imageUrls.push(result.url);
        }
      } else if (formData.imageUrl) {
        imageUrls = [formData.imageUrl];
      }

      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseInt(formData.price, 10),
        images: imageUrls,
        inStock: formData.inStock,
        stockQuantity: parseInt(formData.stockQuantity, 10) || 0,
        categoryId: formData.categoryId ? parseInt(formData.categoryId, 10) : undefined,
      };

      if (editingProduct) {
        await updateProduct(editingProduct.id as number, productData);
      } else {
        await createProduct(productData);
      }
      closeModal();
      fetchProducts();
    } catch (err) {
      console.error('Failed to save product:', err);
      setError('Không thể lưu sản phẩm');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) return;
    try {
      await deleteProduct(id);
      fetchProducts();
    } catch (err) {
      console.error('Failed to delete product:', err);
      setError('Không thể xóa sản phẩm');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Quản lý sản phẩm</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          <RotateCcwIcon className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Đang tải...' : 'Làm mới'}
        </Button>
      </div>

      <Button onClick={() => openModal()} className="mb-4">
        <PlusIcon className="w-4 h-4 mr-2" />
        Thêm sản phẩm
      </Button>

      {error && (
        <div className="p-4 bg-destructive/10 text-destructive rounded-lg">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          Chưa có sản phẩm nào
        </div>
      ) : (
        <div className="border rounded-lg divide-y">
          {products.map((product) => (
            <div
              key={product.id}
              className="flex items-center justify-between p-4 gap-4"
            >
              <div className="flex items-center gap-4 flex-1">
                {product.images?.[0] && (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                )}
                <div>
                  <p className="font-medium">{product.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {product.category} • {formatPrice(product.price)} • Tồn kho: {product.stockQuantity ?? 0}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={product.inStock ? 'success' : 'destructive'}>
                  {product.inStock ? `Còn hàng (${product.stockQuantity ?? 0})` : 'Hết hàng'}
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openModal(product)}
                >
                  <PencilIcon className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(product.id as number)}
                >
                  <TrashIcon className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Product Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? 'Sửa sản phẩm' : 'Thêm sản phẩm'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Tên sản phẩm</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Mô tả</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Giá (VND)</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="categoryId">Danh mục</Label>
              <Select
                value={formData.categoryId}
                onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn danh mục" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id.toString()}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Hình ảnh</Label>
              <div className="border-2 border-dashed rounded-lg p-4">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                  id="product-image-upload"
                />
                <label
                  htmlFor="product-image-upload"
                  className="flex flex-col items-center justify-center cursor-pointer py-4"
                >
                  <PlusIcon className="w-8 h-8 text-muted-foreground mb-2" />
                  <span className="text-sm text-muted-foreground">
                    Nhấn để chọn ảnh (chọn nhiều ảnh)
                  </span>
                </label>
              </div>
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-20 h-20 object-cover rounded border"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <TrashIcon className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="imageUrl">Hoặc nhập URL ảnh</Label>
              <Input
                id="imageUrl"
                value={formData.imageUrl}
                onChange={(e) =>
                  setFormData({ ...formData, imageUrl: e.target.value })
                }
                placeholder="https://..."
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                id="inStock"
                type="checkbox"
                checked={formData.inStock}
                onChange={(e) =>
                  setFormData({ ...formData, inStock: e.target.checked })
                }
                className="w-4 h-4"
              />
              <Label htmlFor="inStock">Còn hàng</Label>
            </div>
            <div className="space-y-2">
              <Label htmlFor="stockQuantity">Số lượng tồn kho</Label>
              <Input
                id="stockQuantity"
                type="number"
                value={formData.stockQuantity}
                onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={closeModal}>
                Hủy
              </Button>
              <Button type="submit" disabled={isUploading}>
                {isUploading ? 'Đang tải...' : editingProduct ? 'Lưu' : 'Thêm'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/**
 * Categories management content with CRUD
 */
function CategoriesContent() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    imageUrl: '',
    isActive: true,
  });

  const fetchCategories = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getAdminCategories({ pageSize: 100 });
      setCategories(data.items);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
      setError('Không thể tải danh mục');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await fetchCategories();
    setIsRefreshing(false);
  }, [fetchCategories]);

  const openModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name || '',
        description: category.description || '',
        imageUrl: category.imageUrl || '',
        isActive: category.isActive ?? true,
      });
    } else {
      setEditingCategory(null);
      setFormData({
        name: '',
        description: '',
        imageUrl: '',
        isActive: true,
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const categoryData = {
        name: formData.name,
        description: formData.description,
        imageUrl: formData.imageUrl || undefined,
        isActive: formData.isActive,
      };

      if (editingCategory) {
        await updateCategory(editingCategory.id, categoryData);
      } else {
        await createCategory(categoryData);
      }
      closeModal();
      fetchCategories();
    } catch (err) {
      console.error('Failed to save category:', err);
      setError('Không thể lưu danh mục');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa danh mục này?')) return;
    try {
      await deleteCategory(id);
      fetchCategories();
    } catch (err) {
      console.error('Failed to delete category:', err);
      setError('Không thể xóa danh mục');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Quản lý danh mục</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          <RotateCcwIcon className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Đang tải...' : 'Làm mới'}
        </Button>
      </div>

      <Button onClick={() => openModal()} className="mb-4">
        <PlusIcon className="w-4 h-4 mr-2" />
        Thêm danh m���c
      </Button>

      {error && (
        <div className="p-4 bg-destructive/10 text-destructive rounded-lg">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          Chưa có danh mục nào
        </div>
      ) : (
        <div className="border rounded-lg divide-y">
          {categories.map((category) => (
            <div
              key={category.id}
              className="flex items-center justify-between p-4 gap-4"
            >
              <div className="flex items-center gap-4 flex-1">
                {category.imageUrl && (
                  <img
                    src={category.imageUrl}
                    alt={category.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                )}
                <div>
                  <p className="font-medium">{category.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {category.productCount} sản phẩm
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={category.isActive ? 'success' : 'secondary'}>
                  {category.isActive ? 'Hoạt động' : 'Ẩn'}
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openModal(category)}
                >
                  <PencilIcon className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(category.id)}
                >
                  <TrashIcon className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Category Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? 'Sửa danh mục' : 'Thêm danh mục'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="categoryName">Tên danh mục</Label>
              <Input
                id="categoryName"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="categoryDescription">Mô tả</Label>
              <Textarea
                id="categoryDescription"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="categoryImageUrl">Hình ảnh URL</Label>
              <Input
                id="categoryImageUrl"
                value={formData.imageUrl}
                onChange={(e) =>
                  setFormData({ ...formData, imageUrl: e.target.value })
                }
                placeholder="https://..."
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                id="categoryIsActive"
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) =>
                  setFormData({ ...formData, isActive: e.target.checked })
                }
                className="w-4 h-4"
              />
              <Label htmlFor="categoryIsActive">Hoạt động</Label>
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={closeModal}>
                Hủy
              </Button>
              <Button type="submit">
                {editingCategory ? 'Lưu' : 'Thêm'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/**
 * Get badge variant from order status
 */
function getBadgeVariant(
  status: OrderStatus
): 'default' | 'success' | 'warning' | 'destructive' | 'secondary' {
  switch (status) {
    case 'delivered':
      return 'success';
    case 'pending':
      return 'warning';
    case 'cancelled':
      return 'destructive';
    case 'confirmed':
    case 'shipping':
      return 'secondary';
    default:
      return 'default';
  }
}