using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using TiemBanhBeYeu.Api.DTOs;
using TiemBanhBeYeu.Api.DTOs.Admin;
using TiemBanhBeYeu.Api.DTOs.Categories;
using TiemBanhBeYeu.Api.DTOs.Orders;
using TiemBanhBeYeu.Api.DTOs.Products;
using TiemBanhBeYeu.Api.Domain.Entities;
using TiemBanhBeYeu.Api.Infrastructure.Persistence;

namespace TiemBanhBeYeu.Api.Extensions.Endpoints;

public static class AdminEndpoints
{
    public static void MapAdminEndpoints(this WebApplication app)
    {
        var admin = app.MapGroup("/api/admin").WithTags("Admin").WithOpenApi();

        // Dashboard
        admin.MapGet("/dashboard", GetDashboardStats)
            .WithName("GetDashboardStats")
            .Produces<ApiResponse<DashboardStatsDto>>()
            .ProducesProblem(401)
            .RequireAuthorization("Admin");

        // Orders management
        admin.MapGet("/orders", GetAllOrders)
            .WithName("GetAllOrders")
            .Produces<ApiResponse<PagedResponse<OrderSummaryDto>>>()
            .ProducesProblem(401)
            .RequireAuthorization("Admin");

        admin.MapGet("/orders/{id:int}", GetOrderByIdAdmin)
            .WithName("GetOrderByIdAdmin")
            .Produces<ApiResponse<OrderDto>>()
            .ProducesProblem(404)
            .ProducesProblem(401)
            .RequireAuthorization("Admin");

        admin.MapPatch("/orders/{id:int}/status", UpdateOrderStatus)
            .WithName("UpdateOrderStatus")
            .Produces<ApiResponse<OrderDto>>()
            .ProducesProblem(400)
            .ProducesProblem(404)
            .ProducesProblem(401)
            .RequireAuthorization("Admin");

        // Products management
        admin.MapGet("/products", GetAllProductsAdmin)
            .WithName("GetAllProductsAdmin")
            .Produces<ApiResponse<PagedResponse<ProductManagementDto>>>()
            .ProducesProblem(401)
            .RequireAuthorization("Admin");

        admin.MapGet("/products/{id:int}", GetProductByIdAdmin)
            .WithName("GetProductByIdAdmin")
            .Produces<ApiResponse<ProductManagementDto>>()
            .ProducesProblem(404)
            .ProducesProblem(401)
            .RequireAuthorization("Admin");

        admin.MapPost("/products", CreateProductAdmin)
            .WithName("CreateProductAdmin")
            .Produces<ApiResponse<ProductManagementDto>>(StatusCodes.Status201Created)
            .ProducesProblem(400)
            .ProducesProblem(404)
            .ProducesProblem(401)
            .RequireAuthorization("Admin");

        admin.MapPut("/products/{id:int}", UpdateProductAdmin)
            .WithName("UpdateProductAdmin")
            .Produces<ApiResponse<ProductManagementDto>>()
            .ProducesProblem(400)
            .ProducesProblem(404)
            .ProducesProblem(401)
            .RequireAuthorization("Admin");

        admin.MapDelete("/products/{id:int}", DeleteProductAdmin)
            .WithName("DeleteProductAdmin")
            .Produces<ApiResponse<ProductManagementDto>>()
            .ProducesProblem(404)
            .ProducesProblem(401)
            .RequireAuthorization("Admin");

        admin.MapPatch("/products/{id:int}/status", ToggleProductStatusAdmin)
            .WithName("ToggleProductStatusAdmin")
            .Produces<ApiResponse<ProductManagementDto>>()
            .ProducesProblem(404)
            .ProducesProblem(401)
            .RequireAuthorization("Admin");

        admin.MapPatch("/products/{id:int}/stock", UpdateProductStockAdmin)
            .WithName("UpdateProductStockAdmin")
            .Produces<ApiResponse<ProductManagementDto>>()
            .ProducesProblem(400)
            .ProducesProblem(404)
            .ProducesProblem(401)
            .RequireAuthorization("Admin");

        // Categories management
        admin.MapGet("/categories", GetAllCategoriesAdmin)
            .WithName("GetAllCategoriesAdmin")
            .Produces<ApiResponse<PagedResponse<CategoryManagementDto>>>()
            .ProducesProblem(401)
            .RequireAuthorization("Admin");

        admin.MapGet("/categories/{id:int}", GetCategoryByIdAdmin)
            .WithName("GetCategoryByIdAdmin")
            .Produces<ApiResponse<CategoryManagementDto>>()
            .ProducesProblem(404)
            .ProducesProblem(401)
            .RequireAuthorization("Admin");

        admin.MapPost("/categories", CreateCategoryAdmin)
            .WithName("CreateCategoryAdmin")
            .Produces<ApiResponse<CategoryManagementDto>>(StatusCodes.Status201Created)
            .ProducesProblem(400)
            .ProducesProblem(409)
            .ProducesProblem(401)
            .RequireAuthorization("Admin");

        admin.MapPut("/categories/{id:int}", UpdateCategoryAdmin)
            .WithName("UpdateCategoryAdmin")
            .Produces<ApiResponse<CategoryManagementDto>>()
            .ProducesProblem(400)
            .ProducesProblem(404)
            .ProducesProblem(409)
            .ProducesProblem(401)
            .RequireAuthorization("Admin");

        admin.MapDelete("/categories/{id:int}", DeleteCategoryAdmin)
            .WithName("DeleteCategoryAdmin")
            .Produces<ApiResponse<CategoryManagementDto>>()
            .ProducesProblem(400)
            .ProducesProblem(404)
            .ProducesProblem(401)
            .RequireAuthorization("Admin");

        admin.MapPatch("/categories/{id:int}/status", ToggleCategoryStatusAdmin)
            .WithName("ToggleCategoryStatusAdmin")
            .Produces<ApiResponse<CategoryManagementDto>>()
            .ProducesProblem(400)
            .ProducesProblem(404)
            .ProducesProblem(401)
            .RequireAuthorization("Admin");

        // Users management
        admin.MapGet("/users", GetAllUsers)
            .WithName("GetAllUsers")
            .Produces<ApiResponse<PagedResponse<UserManagementDto>>>()
            .ProducesProblem(401)
            .RequireAuthorization("Admin");
    }

