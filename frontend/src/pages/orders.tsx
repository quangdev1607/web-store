/**
 * Orders Page
 * Displays user's order history with API integration
 */
import { getMyOrders, getOrderById } from "@/api/orders";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/modal";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate, formatPrice } from "@/lib/format";
import { useAuthStore } from "@/stores/auth-store";
import type { Order, OrderStatus } from "@/types/order";
import { getOrderStatusLabel } from "@/types/order";
import { RotateCcwIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";

/**
 * Orders page - displays user's order history
 */
export function OrdersPage() {
    const { isAuthenticated } = useAuthStore();
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState<string>("");
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isDetailLoading, setIsDetailLoading] = useState(false);

    // Fetch orders
    const fetchOrders = useCallback(async () => {
        try {
            setIsLoading(true);
            const result = await getMyOrders();
            setOrders(result.items);
        } catch (err) {
            console.error("Failed to fetch orders:", err);
            setError("Không thể tải danh sách đơn hàng");
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Fetch order details
    const fetchOrderDetails = useCallback(async (orderId: number) => {
        try {
            setIsDetailLoading(true);
            const orderDetails = await getOrderById(orderId);
            setSelectedOrder(orderDetails);
        } catch (err) {
            console.error("Failed to fetch order details:", err);
        } finally {
            setIsDetailLoading(false);
        }
    }, []);

    // Fetch orders when page loads
    useEffect(() => {
        if (isAuthenticated) {
            fetchOrders();
        }
    }, [isAuthenticated, fetchOrders]);

    // Handle refresh
    const handleRefresh = useCallback(async () => {
        setIsRefreshing(true);
        await fetchOrders();
        setIsRefreshing(false);
    }, [fetchOrders]);

    // Handle view details
    const handleViewDetails = useCallback(
        (order: Order) => {
            fetchOrderDetails(order.id);
        },
        [fetchOrderDetails],
    );

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Đơn hàng của tôi</h1>
                <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
                    <RotateCcwIcon className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
                    {isRefreshing ? "Đang tải..." : "Làm mới"}
                </Button>
            </div>

            {error && <div className="p-4 bg-destructive/10 text-destructive rounded-lg">{error}</div>}

            {isLoading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-32 w-full" />
                    ))}
                </div>
            ) : orders.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-lg text-muted-foreground">Bạn chưa có đơn hàng nào</p>
                    <Link to="/products">
                        <Button className="mt-4">Mua sắm ngay</Button>
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <OrderCard key={order.id} order={order} onViewDetails={handleViewDetails} />
                    ))}
                </div>
            )}

            {/* Order Detail Modal */}
            <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
                {selectedOrder && (
                    <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Chi tiết đơn hàng</DialogTitle>
                        </DialogHeader>
                        {isDetailLoading ? (
                            <div className="flex items-center justify-center py-8">
                                <Skeleton className="h-32 w-full" />
                            </div>
                        ) : (
                            <OrderDetailContent order={selectedOrder} />
                        )}
                    </DialogContent>
                )}
            </Dialog>
        </div>
    );
}

/**
 * Order card component
 */
function OrderCard({ order, onViewDetails }: { order: Order; onViewDetails: (order: Order) => void }) {
    return (
        <div className="border rounded-lg p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="font-semibold">{order.orderCode}</span>
                        <Badge variant={getBadgeVariant(order.status)}>{getOrderStatusLabel(order.status)}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{formatDate(order.createdAt)}</p>
                </div>
                <div className="flex items-center gap-4">
                    <span className="font-semibold">{formatPrice(order.totalAmount)}</span>
                    <Button variant="outline" size="sm" onClick={() => onViewDetails(order)}>
                        Xem chi tiết
                    </Button>
                </div>
            </div>
        </div>
    );
}

/**
 * Order detail modal content
 */
function OrderDetailContent({ order }: { order: Order }) {
    const shippingAddress = order.shippingAddress;
    const fullAddress = shippingAddress
        ? [shippingAddress.address, shippingAddress.ward, shippingAddress.district, shippingAddress.province]
              .filter(Boolean)
              .join(", ")
        : "Chưa cập nhật";

    return (
        <div className="space-y-6">
            {/* Products */}
            <div className="space-y-2">
                <h3 className="font-semibold text-lg">Sản phẩm</h3>
                {order.items && order.items.length > 0 ? (
                    <div className="border rounded-lg divide-y">
                        {order.items.map((item, index) => (
                            <div key={index} className="flex items-center justify-between p-3 gap-4">
                                <div className="flex-1">
                                    <p className="font-medium">{item.productName || "Sản phẩm"}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {formatPrice(item.productPrice)} x {item.quantity}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="font-medium">{formatPrice(item.productPrice * item.quantity)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-muted-foreground text-sm">Không có sản phẩm</p>
                )}
            </div>
            {/* Order Info */}
            <div className="space-y-2">
                <h3 className="font-semibold text-lg">Thông tin đơn hàng</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                    <span className="text-muted-foreground">Mã đơn hàng:</span>
                    <span className="font-medium">{order.orderCode || "-"}</span>
                    <span className="text-muted-foreground">Ngày đặt:</span>
                    <span>{formatDate(order.createdAt)}</span>
                    <span className="text-muted-foreground">Tình trạng:</span>
                    <Badge variant={getBadgeVariant(order.status)}>{getOrderStatusLabel(order.status)}</Badge>
                    <span className="text-muted-foreground">Tổng tiền:</span>
                    <span className="font-semibold text-primary">{formatPrice(order.totalAmount)}</span>
                </div>
            </div>

            {/* Customer Info */}
            <div className="space-y-2">
                <h3 className="font-semibold text-lg">Thông tin người mua</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                    <span className="text-muted-foreground">Họ tên:</span>
                    <span>{order.customerName || "-"}</span>
                    <span className="text-muted-foreground">Số điện thoại:</span>
                    <span>{order.customerPhone || "-"}</span>
                    <span className="text-muted-foreground">Email:</span>
                    <span>{order.customerEmail || "-"}</span>
                    <span className="text-muted-foreground">Địa chỉ:</span>
                    <span>{fullAddress}</span>
                </div>
            </div>
        </div>
    );
}

/**
 * Get badge variant from order status
 */
function getBadgeVariant(status: OrderStatus): "default" | "success" | "warning" | "destructive" | "secondary" {
    switch (status) {
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
