using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TiemBanhBeYeu.Api.Domain.Entities;

namespace TiemBanhBeYeu.Api.Infrastructure.Persistence.Configurations;

public class CategoryConfiguration : IEntityTypeConfiguration<Category>
{
    public void Configure(EntityTypeBuilder<Category> builder)
    {
        builder.ToTable("Categories");
        builder.HasKey(c => c.Id);
        builder.Property(c => c.Name).IsRequired().HasMaxLength(100);
        builder.Property(c => c.Slug).IsRequired().HasMaxLength(100);
        builder.Property(c => c.Description).HasMaxLength(500);
        builder.Property(c => c.ImageUrl).HasMaxLength(500);
        
        builder.HasIndex(c => c.Slug).IsUnique();
        builder.HasIndex(c => c.IsActive);
        builder.HasIndex(c => c.DeletedAt);
    }
}

public class ProductConfiguration : IEntityTypeConfiguration<Product>
{
    public void Configure(EntityTypeBuilder<Product> builder)
    {
        builder.ToTable("Products");
        builder.HasKey(p => p.Id);
        builder.Property(p => p.Name).IsRequired().HasMaxLength(200);
        builder.Property(p => p.Description).HasMaxLength(2000);
        builder.Property(p => p.Price).HasPrecision(18, 2);
        
        builder.HasOne(p => p.Category)
            .WithMany(c => c.Products)
            .HasForeignKey(p => p.CategoryId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(p => p.Name);
        builder.HasIndex(p => p.CategoryId);
        builder.HasIndex(p => p.IsActive);
        builder.HasIndex(p => p.IsDeleted);
        builder.HasIndex(p => p.DeletedAt);
        builder.Ignore(p => p.InStock);
    }
}

public class ProductImageConfiguration : IEntityTypeConfiguration<ProductImage>
{
    public void Configure(EntityTypeBuilder<ProductImage> builder)
    {
        builder.ToTable("ProductImages");
        builder.HasKey(pi => pi.Id);
        builder.Property(pi => pi.ImageUrl).IsRequired().HasMaxLength(500);

        builder.HasOne(pi => pi.Product)
            .WithMany(p => p.Images)
            .HasForeignKey(pi => pi.ProductId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(pi => pi.ProductId);
    }
}

public class OrderConfiguration : IEntityTypeConfiguration<Order>
{
    public void Configure(EntityTypeBuilder<Order> builder)
    {
        builder.ToTable("Orders");
        builder.HasKey(o => o.Id);
        builder.Property(o => o.OrderCode).IsRequired().HasMaxLength(50);
        builder.Property(o => o.CustomerName).IsRequired().HasMaxLength(100);
        builder.Property(o => o.CustomerPhone).IsRequired().HasMaxLength(20);
        builder.Property(o => o.CustomerEmail).IsRequired().HasMaxLength(100);
        
        // Address fields
        builder.Property(o => o.Province).IsRequired().HasMaxLength(100);
        builder.Property(o => o.Ward).IsRequired().HasMaxLength(100);
        builder.Property(o => o.Address).IsRequired().HasMaxLength(500);
        
        builder.Property(o => o.TotalAmount).HasPrecision(18, 2);
        builder.Property(o => o.Status).HasConversion<string>().HasMaxLength(20);

        builder.HasIndex(o => o.OrderCode).IsUnique();
        builder.HasIndex(o => o.CustomerEmail);
        builder.HasIndex(o => o.Status);
        builder.HasIndex(o => o.UserId);
    }
}

public class OrderItemConfiguration : IEntityTypeConfiguration<OrderItem>
{
    public void Configure(EntityTypeBuilder<OrderItem> builder)
    {
        builder.ToTable("OrderItems");
        builder.HasKey(oi => oi.Id);
        builder.Property(oi => oi.ProductName).IsRequired().HasMaxLength(200);
        builder.Property(oi => oi.ProductPrice).HasPrecision(18, 2);

        builder.HasOne(oi => oi.Order)
            .WithMany(o => o.Items)
            .HasForeignKey(oi => oi.OrderId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(oi => oi.Product)
            .WithMany()
            .HasForeignKey(oi => oi.ProductId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(oi => oi.OrderId);
    }
}

public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.ToTable("Users");
        builder.HasKey(u => u.Id);
        builder.Property(u => u.Email).IsRequired().HasMaxLength(100);
        builder.Property(u => u.PasswordHash).IsRequired().HasMaxLength(256);
        builder.Property(u => u.FirstName).IsRequired().HasMaxLength(50);
        builder.Property(u => u.LastName).IsRequired().HasMaxLength(50);
        builder.Property(u => u.Phone).HasMaxLength(20);
        builder.Property(u => u.Address).HasMaxLength(500);
        builder.Property(u => u.Province).HasMaxLength(100);
        builder.Property(u => u.ProvinceName).HasMaxLength(200);
        builder.Property(u => u.Ward).HasMaxLength(100);
        builder.Property(u => u.WardName).HasMaxLength(200);
        builder.Property(u => u.Roles).HasMaxLength(100);

        builder.HasIndex(u => u.Email).IsUnique();
        builder.HasIndex(u => u.IsActive);
    }
}

public class CartConfiguration : IEntityTypeConfiguration<Cart>
{
    public void Configure(EntityTypeBuilder<Cart> builder)
    {
        builder.ToTable("Carts");
        builder.HasKey(c => c.Id);
        
        builder.HasOne(c => c.User)
            .WithMany()
            .HasForeignKey(c => c.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(c => c.UserId).IsUnique();
    }
}

public class CartItemConfiguration : IEntityTypeConfiguration<CartItem>
{
    public void Configure(EntityTypeBuilder<CartItem> builder)
    {
        builder.ToTable("CartItems");
        builder.HasKey(ci => ci.Id);
        builder.Property(ci => ci.Quantity).IsRequired();

        builder.HasOne(ci => ci.Cart)
            .WithMany(c => c.Items)
            .HasForeignKey(ci => ci.CartId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(ci => ci.Product)
            .WithMany()
            .HasForeignKey(ci => ci.ProductId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(ci => ci.CartId);
        builder.HasIndex(ci => new { ci.CartId, ci.ProductId }).IsUnique();
    }
}

public class ProvinceConfiguration : IEntityTypeConfiguration<Province>
{
    public void Configure(EntityTypeBuilder<Province> builder)
    {
        builder.ToTable("Provinces");
        builder.HasKey(p => p.Id);
        
        // Use value generated never so we can assign Id = Code from JSON
        builder.Property(p => p.Id).ValueGeneratedNever();
        
        builder.Property(p => p.Name).IsRequired().HasMaxLength(100);
        builder.Property(p => p.DivisionType).IsRequired().HasMaxLength(50);
        builder.Property(p => p.CodeName).IsRequired().HasMaxLength(100);
        builder.Property(p => p.PhoneCode).IsRequired();
    }
}

public class WardConfiguration : IEntityTypeConfiguration<Ward>
{
    public void Configure(EntityTypeBuilder<Ward> builder)
    {
        builder.ToTable("Wards");
        builder.HasKey(w => w.Id);
        
        // ProvinceCode references Province.Id (which equals province_code from JSON)
        builder.HasOne(w => w.Province)
            .WithMany(p => p.Wards)
            .HasForeignKey(w => w.ProvinceCode)
            .OnDelete(DeleteBehavior.Restrict);
        
        builder.Property(w => w.Name).IsRequired().HasMaxLength(100);
        builder.Property(w => w.Code).IsRequired();
        builder.Property(w => w.DivisionType).IsRequired().HasMaxLength(50);
        builder.Property(w => w.CodeName).IsRequired().HasMaxLength(100);
        builder.Property(w => w.ProvinceCode).IsRequired();

        builder.HasIndex(w => w.Code).IsUnique();
        builder.HasIndex(w => w.ProvinceCode);
    }
}
