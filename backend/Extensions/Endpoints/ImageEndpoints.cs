using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using TiemBanhBeYeu.Api.Infrastructure.Services;

namespace TiemBanhBeYeu.Api.Extensions.Endpoints;

public static class ImageEndpoints
{
    public static void MapImageEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/images");

        group.MapPost("/upload", UploadImage)
            .WithName("UploadImage")
            .Produces(200)
            .ProducesProblem(400)
            .ProducesProblem(502)
            .ProducesProblem(401)
            .AllowAnonymous();

        group.MapDelete("/{publicId}", DeleteImage)
            .WithName("DeleteImage")
            .Produces(200)
            .ProducesProblem(400)
            .ProducesProblem(401)
            .AllowAnonymous();
    }

    private static async Task<IResult> UploadImage(
        HttpContext context,
        ICloudinaryService cloudinaryService,
        ILoggerFactory loggerFactory,
        CancellationToken ct)
    {
        var logger = loggerFactory.CreateLogger(nameof(ImageEndpoints));

        try
        {
            if (!context.Request.HasFormContentType)
            {
                return Results.BadRequest(new
                {
                    error = $"Invalid upload content type: {context.Request.ContentType ?? "none"}"
                });
            }

            var form = await context.Request.ReadFormAsync(ct);
            var file = form.Files.FirstOrDefault();

            if (file == null || file.Length == 0)
            {
                return Results.BadRequest(new { error = "No file provided" });
            }

            var allowedTypes = new[] { "image/jpeg", "image/png", "image/gif", "image/webp" };
            if (!allowedTypes.Contains(file.ContentType.ToLowerInvariant()))
            {
                return Results.BadRequest(new { error = "Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed." });
            }

            if (file.Length > 10 * 1024 * 1024)
            {
                return Results.BadRequest(new { error = "File size exceeds 10MB limit" });
            }

            var folder = context.Request.Query["folder"].ToString();
            var targetFolder = string.IsNullOrEmpty(folder) ? "products" : folder;

            using var stream = file.OpenReadStream();
            var result = await cloudinaryService.UploadImageAsync(stream, file.FileName, targetFolder);

            if (result.Error != null)
            {
                return Results.BadRequest(new { error = result.Error.Message });
            }

            var imageUrl = result.SecureUrl?.ToString() ?? result.Url?.ToString();

            if (string.IsNullOrWhiteSpace(imageUrl))
            {
                logger.LogError("Cloudinary upload succeeded without an image URL for file {FileName}", file.FileName);
                return Results.Json(
                    new { error = "Cloudinary did not return an image URL." },
                    statusCode: StatusCodes.Status502BadGateway);
            }

            return Results.Ok(new
            {
                publicId = result.PublicId,
                url = imageUrl,
                format = result.Format,
                width = result.Width,
                height = result.Height
            });
        }
        catch (BadHttpRequestException ex)
        {
            logger.LogWarning(ex, "Invalid image upload request");
            return Results.BadRequest(new { error = ex.Message });
        }
        catch (InvalidDataException ex)
        {
            logger.LogWarning(ex, "Invalid multipart image upload request");
            return Results.BadRequest(new { error = "Invalid image upload request" });
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Failed to upload image to Cloudinary");
            return Results.Json(
                new { error = $"Không thể upload ảnh lên Cloudinary: {ex.Message}" },
                statusCode: StatusCodes.Status502BadGateway);
        }
    }

    private static async Task<IResult> DeleteImage(
        string publicId,
        ICloudinaryService cloudinaryService,
        CancellationToken ct)
    {
        var result = await cloudinaryService.DeleteImageAsync(publicId);

        if (result.Error != null)
        {
            return Results.BadRequest(new { error = result.Error.Message });
        }

        return Results.Ok(new { success = result.Result == "ok" });
    }
}
