using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using TiemBanhBeYeu.Api.Domain.Entities;
using TiemBanhBeYeu.Api.DTOs;
using TiemBanhBeYeu.Api.DTOs.Orders;
using TiemBanhBeYeu.Api.Infrastructure.Persistence;
using TiemBanhBeYeu.Api.Infrastructure.Services;

namespace TiemBanhBeYeu.Api.Extensions.Endpoints;

public static class PaymentEndpoints
{
    public static void MapPaymentEndpoints(this WebApplication app)
    {
        var payments = app.MapGroup("/api/payments").WithTags("Payments");

        payments.MapPost("/payos/webhook", HandlePayOsWebhook)
            .WithName("HandlePayOsWebhook")
            .Produces<ApiResponse<object>>()
            .ProducesProblem(400);

        app.MapGet("/api/orders/{id:int}/payment-status", GetOrderPaymentStatus)
            .WithTags("Payments")
            .WithName("GetOrderPaymentStatus")
            .Produces<ApiResponse<PaymentStatusDto>>()
            .ProducesProblem(404);
    }

    private static async Task<IResult> HandlePayOsWebhook(
        JsonElement body,
        AppDbContext db,
        IPayOsService payOsService,
        CancellationToken ct)
    {
        if (!payOsService.VerifyWebhookSignature(body))
        {
            return Results.BadRequest(new ApiResponse<object>(
                false,
                null,
                "Webhook payOS không hợp lệ",
                new ApiError("INVALID_WEBHOOK_SIGNATURE", "Không xác thực được chữ ký webhook payOS")
            ));
        }

        if (!body.TryGetProperty("data", out var data))
        {
            return Results.BadRequest(new ApiResponse<object>(
                false,
                null,
                "Webhook payOS thiếu data",
                new ApiError("INVALID_WEBHOOK_PAYLOAD", "Payload webhook không có data")
            ));
        }

        var providerOrderCode = GetLong(data, "orderCode");
        if (providerOrderCode is null)
        {
            return Results.BadRequest(new ApiResponse<object>(
                false,
                null,
                "Webhook payOS thiếu orderCode",
                new ApiError("INVALID_WEBHOOK_PAYLOAD", "Payload webhook không có orderCode")
            ));
        }

        var payment = await db.Payments
            .Include(p => p.Order)
            .ThenInclude(o => o.Items)
            .FirstOrDefaultAsync(p => p.Provider == PaymentProvider.PayOs && p.ProviderOrderCode == providerOrderCode, ct);

        if (payment is null)
        {
            return Results.NotFound(new ApiResponse<object>(
                false,
                null,
                "Không tìm thấy thanh toán tương ứng",
                new ApiError("PAYMENT_NOT_FOUND", "Không tìm thấy payment theo orderCode từ payOS")
            ));
        }

        if (payment.Status == PaymentStatus.Paid)
        {
            return Results.Ok(new ApiResponse<object>(true, new { payment.Id }, "Webhook đã được xử lý trước đó"));
        }

        var amount = GetDecimal(data, "amount");
        if (amount is not null && amount.Value != payment.Amount)
        {
            return Results.BadRequest(new ApiResponse<object>(
                false,
                null,
                "Số tiền webhook không khớp với đơn hàng",
                new ApiError("AMOUNT_MISMATCH", "Số tiền thanh toán payOS không khớp với dữ liệu đơn hàng")
            ));
        }

        var isSuccess = IsSuccessfulWebhook(body, data);
        payment.WebhookPayload = body.GetRawText();
        payment.ProviderPaymentLinkId ??= GetString(data, "paymentLinkId");
        payment.ProviderTransactionReference = GetString(data, "reference") ?? payment.ProviderTransactionReference;
        payment.UpdatedAt = DateTime.UtcNow;

        if (isSuccess)
        {
            payment.Status = PaymentStatus.Paid;
            payment.PaidAt = DateTime.UtcNow;
            payment.Order.PaymentStatus = PaymentStatus.Paid;
            payment.Order.PaidAt = payment.PaidAt;
            payment.Order.Status = OrderStatus.Confirmed;
            payment.Order.UpdatedAt = DateTime.UtcNow;
        }
        else
        {
            payment.Status = PaymentStatus.Failed;
            payment.Order.PaymentStatus = PaymentStatus.Failed;
            payment.Order.UpdatedAt = DateTime.UtcNow;
        }

        await db.SaveChangesAsync(ct);

        return Results.Ok(new ApiResponse<object>(true, new { payment.Id, payment.Status }, "Webhook payOS đã được xử lý"));
    }

    private static async Task<IResult> GetOrderPaymentStatus(
        int id,
        AppDbContext db,
        CancellationToken ct)
    {
        var order = await db.Orders
            .AsNoTracking()
            .Include(o => o.Payments)
            .FirstOrDefaultAsync(o => o.Id == id, ct);

        if (order is null)
        {
            return Results.NotFound(new ApiResponse<PaymentStatusDto>(
                false,
                null,
                "Đơn hàng không tồn tại",
                new ApiError("ORDER_NOT_FOUND", "Đơn hàng không tồn tại")
            ));
        }

        var activePayment = order.Payments
            .OrderByDescending(p => p.CreatedAt)
            .FirstOrDefault(p => p.Id == order.ActivePaymentId);

        var dto = new PaymentStatusDto(
            order.Id,
            order.OrderCode,
            order.TotalAmount,
            order.Status.ToString().ToLower(),
            order.PaymentMethod.ToString().ToLower(),
            order.PaymentStatus.ToString().ToLower(),
            activePayment?.CheckoutUrl,
            order.PaidAt
        );

        return Results.Ok(new ApiResponse<PaymentStatusDto>(true, dto, "Lấy trạng thái thanh toán thành công"));
    }

    private static bool IsSuccessfulWebhook(JsonElement body, JsonElement data)
    {
        var success = GetBool(body, "success");
        var bodyCode = GetString(body, "code");
        var dataCode = GetString(data, "code");
        return success == true || bodyCode == "00" || dataCode == "00";
    }

    private static string? GetString(JsonElement element, string propertyName)
    {
        return element.TryGetProperty(propertyName, out var property) && property.ValueKind != JsonValueKind.Null
            ? property.GetString()
            : null;
    }

    private static bool? GetBool(JsonElement element, string propertyName)
    {
        return element.TryGetProperty(propertyName, out var property) && property.ValueKind is JsonValueKind.True or JsonValueKind.False
            ? property.GetBoolean()
            : null;
    }

    private static long? GetLong(JsonElement element, string propertyName)
    {
        if (!element.TryGetProperty(propertyName, out var property))
        {
            return null;
        }

        if (property.ValueKind == JsonValueKind.Number && property.TryGetInt64(out var number))
        {
            return number;
        }

        return property.ValueKind == JsonValueKind.String && long.TryParse(property.GetString(), out var parsed)
            ? parsed
            : null;
    }

    private static decimal? GetDecimal(JsonElement element, string propertyName)
    {
        if (!element.TryGetProperty(propertyName, out var property))
        {
            return null;
        }

        if (property.ValueKind == JsonValueKind.Number && property.TryGetDecimal(out var number))
        {
            return number;
        }

        return property.ValueKind == JsonValueKind.String && decimal.TryParse(property.GetString(), out var parsed)
            ? parsed
            : null;
    }
}
