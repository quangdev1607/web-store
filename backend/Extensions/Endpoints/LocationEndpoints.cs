using Microsoft.EntityFrameworkCore;
using TiemBanhBeYeu.Api.DTOs.Locations;
using TiemBanhBeYeu.Api.Infrastructure.Persistence;

namespace TiemBanhBeYeu.Api.Extensions.Endpoints;

public static class LocationEndpoints
{
    public static void MapLocationEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/locations");
        
        group.MapGet("/provinces", GetProvinces);
        group.MapGet("/provinces/{provinceCode}/wards", GetWardsByProvince);
        group.MapGet("/wards/{wardCode}", GetWardByCode);
    }
    
    private static async Task<IResult> GetProvinces(AppDbContext db, CancellationToken ct)
    {
        var provinces = await db.Provinces
            .AsNoTracking()
            .OrderBy(p => p.Name)
            .Select(p => new ProvinceDto(
                p.Id,
                p.Name,
                p.DivisionType,
                p.CodeName,
                p.PhoneCode
            ))
            .ToListAsync(ct);
        
        return Results.Ok(provinces);
    }
    
    private static async Task<IResult> GetWardsByProvince(int provinceCode, AppDbContext db, CancellationToken ct)
    {
        var wards = await db.Wards
            .AsNoTracking()
            .Where(w => w.ProvinceCode == provinceCode)
            .OrderBy(w => w.Name)
            .Select(w => new WardDto(
                w.Id,
                w.Name,
                w.Code,
                w.DivisionType,
                w.CodeName,
                w.ProvinceCode
            ))
            .ToListAsync(ct);
        
        return Results.Ok(wards);
    }
    
    private static async Task<IResult> GetWardByCode(int wardCode, AppDbContext db, CancellationToken ct)
    {
        var ward = await db.Wards
            .AsNoTracking()
            .Where(w => w.Code == wardCode)
            .Select(w => new WardDto(
                w.Id,
                w.Name,
                w.Code,
                w.DivisionType,
                w.CodeName,
                w.ProvinceCode
            ))
            .FirstOrDefaultAsync(ct);
        
        return ward is null ? Results.NotFound() : Results.Ok(ward);
    }
}