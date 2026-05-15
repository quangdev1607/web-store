namespace TiemBanhBeYeu.Api.Domain.Entities;

public class Payment
{
    public int Id { get; set; }
    public int OrderId { get; set; }
    public Order Order { get; set; } = null!;

    public PaymentProvider Provider { get; set; } = PaymentProvider.PayOs;
    public PaymentMethod Method { get; set; } = PaymentMethod.PayOs;
    public PaymentStatus Status { get; set; } = PaymentStatus.Pending;

    public long? ProviderOrderCode { get; set; }
    public string? ProviderPaymentLinkId { get; set; }
    public string? ProviderTransactionReference { get; set; }
    public string? CheckoutUrl { get; set; }
    public string? WebhookPayload { get; set; }

    public decimal Amount { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? PaidAt { get; set; }
    public DateTime? ExpiredAt { get; set; }
}
