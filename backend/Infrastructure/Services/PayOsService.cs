using System.Globalization;
using System.Net.Http.Headers;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Options;
using TiemBanhBeYeu.Api.Domain.Entities;
using TiemBanhBeYeu.Api.Domain.Settings;

namespace TiemBanhBeYeu.Api.Infrastructure.Services;

public interface IPayOsService
{
    bool IsConfigured { get; }
    Task<PayOsPaymentLinkResult> CreatePaymentLinkAsync(Order order, CancellationToken ct);
    bool VerifyWebhookSignature(JsonElement webhookBody);
}

public record PayOsPaymentLinkResult(
    string CheckoutUrl,
    string? PaymentLinkId,
    long ProviderOrderCode,
    DateTime? ExpiredAt
);

public class PayOsService : IPayOsService
{
    private readonly HttpClient _httpClient;
    private readonly PayOsSettings _settings;

    public PayOsService(HttpClient httpClient, IOptions<PayOsSettings> settings)
    {
        _httpClient = httpClient;
        _settings = settings.Value;
    }

    public bool IsConfigured => _settings.IsConfigured;

    public async Task<PayOsPaymentLinkResult> CreatePaymentLinkAsync(Order order, CancellationToken ct)
    {
        if (!IsConfigured)
        {
            throw new InvalidOperationException("payOS chưa được cấu hình. Vui lòng thiết lập PayOs__ClientId, PayOs__ApiKey và PayOs__ChecksumKey.");
        }

        var providerOrderCode = BuildProviderOrderCode(order.Id);
        var amount = decimal.ToInt64(decimal.Round(order.TotalAmount, 0, MidpointRounding.AwayFromZero));
        var description = $"Don hang {order.OrderCode}";
        var expiredAt = DateTimeOffset.UtcNow.AddMinutes(30);
        var returnUrl = AppendOrderId(_settings.ReturnUrl, order.Id);
        var cancelUrl = AppendOrderId(_settings.CancelUrl, order.Id);

        var signatureData = new SortedDictionary<string, string>
        {
            ["amount"] = amount.ToString(CultureInfo.InvariantCulture),
            ["cancelUrl"] = cancelUrl,
            ["description"] = description,
            ["orderCode"] = providerOrderCode.ToString(CultureInfo.InvariantCulture),
            ["returnUrl"] = returnUrl
        };

        var payload = new
        {
            orderCode = providerOrderCode,
            amount,
            description,
            returnUrl,
            cancelUrl,
            expiredAt = expiredAt.ToUnixTimeSeconds(),
            signature = CreateSignature(signatureData)
        };

        using var request = new HttpRequestMessage(HttpMethod.Post, "/v2/payment-requests")
        {
            Content = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json")
        };

        request.Headers.Add("x-client-id", _settings.ClientId);
        request.Headers.Add("x-api-key", _settings.ApiKey);
        request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

        using var response = await _httpClient.SendAsync(request, ct);
        var responseText = await response.Content.ReadAsStringAsync(ct);

        if (!response.IsSuccessStatusCode)
        {
            throw new InvalidOperationException($"Không tạo được link thanh toán payOS. Status: {(int)response.StatusCode}. Body: {responseText}");
        }

        using var document = JsonDocument.Parse(responseText);
        var root = document.RootElement;

        if (!root.TryGetProperty("data", out var data))
        {
            throw new InvalidOperationException("payOS không trả về dữ liệu thanh toán hợp lệ.");
        }

        var checkoutUrl = GetString(data, "checkoutUrl")
            ?? throw new InvalidOperationException("payOS không trả về checkoutUrl.");

        return new PayOsPaymentLinkResult(
            checkoutUrl,
            GetString(data, "paymentLinkId"),
            providerOrderCode,
            expiredAt.UtcDateTime
        );
    }

    public bool VerifyWebhookSignature(JsonElement webhookBody)
    {
        if (!IsConfigured)
        {
            return false;
        }

        var signature = GetString(webhookBody, "signature");
        if (string.IsNullOrWhiteSpace(signature) || !webhookBody.TryGetProperty("data", out var data))
        {
            return false;
        }

        var signatureData = FlattenObject(data);
        var expectedSignature = CreateSignature(signatureData);
        return FixedTimeEquals(signature, expectedSignature);
    }

    private long BuildProviderOrderCode(int orderId)
    {
        var timestamp = DateTimeOffset.UtcNow.ToUnixTimeSeconds() % 1_000_000;
        return timestamp * 10_000 + orderId;
    }

    private string CreateSignature(IReadOnlyDictionary<string, string> data)
    {
        var rawData = string.Join("&", data.OrderBy(kvp => kvp.Key).Select(kvp => $"{kvp.Key}={kvp.Value}"));
        using var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(_settings.ChecksumKey));
        var hash = hmac.ComputeHash(Encoding.UTF8.GetBytes(rawData));
        return Convert.ToHexString(hash).ToLowerInvariant();
    }

    private static SortedDictionary<string, string> FlattenObject(JsonElement element)
    {
        var values = new SortedDictionary<string, string>();

        foreach (var property in element.EnumerateObject())
        {
            if (property.NameEquals("signature"))
            {
                continue;
            }

            values[property.Name] = property.Value.ValueKind switch
            {
                JsonValueKind.String => property.Value.GetString() ?? string.Empty,
                JsonValueKind.Number => property.Value.GetRawText(),
                JsonValueKind.True => "true",
                JsonValueKind.False => "false",
                JsonValueKind.Null => string.Empty,
                _ => property.Value.GetRawText()
            };
        }

        return values;
    }

    private static string? GetString(JsonElement element, string propertyName)
    {
        return element.TryGetProperty(propertyName, out var property) && property.ValueKind != JsonValueKind.Null
            ? property.GetString()
            : null;
    }

    private static bool FixedTimeEquals(string left, string right)
    {
        var leftBytes = Encoding.UTF8.GetBytes(left);
        var rightBytes = Encoding.UTF8.GetBytes(right);
        return leftBytes.Length == rightBytes.Length && CryptographicOperations.FixedTimeEquals(leftBytes, rightBytes);
    }

    private static string AppendOrderId(string url, int orderId)
    {
        var separator = url.Contains('?') ? "&" : "?";
        return $"{url}{separator}orderId={orderId}";
    }
}
