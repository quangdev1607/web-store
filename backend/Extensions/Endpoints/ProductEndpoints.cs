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

        // GET /api/products/{id} - Get product by ID
        products.MapGet("/{id:int}", GetProductById)
            .WithName("GetProductById")
            .Produces<ApiResponse<ProductDto>>()
            .ProducesProblem(404);

        // GET /api/products/categories - Get all categories
        products.MapGet("/categories", GetCategories)
            .WithName("GetCategories")
            .Produces<ApiResponse<List<string>>>();
    }

    private static async Task<IResult> GetProducts(
        string? search = null,
        string? category = null,
        string? sortBy = null,
        int page = 1,
        int pageSize = 20,
        AppDbContext db = null!,
        CancellationToken ct = default)
    {
        if (page < 1) page = 1;
        if (pageSize < 1) pageSize = 20;
        if (pageSize > 100) pageSize = 100;

        // Load products without sorting in the database to avoid SQLite decimal issues
        var allProducts = await db.Products
            .AsNoTracking()
            .Include(p => p.Category)
            .ToListAsync(ct);

        // Load images separately to avoid ORDER BY issues with Include
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
                p.Category.Name,
                imagesByProduct.GetValueOrDefault(p.Id, new List<string>()),
                p.InStock,
                p.Rating
            ))
            .ToList();

        var pagedResponse = PagedResponse<ProductDto>.Create(pagedProducts, totalCount, page, pageSize);

        return Results.Ok(new ApiResponse<PagedResponse<ProductDto>>(
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
            .FirstOrDefaultAsync(p => p.Id == id, ct);

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
            product.Category.Name,
            images,
            product.InStock,
            product.Rating
        );

        return Results.Ok(new ApiResponse<ProductDto>(
            Success: true,
            Data: dto,
            Message: "Lấy thông tin sản phẩm thành công"
        ));
    }

    private static async Task<IResult> GetCategories(
        AppDbContext db = null!,
        CancellationToken ct = default)
    {
        var categories = await db.Categories
            .AsNoTracking()
            .OrderBy(c => c.Name)
            .Select(c => c.Name)
            .ToListAsync(ct);

        return Results.Ok(new ApiResponse<List<string>>(
            Success: true,
            Data: categories,
            Message: "Lấy danh mục thành công"
        ));
    }
}
