using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace InterviewPortal.API.Model
{
    public class InterviewPortalDBContext : IdentityDbContext
    {
        public InterviewPortalDBContext(DbContextOptions<InterviewPortalDBContext> options) : base(options) { }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<InterviewRequest>()
                .HasKey(ir => ir.Id);

            modelBuilder.Entity<InterviewRequest>()
                .Property(ir => ir.Id)
                .ValueGeneratedOnAdd();  // This makes it auto-increment
        }
        public DbSet<InterviewRequest> interviewRequest { get; set; }
    }
}
