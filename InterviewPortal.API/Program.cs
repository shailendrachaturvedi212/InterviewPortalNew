using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.SemanticKernel;
using InterviewPortal.API.Model;
using Azure.Storage.Blobs;
using InterviewPortal.API.Services;
using Microsoft.AspNetCore.Identity;
using System.Text.Json.Serialization;
using InterviewPortal.API.Data;

var builder = WebApplication.CreateBuilder(args);

//  Register services BEFORE builder.Build()
builder.Services.AddControllersWithViews();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddRazorPages();
builder.Services.AddScoped<BlobStorageService>();
builder.Services.AddKernel().AddOpenAIChatCompletion("gpt-4o-mini", builder.Configuration["OpenAIKey"]);
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular",
        policy => policy.WithOrigins("http://localhost:4200")
                        .AllowAnyMethod()
                        .AllowAnyHeader());
});
builder.Services.AddControllersWithViews()
    .AddJsonOptions(options =>
    {
options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
});
builder.Services.AddDbContext<InterviewPortalDBContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddIdentity<IdentityUser, IdentityRole>(options =>
{
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequireUppercase = false;
    options.Password.RequiredLength = 6;
    options.SignIn.RequireConfirmedAccount = true;
})
.AddEntityFrameworkStores<InterviewPortalDBContext>()
.AddDefaultTokenProviders()
.AddDefaultUI(); 

var blobServiceClient = new BlobServiceClient(builder.Configuration["AzureBlob:ConnectionString"]);
var containerClient = blobServiceClient.GetBlobContainerClient(builder.Configuration["AzureBlob:ContainerName"]);

var app = builder.Build();
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    await RoleInitializer.SeedRolesAndAdminAsync(services);
}
//  Middleware comes after builder.Build()
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("AllowAngular"); //  Apply CORS policy

app.UseStaticFiles();
//app.UseSession();
app.UseAuthentication();
app.UseAuthorization();
//app.MapControllerRoute(
//    name: "default",
//    pattern: "{controller=Home}/{action=Index}/{id?}"
//);
app.MapControllers();
app.MapDefaultControllerRoute();
app.MapRazorPages();
app.Run();
