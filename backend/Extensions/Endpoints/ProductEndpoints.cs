using Microsoft.EntityFrameworkCore;
using TiemBanhBeYeu.Api.Domain.Entities;
using TiemBanhBeYeu.Api.DTOs;
using TiemBanhBeYeu.Api.DTOs.Products;
using TiemBanhBeYeu.Api.Infrastructure.Persistence;

namespace TiemBanhBeYeu.Api.Extensions.Endpoints;

public static class ProductEndpoints
{
    public static void MapProductEndpoints(this WebApplication app)
    {
        var products = app.MapGroup("/api/products").WithTags("Products");

        // GET /api/products - Get all products with filtering
        products.MapGet("/", GetProducts)
            .WithName("GetProducts")
            .Produces<ApiResponse<PagedResponse<ProductDto>>>();

        // GET /api/products/all - Get all products (no pagination, for admin)
        products.MapGet("/all", GetAllProducts)
            .WithName("GetAllProducts")
            .Produces<ApiResponse<List<ProductSummaryDto>>>();

        // GET /api/products/{id} - Get product by ID
        products.MapGet("/{id:int}", GetProductById)
            .WithName("GetProductById")
            .Produces<ApiResponse<ProductDto>>()
            .ProducesProblem(404);

        // GET /api/products/categories - Get all category names
        products.MapGet("/categories", GetCategoryNames)
            .WithName("GetCategoryNames")
            .Produces<ApiResponse<List<string>>>();

        // POST /api/products - Create new product
        products.MapPost("/", CreateProduct)
            .WithName("CreateProduct")
            .Produces<ApiResponse<ProductDto>>(StatusCodes.Status201Created)
            .ProducesProblem(400)
            .ProducesProblem(404);

        // PUT /api/products/{id} - Update product
        products.MapPut("/{id:int}", UpdateProduct)
            .WithName("UpdateProduct")
            .Produces<ApiResponse<ProductDto>>()
            .ProducesProblem(400)
            .ProducesProblem(404);

        // DELETE /api/products/{id} - Soft delete product
        products.MapDelete("/{id:int}", DeleteProduct)
            .WithName("DeleteProduct")
            .Produces<ApiResponse<ProductDto>>()
            .ProducesProblem(404);

        // PATCH /api/products/{id}/status - Toggle product active status
        products.MapPatch("/{id:int}/status", ToggleProductStatus)
            .WithName("ToggleProductStatus")
            .Produces<ApiResponse<ProductDto>>()
            .ProducesProblem(404);

        // PATCH /api/products/{id}/stock - Update stock quantity
        products.MapPatch("/{id:int}/stock", UpdateStock)
            .WithName("UpdateStock")
            .Produces<ApiResponse<ProductDto>>()
            .ProducesProblem(400)
            .ProducesProblem(404);

        // PATCH /api/products/{id}/images - Update product images
        products.MapPatch("/{id:int}/images", UpdateProductImages)
            .WithName("UpdateProductImages")
            .Produces<ApiResponse<ProductDto>>()
            .ProducesProblem(400)
            .ProducesProblem(404);
    }

