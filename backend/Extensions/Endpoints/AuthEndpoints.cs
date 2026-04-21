using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using TiemBanhBeYeu.Api.DTOs;
using TiemBanhBeYeu.Api.DTOs.Auth;
using TiemBanhBeYeu.Api.Domain.Entities;
using TiemBanhBeYeu.Api.Infrastructure.Persistence;
using TiemBanhBeYeu.Api.Infrastructure.Services;

namespace TiemBanhBeYeu.Api.Extensions.Endpoints;

public static class AuthEndpoints
{
    public static void MapAuthEndpoints(this WebApplication app)
    {
        var auth = app.MapGroup("/api/auth").WithTags("Authentication").WithOpenApi();

        // POST /api/auth/register - Register new user
        auth.MapPost("/register", Register)
            .WithName("Register")
            .Produces<ApiResponse<AuthResponse>>(StatusCodes.Status201Created)
            .ProducesProblem(400)
            .AllowAnonymous();

        // POST /api/auth/login - Login
        auth.MapPost("/login", Login)
            .WithName("Login")
            .Produces<ApiResponse<AuthResponse>>()
            .ProducesProblem(401)
            .AllowAnonymous();

        // GET /api/auth/me - Get current user info
        auth.MapGet("/me", GetCurrentUser)
            .WithName("GetCurrentUser")
            .Produces<ApiResponse<UserDto>>()
            .ProducesProblem(401)
            .RequireAuthorization();

        // PUT /api/auth/me - Update current user profile
        auth.MapPut("/me", UpdateProfile)
            .WithName("UpdateProfile")
            .Produces<ApiResponse<UserDto>>()
            .ProducesProblem(400)
            .ProducesProblem(401)
            .RequireAuthorization();
    }

    private static async Task<IResult> Register(
        RegisterRequest request,
        AppDbContext db,
        IPasswordHasher passwordHasher,
        IJwtService jwtService,
        CancellationToken ct)
    {
        // Validate input
        if (string.IsNullOrWhiteSpace(request.Email))
        {
            return Results.BadRequest(new ApiResponse<object>(false, null, "Email is required", new ApiError("VALIDATION_ERROR", "Email is required")));
        }

        if (string.IsNullOrWhiteSpace(request.Password) || request.Password.Length < 6)
        {
            return Results.BadRequest(new ApiResponse<object>(false, null, "Password must be at least 6 characters", new ApiError("VALIDATION_ERROR", "Password must be at least 6 characters")));
        }

        if (string.IsNullOrWhiteSpace(request.FirstName) || string.IsNullOrWhiteSpace(request.LastName))
        {
            return Results.BadRequest(new ApiResponse<object>(false, null, "First name and last name are required", new ApiError("VALIDATION_ERROR", "First name and last name are required")));
        }

        // Check if email already exists
        var existingUser = await db.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(u => u.Email == request.Email.ToLower().Trim(), ct);

        if (existingUser is not null)
        {
            return Results.BadRequest(new ApiResponse<object>(false, null, "Email already registered", new ApiError("DUPLICATE_EMAIL", "Email already registered")));
        }

        // Create new user
        var user = new User
        {
            Email = request.Email.ToLower().Trim(),
            PasswordHash = passwordHasher.HashPassword(request.Password),
            FirstName = request.FirstName?.Trim() ?? string.Empty,
            LastName = request.LastName?.Trim() ?? string.Empty,
            Phone = request.Phone?.Trim(),
            Address = request.Address?.Trim(),
            Province = request.Province?.Trim() ?? string.Empty,
            ProvinceName = request.ProvinceName?.Trim(),
            Ward = request.Ward?.Trim() ?? string.Empty,
            WardName = request.WardName?.Trim(),
            Roles = "User",
            CreatedAt = DateTime.UtcNow,
            IsActive = true
        };

        db.Users.Add(user);
        await db.SaveChangesAsync(ct);

        // Generate token
        var token = jwtService.GenerateToken(user.Id, user.Email, user.GetRoles());

        var response = new AuthResponse(
            token,
            user.Email,
            user.FirstName,
            user.LastName,
            user.GetRoles(),
            user.Phone,
            user.Address,
            user.Province,
            user.ProvinceName,
            user.Ward,
            user.WardName
        );

        return Results.Created($"/api/auth/me", new ApiResponse<AuthResponse>(true, response, "Registration successful"));
    }