    private static async Task<IResult> GetDashboardStats(
        HttpContext httpContext,
        AppDbContext db,
        CancellationToken ct)
    {
        if (!IsAdmin(httpContext)) return Results.Forbid();

        var totalOrders = await db.Orders.CountAsync(ct);
        var totalProducts = await db.Products.Where(p => !p.IsDeleted).CountAsync(ct);
        var totalCategories = await db.Categories.Where(c => c.DeletedAt == null).CountAsync(ct);
        var totalUsers = await db.Users.CountAsync(ct);
        
        // Load orders to filter by status (EF Core can't translate enum comparison)
        var allOrders = await db.Orders.AsNoTracking().ToListAsync(ct);
        var deliveredOrders = allOrders.Where(o => o.Status == OrderStatus.Delivered).ToList();
        var pendingOrdersList = allOrders.Where(o => o.Status == OrderStatus.Pending).ToList();
        
        var totalRevenue = deliveredOrders.Sum(o => o.TotalAmount);
        var pendingOrders = pendingOrdersList.Count;
        var completedOrders = deliveredOrders.Count;

        var recentOrders = await db.Orders
            .AsNoTracking()
            .OrderByDescending(o => o.CreatedAt)
            .Take(10)
            .Select(o => new OrderSummaryDto(
                o.Id,
                o.OrderCode,
                o.CustomerName,
                o.TotalAmount,
                o.Status.ToString(),
                o.CreatedAt
            ))
            .ToListAsync(ct);

        var stats = new DashboardStatsDto(
            totalOrders,
            totalProducts,
            totalCategories,
            totalUsers,
            totalRevenue,
            pendingOrders,
            completedOrders,
            recentOrders
        );

        return Results.Ok(new ApiResponse<DashboardStatsDto>(true, stats));
    }

