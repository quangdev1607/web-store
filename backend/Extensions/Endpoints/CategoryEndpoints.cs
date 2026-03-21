using Microsoft.EntityFrameworkCore;
using TiemBanhBeYeu.Api.Domain.Entities;
using TiemBanhBeYeu.Api.DTOs;
using TiemBanhBeYeu.Api.DTOs.Categories;
using TiemBanhBeYeu.Api.Infrastructure.Persistence;

namespace TiemBanhBeYeu.Api.Extensions.Endpoints;

public static class CategoryEndpoints
{
    public static void MapCategoryEndpoints(this WebApplication app)
    {
        var categories = app.MapGroup("/api/categories").WithTags("Categories");

        // GET /api/categories - Get all categories
        categories.MapGet("/", GetCategories)
            .WithName("GetCategories")
            .Produces<ApiResponse<PagedResponse<CategoryDto>>>();
        
        // GET /api/categories/all - Get all categories (no pagination, for dropdown)
        categories.MapGet("/all", GetAllCategories)
            .WithName("GetAllCategories")
            .Produces<ApiResponse<List<CategorySummaryDto>>>();

        // GET /api/categories/{id} - Get category by ID
        categories.MapGet("/{id:int}", GetCategoryById)
            .WithName("GetCategoryById")
            .Produces<ApiResponse<CategoryDto>>()
            .ProducesProblem(404);

        // POST /api/categories - Create new category
        categories.MapPost("/", CreateCategory)
            .WithName("CreateCategory")
            .Produces<ApiResponse<CategoryDto>>(StatusCodes.Status201Created)
            .ProducesProblem(400)
            .ProducesProblem(409);

        // PUT /api/categories/{id} - Update category
        categories.MapPut("/{id:int}", UpdateCategory)
            .WithName("UpdateCategory")
            .Produces<ApiResponse<CategoryDto>>()
            .ProducesProblem(400)
            .ProducesProblem(404)
            .ProducesProblem(409);

        // DELETE /api/categories/{id} - Soft delete category
        categories.MapDelete("/{id:int}", DeleteCategory)
            .WithName("DeleteCategory")
            .Produces<ApiResponse<CategoryDto>>()
            .ProducesProblem(404);

        // PATCH /api/categories/{id}/status - Toggle category active status
        categories.MapPatch("/{id:int}/status", ToggleCategoryStatus)
            .WithName("ToggleCategoryStatus")
            .Produces<ApiResponse<CategoryDto>>()
            .ProducesProblem(404);
    }

    private static async Task<IResult> GetCategories(
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

        var query = db.Categories
            .AsNoTracking()
            .Where(c => c.DeletedAt == null);

        // Apply search filter
        if (!string.IsNullOrWhiteSpace(search))
        {
            query = query.Where(c => 
                c.Name.Contains(search) || 
                (c.Description != null && c.Description.Contains(search)));
        }

        // Apply isActive filter
        if (isActive.HasValue)
        {
            query = query.Where(c => c.IsActive == isActive.Value);
        }

        var totalCount = await query.CountAsync(ct);

        var categories = await query
            .Include(c => c.Products.Where(p => !p.IsDeleted))
            .OrderBy(c => c.Name)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(c => new CategoryDto(
                c.Id,
                c.Name,
                c.Slug,
                c.Description,
                c.ImageUrl,
                c.IsActive,
                c.Products.Count,
                c.CreatedAt,
                c.UpdatedAt
            ))
            .ToListAsync(ct);

        var pagedResponse = PagedResponse<CategoryDto>.Create(categories, totalCount, page, pageSize);

        return Results.Ok(new ApiResponse<PagedResponse<CategoryDto>>(
            Success: true,
            Data: pagedResponse,
            Message: "Lấy danh sách danh mục thành công"
        ));
    }

    private static async Task<IResult> GetAllCategories(
        bool? isActive = null,
        AppDbContext db = null!,
        CancellationToken ct = default)
    {
        var query = db.Categories
            .AsNoTracking()
            .Where(c => c.DeletedAt == null);

        if (isActive.HasValue)
        {
            query = query.Where(c => c.IsActive == isActive.Value);
        }

        var categories = await query
            .Include(c => c.Products.Where(p => !p.IsDeleted))
            .OrderBy(c => c.Name)
            .Select(c => new CategorySummaryDto(
                c.Id,
                c.Name,
                c.Slug,
                c.IsActive,
                c.Products.Count
            ))
            .ToListAsync(ct);

        return Results.Ok(new ApiResponse<List<CategorySummaryDto>>(
            Success: true,
            Data: categories,
            Message: "Lấy danh sách danh mục thành công"
        ));
    }

