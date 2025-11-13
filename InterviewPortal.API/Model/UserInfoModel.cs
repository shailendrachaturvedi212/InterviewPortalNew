using System.ComponentModel.DataAnnotations;

public class UserInfoModel
{

    [Display(Name = "Years of Experience")]
    public int experience { get; set; }

    [Display(Name = "Skills (comma separated)")]
    public string Skills { get; set; } = string.Empty;
}