    private static async Task<IResult> Login(
        LoginRequest request,
        AppDbContext db,
        IPasswordHasher passwordHasher,
        IJwtService jwtService,
        CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
        {
            return Results.BadRequest(new ApiResponse<object>(false, null, "Email and password are required", new ApiError("VALIDATION_ERROR", "Email and password are required")));
        }

        var user = await db.Users
            .FirstOrDefaultAsync(u => u.Email == request.Email.ToLower().Trim(), ct);

        if (user is null || !passwordHasher.VerifyPassword(request.Password, user.PasswordHash))
        {
            return Results.Json(
                new ApiResponse<object>(false, null, "Email hoặc mật khẩu không đúng", new ApiError("INVALID_CREDENTIALS", "Email hoặc mật khẩu không đúng")),
                statusCode: StatusCodes.Status401Unauthorized);
        }

        if (!user.IsActive)
        {
            return Results.BadRequest(new ApiResponse<object>(false, null, "Tài khoản bị vô hiệu hóa", new ApiError("INACTIVE_ACCOUNT", "Tài khoản bị vô hiệu hóa")));
        }

        var token = jwtService.GenerateToken(user.Id, user.Email, user.GetRoles());

        var response = new AuthResponse(
            token,
            user.Email,
            user.FirstName,
            user.LastName,
            user.GetRoles(),
            user.Phone,
            user.Address,
            user.Province,
            user.ProvinceName,
            user.Ward,
            user.WardName
        );

        return Results.Ok(new ApiResponse<AuthResponse>(true, response, "Login successful"));
    }

    private static async Task<IResult> GetCurrentUser(
        HttpContext httpContext,
        AppDbContext db,
        CancellationToken ct)
    {
        var userIdClaim = httpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (!int.TryParse(userIdClaim, out var userId))
        {
            return Results.Unauthorized();
        }

        var user = await db.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(u => u.Id == userId, ct);

        if (user is null)
        {
            return Results.NotFound(new ApiResponse<object>(false, null, "User not found", new ApiError("NOT_FOUND", "User not found")));
        }

        var userDto = new UserDto(
            user.Id,
            user.Email,
            user.FirstName,
            user.LastName,
            user.GetRoles(),
            user.Phone,
            user.Address,
            user.Province,
            user.ProvinceName,
            user.Ward,
            user.WardName,
            user.CreatedAt
        );

        return Results.Ok(new ApiResponse<UserDto>(true, userDto));
    }

    private static async Task<IResult> UpdateProfile(
        UpdateProfileRequest request,
        HttpContext httpContext,
        AppDbContext db,
        CancellationToken ct)
    {
        var userIdClaim = httpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (!int.TryParse(userIdClaim, out var userId))
        {
            return Results.Unauthorized();
        }

        var user = await db.Users.FindAsync(new object[] { userId }, ct);

        if (user is null)
        {
            return Results.NotFound(new ApiResponse<object>(false, null, "User not found", new ApiError("NOT_FOUND", "User not found")));
        }

        // Update fields if provided
        if (request.FirstName is not null)
            user.FirstName = request.FirstName.Trim();

        if (request.LastName is not null)
            user.LastName = request.LastName.Trim();

        if (request.Phone is not null)
            user.Phone = request.Phone.Trim();

        if (request.Address is not null)
            user.Address = request.Address.Trim();

        if (request.Province is not null)
            user.Province = request.Province.Trim();

        if (request.ProvinceName is not null)
            user.ProvinceName = request.ProvinceName.Trim();

        if (request.Ward is not null)
            user.Ward = request.Ward.Trim();

        if (request.WardName is not null)
            user.WardName = request.WardName.Trim();

        await db.SaveChangesAsync(ct);

        var userDto = new UserDto(
            user.Id,
            user.Email,
            user.FirstName,
            user.LastName,
            user.GetRoles(),
            user.Phone,
            user.Address,
            user.Province,
            user.ProvinceName,
            user.Ward,
            user.WardName,
            user.CreatedAt
        );

        return Results.Ok(new ApiResponse<UserDto>(true, userDto, "Profile updated successfully"));
    }
}