    private static async Task<IResult> GetProducts(
        string? search = null,
        string? category = null,
        string? sortBy = null,
        int page = 1,
        int pageSize = 20,
        bool? isActive = null,
        AppDbContext db = null!,
        CancellationToken ct = default)
    {
        if (page < 1) page = 1;
        if (pageSize < 1) pageSize = 20;
        if (pageSize > 100) pageSize = 100;

        // Load products (only active by default for public API)
        var query = db.Products
            .AsNoTracking()
            .Include(p => p.Category)
            .Where(p => !p.IsDeleted);

        // Filter by IsActive if specified
        if (isActive.HasValue)
        {
            query = query.Where(p => p.IsActive == isActive.Value);
        }
        // Default: show all products (both active and inactive)

        var allProducts = await query.ToListAsync(ct);

        // Load images separately
        var productIds = allProducts.Select(p => p.Id).ToList();
        var allImages = await db.ProductImages
            .AsNoTracking()
            .Where(i => productIds.Contains(i.ProductId))
            .OrderBy(i => i.SortOrder)
            .ToListAsync(ct);

        // Group images by product
        var imagesByProduct = allImages.GroupBy(i => i.ProductId)
            .ToDictionary(g => g.Key, g => g.Select(i => i.ImageUrl).ToList());

        // Apply search filter (case-insensitive)
        if (!string.IsNullOrWhiteSpace(search))
        {
            allProducts = allProducts.Where(p =>
                p.Name.Contains(search, StringComparison.OrdinalIgnoreCase) ||
                p.Description.Contains(search, StringComparison.OrdinalIgnoreCase)
            ).ToList();
        }

        // Apply category filter (case-insensitive)
        if (!string.IsNullOrWhiteSpace(category))
        {
            allProducts = allProducts.Where(p =>
                p.Category.Name.Equals(category, StringComparison.OrdinalIgnoreCase)
            ).ToList();
        }

        var totalCount = allProducts.Count;

        // Apply sorting
        allProducts = sortBy?.ToLower() switch
        {
            "price-asc" => allProducts.OrderBy(p => p.Price).ToList(),
            "price-desc" => allProducts.OrderByDescending(p => p.Price).ToList(),
            "rating" => allProducts.OrderByDescending(p => p.Rating ?? 0).ToList(),
            "stock" => allProducts.OrderByDescending(p => p.StockQuantity).ToList(),
            _ => allProducts.OrderByDescending(p => p.CreatedAt).ToList()
        };

        // Apply pagination
        var pagedProducts = allProducts
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(p => new ProductDto(
                p.Id,
                p.Name,
                p.Description,
                p.Price,
                p.StockQuantity,
                p.Category.Name,
                p.CategoryId,
                imagesByProduct.GetValueOrDefault(p.Id, new List<string>()),
                p.InStock,
                p.IsActive,
                p.Rating,
                p.CreatedAt,
                p.UpdatedAt
            ))
            .ToList();

        var pagedResponse = PagedResponse<ProductDto>.Create(pagedProducts, totalCount, page, pageSize);

        return Results.Ok(new ApiResponse<PagedResponse<ProductDto>>(
            Success: true,
            Data: pagedResponse,
            Message: "Lấy danh sách sản phẩm thành công"
        ));
    }

