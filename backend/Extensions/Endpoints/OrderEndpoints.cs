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
            .ProducesProblem(400);

        // GET /api/orders - Get current user's orders
        orders.MapGet("/", GetMyOrders)
            .WithName("GetMyOrders")
            .Produces<ApiResponse<PagedResponse<OrderSummaryDto>>>()
            .ProducesProblem(401);

        // GET /api/orders/{id} - Get order by ID
        orders.MapGet("/{id:int}", GetOrderById)
            .WithName("GetOrderById")
            .Produces<ApiResponse<OrderDto>>()
            .ProducesProblem(404);
    }

    private static async Task<IResult> CreateOrder(
        CreateOrderRequest request,
        AppDbContext db = null!,
        CancellationToken ct = default)
    {
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
            CustomerName = request.CustomerInfo.Name,
            CustomerPhone = request.CustomerInfo.Phone,
            CustomerEmail = request.CustomerInfo.Email,
            Province = request.ShippingAddress.Province,
            District = request.ShippingAddress.District,
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
        AppDbContext db = null!,
        CancellationToken ct = default)
    {
        var order = await db.Orders
            .AsNoTracking()
            .Include(o => o.Items)
            .FirstOrDefaultAsync(o => o.Id == id, ct);

        if (order is null)
        {
            return Results.NotFound(new ApiResponse<OrderDto>(
                Success: false,
                Data: null,
                Error: new ApiError("ORDER_NOT_FOUND", "Đơn hàng không tồn tại")
            ));
        }

        var dto = new OrderDto(
            order.Id,
            order.OrderCode,
            order.CustomerName,
            order.CustomerPhone,
            order.CustomerEmail,
            new ShippingAddressDto(
                order.Province,
                order.District,
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

        return Results.Ok(new ApiResponse<OrderDto>(
            Success: true,
            Data: dto,
            Message: "Lấy thông tin đơn hàng thành công"
        ));
    }

    private static async Task<IResult> GetMyOrders(
        HttpContext httpContext,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        AppDbContext db = null!,
        CancellationToken ct = default)
    {
        if (page < 1) page = 1;
        if (pageSize < 1) pageSize = 20;

        // Get all orders (for now - in production, filter by user email)
        var query = db.Orders
            .AsNoTracking()
            .AsQueryable()
            .OrderByDescending(o => o.CreatedAt);

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
}
