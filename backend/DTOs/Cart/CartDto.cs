namespace TiemBanhBeYeu.Api.DTOs.Cart;

public record AddToCartRequest(
    int ProductId,
    int Quantity
);

public record UpdateCartItemRequest(
    int Quantity
);

public record CartItemDto(
    int Id,
    int ProductId,
    string ProductName,
    string? ProductImage,
    decimal ProductPrice,
    int Quantity,
    decimal Subtotal
);

public record CartDto(
    int Id,
    int UserId,
    List<CartItemDto> Items,
    int TotalItems,
    decimal TotalAmount,
    DateTime UpdatedAt
);