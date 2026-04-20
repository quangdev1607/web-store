using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using TiemBanhBeYeu.Api.Domain.Entities;
using TiemBanhBeYeu.Api.Infrastructure.Services;

namespace TiemBanhBeYeu.Api.Infrastructure.Persistence;

public static class DbSeeder
{
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNameCaseInsensitive = true
    };

    public static async Task SeedAsync(AppDbContext context, IPasswordHasher? passwordHasher = null)
    {
        // Ensure database is created
        await context.Database.EnsureCreatedAsync();

        // Seed categories if empty
        if (!await context.Categories.AnyAsync())
        {
            var categories = new[]
            {
                new Category { Name = "Kẹo", Slug = "keo" },
                new Category { Name = "Bánh", Slug = "banh" },
                new Category { Name = "Đồ uống", Slug = "do-uong" }
            };
            context.Categories.AddRange(categories);
            await context.SaveChangesAsync();
        }

        // Seed products if empty
        if (!await context.Products.AnyAsync())
        {
            var categoryKẹo = await context.Categories.FirstAsync(c => c.Slug == "keo");
            var categoryBánh = await context.Categories.FirstAsync(c => c.Slug == "banh");
            var categoryĐồUống = await context.Categories.FirstAsync(c => c.Slug == "do-uong");

            var products = new[]
            {
                new Product
                {
                    Name = "Kẹo mút trị ho hữu cơ cho bé",
                    Description = "Kẹo mút trị ho từ thiên nhiên, không chất bảo quản, an toàn cho trẻ em từ 2 tuổi trở lên. Hương vị thơm ngon, dễ sử dụng.",
                    Price = 35000,
                    StockQuantity = 100,
                    CategoryId = categoryKẹo.Id,
                    IsActive = true,
                    Rating = 4.5,
                    Images = new List<ProductImage>
                    {
                        new() { ImageUrl = "/img/keo-mut-tri-ho-1.jpg", SortOrder = 1 },
                        new() { ImageUrl = "/img/keo-mut-tri-ho-2.jpg", SortOrder = 2 }
                    }
                },
                new Product
                {
                    Name = "Kẹo sữa Milky – Hộp 20 viên",
                    Description = "Kẹo sữa thơm ngon, giàu canxi, phù hợp cho trẻ em. Được sản xuất từ sữa tươi cao cấp.",
                    Price = 25000,
                    StockQuantity = 150,
                    CategoryId = categoryKẹo.Id,
                    IsActive = true,
                    Rating = 4.8,
                    Images = new List<ProductImage>
                    {
                        new() { ImageUrl = "/img/keo-sua-milky.jpg", SortOrder = 1 }
                    }
                },
                new Product
                {
                    Name = "Kẹo que hương dâu – 10 cái",
                    Description = "Kẹo que hương dâu tự nhiên, không đường hóa học, an toàn cho sức khỏe bé yêu.",
                    Price = 18000,
                    StockQuantity = 80,
                    CategoryId = categoryKẹo.Id,
                    IsActive = true,
                    Rating = 4.3,
                    Images = new List<ProductImage>
                    {
                        new() { ImageUrl = "/img/keo-que-dau.jpg", SortOrder = 1 }
                    }
                },
                new Product
                {
                    Name = "Bánh quy bơ Đức – 250g",
                    Description = "Bánh quy bơ giòn tan, hương vị thơm ngon đậm đà. Sản phẩm nhập khẩu chính hãng từ Đức.",
                    Price = 45000,
                    StockQuantity = 60,
                    CategoryId = categoryBánh.Id,
                    IsActive = true,
                    Rating = 4.7,
                    Images = new List<ProductImage>
                    {
                        new() { ImageUrl = "/img/banh-quy-bo.jpg", SortOrder = 1 }
                    }
                },
                new Product
                {
                    Name = "Bánh gấu chocolate – 12 cái/hộp",
                    Description = "Bánh gấu hình dễ thương, lớp chocolate ngọt ngào bên ngoài, phù hợp cho tiệc sinh nhật trẻ em.",
                    Price = 55000,
                    StockQuantity = 45,
                    CategoryId = categoryBánh.Id,
                    IsActive = true,
                    Rating = 4.9,
                    Images = new List<ProductImage>
                    {
                        new() { ImageUrl = "/img/banh-gau-choco.jpg", SortOrder = 1 }
                    }
                },
                new Product
                {
                    Name = "Bánh mì gối nguyên cám – 400g",
                    Description = "Bánh mì làm từ bột nguyên cám, giàu chất xơ, tốt cho hệ tiêu hóa của trẻ.",
                    Price = 32000,
                    StockQuantity = 0,
                    CategoryId = categoryBánh.Id,
                    IsActive = true,
                    Rating = 4.2,
                    Images = new List<ProductImage>
                    {
                        new() { ImageUrl = "/img/banh-mi-nguyen-cam.jpg", SortOrder = 1 }
                    }
                },
                new Product
                {
                    Name = "Sữa hạt sen – 500ml",
                    Description = "Sữa hạt sen thơm ngon, giàu dinh dưỡng, không đường, không chất bảo quản. Thích hợp cho trẻ em.",
                    Price = 38000,
                    StockQuantity = 70,
                    CategoryId = categoryĐồUống.Id,
                    IsActive = true,
                    Rating = 4.6,
                    Images = new List<ProductImage>
                    {
                        new() { ImageUrl = "/img/sua-hat-sen.jpg", SortOrder = 1 }
                    }
                },
                new Product
                {
                    Name = "Nước ép cam nguyên chất – 1L",
                    Description = "Nước ép cam 100% tự nhiên, giàu vitamin C, không đường, không chất bảo quản.",
                    Price = 42000,
                    StockQuantity = 55,
                    CategoryId = categoryĐồUống.Id,
                    IsActive = true,
                    Rating = 4.4,
                    Images = new List<ProductImage>
                    {
                        new() { ImageUrl = "/img/nuoc-ep-cam.jpg", SortOrder = 1 }
                    }
                }
            };

            context.Products.AddRange(products);
            await context.SaveChangesAsync();
        }

        // Seed admin user if no users exist
        if (!await context.Users.AnyAsync() && passwordHasher != null)
        {
            var adminUser = new User
            {
                Email = "admin@tiembanh.com",
                PasswordHash = passwordHasher.HashPassword("admin123"),
                FirstName = "Admin",
                LastName = "User",
                Roles = "Admin",
                CreatedAt = DateTime.UtcNow,
                IsActive = true
            };
            context.Users.Add(adminUser);
            await context.SaveChangesAsync();
        }

        // Seed provinces if empty
        if (!await context.Provinces.AnyAsync())
        {
            var provincesPath = Path.Combine(AppContext.BaseDirectory, "Data", "provinces.json");
            if (File.Exists(provincesPath))
            {
                var json = await File.ReadAllTextAsync(provincesPath);
                var provincesData = JsonSerializer.Deserialize<List<ProvinceJson>>(json, JsonOptions);
                if (provincesData != null)
                {
                    var provinces = provincesData.Select(p => new Province
                    {
                        Id = p.code,  // Use code as PK (matches province_code from JSON)
                        Name = p.name,
                        DivisionType = p.division_type,
                        CodeName = p.codename,
                        PhoneCode = p.phone_code
                    }).ToList();
                    context.Provinces.AddRange(provinces);
                    await context.SaveChangesAsync();
                    Console.WriteLine($"Seeded {provinces.Count} provinces");
                }
            }
        }

        // Seed wards if empty
        if (!await context.Wards.AnyAsync())
        {
            var wardsPath = Path.Combine(AppContext.BaseDirectory, "Data", "wards.json");
            if (File.Exists(wardsPath))
            {
                var json = await File.ReadAllTextAsync(wardsPath);
                var wardsData = JsonSerializer.Deserialize<List<WardJson>>(json, JsonOptions);
                if (wardsData != null)
                {
                    var wards = wardsData.Select(w => new Ward
                    {
                        Name = w.name,
                        Code = w.code,
                        DivisionType = w.division_type,
                        CodeName = w.codename,
                        ProvinceCode = w.province_code
                    }).ToList();
                    context.Wards.AddRange(wards);
                    await context.SaveChangesAsync();
                    Console.WriteLine($"Seeded {wards.Count} wards");
                }
            }
        }
    }

    // JSON DTOs for deserialization (snake_case from JSON)
    private record ProvinceJson(string name, int code, string division_type, string codename, int phone_code);
    private record WardJson(string name, int code, string division_type, string codename, int province_code);
}
