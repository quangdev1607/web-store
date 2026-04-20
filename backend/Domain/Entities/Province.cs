namespace TiemBanhBeYeu.Api.Domain.Entities;

public class Province
{
    // Id = Code (province_code from JSON), not auto-increment
    // This allows Ward.ProvinceCode to reference Province.Id directly
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string DivisionType { get; set; } = string.Empty;
    public string CodeName { get; set; } = string.Empty;
    public int PhoneCode { get; set; }
    public ICollection<Ward> Wards { get; set; } = new List<Ward>();
}