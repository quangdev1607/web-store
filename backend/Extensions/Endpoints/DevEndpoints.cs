using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using TiemBanhBeYeu.Api.DTOs;
using TiemBanhBeYeu.Api.Domain.Entities;
using TiemBanhBeYeu.Api.Infrastructure.Persistence;

namespace TiemBanhBeYeu.Api.Extensions.Endpoints;

public static class DevEndpoints
{
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNameCaseInsensitive = true
    };

    public static void MapDevEndpoints(this WebApplication app)
    {
        var dev = app.MapGroup("/api/dev").WithTags("Development").WithOpenApi();

        // DELETE /api/dev/clear-data - Clear all data from Orders, Products, ProductImages
        dev.MapDelete("/clear-data", ClearData)
            .WithName("ClearData")
            .Produces<ApiResponse<object>>();

        // DELETE /api/dev/clear-categories - Clear all categories
        dev.MapDelete("/clear-categories", ClearCategories)
            .WithName("ClearCategories")
            .Produces<ApiResponse<object>>();

        // POST /api/dev/seed-products - Seed products from product-seed.json
        dev.MapPost("/seed-products", SeedProducts)
            .WithName("SeedProducts")
            .Produces<ApiResponse<object>>();
    }

    private static async Task<IResult> ClearData(AppDbContext db, CancellationToken ct)
    {
        // Delete in correct order due to foreign key constraints
        // 1. Delete OrderItems first (child of Orders)
        var orderItems = await db.OrderItems.ToListAsync(ct);
        db.OrderItems.RemoveRange(orderItems);

        // 2. Delete Orders
        var orders = await db.Orders.ToListAsync(ct);
        db.Orders.RemoveRange(orders);

        // 3. Delete ProductImages first (child of Products)
        var productImages = await db.ProductImages.ToListAsync(ct);
        db.ProductImages.RemoveRange(productImages);

        // 4. Delete Products
        var products = await db.Products.ToListAsync(ct);
        db.Products.RemoveRange(products);

        await db.SaveChangesAsync(ct);

        return Results.Ok(new ApiResponse<object>(true, new 
        { 
            ordersDeleted = orders.Count,
            orderItemsDeleted = orderItems.Count,
            productsDeleted = products.Count,
            productImagesDeleted = productImages.Count
        }, "Data cleared successfully"));
    }

    private static async Task<IResult> ClearCategories(AppDbContext db, CancellationToken ct)
    {
        // First delete all products and their images
        var productImages = await db.ProductImages.ToListAsync(ct);
        db.ProductImages.RemoveRange(productImages);

        var products = await db.Products.ToListAsync(ct);
        db.Products.RemoveRange(products);

        // Then delete categories
        var categories = await db.Categories.ToListAsync(ct);
        db.Categories.RemoveRange(categories);

        await db.SaveChangesAsync(ct);

        return Results.Ok(new ApiResponse<object>(true, new 
        { 
            categoriesDeleted = categories.Count,
            productsDeleted = products.Count,
            productImagesDeleted = productImages.Count
        }, "Categories and products cleared successfully"));
    }

    private static async Task<IResult> SeedProducts(AppDbContext db, CancellationToken ct)
    {
        // Read product-seed.json - use fixed path
        var jsonPath = "/home/quang-penguin/Code/web-store/product-seed.json";

        if (!File.Exists(jsonPath))
        {
            return Results.NotFound(new ApiResponse<object>(false, null, "product-seed.json not found", null));
        }

        var json = await File.ReadAllTextAsync(jsonPath, ct);
        var productsData = JsonSerializer.Deserialize<List<ProductSeedDto>>(json, JsonOptions);

        if (productsData == null || productsData.Count == 0)
        {
            return Results.BadRequest(new ApiResponse<object>(false, null, "No products found in JSON", null));
        }

        // Get unique category names
        var categoryNames = productsData.Select(p => p.CategoryName).Distinct().ToList();

        // Create categories if not exist
        var categories = new List<Category>();
        foreach (var categoryName in categoryNames)
        {
            var existingCategory = await db.Categories.FirstOrDefaultAsync(c => c.Name == categoryName, ct);
            if (existingCategory == null)
            {
                var slug = categoryName.ToLower().Replace(" ", "-").Replace("&", "va");
                var newCategory = new Category { Name = categoryName, Slug = slug };
                db.Categories.Add(newCategory);
                categories.Add(newCategory);
            }
        }
        await db.SaveChangesAsync(ct);

        // Create products
        var createdProducts = 0;
        foreach (var productData in productsData)
        {
            var category = await db.Categories.FirstOrDefaultAsync(c => c.Name == productData.CategoryName, ct);
            if (category == null) continue;

            var product = new Product
            {
                Name = productData.Name,
                Description = productData.Description,
                Price = productData.Price,
                StockQuantity = productData.StockQuantity,
                CategoryId = category.Id,
                Rating = productData.Rating,
                IsActive = productData.IsActive,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
            db.Products.Add(product);
            await db.SaveChangesAsync(ct);

            // Add images if available
            if (productData.Images != null && productData.Images.Count > 0)
            {
                for (int i = 0; i < productData.Images.Count; i++)
                {
                    db.ProductImages.Add(new ProductImage
                    {
                        ProductId = product.Id,
                        ImageUrl = productData.Images[i],
                        SortOrder = i + 1
                    });
                }
                await db.SaveChangesAsync(ct);
            }

            createdProducts++;
        }

        return Results.Ok(new ApiResponse<object>(true, new 
        { 
            productsCreated = createdProducts,
            categoriesCreated = categories.Count
        }, "Products seeded successfully"));
    }

    // DTO for product seed
    private record ProductSeedDto(
        string Name,
        string Description,
        decimal Price,
        int StockQuantity,
        string CategoryName,
        double Rating,
        bool IsActive,
        List<string>? Images
    );
}
