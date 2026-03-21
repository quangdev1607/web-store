using System.ComponentModel.DataAnnotations;

namespace TiemBanhBeYeu.Api.DTOs.Products;

// Product DTO - matches frontend Product interface
public record ProductDto(
    int Id,
    string Name,
    string Description,
    decimal Price,
    int StockQuantity,
    string Category,
    int CategoryId,
    List<string> Images,
    bool InStock,
    bool IsActive,
    double? Rating,
    DateTime CreatedAt,
    DateTime UpdatedAt
);

// Product Summary DTO - for lists
public record ProductSummaryDto(
    int Id,
    string Name,
    decimal Price,
    int StockQuantity,
    string Category,
    string? ImageUrl,
    bool InStock,
    bool IsActive
);

// Query parameters for product filtering
public record ProductQueryParams(
    string? Search = null,
    string? Category = null,
    string? SortBy = null,
    int Page = 1,
    int PageSize = 20,
    bool? IsActive = null,
    bool IncludeDeleted = false
);

// Create Product Request
public record CreateProductRequest(
    [Required(ErrorMessage = "Tên sản phẩm là bắt buộc")]
    [StringLength(200, MinimumLength = 1, ErrorMessage = "Tên sản phẩm phải từ 1-200 ký tự")]
    string Name,
    
    [StringLength(2000, ErrorMessage = "Mô tả không được vượt quá 2000 ký tự")]
    string Description,
    
    [Required(ErrorMessage = "Giá là bắt buộc")]
    [Range(0, double.MaxValue, ErrorMessage = "Giá phải lớn hơn hoặc bằng 0")]
    decimal Price,
    
    [Required(ErrorMessage = "Số lượng tồn kho là bắt buộc")]
    [Range(0, int.MaxValue, ErrorMessage = "Số lượng tồn kho phải lớn hơn hoặc bằng 0")]
    int StockQuantity,
    
    [Required(ErrorMessage = "Danh mục là bắt buộc")]
    int CategoryId,
    
    [Required(ErrorMessage = "Danh sách ảnh là bắt buộc")]
    [MinLength(1, ErrorMessage = "Phải có ít nhất 1 ảnh")]
    List<string> Images
);

// Update Product Request
public record UpdateProductRequest(
    [Required(ErrorMessage = "Tên sản phẩm là bắt buộc")]
    [StringLength(200, MinimumLength = 1, ErrorMessage = "Tên sản phẩm phải từ 1-200 ký tự")]
    string Name,
    
    [StringLength(2000, ErrorMessage = "Mô tả không được vượt quá 2000 ký tự")]
    string Description,
    
    [Required(ErrorMessage = "Giá là bắt buộc")]
    [Range(0, double.MaxValue, ErrorMessage = "Giá phải lớn hơn hoặc bằng 0")]
    decimal Price,
    
    [Required(ErrorMessage = "Số lượng tồn kho là bắt buộc")]
    [Range(0, int.MaxValue, ErrorMessage = "Số lượng tồn kho phải lớn hơn hoặc bằng 0")]
    int StockQuantity,
    
    [Required(ErrorMessage = "Danh mục là bắt buộc")]
    int CategoryId,
    
    [Required(ErrorMessage = "Danh sách ảnh là bắt buộc")]
    [MinLength(1, ErrorMessage = "Phải có ít nhất 1 ảnh")]
    List<string> Images,
    
    bool IsActive
);

// Update Stock Request
public record UpdateStockRequest(
    [Required(ErrorMessage = "Số lượng tồn kho là bắt buộc")]
    [Range(0, int.MaxValue, ErrorMessage = "Số lượng tồn kho phải lớn hơn hoặc bằng 0")]
    int StockQuantity
);

// Toggle Product Status Request
public record ToggleProductStatusRequest(
    bool IsActive
);

// Add/Update Images Request
public record UpdateProductImagesRequest(
    [Required(ErrorMessage = "Danh sách ảnh là bắt buộc")]
    [MinLength(1, ErrorMessage = "Phải có ít nhất 1 ảnh")]
    List<string> Images
);
