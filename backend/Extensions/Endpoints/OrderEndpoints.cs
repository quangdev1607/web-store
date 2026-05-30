using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TiemBanhBeYeu.Api.Domain.Entities;
using TiemBanhBeYeu.Api.DTOs;
using TiemBanhBeYeu.Api.DTOs.Admin;
using TiemBanhBeYeu.Api.DTOs.Orders;
using TiemBanhBeYeu.Api.Infrastructure.Persistence;

namespace TiemBanhBeYeu.Api.Extensions.Endpoints;

public static class OrderEndpoints
{
    public static void MapOrderEndpoints(this WebApplication app)
    {
        var orders = app.MapGroup("/api/orders").WithTags("Orders");

        // POST /api/orders - Create new order
        orders.MapPost("/", CreateOrder)
            .WithName("CreateOrder")
            .Produces<ApiResponse<CreateOrderResponse>>()
            .ProducesValidationProblem()
            .ProducesProblem(400)
            .ProducesProblem(401)
            .RequireAuthorization();

        // GET /api/orders - Get current user's orders
        orders.MapGet("/", GetMyOrders)
            .WithName("GetMyOrders")
            .Produces<ApiResponse<PagedResponse<OrderSummaryDto>>>()
            .ProducesProblem(401)
            .RequireAuthorization();

        // GET /api/orders/{id} - Get order by ID
        orders.MapGet("/{id:int}", GetOrderById)
            .WithName("GetOrderById")
            .Produces<ApiResponse<OrderDto>>()
            .ProducesProblem(401)
            .ProducesProblem(404)
            .RequireAuthorization();

        // PATCH /api/orders/{id}/cancel - Cancel current user's pending order
        orders.MapPatch("/{id:int}/cancel", CancelOrder)
            .WithName("CancelOrder")
            .Produces<ApiResponse<OrderDto>>()
            .ProducesProblem(400)
            .ProducesProblem(401)
            .ProducesProblem(404)
            .RequireAuthorization();
    }

