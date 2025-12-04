using Microsoft.AspNetCore.Mvc;
using Microsoft.SemanticKernel;
using InterviewPortal.API.Model;
using InterviewPortal.API.Services;
using System;

namespace InterviewPortal.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class InterviewController : ControllerBase
    {
        private readonly Kernel _kernel;
        public InterviewController(Kernel kernel)
        {
            _kernel = kernel;
        }
        [HttpGet("ping")]
        public IActionResult Ping()
        {
            return Ok("API is working!");
        }
        [HttpPost("questions")]
        public async Task<IActionResult> GetQuestions([FromBody] InterviewSkills request)
        {
            if (string.IsNullOrWhiteSpace(request.Skills))
            {
                return BadRequest("Skills is required.");
            }
            // Build the AI prompt
            var prompt = $"Generate 10 interview questions for {request.Experience} of Experience having skills {request.Skills}. " +
                         $"Only return the questions as a numbered list.";
            var result = await _kernel.InvokePromptAsync<string>(prompt);
            // Split into lines if the model returns multiple questions in one block
            var questions = result?.Split('\n', StringSplitOptions.RemoveEmptyEntries).ToList() ?? new List<string>();

            return Ok(new { questions });  
        }

        [HttpPost("upload")]
        public async Task<IActionResult> UploadInterview([FromForm] IFormFile video, [FromForm] string candidateName, [FromForm] int experience, [FromForm] string skills, [FromForm] string Questions, [FromServices] BlobStorageService blobService, [FromServices] InterviewPortalDBContext db)
        {
            if (video == null || video.Length == 0)
                return BadRequest("Video file is missing.");

            // Upload video to blob
            using var stream = video.OpenReadStream();
            var videoUrl = await blobService.UploadAsync(stream, $"{Guid.NewGuid()}_{video.FileName}");

            // Save session in DB
            var session = new InterviewRequest
            {
                CandidateName = candidateName,
                Experience = experience,
                Skills = skills,
                Questions = Questions,
                VideoBlobUrl = videoUrl
            };

            db.interviewRequest.Add(session);
            await db.SaveChangesAsync();

            return Ok(session);
        }
        public class InterviewSkills
        {
            public int Experience { get; set; }
            public string Skills { get; set; }
          
        }

    }
}