    private static async Task<IResult> GetCategoryById(
        int id,
        AppDbContext db = null!,
        CancellationToken ct = default)
    {
        var category = await db.Categories
            .AsNoTracking()
            .Include(c => c.Products.Where(p => !p.IsDeleted))
            .FirstOrDefaultAsync(c => c.Id == id && c.DeletedAt == null, ct);

        if (category is null)
        {
            return Results.NotFound(new ApiResponse<CategoryDto>(
                Success: false,
                Data: null,
                Error: new ApiError("CATEGORY_NOT_FOUND", "Danh mục không tồn tại")
            ));
        }

        var dto = new CategoryDto(
            category.Id,
            category.Name,
            category.Slug,
            category.Description,
            category.ImageUrl,
            category.IsActive,
            category.Products.Count,
            category.CreatedAt,
            category.UpdatedAt
        );

        return Results.Ok(new ApiResponse<CategoryDto>(
            Success: true,
            Data: dto,
            Message: "Lấy thông tin danh mục thành công"
        ));
    }

    private static async Task<IResult> CreateCategory(
        CreateCategoryRequest request,
        AppDbContext db = null!,
        CancellationToken ct = default)
    {
        // Check if slug already exists
        var existingCategory = await db.Categories
            .AsNoTracking()
            .FirstOrDefaultAsync(c => c.Slug == request.Slug && c.DeletedAt == null, ct);

        if (existingCategory is not null)
        {
            return Results.Conflict(new ApiResponse<CategoryDto>(
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

        var dto = new CategoryDto(
            category.Id,
            category.Name,
            category.Slug,
            category.Description,
            category.ImageUrl,
            category.IsActive,
            0,
            category.CreatedAt,
            category.UpdatedAt
        );

        return Results.Created($"/api/categories/{category.Id}", new ApiResponse<CategoryDto>(
            Success: true,
            Data: dto,
            Message: "Tạo danh mục thành công"
        ));
    }

    private static async Task<IResult> UpdateCategory(
        int id,
        UpdateCategoryRequest request,
        AppDbContext db = null!,
        CancellationToken ct = default)
    {
        var category = await db.Categories
            .FirstOrDefaultAsync(c => c.Id == id && c.DeletedAt == null, ct);

        if (category is null)
        {
            return Results.NotFound(new ApiResponse<CategoryDto>(
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
            return Results.Conflict(new ApiResponse<CategoryDto>(
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

        var dto = new CategoryDto(
            category.Id,
            category.Name,
            category.Slug,
            category.Description,
            category.ImageUrl,
            category.IsActive,
            productCount,
            category.CreatedAt,
            category.UpdatedAt
        );

        return Results.Ok(new ApiResponse<CategoryDto>(
            Success: true,
            Data: dto,
            Message: "Cập nhật danh mục thành công"
        ));
    }

    private static async Task<IResult> DeleteCategory(
        int id,
        AppDbContext db = null!,
        CancellationToken ct = default)
    {
        var category = await db.Categories
            .Include(c => c.Products.Where(p => !p.IsDeleted))
            .FirstOrDefaultAsync(c => c.Id == id && c.DeletedAt == null, ct);

        if (category is null)
        {
            return Results.NotFound(new ApiResponse<CategoryDto>(
                Success: false,
                Data: null,
                Error: new ApiError("CATEGORY_NOT_FOUND", "Danh mục không tồn tại")
            ));
        }

        // Check if category has active products
        var activeProducts = category.Products.Count(p => p.IsActive);
        if (activeProducts > 0)
        {
            return Results.BadRequest(new ApiResponse<CategoryDto>(
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

        var dto = new CategoryDto(
            category.Id,
            category.Name,
            category.Slug,
            category.Description,
            category.ImageUrl,
            category.IsActive,
            0,
            category.CreatedAt,
            category.UpdatedAt
        );

        return Results.Ok(new ApiResponse<CategoryDto>(
            Success: true,
            Data: dto,
            Message: "Xóa danh mục thành công"
        ));
    }

    private static async Task<IResult> ToggleCategoryStatus(
        int id,
        AppDbContext db = null!,
        CancellationToken ct = default)
    {
        var category = await db.Categories
            .Include(c => c.Products.Where(p => !p.IsDeleted))
            .FirstOrDefaultAsync(c => c.Id == id && c.DeletedAt == null, ct);

        if (category is null)
        {
            return Results.NotFound(new ApiResponse<CategoryDto>(
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
                return Results.BadRequest(new ApiResponse<CategoryDto>(
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

        var dto = new CategoryDto(
            category.Id,
            category.Name,
            category.Slug,
            category.Description,
            category.ImageUrl,
            category.IsActive,
            category.Products.Count,
            category.CreatedAt,
            category.UpdatedAt
        );

        return Results.Ok(new ApiResponse<CategoryDto>(
            Success: true,
            Data: dto,
            Message: category.IsActive ? "Kích hoạt danh mục thành công" : "Vô hiệu hóa danh mục thành công"
        ));
    }
}