    private static async Task<IResult> CreateOrder(
        CreateOrderRequest request,
        HttpContext httpContext,
        AppDbContext db = null!,
        CancellationToken ct = default)
    {
        var userId = GetUserId(httpContext);
        if (userId is null) return Results.Unauthorized();

        // Validate request
        if (string.IsNullOrWhiteSpace(request.CustomerInfo?.Name))
        {
            return Results.BadRequest(new ApiResponse<CreateOrderResponse>(
                Success: false,
                Data: null,
                Error: new ApiError("VALIDATION_ERROR", "Tên khách hàng không được trống")
            ));
        }

        if (string.IsNullOrWhiteSpace(request.CustomerInfo?.Phone))
        {
            return Results.BadRequest(new ApiResponse<CreateOrderResponse>(
                Success: false,
                Data: null,
                Error: new ApiError("VALIDATION_ERROR", "Số điện thoại không được trống")
            ));
        }

        if (string.IsNullOrWhiteSpace(request.CustomerInfo?.Email))
        {
            return Results.BadRequest(new ApiResponse<CreateOrderResponse>(
                Success: false,
                Data: null,
                Error: new ApiError("VALIDATION_ERROR", "Email không được trống")
            ));
        }

        if (request.Items is null || request.Items.Count == 0)
        {
            return Results.BadRequest(new ApiResponse<CreateOrderResponse>(
                Success: false,
                Data: null,
                Error: new ApiError("VALIDATION_ERROR", "Đơn hàng phải có ít nhất 1 sản phẩm")
            ));
        }

        // Get products with tracking to update stock
        var productIds = request.Items.Select(i => i.ProductId).ToList();
        var products = await db.Products
            .Where(p => productIds.Contains(p.Id))
            .ToDictionaryAsync(p => p.Id, ct);

        if (products.Count != request.Items.Count)
        {
            return Results.BadRequest(new ApiResponse<CreateOrderResponse>(
                Success: false,
                Data: null,
                Error: new ApiError("PRODUCT_NOT_FOUND", "Một hoặc nhiều sản phẩm không tồn tại")
            ));
        }

        // Validate stock and calculate total
        decimal totalAmount = 0;
        var orderItems = new List<OrderItem>();

        foreach (var item in request.Items)
        {
            var product = products[item.ProductId];

            // Check stock availability
            if (product.StockQuantity < item.Quantity)
            {
                return Results.BadRequest(new ApiResponse<CreateOrderResponse>(
                    Success: false,
                    Data: null,
                    Error: new ApiError("INSUFFICIENT_STOCK", $"Sản phẩm {product.Name} không đủ số lượng. Còn {product.StockQuantity} sản phẩm.")
                ));
            }

            // Deduct stock immediately
            product.StockQuantity -= item.Quantity;
            product.UpdatedAt = DateTime.UtcNow;

            var itemTotal = product.Price * item.Quantity;
            totalAmount += itemTotal;

            orderItems.Add(new OrderItem
            {
                ProductId = item.ProductId,
                ProductName = product.Name,
                ProductPrice = product.Price,
                Quantity = item.Quantity
            });
        }

        // Generate order code
        var orderCode = GenerateOrderCode();

        // Create order with simplified address (strings from frontend)
        var order = new Order
        {
            OrderCode = orderCode,
            UserId = userId.Value,
            CustomerName = request.CustomerInfo.Name,
            CustomerPhone = request.CustomerInfo.Phone,
            CustomerEmail = request.CustomerInfo.Email,
            Province = request.ShippingAddress.Province,
            Ward = request.ShippingAddress.Ward,
            Address = request.ShippingAddress.Address,
            TotalAmount = totalAmount,
            Status = OrderStatus.Pending,
            Items = orderItems
        };

        db.Orders.Add(order);
        await db.SaveChangesAsync(ct);

        var response = new CreateOrderResponse(
            OrderId: order.Id,
            OrderCode: order.OrderCode,
            TotalAmount: order.TotalAmount,
            EstimatedDelivery: DateTime.UtcNow.AddDays(3)
        );

        return Results.Created($"/api/orders/{order.Id}", new ApiResponse<CreateOrderResponse>(
            Success: true,
            Data: response,
            Message: "Đặt hàng thành công!"
        ));
    }

    private static async Task<IResult> GetOrderById(
        int id,
        HttpContext httpContext,
        AppDbContext db = null!,
        CancellationToken ct = default)
    {
        var userId = GetUserId(httpContext);
        if (userId is null) return Results.Unauthorized();

        var order = await db.Orders
            .AsNoTracking()
            .Include(o => o.Items)
            .FirstOrDefaultAsync(o => o.Id == id && o.UserId == userId.Value, ct);

        if (order is null)
        {
            return Results.NotFound(new ApiResponse<OrderDto>(
                Success: false,
                Data: null,
                Error: new ApiError("ORDER_NOT_FOUND", "Đơn hàng không tồn tại")
            ));
        }

        var dto = ToOrderDto(order);

        return Results.Ok(new ApiResponse<OrderDto>(
            Success: true,
            Data: dto,
            Message: "Lấy thông tin đơn hàng thành công"
        ));
    }

