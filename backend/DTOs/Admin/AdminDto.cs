namespace TiemBanhBeYeu.Api.DTOs.Admin;

public record DashboardStatsDto(
    int TotalOrders,
    int TotalProducts,
    int TotalCategories,
    int TotalUsers,
    decimal TotalRevenue,
    int PendingOrders,
    int CompletedOrders,
    List<OrderSummaryDto> RecentOrders
);

public record OrderSummaryDto(
    int Id,
    string OrderCode,
    string CustomerName,
    decimal TotalAmount,
    string Status,
    DateTime CreatedAt
);

public record UpdateOrderStatusRequest(
    string Status
);

public record ProductManagementDto(
    int Id,
    string Name,
    string CategoryName,
    decimal Price,
    int StockQuantity,
    bool IsActive,
    DateTime CreatedAt
);

public record CategoryManagementDto(
    int Id,
    string Name,
    string Slug,
    string? Description,
    string? ImageUrl,
    int ProductCount,
    bool IsActive,
    DateTime CreatedAt
);

public record UserManagementDto(
    int Id,
    string Email,
    string FirstName,
    string LastName,
    string? Phone,
    string? Address,
    string? Province,
    string? District,
    string? Ward,
    List<string> Roles,
    bool IsActive,
    DateTime CreatedAt
);