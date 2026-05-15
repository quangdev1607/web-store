namespace TiemBanhBeYeu.Api.Domain.Settings;

public class PayOsSettings
{
    public string ClientId { get; set; } = string.Empty;
    public string ApiKey { get; set; } = string.Empty;
    public string ChecksumKey { get; set; } = string.Empty;
    public string BaseUrl { get; set; } = "https://api-merchant.payos.vn";
    public string ReturnUrl { get; set; } = "http://localhost:5173/payment/result";
    public string CancelUrl { get; set; } = "http://localhost:5173/payment/result?cancelled=true";

    public bool IsConfigured =>
        !string.IsNullOrWhiteSpace(ClientId) &&
        !string.IsNullOrWhiteSpace(ApiKey) &&
        !string.IsNullOrWhiteSpace(ChecksumKey);
}
