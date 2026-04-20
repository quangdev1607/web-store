namespace TiemBanhBeYeu.Api.DTOs.Auth;

public record RegisterRequest(
    string Email,
    string Password,
    string FirstName,
    string LastName,
    string? Phone = null,
    string? Address = null,
    string? Province = null,
    string? ProvinceName = null,
    string? Ward = null,
    string? WardName = null
);

public record LoginRequest(
    string Email,
    string Password
);

public record AuthResponse(
    string Token,
    string Email,
    string FirstName,
    string LastName,
    List<string> Roles,
    string? Phone = null,
    string? Address = null,
    string? Province = null,
    string? ProvinceName = null,
    string? Ward = null,
    string? WardName = null
);

public record UserDto(
    int Id,
    string Email,
    string FirstName,
    string LastName,
    List<string> Roles,
    string? Phone = null,
    string? Address = null,
    string? Province = null,
    string? ProvinceName = null,
    string? Ward = null,
    string? WardName = null,
    DateTime CreatedAt = default
);

// Update profile request
public record UpdateProfileRequest(
    string? FirstName = null,
    string? LastName = null,
    string? Phone = null,
    string? Address = null,
    string? Province = null,
    string? ProvinceName = null,
    string? Ward = null,
    string? WardName = null
);
