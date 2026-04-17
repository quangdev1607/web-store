using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using TiemBanhBeYeu.Api.DTOs;
using TiemBanhBeYeu.Api.DTOs.Cart;
using TiemBanhBeYeu.Api.Domain.Entities;
using TiemBanhBeYeu.Api.Infrastructure.Persistence;

namespace TiemBanhBeYeu.Api.Extensions.Endpoints;

public static class CartEndpoints
{
    public static void MapCartEndpoints(this WebApplication app)
    {
        var cart = app.MapGroup("/api/cart").WithTags("Shopping Cart").WithOpenApi();

        // GET /api/cart - Get current user's cart
        cart.MapGet("/", GetCart)
            .WithName("GetCart")
            .Produces<ApiResponse<CartDto>>()
            .ProducesProblem(401)
            .RequireAuthorization();

        // POST /api/cart/items - Add item to cart
        cart.MapPost("/items", AddToCart)
            .WithName("AddToCart")
            .Produces<ApiResponse<CartDto>>(StatusCodes.Status201Created)
            .ProducesProblem(400)
            .ProducesProblem(401)
            .RequireAuthorization();

        // PUT /api/cart/items/{productId} - Update cart item quantity
        cart.MapPut("/items/{productId:int}", UpdateCartItem)
            .WithName("UpdateCartItem")
            .Produces<ApiResponse<CartDto>>()
            .ProducesProblem(400)
            .ProducesProblem(404)
            .ProducesProblem(401)
            .RequireAuthorization();

        // DELETE /api/cart/items/{productId} - Remove item from cart
        cart.MapDelete("/items/{productId:int}", RemoveFromCart)
            .WithName("RemoveFromCart")
            .Produces<ApiResponse<CartDto>>()
            .ProducesProblem(404)
            .ProducesProblem(401)
            .RequireAuthorization();

        // DELETE /api/cart - Clear entire cart
        cart.MapDelete("/", ClearCart)
            .WithName("ClearCart")
            .Produces<ApiResponse<CartDto>>()
            .ProducesProblem(401)
            .RequireAuthorization();
    }

    private static async Task<IResult> GetCart(
        HttpContext httpContext,
        AppDbContext db,
        CancellationToken ct)
    {
        var userId = GetUserId(httpContext);
        if (userId is null) return Results.Unauthorized();

        var cart = await db.Carts
            .Include(c => c.Items)
            .ThenInclude(ci => ci.Product)
            .ThenInclude(p => p!.Images.Where(img => img.SortOrder == 1).Take(1))
            .FirstOrDefaultAsync(c => c.UserId == userId, ct);

        if (cart is null)
        {
            // Create empty cart
            cart = new Cart { UserId = userId.Value };
            db.Carts.Add(cart);
            await db.SaveChangesAsync(ct);
        }

        var cartDto = MapToCartDto(cart);
        return Results.Ok(new ApiResponse<CartDto>(true, cartDto));
    }

    private static async Task<IResult> AddToCart(
        AddToCartRequest request,
        HttpContext httpContext,
        AppDbContext db,
        CancellationToken ct)
    {
        var userId = GetUserId(httpContext);
        if (userId is null) return Results.Unauthorized();

        if (request.Quantity < 1)
        {
            return Results.BadRequest(new ApiResponse<object>(false, null, "Quantity must be at least 1", new ApiError("INVALID_QUANTITY", "Quantity must be at least 1")));
        }

        // Check if product exists
        var product = await db.Products.FindAsync(new object[] { request.ProductId }, ct);
        if (product is null || !product.IsActive || product.IsDeleted)
        {
            return Results.NotFound(new ApiResponse<object>(false, null, "Product not found", new ApiError("NOT_FOUND", "Product not found")));
        }

        // Get or create cart
        var cart = await db.Carts
            .Include(c => c.Items)
            .FirstOrDefaultAsync(c => c.UserId == userId, ct);

        if (cart is null)
        {
            cart = new Cart { UserId = userId.Value };
            db.Carts.Add(cart);
        }

        // Check if item already in cart
        var existingItem = cart.Items.FirstOrDefault(ci => ci.ProductId == request.ProductId);
        if (existingItem is not null)
        {
            existingItem.Quantity += request.Quantity;
        }
        else
        {
            cart.Items.Add(new CartItem
            {
                ProductId = request.ProductId,
                Quantity = request.Quantity
            });
        }

        cart.UpdatedAt = DateTime.UtcNow;
        await db.SaveChangesAsync(ct);

        // Reload cart with product data
        cart = await db.Carts
            .Include(c => c.Items)
            .ThenInclude(ci => ci.Product)
            .ThenInclude(p => p!.Images.Where(img => img.SortOrder == 1).Take(1))
            .FirstAsync(c => c.Id == cart.Id, ct);

        var cartDto = MapToCartDto(cart);
        return Results.Created($"/api/cart", new ApiResponse<CartDto>(true, cartDto, "Item added to cart"));
    }

