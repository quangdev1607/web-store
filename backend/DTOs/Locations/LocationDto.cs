namespace TiemBanhBeYeu.Api.DTOs.Locations;

public record ProvinceDto(
    int Id,
    string Name,
    string DivisionType,
    string CodeName,
    int PhoneCode
);

public record WardDto(
    int Id,
    string Name,
    int Code,
    string DivisionType,
    string CodeName,
    int ProvinceCode
);

public record GetWardsByProvinceRequest(int ProvinceCode);