    private static async Task<IResult> GetAllProducts(
        string? search = null,
        bool? isActive = null,
        int page = 1,
        int pageSize = 20,
        AppDbContext db = null!,
        CancellationToken ct = default)
    {
        if (page < 1) page = 1;
        if (pageSize < 1) pageSize = 20;
        if (pageSize > 100) pageSize = 100;

        var query = db.Products
            .AsNoTracking()
            .Include(p => p.Category)
            .Include(p => p.Images.OrderBy(i => i.SortOrder))
            .Where(p => !p.IsDeleted);

        if (isActive.HasValue)
        {
            query = query.Where(p => p.IsActive == isActive.Value);
        }

        var totalCount = await query.CountAsync(ct);

        var products = await query
            .OrderByDescending(p => p.UpdatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(p => new ProductSummaryDto(
                p.Id,
                p.Name,
                p.Price,
                p.StockQuantity,
                p.Category.Name,
                p.Images.OrderBy(i => i.SortOrder).FirstOrDefault()!.ImageUrl,
                p.InStock,
                p.IsActive
            ))
            .ToListAsync(ct);

        var pagedResponse = PagedResponse<ProductSummaryDto>.Create(products, totalCount, page, pageSize);

        return Results.Ok(new ApiResponse<PagedResponse<ProductSummaryDto>>(
            Success: true,
            Data: pagedResponse,
            Message: "Lấy danh sách sản phẩm thành công"
        ));
    }

    private static async Task<IResult> GetProductById(
        int id,
        AppDbContext db = null!,
        CancellationToken ct = default)
    {
        var product = await db.Products
            .AsNoTracking()
            .Include(p => p.Category)
            .FirstOrDefaultAsync(p => p.Id == id && !p.IsDeleted, ct);

        if (product is null)
        {
            return Results.NotFound(new ApiResponse<ProductDto>(
                Success: false,
                Data: null,
                Error: new ApiError("PRODUCT_NOT_FOUND", "Sản phẩm không tồn tại")
            ));
        }

        var images = await db.ProductImages
            .AsNoTracking()
            .Where(i => i.ProductId == id)
            .OrderBy(i => i.SortOrder)
            .Select(i => i.ImageUrl)
            .ToListAsync(ct);

        var dto = new ProductDto(
            product.Id,
            product.Name,
            product.Description,
            product.Price,
            product.StockQuantity,
            product.Category.Name,
            product.CategoryId,
            images,
            product.InStock,
            product.IsActive,
            product.Rating,
            product.CreatedAt,
            product.UpdatedAt
        );

        return Results.Ok(new ApiResponse<ProductDto>(
            Success: true,
            Data: dto,
            Message: "Lấy thông tin sản phẩm thành công"
        ));
    }

    private static async Task<IResult> GetCategoryNames(
        bool activeOnly = true,
        AppDbContext db = null!,
        CancellationToken ct = default)
    {
        var query = db.Categories
            .AsNoTracking()
            .Where(c => c.DeletedAt == null);

        if (activeOnly)
        {
            query = query.Where(c => c.IsActive);
        }

        var categories = await query
            .OrderBy(c => c.Name)
            .Select(c => c.Name)
            .ToListAsync(ct);

        return Results.Ok(new ApiResponse<List<string>>(
            Success: true,
            Data: categories,
            Message: "Lấy danh mục thành công"
        ));
    }

    private static async Task<IResult> CreateProduct(
        CreateProductRequest request,
        AppDbContext db = null!,
        CancellationToken ct = default)
    {
        // Validate category exists
        var category = await db.Categories
            .AsNoTracking()
            .FirstOrDefaultAsync(c => c.Id == request.CategoryId && c.DeletedAt == null && c.IsActive, ct);

        if (category is null)
        {
            return Results.NotFound(new ApiResponse<ProductDto>(
                Success: false,
                Data: null,
                Error: new ApiError("CATEGORY_NOT_FOUND", "Danh mục không tồn tại hoặc không hoạt động")
            ));
        }

        // Validate images
        if (request.Images.Any(string.IsNullOrWhiteSpace))
        {
            return Results.BadRequest(new ApiResponse<ProductDto>(
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

            var dto = new ProductDto(
                product.Id,
                product.Name,
                product.Description,
                product.Price,
                product.StockQuantity,
                category.Name,
                product.CategoryId,
                request.Images,
                product.InStock,
                product.IsActive,
                product.Rating,
                product.CreatedAt,
                product.UpdatedAt
            );

            return Results.Created($"/api/products/{product.Id}", new ApiResponse<ProductDto>(
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

    private static async Task<IResult> UpdateProduct(
        int id,
        UpdateProductRequest request,
        AppDbContext db = null!,
        CancellationToken ct = default)
    {
        var product = await db.Products
            .Include(p => p.Images)
            .FirstOrDefaultAsync(p => p.Id == id && !p.IsDeleted, ct);

        if (product is null)
        {
            return Results.NotFound(new ApiResponse<ProductDto>(
                Success: false,
                Data: null,
                Error: new ApiError("PRODUCT_NOT_FOUND", "Sản phẩm không tồn tại")
            ));
        }

        // Validate category exists
        var category = await db.Categories
            .AsNoTracking()
            .FirstOrDefaultAsync(c => c.Id == request.CategoryId && c.DeletedAt == null && c.IsActive, ct);

        if (category is null)
        {
            return Results.NotFound(new ApiResponse<ProductDto>(
                Success: false,
                Data: null,
                Error: new ApiError("CATEGORY_NOT_FOUND", "Danh mục không tồn tại hoặc không hoạt động")
            ));
        }

        // Validate images
        if (request.Images.Any(string.IsNullOrWhiteSpace))
        {
            return Results.BadRequest(new ApiResponse<ProductDto>(
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

            var dto = new ProductDto(
                product.Id,
                product.Name,
                product.Description,
                product.Price,
                product.StockQuantity,
                category.Name,
                product.CategoryId,
                request.Images,
                product.InStock,
                product.IsActive,
                product.Rating,
                product.CreatedAt,
                product.UpdatedAt
            );

            return Results.Ok(new ApiResponse<ProductDto>(
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

    private static async Task<IResult> DeleteProduct(
        int id,
        AppDbContext db = null!,
        CancellationToken ct = default)
    {
        var product = await db.Products
            .Include(p => p.Category)
            .FirstOrDefaultAsync(p => p.Id == id && !p.IsDeleted, ct);

        if (product is null)
        {
            return Results.NotFound(new ApiResponse<ProductDto>(
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

        var images = await db.ProductImages
            .AsNoTracking()
            .Where(i => i.ProductId == id)
            .OrderBy(i => i.SortOrder)
            .Select(i => i.ImageUrl)
            .ToListAsync(ct);

        var dto = new ProductDto(
            product.Id,
            product.Name,
            product.Description,
            product.Price,
            product.StockQuantity,
            product.Category.Name,
            product.CategoryId,
            images,
            product.InStock,
            product.IsActive,
            product.Rating,
            product.CreatedAt,
            product.UpdatedAt
        );

        return Results.Ok(new ApiResponse<ProductDto>(
            Success: true,
            Data: dto,
            Message: "Xóa sản phẩm thành công"
        ));
    }

    private static async Task<IResult> ToggleProductStatus(
        int id,
        AppDbContext db = null!,
        CancellationToken ct = default)
    {
        var product = await db.Products
            .Include(p => p.Category)
            .FirstOrDefaultAsync(p => p.Id == id && !p.IsDeleted, ct);

        if (product is null)
        {
            return Results.NotFound(new ApiResponse<ProductDto>(
                Success: false,
                Data: null,
                Error: new ApiError("PRODUCT_NOT_FOUND", "Sản phẩm không tồn tại")
            ));
        }

        product.IsActive = !product.IsActive;
        product.UpdatedAt = DateTime.UtcNow;

        await db.SaveChangesAsync(ct);

        var images = await db.ProductImages
            .AsNoTracking()
            .Where(i => i.ProductId == id)
            .OrderBy(i => i.SortOrder)
            .Select(i => i.ImageUrl)
            .ToListAsync(ct);

        var dto = new ProductDto(
            product.Id,
            product.Name,
            product.Description,
            product.Price,
            product.StockQuantity,
            product.Category.Name,
            product.CategoryId,
            images,
            product.InStock,
            product.IsActive,
            product.Rating,
            product.CreatedAt,
            product.UpdatedAt
        );

        return Results.Ok(new ApiResponse<ProductDto>(
            Success: true,
            Data: dto,
            Message: product.IsActive ? "Kích hoạt sản phẩm thành công" : "Vô hiệu hóa sản phẩm thành công"
        ));
    }

    private static async Task<IResult> UpdateStock(
        int id,
        UpdateStockRequest request,
        AppDbContext db = null!,
        CancellationToken ct = default)
    {
        var product = await db.Products
            .Include(p => p.Category)
            .FirstOrDefaultAsync(p => p.Id == id && !p.IsDeleted, ct);

        if (product is null)
        {
            return Results.NotFound(new ApiResponse<ProductDto>(
                Success: false,
                Data: null,
                Error: new ApiError("PRODUCT_NOT_FOUND", "Sản phẩm không tồn tại")
            ));
        }

        product.StockQuantity = request.StockQuantity;
        product.UpdatedAt = DateTime.UtcNow;

        await db.SaveChangesAsync(ct);

        var images = await db.ProductImages
            .AsNoTracking()
            .Where(i => i.ProductId == id)
            .OrderBy(i => i.SortOrder)
            .Select(i => i.ImageUrl)
            .ToListAsync(ct);

        var dto = new ProductDto(
            product.Id,
            product.Name,
            product.Description,
            product.Price,
            product.StockQuantity,
            product.Category.Name,
            product.CategoryId,
            images,
            product.InStock,
            product.IsActive,
            product.Rating,
            product.CreatedAt,
            product.UpdatedAt
        );

        return Results.Ok(new ApiResponse<ProductDto>(
            Success: true,
            Data: dto,
            Message: "Cập nhật số lượng tồn kho thành công"
        ));
    }

    private static async Task<IResult> UpdateProductImages(
        int id,
        UpdateProductImagesRequest request,
        AppDbContext db = null!,
        CancellationToken ct = default)
    {
        var product = await db.Products
            .Include(p => p.Category)
            .Include(p => p.Images)
            .FirstOrDefaultAsync(p => p.Id == id && !p.IsDeleted, ct);

        if (product is null)
        {
            return Results.NotFound(new ApiResponse<ProductDto>(
                Success: false,
                Data: null,
                Error: new ApiError("PRODUCT_NOT_FOUND", "Sản phẩm không tồn tại")
            ));
        }

        // Validate images
        if (request.Images.Any(string.IsNullOrWhiteSpace))
        {
            return Results.BadRequest(new ApiResponse<ProductDto>(
                Success: false,
                Data: null,
                Error: new ApiError("INVALID_IMAGES", "Danh sách ảnh chứa URL không hợp lệ")
            ));
        }

        using var transaction = await db.Database.BeginTransactionAsync(ct);

        try
        {
            // Remove old images and add new ones
            db.ProductImages.RemoveRange(product.Images);

            var images = request.Images.Select((url, index) => new ProductImage
            {
                ProductId = product.Id,
                ImageUrl = url,
                SortOrder = index
            }).ToList();

            db.ProductImages.AddRange(images);

            product.UpdatedAt = DateTime.UtcNow;

            await db.SaveChangesAsync(ct);
            await transaction.CommitAsync(ct);

            var dto = new ProductDto(
                product.Id,
                product.Name,
                product.Description,
                product.Price,
                product.StockQuantity,
                product.Category.Name,
                product.CategoryId,
                request.Images,
                product.InStock,
                product.IsActive,
                product.Rating,
                product.CreatedAt,
                product.UpdatedAt
            );

            return Results.Ok(new ApiResponse<ProductDto>(
                Success: true,
                Data: dto,
                Message: "Cập nhật ảnh sản phẩm thành công"
            ));
        }
        catch
        {
            await transaction.RollbackAsync(ct);
            throw;
        }
    }
}
