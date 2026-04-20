namespace TiemBanhBeYeu.Api.DTOs.Orders;

// Order creation request from frontend
public record CreateOrderRequest(
    CustomerInfo CustomerInfo,
    ShippingAddress ShippingAddress,
    List<OrderItemRequest> Items
);

public record CustomerInfo(
    string Name,
    string Phone,
    string Email
);

// Shipping address - simple strings from frontend (frontend calls external API)
public record ShippingAddress(
    string Province,
    string Ward,
    string Address
);

public record OrderItemRequest(
    int ProductId,
    int Quantity
);

// Order response
public record OrderDto(
    int Id,
    string OrderCode,
    string CustomerName,
    string CustomerPhone,
    string CustomerEmail,
    ShippingAddressDto ShippingAddress,
    decimal TotalAmount,
    string Status,
    DateTime CreatedAt,
    List<OrderItemDto> Items
);

public record ShippingAddressDto(
    string Province,
    string Ward,
    string Address
);

public record OrderItemDto(
    int ProductId,
    string ProductName,
    decimal ProductPrice,
    int Quantity
);

// Create order response
public record CreateOrderResponse(
    int OrderId,
    string OrderCode,
    decimal TotalAmount,
    DateTime EstimatedDelivery
);