    private static async Task<IResult> GetAllOrders(
        string? status = null,
        string? search = null,
        int page = 1,
        int pageSize = 20,
        HttpContext httpContext = null!,
        AppDbContext db = null!,
        CancellationToken ct = default)
    {
        if (!IsAdmin(httpContext)) return Results.Forbid();

        if (page < 1) page = 1;
        if (pageSize < 1) pageSize = 20;
        if (pageSize > 100) pageSize = 100;

        var query = db.Orders.AsNoTracking().AsQueryable();

        if (!string.IsNullOrEmpty(status) && Enum.TryParse<OrderStatus>(status, true, out var orderStatus))
        {
            query = query.Where(o => o.Status == orderStatus);
        }

        if (!string.IsNullOrEmpty(search))
        {
            query = query.Where(o => 
                o.OrderCode.Contains(search) || 
                o.CustomerName.Contains(search) || 
                o.CustomerEmail.Contains(search));
        }

        var totalCount = await query.CountAsync(ct);
        
        var orders = await query
            .OrderByDescending(o => o.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(o => new OrderSummaryDto(
                o.Id,
                o.OrderCode,
                o.CustomerName,
                o.TotalAmount,
                o.Status.ToString(),
                o.CreatedAt
            ))
            .ToListAsync(ct);

        var pagedResponse = PagedResponse<OrderSummaryDto>.Create(orders, totalCount, page, pageSize);
        return Results.Ok(new ApiResponse<PagedResponse<OrderSummaryDto>>(true, pagedResponse));
    }

    private static async Task<IResult> GetOrderByIdAdmin(
        int id,
        AppDbContext db,
        CancellationToken ct)
    {
        var order = await db.Orders
            .AsNoTracking()
            .Include(o => o.Items)
            .ThenInclude(oi => oi.Product)
            .FirstOrDefaultAsync(o => o.Id == id, ct);

        if (order is null)
        {
            return Results.NotFound(new ApiResponse<object>(false, null, "Order not found", new ApiError("NOT_FOUND", "Order not found")));
        }

        var orderDto = new OrderDto(
            order.Id,
            order.OrderCode,
            order.CustomerName,
            order.CustomerPhone,
            order.CustomerEmail,
            new ShippingAddressDto(order.Province, order.District, order.Ward, order.Address),
            order.TotalAmount,
            order.Status.ToString(),
            order.CreatedAt,
            order.Items.Select(oi => new OrderItemDto(
                oi.ProductId,
                oi.ProductName,
                oi.ProductPrice,
                oi.Quantity
            )).ToList()
        );

        return Results.Ok(new ApiResponse<OrderDto>(true, orderDto));
    }

    private static async Task<IResult> UpdateOrderStatus(
        int id,
        UpdateOrderStatusRequest request,
        AppDbContext db,
        CancellationToken ct)
    {
        if (!Enum.TryParse<OrderStatus>(request.Status, true, out var newStatus))
        {
            return Results.BadRequest(new ApiResponse<object>(false, null, "Invalid status. Valid values: Pending, Confirmed, Shipping, Delivered, Cancelled", new ApiError("INVALID_STATUS", "Invalid status")));
        }

        var order = await db.Orders.FindAsync(new object[] { id }, ct);
        if (order is null)
        {
            return Results.NotFound(new ApiResponse<object>(false, null, "Order not found", new ApiError("NOT_FOUND", "Order not found")));
        }

        order.Status = newStatus;
        order.UpdatedAt = DateTime.UtcNow;
        await db.SaveChangesAsync(ct);

        // Reload with items
        order = await db.Orders
            .Include(o => o.Items)
            .ThenInclude(oi => oi.Product)
            .FirstAsync(o => o.Id == id, ct);

        var orderDto = new OrderDto(
            order.Id,
            order.OrderCode,
            order.CustomerName,
            order.CustomerPhone,
            order.CustomerEmail,
            new ShippingAddressDto(order.Province, order.District, order.Ward, order.Address),
            order.TotalAmount,
            order.Status.ToString(),
            order.CreatedAt,
            order.Items.Select(oi => new OrderItemDto(
                oi.ProductId,
                oi.ProductName,
                oi.ProductPrice,
                oi.Quantity
            )).ToList()
        );

        return Results.Ok(new ApiResponse<OrderDto>(true, orderDto, $"Order status updated to {newStatus}"));
    }

    private static async Task<IResult> GetAllProductsAdmin(
        string? search = null,
        int? categoryId = null,
        bool? isActive = null,
        int page = 1,
        int pageSize = 20,
        HttpContext httpContext = null!,
        AppDbContext db = null!,
        CancellationToken ct = default)
    {
        if (!IsAdmin(httpContext)) return Results.Forbid();

        if (page < 1) page = 1;
        if (pageSize < 1) pageSize = 20;
        if (pageSize > 100) pageSize = 100;

        var query = db.Products
            .AsNoTracking()
            .Include(p => p.Category)
            .Where(p => !p.IsDeleted);

        if (!string.IsNullOrEmpty(search))
        {
            query = query.Where(p => p.Name.Contains(search) || p.Description.Contains(search));
        }

        if (categoryId.HasValue)
        {
            query = query.Where(p => p.CategoryId == categoryId.Value);
        }

        if (isActive.HasValue)
        {
            query = query.Where(p => p.IsActive == isActive.Value);
        }

        var totalCount = await query.CountAsync(ct);

        var products = await query
            .OrderByDescending(p => p.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(p => new ProductManagementDto(
                p.Id,
                p.Name,
                p.Category.Name,
                p.Price,
                p.StockQuantity,
                p.IsActive,
                p.CreatedAt
            ))
            .ToListAsync(ct);

        var pagedResponse = PagedResponse<ProductManagementDto>.Create(products, totalCount, page, pageSize);
        return Results.Ok(new ApiResponse<PagedResponse<ProductManagementDto>>(true, pagedResponse));
    }

    private static async Task<IResult> GetProductByIdAdmin(
        int id,
        AppDbContext db,
        CancellationToken ct)
    {
        var product = await db.Products
            .AsNoTracking()
            .Include(p => p.Category)
            .Include(p => p.Images)
            .FirstOrDefaultAsync(p => p.Id == id && !p.IsDeleted, ct);

        if (product is null)
        {
            return Results.NotFound(new ApiResponse<object>(false, null, "Product not found", new ApiError("NOT_FOUND", "Product not found")));
        }

        var dto = new ProductManagementDto(
            product.Id,
            product.Name,
            product.Category.Name,
            product.Price,
            product.StockQuantity,
            product.IsActive,
            product.CreatedAt
        );

        return Results.Ok(new ApiResponse<ProductManagementDto>(true, dto));
    }

    private static async Task<IResult> GetAllCategoriesAdmin(
        bool? isActive = null,
        int page = 1,
        int pageSize = 20,
        HttpContext httpContext = null!,
        AppDbContext db = null!,
        CancellationToken ct = default)
    {
        if (!IsAdmin(httpContext)) return Results.Forbid();

        if (page < 1) page = 1;
        if (pageSize < 1) pageSize = 20;
        if (pageSize > 100) pageSize = 100;

        var query = db.Categories
            .AsNoTracking()
            .Include(c => c.Products)
            .Where(c => c.DeletedAt == null);

        if (isActive.HasValue)
        {
            query = query.Where(c => c.IsActive == isActive.Value);
        }

        var totalCount = await query.CountAsync(ct);

        var categories = await query
            .OrderBy(c => c.Name)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(c => new CategoryManagementDto(
                c.Id,
                c.Name,
                c.Slug,
                c.Description,
                c.ImageUrl,
                c.Products.Count(p => !p.IsDeleted),
                c.IsActive,
                c.CreatedAt
            ))
            .ToListAsync(ct);

        var pagedResponse = PagedResponse<CategoryManagementDto>.Create(categories, totalCount, page, pageSize);
        return Results.Ok(new ApiResponse<PagedResponse<CategoryManagementDto>>(true, pagedResponse));
    }

    // ==================== PRODUCTS CRUD ====================

    private static async Task<IResult> CreateProductAdmin(
        CreateProductRequest request,
        AppDbContext db,
        CancellationToken ct)
    {
        // Validate category exists
        var category = await db.Categories
            .AsNoTracking()
            .FirstOrDefaultAsync(c => c.Id == request.CategoryId && c.DeletedAt == null, ct);

        if (category is null)
        {
            return Results.NotFound(new ApiResponse<ProductManagementDto>(
                Success: false,
                Data: null,
                Error: new ApiError("CATEGORY_NOT_FOUND", "Danh mục không tồn tại")
            ));
        }

        // Validate images
        if (request.Images.Any(string.IsNullOrWhiteSpace))
        {
            return Results.BadRequest(new ApiResponse<ProductManagementDto>(
                Success: false,
                Data: null,
                Error: new ApiError("INVALID_IMAGES", "Danh sách ảnh chứa URL không hợp lệ")
            ));
        }

        using var transaction = await db.Database.BeginTransactionAsync(ct);

        try
        {
            var product = new Product
            {
                Name = request.Name,
                Description = request.Description,
                Price = request.Price,
                StockQuantity = request.StockQuantity,
                CategoryId = request.CategoryId,
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            db.Products.Add(product);
            await db.SaveChangesAsync(ct);

            // Add images
            var images = request.Images.Select((url, index) => new ProductImage
            {
                ProductId = product.Id,
                ImageUrl = url,
                SortOrder = index
            }).ToList();

            db.ProductImages.AddRange(images);
            await db.SaveChangesAsync(ct);

            await transaction.CommitAsync(ct);

            var dto = new ProductManagementDto(
                product.Id,
                product.Name,
                category.Name,
                product.Price,
                product.StockQuantity,
                product.IsActive,
                product.CreatedAt
            );

            return Results.Created($"/api/admin/products/{product.Id}", new ApiResponse<ProductManagementDto>(
                Success: true,
                Data: dto,
                Message: "Tạo sản phẩm thành công"
            ));
        }
        catch
        {
            await transaction.RollbackAsync(ct);
            throw;
        }
    }

    private static async Task<IResult> UpdateProductAdmin(
        int id,
        UpdateProductRequest request,
        AppDbContext db,
        CancellationToken ct)
    {
        var product = await db.Products
            .Include(p => p.Images)
            .FirstOrDefaultAsync(p => p.Id == id && !p.IsDeleted, ct);

        if (product is null)
        {
            return Results.NotFound(new ApiResponse<ProductManagementDto>(
                Success: false,
                Data: null,
                Error: new ApiError("PRODUCT_NOT_FOUND", "Sản phẩm không tồn tại")
            ));
        }

        // Validate category exists
        var category = await db.Categories
            .AsNoTracking()
            .FirstOrDefaultAsync(c => c.Id == request.CategoryId && c.DeletedAt == null, ct);

        if (category is null)
        {
            return Results.NotFound(new ApiResponse<ProductManagementDto>(
                Success: false,
                Data: null,
                Error: new ApiError("CATEGORY_NOT_FOUND", "Danh mục không tồn tại")
            ));
        }

        // Validate images
        if (request.Images.Any(string.IsNullOrWhiteSpace))
        {
            return Results.BadRequest(new ApiResponse<ProductManagementDto>(
                Success: false,
                Data: null,
                Error: new ApiError("INVALID_IMAGES", "Danh sách ảnh chứa URL không hợp lệ")
            ));
        }

        using var transaction = await db.Database.BeginTransactionAsync(ct);

        try
        {
            // Update product
            product.Name = request.Name;
            product.Description = request.Description;
            product.Price = request.Price;
            product.StockQuantity = request.StockQuantity;
            product.CategoryId = request.CategoryId;
            product.IsActive = request.IsActive;
            product.UpdatedAt = DateTime.UtcNow;

            // Remove old images and add new ones
            db.ProductImages.RemoveRange(product.Images);

            var images = request.Images.Select((url, index) => new ProductImage
            {
                ProductId = product.Id,
                ImageUrl = url,
                SortOrder = index
            }).ToList();

            db.ProductImages.AddRange(images);

            await db.SaveChangesAsync(ct);
            await transaction.CommitAsync(ct);

            var dto = new ProductManagementDto(
                product.Id,
                product.Name,
                category.Name,
                product.Price,
                product.StockQuantity,
                product.IsActive,
                product.CreatedAt
            );

            return Results.Ok(new ApiResponse<ProductManagementDto>(
                Success: true,
                Data: dto,
                Message: "Cập nhật sản phẩm thành công"
            ));
        }
        catch
        {
            await transaction.RollbackAsync(ct);
            throw;
        }
    }

    private static async Task<IResult> DeleteProductAdmin(
        int id,
        AppDbContext db,
        CancellationToken ct)
    {
        var product = await db.Products
            .FirstOrDefaultAsync(p => p.Id == id && !p.IsDeleted, ct);

        if (product is null)
        {
            return Results.NotFound(new ApiResponse<ProductManagementDto>(
                Success: false,
                Data: null,
                Error: new ApiError("PRODUCT_NOT_FOUND", "Sản phẩm không tồn tại")
            ));
        }

        // Soft delete
        product.IsDeleted = true;
        product.DeletedAt = DateTime.UtcNow;
        product.IsActive = false;
        product.UpdatedAt = DateTime.UtcNow;

        await db.SaveChangesAsync(ct);

        var category = await db.Categories
            .AsNoTracking()
            .FirstOrDefaultAsync(c => c.Id == product.CategoryId, ct);

        var dto = new ProductManagementDto(
            product.Id,
            product.Name,
            category?.Name ?? "Unknown",
            product.Price,
            product.StockQuantity,
            product.IsActive,
            product.CreatedAt
        );

        return Results.Ok(new ApiResponse<ProductManagementDto>(
            Success: true,
            Data: dto,
            Message: "Xóa sản phẩm thành công"
        ));
    }

    private static async Task<IResult> ToggleProductStatusAdmin(
        int id,
        AppDbContext db,
        CancellationToken ct)
    {
        var product = await db.Products
            .Include(p => p.Category)
            .FirstOrDefaultAsync(p => p.Id == id && !p.IsDeleted, ct);

        if (product is null)
        {
            return Results.NotFound(new ApiResponse<ProductManagementDto>(
                Success: false,
                Data: null,
                Error: new ApiError("PRODUCT_NOT_FOUND", "Sản phẩm không tồn tại")
            ));
        }

        product.IsActive = !product.IsActive;
        product.UpdatedAt = DateTime.UtcNow;

        await db.SaveChangesAsync(ct);

        var dto = new ProductManagementDto(
            product.Id,
            product.Name,
            product.Category.Name,
            product.Price,
            product.StockQuantity,
            product.IsActive,
            product.CreatedAt
        );

        return Results.Ok(new ApiResponse<ProductManagementDto>(
            Success: true,
            Data: dto,
            Message: product.IsActive ? "Kích hoạt sản phẩm thành công" : "Vô hiệu hóa sản phẩm thành công"
        ));
    }

    private static async Task<IResult> UpdateProductStockAdmin(
        int id,
        UpdateStockRequest request,
        AppDbContext db,
        CancellationToken ct)
    {
        var product = await db.Products
            .Include(p => p.Category)
            .FirstOrDefaultAsync(p => p.Id == id && !p.IsDeleted, ct);

        if (product is null)
        {
            return Results.NotFound(new ApiResponse<ProductManagementDto>(
                Success: false,
                Data: null,
                Error: new ApiError("PRODUCT_NOT_FOUND", "Sản phẩm không tồn tại")
            ));
        }

        product.StockQuantity = request.StockQuantity;
        product.UpdatedAt = DateTime.UtcNow;

        await db.SaveChangesAsync(ct);

        var dto = new ProductManagementDto(
            product.Id,
            product.Name,
            product.Category.Name,
            product.Price,
            product.StockQuantity,
            product.IsActive,
            product.CreatedAt
        );

        return Results.Ok(new ApiResponse<ProductManagementDto>(
            Success: true,
            Data: dto,
            Message: "Cập nhật số lượng tồn kho thành công"
        ));
    }

    // ==================== CATEGORIES CRUD ====================

    private static async Task<IResult> GetCategoryByIdAdmin(
        int id,
        AppDbContext db,
        CancellationToken ct)
    {
        var category = await db.Categories
            .AsNoTracking()
            .Include(c => c.Products)
            .FirstOrDefaultAsync(c => c.Id == id && c.DeletedAt == null, ct);

        if (category is null)
        {
            return Results.NotFound(new ApiResponse<CategoryManagementDto>(
                Success: false,
                Data: null,
                Error: new ApiError("CATEGORY_NOT_FOUND", "Danh mục không tồn tại")
            ));
        }

        var dto = new CategoryManagementDto(
            category.Id,
            category.Name,
            category.Slug,
            category.Description,
            category.ImageUrl,
            category.Products.Count(p => !p.IsDeleted),
            category.IsActive,
            category.CreatedAt
        );

        return Results.Ok(new ApiResponse<CategoryManagementDto>(
            Success: true,
            Data: dto,
            Message: "Lấy thông tin danh mục thành công"
        ));
    }

    private static async Task<IResult> CreateCategoryAdmin(
        CreateCategoryRequest request,
        AppDbContext db,
        CancellationToken ct)
    {
        // Check if slug already exists
        var existingCategory = await db.Categories
            .AsNoTracking()
            .FirstOrDefaultAsync(c => c.Slug == request.Slug && c.DeletedAt == null, ct);

        if (existingCategory is not null)
        {
            return Results.Conflict(new ApiResponse<CategoryManagementDto>(
                Success: false,
                Data: null,
                Error: new ApiError("CATEGORY_SLUG_EXISTS", "Slug danh mục đã tồn tại")
            ));
        }

        var category = new Category
        {
            Name = request.Name,
            Slug = request.Slug,
            Description = request.Description,
            ImageUrl = request.ImageUrl,
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        db.Categories.Add(category);
        await db.SaveChangesAsync(ct);

        var dto = new CategoryManagementDto(
            category.Id,
            category.Name,
            category.Slug,
            category.Description,
            category.ImageUrl,
            0,
            category.IsActive,
            category.CreatedAt
        );

        return Results.Created($"/api/admin/categories/{category.Id}", new ApiResponse<CategoryManagementDto>(
            Success: true,
            Data: dto,
            Message: "Tạo danh mục thành công"
        ));
    }

    private static async Task<IResult> UpdateCategoryAdmin(
        int id,
        UpdateCategoryRequest request,
        AppDbContext db,
        CancellationToken ct)
    {
        var category = await db.Categories
            .FirstOrDefaultAsync(c => c.Id == id && c.DeletedAt == null, ct);

        if (category is null)
        {
            return Results.NotFound(new ApiResponse<CategoryManagementDto>(
                Success: false,
                Data: null,
                Error: new ApiError("CATEGORY_NOT_FOUND", "Danh mục không tồn tại")
            ));
        }

        // Check if slug already exists for another category
        var existingSlug = await db.Categories
            .AsNoTracking()
            .FirstOrDefaultAsync(c => c.Slug == request.Slug && c.Id != id && c.DeletedAt == null, ct);

        if (existingSlug is not null)
        {
            return Results.Conflict(new ApiResponse<CategoryManagementDto>(
                Success: false,
                Data: null,
                Error: new ApiError("CATEGORY_SLUG_EXISTS", "Slug danh mục đã tồn tại")
            ));
        }

        // Get product count before updating
        var productCount = await db.Products
            .AsNoTracking()
            .CountAsync(p => p.CategoryId == id && !p.IsDeleted, ct);

        category.Name = request.Name;
        category.Slug = request.Slug;
        category.Description = request.Description;
        category.ImageUrl = request.ImageUrl;
        category.IsActive = request.IsActive;
        category.UpdatedAt = DateTime.UtcNow;

        await db.SaveChangesAsync(ct);

        var dto = new CategoryManagementDto(
            category.Id,
            category.Name,
            category.Slug,
            category.Description,
            category.ImageUrl,
            productCount,
            category.IsActive,
            category.CreatedAt
        );

        return Results.Ok(new ApiResponse<CategoryManagementDto>(
            Success: true,
            Data: dto,
            Message: "Cập nhật danh mục thành công"
        ));
    }

    private static async Task<IResult> DeleteCategoryAdmin(
        int id,
        AppDbContext db,
        CancellationToken ct)
    {
        var category = await db.Categories
            .Include(c => c.Products.Where(p => !p.IsDeleted))
            .FirstOrDefaultAsync(c => c.Id == id && c.DeletedAt == null, ct);

        if (category is null)
        {
            return Results.NotFound(new ApiResponse<CategoryManagementDto>(
                Success: false,
                Data: null,
                Error: new ApiError("CATEGORY_NOT_FOUND", "Danh mục không tồn tại")
            ));
        }

        // Check if category has active products
        var activeProducts = category.Products.Count(p => p.IsActive);
        if (activeProducts > 0)
        {
            return Results.BadRequest(new ApiResponse<CategoryManagementDto>(
                Success: false,
                Data: null,
                Error: new ApiError("CATEGORY_HAS_ACTIVE_PRODUCTS",
                    $"Danh mục có {activeProducts} sản phẩm đang hoạt động. Vui lòng vô hiệu hóa hoặc xóa các sản phẩm trước.")
            ));
        }

        // Soft delete
        category.DeletedAt = DateTime.UtcNow;
        category.IsActive = false;

        await db.SaveChangesAsync(ct);

        var dto = new CategoryManagementDto(
            category.Id,
            category.Name,
            category.Slug,
            category.Description,
            category.ImageUrl,
            0,
            category.IsActive,
            category.CreatedAt
        );

        return Results.Ok(new ApiResponse<CategoryManagementDto>(
            Success: true,
            Data: dto,
            Message: "Xóa danh mục thành công"
        ));
    }

    private static async Task<IResult> ToggleCategoryStatusAdmin(
        int id,
        AppDbContext db,
        CancellationToken ct)
    {
        var category = await db.Categories
            .Include(c => c.Products.Where(p => !p.IsDeleted))
            .FirstOrDefaultAsync(c => c.Id == id && c.DeletedAt == null, ct);

        if (category is null)
        {
            return Results.NotFound(new ApiResponse<CategoryManagementDto>(
                Success: false,
                Data: null,
                Error: new ApiError("CATEGORY_NOT_FOUND", "Danh mục không tồn tại")
            ));
        }

        // If trying to deactivate, check if category has active products
        if (category.IsActive)
        {
            var activeProducts = category.Products.Count(p => p.IsActive);
            if (activeProducts > 0)
            {
                return Results.BadRequest(new ApiResponse<CategoryManagementDto>(
                    Success: false,
                    Data: null,
                    Error: new ApiError("CATEGORY_HAS_ACTIVE_PRODUCTS",
                        $"Danh mục có {activeProducts} sản phẩm đang hoạt động. Vui lòng vô hiệu hóa các sản phẩm trước.")
                ));
            }
        }

        category.IsActive = !category.IsActive;
        category.UpdatedAt = DateTime.UtcNow;

        await db.SaveChangesAsync(ct);

        var dto = new CategoryManagementDto(
            category.Id,
            category.Name,
            category.Slug,
            category.Description,
            category.ImageUrl,
            category.Products.Count,
            category.IsActive,
            category.CreatedAt
        );

        return Results.Ok(new ApiResponse<CategoryManagementDto>(
            Success: true,
            Data: dto,
            Message: category.IsActive ? "Kích hoạt danh mục thành công" : "Vô hiệu hóa danh mục thành công"
        ));
    }

    // ==================== USERS MANAGEMENT ====================

    private static async Task<IResult> GetAllUsers(
        string? search = null,
        bool? isActive = null,
        string? role = null,
        int page = 1,
        int pageSize = 20,
        HttpContext httpContext = null!,
        AppDbContext db = null!,
        CancellationToken ct = default)
    {
        if (!IsAdmin(httpContext)) return Results.Forbid();

        if (page < 1) page = 1;
        if (pageSize < 1) pageSize = 20;
        if (pageSize > 100) pageSize = 100;

        var query = db.Users.AsNoTracking();

        if (!string.IsNullOrEmpty(search))
        {
            query = query.Where(u => u.Email.Contains(search) || u.FirstName.Contains(search) || u.LastName.Contains(search));
        }

        if (isActive.HasValue)
        {
            query = query.Where(u => u.IsActive == isActive.Value);
        }

        if (!string.IsNullOrEmpty(role))
        {
            query = query.Where(u => u.Roles.Contains(role));
        }

        var totalCount = await query.CountAsync(ct);

        var users = await query
            .OrderByDescending(u => u.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(u => new UserManagementDto(
                u.Id,
                u.Email,
                u.FirstName,
                u.LastName,
                u.Phone,
                u.Address,
                u.Province,
                u.District,
                u.Ward,
                u.Roles.Split(',', StringSplitOptions.RemoveEmptyEntries).ToList(),
                u.IsActive,
                u.CreatedAt
            ))
            .ToListAsync(ct);

        var pagedResponse = PagedResponse<UserManagementDto>.Create(users, totalCount, page, pageSize);
        return Results.Ok(new ApiResponse<PagedResponse<UserManagementDto>>(true, pagedResponse));
    }

    private static bool IsAdmin(HttpContext httpContext)
    {
        return httpContext.User.IsInRole("Admin");
    }
}