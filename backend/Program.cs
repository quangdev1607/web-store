using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using TiemBanhBeYeu.Api.Extensions.Endpoints;
using TiemBanhBeYeu.Api.Infrastructure.Persistence;

var builder = WebApplication.CreateBuilder(args);

// Configure Kestrel to run on port 5000
builder.WebHost.ConfigureKestrel(options =>
{
    options.ListenAnyIP(5000);
});

// Add services to the container
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Tiệm Bánh Bé Yêu API",
        Version = "v1",
        Description = "API for Snack Food E-commerce Website for Children"
    });
});

// Configure SQLite database
builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"));
});

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>()
            ?? new[] { "http://localhost:5173", "http://localhost:3000" };
        
        policy.WithOrigins(allowedOrigins)
            .AllowAnyMethod()
            .AllowAnyHeader()
            .WithExposedHeaders("Content-Type");
    });
});

var app = builder.Build();

// Initialize database and seed data
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    await DbSeeder.SeedAsync(context);
}

// Configure the HTTP request pipeline
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Tiệm Bánh Bé Yêu API v1");
    c.RoutePrefix = string.Empty; // Set Swagger UI at the root
});

app.UseCors();

// Map endpoints
app.MapProductEndpoints();
app.MapCategoryEndpoints();
app.MapOrderEndpoints();

// Health check endpoint
app.MapGet("/api/health", () => Results.Ok(new { Status = "Healthy", Timestamp = DateTime.UtcNow }))
    .WithTags("Health")
    .Produces(200);

app.Run();