    private static async Task<IResult> CancelOrder(
        int id,
        HttpContext httpContext,
        AppDbContext db = null!,
        CancellationToken ct = default)
    {
        var userId = GetUserId(httpContext);
        if (userId is null) return Results.Unauthorized();

        var order = await db.Orders
            .Include(o => o.Items)
            .FirstOrDefaultAsync(o => o.Id == id && o.UserId == userId.Value, ct);

        if (order is null)
        {
            return Results.NotFound(new ApiResponse<OrderDto>(
                Success: false,
                Data: null,
                Error: new ApiError("ORDER_NOT_FOUND", "Đơn hàng không tồn tại")
            ));
        }

        if (order.Status != OrderStatus.Pending)
        {
            return Results.BadRequest(new ApiResponse<OrderDto>(
                Success: false,
                Data: null,
                Error: new ApiError("ORDER_CANNOT_BE_CANCELLED", "Chỉ có thể hủy đơn hàng đang chờ xác nhận")
            ));
        }

        var productIds = order.Items.Select(i => i.ProductId).ToList();
        var products = await db.Products
            .Where(p => productIds.Contains(p.Id))
            .ToDictionaryAsync(p => p.Id, ct);
        var now = DateTime.UtcNow;

        foreach (var item in order.Items)
        {
            if (products.TryGetValue(item.ProductId, out var product))
            {
                product.StockQuantity += item.Quantity;
                product.UpdatedAt = now;
            }
        }

        order.Status = OrderStatus.Cancelled;
        order.UpdatedAt = now;

        await db.SaveChangesAsync(ct);

        return Results.Ok(new ApiResponse<OrderDto>(
            Success: true,
            Data: ToOrderDto(order),
            Message: "Hủy đơn hàng thành công"
        ));
    }

    private static async Task<IResult> GetMyOrders(
        HttpContext httpContext,
        string? status = null,
        string? search = null,
        string? sortBy = null,
        int page = 1,
        int pageSize = 20,
        AppDbContext db = null!,
        CancellationToken ct = default)
    {
        var userId = GetUserId(httpContext);
        if (userId is null) return Results.Unauthorized();

        if (page < 1) page = 1;
        if (pageSize < 1) pageSize = 20;
        if (pageSize > 100) pageSize = 100;

        var query = db.Orders
            .AsNoTracking()
            .Where(o => o.UserId == userId.Value)
            .AsQueryable();

        // Filter by status
        if (!string.IsNullOrEmpty(status) && Enum.TryParse<OrderStatus>(status, true, out var orderStatus))
        {
            query = query.Where(o => o.Status == orderStatus);
        }

        // Search by order code, customer name, or email
        if (!string.IsNullOrEmpty(search))
        {
            query = query.Where(o =>
                o.OrderCode.Contains(search) ||
                o.CustomerName.Contains(search) ||
                o.CustomerEmail.Contains(search));
        }

        // Apply sorting
        query = sortBy?.ToLower() switch
        {
            "date-asc" => query.OrderBy(o => o.CreatedAt),
            "date-desc" => query.OrderByDescending(o => o.CreatedAt),
            _ => query.OrderByDescending(o => o.CreatedAt)
        };

        var totalCount = await query.CountAsync(ct);
        var orders = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(o => new OrderSummaryDto(
                o.Id,
                o.OrderCode,
                o.CustomerName,
                o.TotalAmount,
                o.Status.ToString().ToLower(),
                o.CreatedAt
            ))
            .ToListAsync(ct);

        var pagedResponse = PagedResponse<OrderSummaryDto>.Create(orders, totalCount, page, pageSize);
        return Results.Ok(new ApiResponse<PagedResponse<OrderSummaryDto>>(true, pagedResponse));
    }

    private static string GenerateOrderCode()
    {
        var timestamp = DateTime.UtcNow.ToString("yyyyMMddHHmmss");
        var random = Random.Shared.Next(1000, 9999);
        return $"ORD-{timestamp}-{random}";
    }

    private static OrderDto ToOrderDto(Order order) => new(
        order.Id,
        order.OrderCode,
        order.CustomerName,
        order.CustomerPhone,
        order.CustomerEmail,
        new ShippingAddressDto(
            order.Province,
            order.Ward,
            order.Address
        ),
        order.TotalAmount,
        order.Status.ToString().ToLower(),
        order.CreatedAt,
        order.Items.Select(i => new OrderItemDto(
            i.ProductId,
            i.ProductName,
            i.ProductPrice,
            i.Quantity
        )).ToList()
    );

    private static int? GetUserId(HttpContext httpContext)
    {
        var userIdClaim = httpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
        return int.TryParse(userIdClaim, out var userId) ? userId : null;
    }
}
