using InterviewPortal.API.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.CognitiveServices.Speech.Transcription;
using Microsoft.EntityFrameworkCore;

namespace InterviewPortal.API.Controllers
{
    [Authorize(Roles = "Admin")]
    public class AdminDashboardController : Controller
    {

        private readonly InterviewPortalDBContext _context;

        public AdminDashboardController(InterviewPortalDBContext context)
        {
            _context = context;
        }

        public async Task<IActionResult> Dashboard()
        {
            //var users = await _context.interviewRequest.ToListAsync();
            //return View(users);

            var users = new List<InterviewRequest>
{
    new InterviewRequest
    {
        CandidateName = "John Doe",
        Skills = "C#, SQL, ASP.NET",
        Experience = 5,
        Questions = "What is OOP?",
        VideoBlobUrl = "https://example.com/video1.mp4",
        AccuracyScore = 86, // For star rendering
        AI_Feedback = "Excellent",
        CreatedAt = DateTime.Now.AddDays(-2)
    },
    new InterviewRequest
    {
        CandidateName = "Alice Smith",
        Skills = "Java, Spring Boot",
        Experience = 3,
        Questions = "Explain Spring Beans",
        VideoBlobUrl = "",
        AccuracyScore = 72,
        AI_Feedback = "Good",
        CreatedAt = DateTime.Now.AddDays(-5)
    },
    new InterviewRequest
    {
        CandidateName = "Bob Johnson",
        Skills = "Python, Django",
        Experience = 7,
        Questions = "What is Django ORM?",
        VideoBlobUrl = "https://example.com/video2.mp4",
        AccuracyScore = 50,
        AI_Feedback = "Average",
        CreatedAt = DateTime.Now.AddDays(-1)
    },
    new InterviewRequest
    {
        CandidateName = "Carol Lee",
        Skills = "JavaScript, React",
        Experience = 2,
        Questions = "Explain React Hooks",
        VideoBlobUrl = "",
        AccuracyScore = 28,
        AI_Feedback = "Below Average",
        CreatedAt = DateTime.Now.AddDays(-3)
    }
};
            return View(users);
        }

    }
}
