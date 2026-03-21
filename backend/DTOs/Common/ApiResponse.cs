namespace TiemBanhBeYeu.Api.DTOs;

// Standard API response wrapper
public record ApiResponse<T>(
    bool Success,
    T? Data,
    string? Message = null,
    ApiError? Error = null
);

public record ApiError(
    string Code,
    string Message
);

// Pagination response
public record PagedResponse<T>(
    List<T> Items,
    int TotalCount,
    int Page,
    int PageSize,
    int TotalPages
)
{
    public static PagedResponse<T> Create(List<T> items, int totalCount, int page, int pageSize) =>
        new(items, totalCount, page, pageSize, (int)Math.Ceiling(totalCount / (double)pageSize));
}
