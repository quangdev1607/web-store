namespace TiemBanhBeYeu.Api.Domain.Entities;

public class User
{
    public int Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string? Phone { get; set; }      // Số điện thoại - cho user
    public string? Address { get; set; }    // Địa chỉ - cho user
    public string Province { get; set; } = string.Empty;   // Tỉnh/TP - cho user
    public string District { get; set; } = string.Empty; // Quận/Huyện - cho user
    public string Ward { get; set; } = string.Empty;      // Phường/Xã - cho user
    public string Roles { get; set; } = "User"; // Stored as comma-separated string
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public bool IsActive { get; set; } = true;

    // Helper property to get roles as list
    public List<string> GetRoles() =>
        string.IsNullOrEmpty(Roles) 
            ? new List<string> { "User" } 
            : Roles.Split(',', StringSplitOptions.RemoveEmptyEntries).ToList();

    // Helper to check if user has a specific role
    public bool HasRole(string role) =>
        GetRoles().Contains(role, StringComparer.OrdinalIgnoreCase);
}