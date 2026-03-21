using System.ComponentModel.DataAnnotations;

namespace TiemBanhBeYeu.Api.DTOs.Categories;

// Category DTO - Response
public record CategoryDto(
    int Id,
    string Name,
    string Slug,
    string? Description,
    string? ImageUrl,
    bool IsActive,
    int ProductCount,
    DateTime CreatedAt,
    DateTime UpdatedAt
);

// Category DTO - Summary (for lists)
public record CategorySummaryDto(
    int Id,
    string Name,
    string Slug,
    bool IsActive,
    int ProductCount
);

// Create Category Request
public record CreateCategoryRequest(
    [Required(ErrorMessage = "Tên danh mục là bắt buộc")]
    [StringLength(100, MinimumLength = 1, ErrorMessage = "Tên danh mục phải từ 1-100 ký tự")]
    string Name,
    
    [Required(ErrorMessage = "Slug là bắt buộc")]
    [StringLength(100, MinimumLength = 1, ErrorMessage = "Slug phải từ 1-100 ký tự")]
    [RegularExpression(@"^[a-z0-9]+(?:-[a-z0-9]+)*$", ErrorMessage = "Slug phải là chữ thường, số và dấu gạch ngang")]
    string Slug,
    
    [StringLength(500, ErrorMessage = "Mô tả không được vượt quá 500 ký tự")]
    string? Description,
    
    [Url(ErrorMessage = "URL hình ảnh không hợp lệ")]
    string? ImageUrl
);

// Update Category Request
public record UpdateCategoryRequest(
    [Required(ErrorMessage = "Tên danh mục là bắt buộc")]
    [StringLength(100, MinimumLength = 1, ErrorMessage = "Tên danh mục phải từ 1-100 ký tự")]
    string Name,
    
    [Required(ErrorMessage = "Slug là bắt buộc")]
    [StringLength(100, MinimumLength = 1, ErrorMessage = "Slug phải từ 1-100 ký tự")]
    [RegularExpression(@"^[a-z0-9]+(?:-[a-z0-9]+)*$", ErrorMessage = "Slug phải là chữ thường, số và dấu gạch ngang")]
    string Slug,
    
    [StringLength(500, ErrorMessage = "Mô tả không được vượt quá 500 ký tự")]
    string? Description,
    
    [Url(ErrorMessage = "URL hình ảnh không hợp lệ")]
    string? ImageUrl,
    
    bool IsActive
);

// Toggle Category Status Request
public record ToggleCategoryStatusRequest(
    bool IsActive
);
