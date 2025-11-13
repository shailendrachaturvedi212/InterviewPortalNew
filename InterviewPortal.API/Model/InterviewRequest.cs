using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace InterviewPortal.API.Model
{
    public class InterviewRequest
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public string CandidateName { get; set; }
        public int Experience { get; set; }
        public string Skills { get; set; }
        public string Questions { get; set; }
        public string VideoBlobUrl { get; set; }
        public string AnswerTranscript { get; set; }
        public double AccuracyScore { get; set; }
        public string AI_Feedback { get; set; }
        public string Sentiment { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
