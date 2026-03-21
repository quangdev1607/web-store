namespace TiemBanhBeYeu.Api.DTOs.Products;

// Product DTO - matches frontend Product interface
public record ProductDto(
    int Id,
    string Name,
    string Description,
    decimal Price,
    string Category,
    List<string> Images,
    bool InStock,
    double? Rating
);

// Query parameters for product filtering
public record ProductQueryParams(
    string? Search = null,
    string? Category = null,
    string? SortBy = null,
    int Page = 1,
    int PageSize = 20
);
