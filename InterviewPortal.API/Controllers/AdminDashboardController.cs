using InterviewPortal.API.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
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
            var users = await _context.interviewRequest.ToListAsync();
            return View(users);
        }
    }
}