    private static async Task<IResult> UpdateCartItem(
        int productId,
        UpdateCartItemRequest request,
        HttpContext httpContext,
        AppDbContext db,
        CancellationToken ct)
    {
        var userId = GetUserId(httpContext);
        if (userId is null) return Results.Unauthorized();

        if (request.Quantity < 1)
        {
            return Results.BadRequest(new ApiResponse<object>(false, null, "Quantity must be at least 1", new ApiError("INVALID_QUANTITY", "Quantity must be at least 1")));
        }

        var cart = await db.Carts
            .Include(c => c.Items)
            .ThenInclude(ci => ci.Product)
            .ThenInclude(p => p!.Images.Where(img => img.SortOrder == 1).Take(1))
            .FirstOrDefaultAsync(c => c.UserId == userId, ct);

        if (cart is null)
        {
            return Results.NotFound(new ApiResponse<object>(false, null, "Cart not found", new ApiError("NOT_FOUND", "Cart not found")));
        }

        var item = cart.Items.FirstOrDefault(ci => ci.ProductId == productId);
        if (item is null)
        {
            return Results.NotFound(new ApiResponse<object>(false, null, "Item not found in cart", new ApiError("NOT_FOUND", "Item not found in cart")));
        }

        item.Quantity = request.Quantity;
        cart.UpdatedAt = DateTime.UtcNow;
        await db.SaveChangesAsync(ct);

        var cartDto = MapToCartDto(cart);
        return Results.Ok(new ApiResponse<CartDto>(true, cartDto, "Cart updated"));
    }

    private static async Task<IResult> RemoveFromCart(
        int productId,
        HttpContext httpContext,
        AppDbContext db,
        CancellationToken ct)
    {
        var userId = GetUserId(httpContext);
        if (userId is null) return Results.Unauthorized();

        var cart = await db.Carts
            .Include(c => c.Items)
            .ThenInclude(ci => ci.Product)
            .ThenInclude(p => p!.Images.Where(img => img.SortOrder == 1).Take(1))
            .FirstOrDefaultAsync(c => c.UserId == userId, ct);

        if (cart is null)
        {
            return Results.NotFound(new ApiResponse<object>(false, null, "Cart not found", new ApiError("NOT_FOUND", "Cart not found")));
        }

        var item = cart.Items.FirstOrDefault(ci => ci.ProductId == productId);
        if (item is null)
        {
            return Results.NotFound(new ApiResponse<object>(false, null, "Item not found in cart", new ApiError("NOT_FOUND", "Item not found in cart")));
        }

        db.CartItems.Remove(item);
        cart.UpdatedAt = DateTime.UtcNow;
        await db.SaveChangesAsync(ct);

        var cartDto = MapToCartDto(cart);
        return Results.Ok(new ApiResponse<CartDto>(true, cartDto, "Item removed from cart"));
    }

    private static async Task<IResult> ClearCart(
        HttpContext httpContext,
        AppDbContext db,
        CancellationToken ct)
    {
        var userId = GetUserId(httpContext);
        if (userId is null) return Results.Unauthorized();

        var cart = await db.Carts
            .Include(c => c.Items)
            .FirstOrDefaultAsync(c => c.UserId == userId, ct);

        if (cart is null)
        {
            return Results.Ok(new ApiResponse<CartDto>(true, new CartDto(0, userId.Value, new List<CartItemDto>(), 0, 0, DateTime.UtcNow), "Cart already empty"));
        }

        db.CartItems.RemoveRange(cart.Items);
        cart.UpdatedAt = DateTime.UtcNow;
        await db.SaveChangesAsync(ct);

        var cartDto = MapToCartDto(cart);
        return Results.Ok(new ApiResponse<CartDto>(true, cartDto, "Cart cleared"));
    }

    private static int? GetUserId(HttpContext httpContext)
    {
        var userIdClaim = httpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
        return int.TryParse(userIdClaim, out var userId) ? userId : null;
    }

    private static CartDto MapToCartDto(Cart cart)
    {
        var items = cart.Items.Select(ci => new CartItemDto(
            ci.Id,
            ci.ProductId,
            ci.Product?.Name ?? "Unknown Product",
            ci.Product?.Images?.FirstOrDefault()?.ImageUrl,
            ci.Product?.Price ?? 0,
            ci.Quantity,
            (ci.Product?.Price ?? 0) * ci.Quantity
        )).ToList();

        var totalAmount = items.Sum(i => i.Subtotal);
        var totalItems = items.Sum(i => i.Quantity);

        return new CartDto(
            cart.Id,
            cart.UserId,
            items,
            totalItems,
            totalAmount,
            cart.UpdatedAt
        );
    }
}