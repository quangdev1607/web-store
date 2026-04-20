namespace TiemBanhBeYeu.Api.Domain.Entities;

public class Ward
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public int Code { get; set; }
    public string DivisionType { get; set; } = string.Empty;
    public string CodeName { get; set; } = string.Empty;
    public int ProvinceCode { get; set; }  // FK reference to Province.Code
    public Province Province { get; set; } = null!;
}