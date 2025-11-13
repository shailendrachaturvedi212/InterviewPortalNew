using Azure.Storage.Blobs;

namespace InterviewPortal.API.Services
{
    public class BlobStorageService
    {
        private readonly string _connectionString;
        private readonly string _containerName;

        public BlobStorageService(IConfiguration config)
        {
            _connectionString = config["AzureBlob:ConnectionString"];
            _containerName = config["AzureBlob:ContainerName"];
        }

        public async Task<string> UploadAsync(Stream fileStream, string fileName)
        {
            var blobClient = new BlobContainerClient(_connectionString, _containerName);
            await blobClient.CreateIfNotExistsAsync();

            var blob = blobClient.GetBlobClient(fileName);
            await blob.UploadAsync(fileStream, overwrite: true);

            return blob.Uri.ToString(); // return URL to save in DB
        }
    }
}
