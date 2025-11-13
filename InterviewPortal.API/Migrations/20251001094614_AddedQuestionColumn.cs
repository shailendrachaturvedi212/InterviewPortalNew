using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace InterviewPortal.API.Migrations
{
    /// <inheritdoc />
    public partial class AddedQuestionColumn : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Questions",
                table: "interviewRequest",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Questions",
                table: "interviewRequest");
        }
    }
}
