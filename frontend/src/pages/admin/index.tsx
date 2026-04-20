/**
 * Admin Dashboard Page
 * Admin dashboard with statistics and management
 */
import {
    createCategory,
    createProduct,
    deleteAdminUser,
    deleteCategory,
    deleteProduct,
    getAdminCategories,
    getAdminOrders,
    getAdminProducts,
    getAdminUsers,
    getDashboardStats,
    toggleAdminUserStatus,
    updateAdminUser,
    updateAdminUserPassword,
    updateCategory,
    updateOrderStatus,
    updateProduct,
    uploadImage,
} from "@/api/admin";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/modal";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate, formatPrice } from "@/lib/format";
import { useAuthStore } from "@/stores/auth-store";
import type {
    Category,
    CategoryFilters,
    DashboardStats,
    Order,
    OrderFilters,
    OrderStatus,
    PaginatedOrders,
    Product,
    ProductFilters,
    UpdateUserRequest,
    User,
    UserFilters,
} from "@/types";
import { getOrderStatusLabel } from "@/types/order";
import { KeyRound, PencilIcon, PlusIcon, RotateCcwIcon, ShieldBan, ShieldCheck, TrashIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

// Label component for forms
function Label({ children, htmlFor, className }: { children: React.ReactNode; htmlFor?: string; className?: string }) {
    return (
        <label htmlFor={htmlFor} className={className || "text-sm font-medium"}>
            {children}
        </label>
    );
}

// Textarea component for forms
function Textarea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
    return (
        <textarea
            className={
                className ||
                "flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            }
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

type TabType = "dashboard" | "orders" | "products" | "categories" | "users";

export function AdminPage() {
    const { user, isAuthenticated } = useAuthStore();
    const [activeTab, setActiveTab] = useState<TabType>("dashboard");
    const [stats, setStats] = useState<DashboardStats>(DEFAULT_STATS);
    const [orders, setOrders] = useState<Order[]>([]);
    const [totalPages, setTotalPages] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [orderFilters, setOrderFilters] = useState<OrderFilters>({
        page: 1,
        pageSize: 10,
        status: "",
        search: "",
        sortBy: "date-desc",
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
            console.error("Failed to fetch dashboard stats:", error);
            setStatsError("Không thể tải dữ liệu thống kê");
        }
    }, []);

    // Fetch orders
    const fetchOrders = useCallback(async () => {
        try {
            setIsLoading(true);
            setOrdersError(null);
            const data: PaginatedOrders = await getAdminOrders(orderFilters);
            setOrders(data.items);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error("Failed to fetch orders:", error);
            setOrdersError("Không thể tải danh sách đơn hàng");
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
    if (!isAuthenticated || !user?.roles.includes("Admin")) {
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
                console.error("Failed to update order status:", error);
            }
        },
        [fetchOrders],
    );

    const tabs = [
        { id: "dashboard", label: "Tổng quan" },
        { id: "orders", label: "Đơn hàng" },
        { id: "products", label: "Sản phẩm" },
        { id: "categories", label: "Danh mục" },
        { id: "users", label: "Người dùng" },
    ] as const;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Quản trị viên</h1>
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
                        <RotateCcwIcon className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
                        {isRefreshing ? "Đang tải..." : "Làm mới"}
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
                                ? "border-primary text-primary"
                                : "border-transparent text-muted-foreground hover:text-foreground"
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Dashboard Tab */}
            {activeTab === "dashboard" && <DashboardContent stats={stats} />}

            {/* Orders Tab */}
            {activeTab === "orders" && (
                <OrdersContent
                    orders={orders}
                    isLoading={isLoading}
                    onStatusChange={handleStatusChange}
                    filters={orderFilters}
                    setFilters={setOrderFilters}
                    totalPages={totalPages}
                />
            )}

            {/* Products Tab */}
            {activeTab === "products" && <ProductsContent />}

            {/* Categories Tab */}
            {activeTab === "categories" && <CategoriesContent />}

            {/* Users Tab */}
            {activeTab === "users" && <UsersContent />}
        </div>
    );
}

/**
 * Dashboard statistics content
 */
function DashboardContent({ stats }: { stats: DashboardStats }) {
    const statCards = [
        { title: "Tổng đơn hàng", value: stats.totalOrders, color: "blue" },
        { title: "Đơn chờ xử lý", value: stats.pendingOrders, color: "yellow" },
        { title: "Đơn hoàn thành", value: stats.completedOrders, color: "green" },
        { title: "Tổng sản phẩm", value: stats.totalProducts, color: "purple" },
        { title: "Tổng danh mục", value: stats.totalCategories, color: "orange" },
        { title: "Tổng khách hàng", value: stats.totalUsers, color: "pink" },
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
                    <p className="text-3xl font-bold text-primary">{formatPrice(stats.totalRevenue)}</p>
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
    filters,
    setFilters,
    totalPages,
}: {
    orders: Order[];
    isLoading: boolean;
    onStatusChange: (orderId: number, status: OrderStatus) => Promise<void>;
    filters: OrderFilters;
    setFilters: React.Dispatch<React.SetStateAction<OrderFilters>>;
    totalPages: number;
}) {
    const [pendingStatusChange, setPendingStatusChange] = useState<{
        orderId: number;
        status: OrderStatus;
    } | null>(null);
    // Track locally confirmed orders - helpful while waiting for fetch to complete
    const [confirmedOrderIds, setConfirmedOrderIds] = useState<Set<number>>(new Set());

    const isOrderCompleted = (order: Order) => {
        return (
            order.status.toLowerCase() === "delivered" ||
            order.status.toLowerCase() === "cancelled" ||
            confirmedOrderIds.has(Number(order.id))
        );
    };

    const handleStatusChange = (orderId: number, newStatus: OrderStatus) => {
        // Show confirmation popup for delivered or cancelled
        if (newStatus === "delivered" || newStatus === "cancelled") {
            setPendingStatusChange({ orderId, status: newStatus });
        } else {
            onStatusChange(orderId, newStatus);
        }
    };

    const handleConfirmStatusChange = async () => {
        if (pendingStatusChange) {
            // Add to confirmed list immediately for UI feedback
            setConfirmedOrderIds((prev) => new Set(prev).add(pendingStatusChange.orderId));
            await onStatusChange(pendingStatusChange.orderId, pendingStatusChange.status);
            setPendingStatusChange(null);
        }
    };

    const handleCancelStatusChange = () => {
        setPendingStatusChange(null);
    };

    const handleFilterChange = (key: keyof OrderFilters, value: string) => {
        setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
    };

    const handlePageChange = (newPage: number) => {
        setFilters((prev) => ({ ...prev, page: newPage }));
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Quản lý đơn hàng</h2>
            </div>

            {/* Filters Row */}
            <div className="flex flex-wrap gap-2">
                {/* Search */}
                <Input
                    placeholder="Tìm kiếm theo mã, tên, sđt..."
                    value={filters.search || ""}
                    onChange={(e) => handleFilterChange("search", e.target.value)}
                    className="max-w-xs"
                />

                {/* Status Filter */}
                <Select
                    value={filters.status || "all"}
                    onValueChange={(value) => handleFilterChange("status", value === "all" ? "" : value)}
                >
                    <SelectTrigger className="w-40">
                        <SelectValue placeholder="Trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Tất cả</SelectItem>
                        <SelectItem value="pending">Chờ xác nhận</SelectItem>
                        <SelectItem value="confirmed">Đã xác nhận</SelectItem>
                        <SelectItem value="shipping">Đang giao</SelectItem>
                        <SelectItem value="delivered">Đã giao</SelectItem>
                        <SelectItem value="cancelled">Đã hủy</SelectItem>
                    </SelectContent>
                </Select>

                {/* Sort */}
                <Select
                    value={filters.sortBy || "date-desc"}
                    onValueChange={(value) => handleFilterChange("sortBy", value)}
                >
                    <SelectTrigger className="w-40">
                        <SelectValue placeholder="Sắp xếp" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="date-desc">Mới nhất</SelectItem>
                        <SelectItem value="date-asc">Cũ nhất</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {isLoading ? (
                <div className="text-center py-8">Đang tải...</div>
            ) : orders.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">Chưa có đơn hàng nào</div>
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
                                            {order.customerName} • {order.customerPhone} •{formatDate(order.createdAt)}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="font-semibold">{formatPrice(order.totalAmount)}</span>
                                        <select
                                            className="border rounded-md px-2 py-1 text-sm"
                                            value={order.status.toLowerCase()}
                                            onChange={(e) =>
                                                handleStatusChange(order.id, e.target.value as OrderStatus)
                                            }
                                            disabled={isOrderCompleted(order)}
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

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(filters.page! - 1)}
                        disabled={filters.page === 1}
                    >
                        Trước
                    </Button>
                    <span className="text-sm">
                        Trang {filters.page} / {totalPages}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(filters.page! + 1)}
                        disabled={filters.page === totalPages}
                    >
                        Sau
                    </Button>
                </div>
            )}

            {/* Confirmation Popup */}
            <Dialog open={pendingStatusChange !== null} onOpenChange={handleCancelStatusChange}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Xác nhận thay đổi trạng thái</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <p>
                            {pendingStatusChange?.status === "delivered"
                                ? 'Bạn có chắc chắn muốn đánh dấu đơn hàng này là "Đã giao"?'
                                : "Bạn có chắc chắn muốn hủy đơn hàng này? Sản phẩm sẽ được hoàn lại vào kho."}
                        </p>
                        <p className="text-sm text-muted-foreground mt-2">
                            Lưu ý: Sau khi xác nhận, bạn sẽ không thể thay đổi trạng thái của đơn hàng này nữa.
                        </p>
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={handleCancelStatusChange}>
                            Hủy
                        </Button>
                        <Button onClick={handleConfirmStatusChange}>Xác nhận</Button>
                    </div>
                </DialogContent>
            </Dialog>
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
        name: "",
        description: "",
        price: "",
        categoryId: "",
        imageUrl: "",
        inStock: true,
        stockQuantity: "",
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
            console.error("Failed to fetch products:", err);
            setError("Không thể tải danh sách sản phẩm");
        } finally {
            setIsLoading(false);
        }
    }, []);

    const fetchCategories = useCallback(async () => {
        try {
            const data = await getAdminCategories({ pageSize: 100 });
            setCategories(data.items);
        } catch (err) {
            console.error("Failed to fetch categories:", err);
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
            const categoryIdValue = product.categoryId?.toString() || "";
            setFormData({
                name: product.name || "",
                description: product.description || "",
                price: product.price?.toString() || "",
                categoryId: categoryIdValue,
                imageUrl: product.images?.[0] || "",
                inStock: product.inStock ?? true,
                stockQuantity: product.stockQuantity?.toString() || "0",
            });
            setImagePreviews(product.images || []);
            setSelectedFiles([]);
        } else {
            setEditingProduct(null);
            setFormData({
                name: "",
                description: "",
                price: "",
                categoryId: "",
                imageUrl: "",
                inStock: true,
                stockQuantity: "0",
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
                    const result = await uploadImage(file, "products");
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
            console.error("Failed to save product:", err);
            setError("Không thể lưu sản phẩm");
        } finally {
            setIsUploading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) return;
        try {
            await deleteProduct(id);
            fetchProducts();
        } catch (err) {
            console.error("Failed to delete product:", err);
            setError("Không thể xóa sản phẩm");
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Quản lý sản phẩm</h2>
                <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
                    <RotateCcwIcon className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
                    {isRefreshing ? "Đang tải..." : "Làm mới"}
                </Button>
            </div>

            <Button onClick={() => openModal()} className="mb-4">
                <PlusIcon className="w-4 h-4 mr-2" />
                Thêm sản phẩm
            </Button>

            {error && <div className="p-4 bg-destructive/10 text-destructive rounded-lg">{error}</div>}

            {isLoading ? (
                <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-16 w-full" />
                    ))}
                </div>
            ) : products.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">Chưa có sản phẩm nào</div>
            ) : (
                <div className="border rounded-lg divide-y">
                    {products.map((product) => (
                        <div key={product.id} className="flex items-center justify-between p-4 gap-4">
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
                                        {product.category} • {formatPrice(product.price)} • Tồn kho:{" "}
                                        {product.stockQuantity ?? 0}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge variant={(product.stockQuantity ?? 0) > 0 ? "success" : "destructive"}>
                                    {(product.stockQuantity ?? 0) > 0
                                        ? `Còn hàng (${product.stockQuantity ?? 0})`
                                        : "Hết hàng"}
                                </Badge>
                                <Button variant="outline" size="sm" onClick={() => openModal(product)}>
                                    <PencilIcon className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => handleDelete(product.id as number)}>
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
                        <DialogTitle>{editingProduct ? "Sửa sản phẩm" : "Thêm sản phẩm"}</DialogTitle>
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
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
                        <div className="flex items-center gap-2">
                            <input
                                id="inStock"
                                type="checkbox"
                                checked={formData.inStock}
                                onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
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
                                {isUploading ? "Đang tải..." : editingProduct ? "Lưu" : "Thêm"}
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
        name: "",
        description: "",
        imageUrl: "",
        isActive: true,
    });

    const fetchCategories = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await getAdminCategories({ pageSize: 100 });
            setCategories(data.items);
        } catch (err) {
            console.error("Failed to fetch categories:", err);
            setError("Không thể tải danh mục");
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
                name: category.name || "",
                description: category.description || "",
                imageUrl: category.imageUrl || "",
                isActive: category.isActive ?? true,
            });
        } else {
            setEditingCategory(null);
            setFormData({
                name: "",
                description: "",
                imageUrl: "",
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
            console.error("Failed to save category:", err);
            setError("Không thể lưu danh mục");
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Bạn có chắc chắn muốn xóa danh mục này?")) return;
        try {
            await deleteCategory(id);
            fetchCategories();
        } catch (err) {
            console.error("Failed to delete category:", err);
            setError("Không thể xóa danh mục");
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Quản lý danh mục</h2>
                <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
                    <RotateCcwIcon className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
                    {isRefreshing ? "Đang tải..." : "Làm mới"}
                </Button>
            </div>

            <Button onClick={() => openModal()} className="mb-4">
                <PlusIcon className="w-4 h-4 mr-2" />
                Thêm danh mục
            </Button>

            {error && <div className="p-4 bg-destructive/10 text-destructive rounded-lg">{error}</div>}

            {isLoading ? (
                <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-16 w-full" />
                    ))}
                </div>
            ) : categories.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">Chưa có danh mục nào</div>
            ) : (
                <div className="border rounded-lg divide-y">
                    {categories.map((category) => (
                        <div key={category.id} className="flex items-center justify-between p-4 gap-4">
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
                                    <p className="text-sm text-muted-foreground">{category.productCount} sản phẩm</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge variant={category.isActive ? "success" : "secondary"}>
                                    {category.isActive ? "Hoạt động" : "Ẩn"}
                                </Badge>
                                <Button variant="outline" size="sm" onClick={() => openModal(category)}>
                                    <PencilIcon className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => handleDelete(category.id)}>
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
                        <DialogTitle>{editingCategory ? "Sửa danh mục" : "Thêm danh mục"}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="categoryName">Tên danh mục</Label>
                            <Input
                                id="categoryName"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>

                        <div className="flex justify-end gap-2">
                            <Button type="button" variant="outline" onClick={closeModal}>
                                Hủy
                            </Button>
                            <Button type="submit">{editingCategory ? "Lưu" : "Thêm"}</Button>
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
function getBadgeVariant(status: OrderStatus): "default" | "success" | "warning" | "destructive" | "secondary" {
    const lowerStatus = status.toLowerCase();
    switch (lowerStatus) {
        case "delivered":
            return "success";
        case "pending":
            return "warning";
        case "cancelled":
            return "destructive";
        case "confirmed":
        case "shipping":
            return "secondary";
        default:
            return "default";
    }
}

/**
 * Users management content with CRUD
 */
function UsersContent() {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
    const [filters, setFilters] = useState<UserFilters>({
        page: 1,
        pageSize: 20,
    });
    const [totalPages, setTotalPages] = useState(0);
    const [formData, setFormData] = useState<UpdateUserRequest>({
        firstName: "",
        lastName: "",
        phone: "",
        address: "",
        province: "",
        ward: "",
        roles: [],
    });
    const [newPassword, setNewPassword] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    const fetchUsers = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await getAdminUsers(filters);
            setUsers(data.items);
            setTotalPages(data.totalPages);
        } catch (err) {
            console.error("Failed to fetch users:", err);
            setError("Không thể tải danh sách người dùng");
        } finally {
            setIsLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleRefresh = useCallback(async () => {
        setIsRefreshing(true);
        await fetchUsers();
        setIsRefreshing(false);
    }, [fetchUsers]);

    const handleFilterChange = (key: keyof UserFilters, value: string) => {
        setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
    };

    const handlePageChange = (newPage: number) => {
        setFilters((prev) => ({ ...prev, page: newPage }));
    };

    const openEditModal = (user: User) => {
        setEditingUser(user);
        setFormData({
            firstName: user.firstName || "",
            lastName: user.lastName || "",
            phone: user.phone || "",
            address: user.address || "",
            province: user.province || "",
            ward: user.ward || "",
            roles: user.roles || [],
        });
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setEditingUser(null);
    };

    const openPasswordModal = (user: User) => {
        setEditingUser(user);
        setNewPassword("");
        setIsPasswordModalOpen(true);
    };

    const closePasswordModal = () => {
        setIsPasswordModalOpen(false);
        setEditingUser(null);
        setNewPassword("");
    };

    const openDeleteModal = (user: User) => {
        setEditingUser(user);
        setSelectedUserId(user.id);
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setEditingUser(null);
        setSelectedUserId(null);
    };

    const handleSubmitEdit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingUser) return;

        try {
            setIsSaving(true);
            await updateAdminUser(editingUser.id, {
                firstName: formData.firstName,
                lastName: formData.lastName,
                phone: formData.phone || undefined,
                address: formData.address || undefined,
                province: formData.province || undefined,
                ward: formData.ward || undefined,
                roles: formData.roles,
            });
            closeEditModal();
            fetchUsers();
        } catch (err) {
            console.error("Failed to update user:", err);
            setError("Không thể cập nhật người dùng");
        } finally {
            setIsSaving(false);
        }
    };

    const handleSubmitPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingUser || !newPassword) return;

        try {
            setIsSaving(true);
            await updateAdminUserPassword(editingUser.id, { newPassword });
            closePasswordModal();
        } catch (err) {
            console.error("Failed to update password:", err);
            setError("Không thể cập nhật mật khẩu");
        } finally {
            setIsSaving(false);
        }
    };

    const handleToggleStatus = async (user: User) => {
        try {
            await toggleAdminUserStatus(user.id);
            fetchUsers();
        } catch (err) {
            console.error("Failed to toggle user status:", err);
            setError("Không thể thay đổi trạng thái người dùng");
        }
    };

    const handleDelete = async () => {
        if (!selectedUserId) return;

        try {
            await deleteAdminUser(selectedUserId);
            closeDeleteModal();
            fetchUsers();
        } catch (err) {
            console.error("Failed to delete user:", err);
            setError("Không thể xóa người dùng");
        }
    };

    const handleRoleChange = (role: string, checked: boolean) => {
        const currentRoles = formData.roles || [];
        if (checked) {
            setFormData({ ...formData, roles: [...currentRoles, role] });
        } else {
            setFormData({ ...formData, roles: currentRoles.filter((r) => r !== role) });
        }
    };

    const hasAdminRole = (user: User) => user.roles.includes("Admin");

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Quản lý người dùng</h2>
                <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
                    <RotateCcwIcon className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
                    {isRefreshing ? "Đang tải..." : "Làm mới"}
                </Button>
            </div>

            {/* Filters Row */}
            <div className="flex flex-wrap gap-2">
                <Input
                    placeholder="Tìm kiếm theo email, tên..."
                    value={filters.search || ""}
                    onChange={(e) => handleFilterChange("search", e.target.value)}
                    className="max-w-xs"
                />
                <Select
                    value={filters.isActive === undefined ? "all" : filters.isActive ? "active" : "inactive"}
                    onValueChange={(value) =>
                        handleFilterChange("isActive", value === "all" ? "" : value === "active" ? "true" : "false")
                    }
                >
                    <SelectTrigger className="w-40">
                        <SelectValue placeholder="Trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Tất cả</SelectItem>
                        <SelectItem value="active">Hoạt động</SelectItem>
                        <SelectItem value="inactive">Bị vô hiệu</SelectItem>
                    </SelectContent>
                </Select>
                <Select
                    value={filters.role || "all"}
                    onValueChange={(value) => handleFilterChange("role", value === "all" ? "" : value)}
                >
                    <SelectTrigger className="w-40">
                        <SelectValue placeholder="Vai trò" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Tất cả</SelectItem>
                        <SelectItem value="User">User</SelectItem>
                        <SelectItem value="Admin">Admin</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {error && <div className="p-4 bg-destructive/10 text-destructive rounded-lg">{error}</div>}

            {isLoading ? (
                <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-16 w-full" />
                    ))}
                </div>
            ) : users.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">Chưa có người dùng nào</div>
            ) : (
                <div className="border rounded-lg divide-y">
                    {users.map((user) => (
                        <div key={user.id} className="flex items-center justify-between p-4 gap-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <span className="font-medium">
                                        {user.firstName} {user.lastName}
                                    </span>
                                    <Badge variant={user.isActive ? "success" : "secondary"}>
                                        {user.isActive ? "Hoạt động" : "Bị vô hiệu"}
                                    </Badge>
                                    {hasAdminRole(user) && <Badge variant="warning">Admin</Badge>}
                                </div>
                                <p className="text-sm text-muted-foreground">{user.email}</p>
                                <p className="text-sm text-muted-foreground">
                                    {user.phone || "Chưa có SĐT"} • {formatDate(user.createdAt)}
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => openEditModal(user)}
                                    title="Sửa thông tin"
                                >
                                    <PencilIcon className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => openPasswordModal(user)}
                                    title="Đổi mật khẩu"
                                >
                                    <KeyRound className="w-4 h-4" />
                                </Button>
                                {!hasAdminRole(user) && (
                                    <Button
                                        variant={user.isActive ? "outline" : "default"}
                                        size="sm"
                                        onClick={() => handleToggleStatus(user)}
                                        title={user.isActive ? "Vô hiệu hóa" : "Kích hoạt"}
                                    >
                                        {user.isActive ? (
                                            <ShieldBan className="w-4 h-4" />
                                        ) : (
                                            <ShieldCheck className="w-4 h-4" />
                                        )}
                                    </Button>
                                )}

                                {!hasAdminRole(user) && (
                                    <Button variant="ghost" size="sm" onClick={() => openDeleteModal(user)} title="Xóa">
                                        <TrashIcon className="w-4 h-4 text-destructive" />
                                    </Button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(filters.page! - 1)}
                        disabled={filters.page === 1}
                    >
                        Trước
                    </Button>
                    <span className="text-sm">
                        Trang {filters.page} / {totalPages}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(filters.page! + 1)}
                        disabled={filters.page === totalPages}
                    >
                        Sau
                    </Button>
                </div>
            )}

            {/* Edit User Modal */}
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Sửa thông tin người dùng</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmitEdit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="firstName">Họ</Label>
                            <Input
                                id="firstName"
                                value={formData.firstName}
                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName">Tên</Label>
                            <Input
                                id="lastName"
                                value={formData.lastName}
                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Số điện thoại</Label>
                            <Input
                                id="phone"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="address">Địa chỉ</Label>
                            <Input
                                id="address"
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-2">
                                <Label htmlFor="province">Tỉnh/TP</Label>
                                <Input
                                    id="province"
                                    value={formData.province}
                                    onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="ward">Phường/Xã</Label>
                                <Input
                                    id="ward"
                                    value={formData.ward}
                                    onChange={(e) => setFormData({ ...formData, ward: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Vai trò</Label>
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={formData.roles?.includes("User")}
                                        onChange={(e) => handleRoleChange("User", e.target.checked)}
                                    />
                                    User
                                </label>
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={formData.roles?.includes("Admin")}
                                        onChange={(e) => handleRoleChange("Admin", e.target.checked)}
                                    />
                                    Admin
                                </label>
                            </div>
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button type="button" variant="outline" onClick={closeEditModal}>
                                Hủy
                            </Button>
                            <Button type="submit" disabled={isSaving}>
                                {isSaving ? "Đang lưu..." : "Lưu"}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Change Password Modal */}
            <Dialog open={isPasswordModalOpen} onOpenChange={setIsPasswordModalOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Đổi mật khẩu</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmitPassword} className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                            Đổi mật khẩu cho: <strong>{editingUser?.email}</strong>
                        </p>
                        <div className="space-y-2">
                            <Label htmlFor="newPassword">Mật khẩu mới</Label>
                            <Input
                                id="newPassword"
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Nhập mật khẩu mới (ít nhất 6 ký tự)"
                                minLength={6}
                                required
                            />
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button type="button" variant="outline" onClick={closePasswordModal}>
                                Hủy
                            </Button>
                            <Button type="submit" disabled={isSaving || newPassword.length < 6}>
                                {isSaving ? "Đang lưu..." : "Đổi mật khẩu"}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Modal */}
            <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Xác nhận xóa</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <p>
                            Bạn có chắc chắn muốn xóa tài khoản của{" "}
                            <strong>
                                {editingUser?.firstName} {editingUser?.lastName}
                            </strong>
                            ?
                        </p>
                        <p className="text-sm text-muted-foreground mt-2">Email: {editingUser?.email}</p>
                        <p className="text-sm text-destructive mt-2">
                            Lưu ý: Tài khoản sẽ bị vô hiệu hóa nhưng dữ liệu đơn hàng sẽ được giữ lại.
                        </p>
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={closeDeleteModal}>
                            Hủy
                        </Button>
                        <Button variant="destructive" onClick={handleDelete}>
                            Xóa
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
