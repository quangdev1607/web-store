using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using TiemBanhBeYeu.Api.Domain.Settings;

namespace TiemBanhBeYeu.Api.Infrastructure.Services;

public interface ICloudinaryService
{
    Task<ImageUploadResult> UploadImageAsync(Stream fileStream, string fileName, string folder);
    Task<DeletionResult> DeleteImageAsync(string publicId);
}

public sealed class CloudinaryService : ICloudinaryService
{
    private readonly Cloudinary _cloudinary;

    public CloudinaryService(CloudinarySettings settings)
    {
        var account = new Account(
            settings.CloudName,
            settings.ApiKey,
            settings.ApiSecret
        );
        _cloudinary = new Cloudinary(account);
    }

    public async Task<ImageUploadResult> UploadImageAsync(Stream fileStream, string fileName, string folder)
    {
        var uploadParams = new ImageUploadParams
        {
            File = new FileDescription(fileName, fileStream),
            Folder = $"tiembanhbeyeu/{folder}",
            Transformation = new Transformation()
                .Quality("auto")
                .FetchFormat("auto")
        };

        return await _cloudinary.UploadAsync(uploadParams);
    }

    public async Task<DeletionResult> DeleteImageAsync(string publicId)
    {
        var deleteParams = new DeletionParams(publicId)
        {
            ResourceType = ResourceType.Image
        };
        return await _cloudinary.DestroyAsync(deleteParams);
    }
}