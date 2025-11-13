using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace InterviewPortal.API.Migrations
{
    /// <inheritdoc />
    public partial class addednewcolumn : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AI_Feedback",
                table: "interviewRequest",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<double>(
                name: "AccuracyScore",
                table: "interviewRequest",
                type: "float",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<string>(
                name: "AnswerTranscript",
                table: "interviewRequest",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Sentiment",
                table: "interviewRequest",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AI_Feedback",
                table: "interviewRequest");

            migrationBuilder.DropColumn(
                name: "AccuracyScore",
                table: "interviewRequest");

            migrationBuilder.DropColumn(
                name: "AnswerTranscript",
                table: "interviewRequest");

            migrationBuilder.DropColumn(
                name: "Sentiment",
                table: "interviewRequest");
        }
    }
}
