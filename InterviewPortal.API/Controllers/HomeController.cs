using Microsoft.AspNetCore.Mvc;
using Microsoft.SemanticKernel;
using InterviewPortal.API.Model;
using InterviewPortal.API.Services;
using System;
using Microsoft.AspNetCore.Authorization;
using InterviewPortal.API.Helpers;
using Newtonsoft.Json;
using System.Text;
using Microsoft.CognitiveServices.Speech.Audio;
using Microsoft.CognitiveServices.Speech;
using Xabe.FFmpeg;
using Xabe.FFmpeg.Downloader;


[Authorize]
public class HomeController : Controller
{
    private readonly Kernel _kernel;
    public HomeController(Kernel kernel)
    {
        _kernel = kernel;
    }
    public IActionResult Index()
    {
        // This will render the default home view
        return View();
    }

    [HttpPost]
    public async Task<IActionResult> GetQuestions([FromBody] UserInfoModel model)
    {
            if (string.IsNullOrWhiteSpace(model.Skills))
            {
                return BadRequest("Skills is required.");
            }
            // Build the AI prompt
            var prompt = $"Generate 10 interview questions for {model.experience} of Experience having skills {model.Skills}. " +
                         $"Only return the questions as a numbered list.";
            var result = await _kernel.InvokePromptAsync<string>(prompt);
            // Split into lines if the model returns multiple questions in one block
            var questions = result?.Split('\n', StringSplitOptions.RemoveEmptyEntries).ToList() ?? new List<string>();

        return Json(questions);

    }
    public async Task<IActionResult> UploadInterview([FromForm] IFormFile video, [FromForm] string candidateName, [FromForm] int experience, [FromForm] string skills, [FromForm] string questions, [FromServices] BlobStorageService blobService, [FromServices] InterviewPortalDBContext db)
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
            Questions = questions,
            VideoBlobUrl = videoUrl
        };

        db.interviewRequest.Add(session);
        await db.SaveChangesAsync();

        return Ok(session);
    }
    
    public async Task<IActionResult> AnalyzeAnswer([FromForm] IFormFile video, [FromForm] string candidateName, [FromForm] int experience, [FromForm] string skills, [FromForm] string question, [FromServices] InterviewPortalDBContext db, [FromServices] BlobStorageService blobService)
    {
        if (video == null || video.Length == 0)
            return BadRequest("No video uploaded.");

        //// Step 1: Save the video temporarily
        //var tempVideo = Path.Combine(Path.GetTempPath(), $"{Guid.NewGuid()}.webm");
        //await using (var stream = new FileStream(tempVideo, FileMode.Create))
        //    await video.CopyToAsync(stream);

        // Step 2: Extract audio & transcribe using Azure Speech SDK
        var transcript = await TranscribeSpeechAsync(video);

        // Step 3: Analyze answer accuracy using GPT
        var (score, feedback) = await EvaluateAnswerWithAIAsync(question, transcript);

        // Upload video to blob
        using var stream1 = video.OpenReadStream();
        var videoUrl = await blobService.UploadAsync(stream1, $"{Guid.NewGuid()}_{video.FileName}");

        // Step 4: Store in DB
        var answer = new InterviewRequest
        {
            CandidateName = candidateName,
            Experience = experience,
            Skills = skills,
            VideoBlobUrl = videoUrl,
            Questions = question,
            AnswerTranscript = transcript,
            AccuracyScore = score,
            AI_Feedback = feedback,
            CreatedAt = DateTime.UtcNow
        };

        db.interviewRequest.Add(answer);
        await db.SaveChangesAsync();

        return Json(new { transcript, score, feedback });
    }
    private async Task<(double score, string feedback)> EvaluateAnswerWithAIAsync(string question, string answer)
    {
        string prompt = $@"
You are an expert interviewer evaluating a candidate.
Question: {question}
Candidate's Answer: {answer}

Please:
1. Rate how accurately and completely the answer addresses the question (0–100%).
2. Provide short constructive feedback (2–3 lines).
Respond in JSON format:
{{ ""score"": <number>, ""feedback"": ""<text>"" }}";

        var client = new HttpClient();
        client.DefaultRequestHeaders.Add("Authorization", "Bearer " + "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");

        var body = new
        {
            model = "gpt-4o-mini",
            messages = new[]
            {
            new { role = "user", content = prompt }
        }
        };
       
        var response = await client.PostAsync(
            "https://api.openai.com/v1/chat/completions",
            new StringContent(JsonConvert.SerializeObject(body), Encoding.UTF8, "application/json")
        );

        var json = await response.Content.ReadAsStringAsync();
        dynamic result = JsonConvert.DeserializeObject(json);

        var content = result?.choices[0].message.content.ToString();
        try
        {
            var parsed = JsonConvert.DeserializeObject<dynamic>(content);
            return ((double)parsed.score, (string)parsed.feedback);
        }
        catch
        {
            return (0, "Unable to parse AI feedback");
        }
    }
    private async Task<string> TranscribeSpeechAsync(IFormFile videoFile)
    {
        
        // Temp file paths
        var tempVideoPath = Path.GetTempFileName() + Path.GetExtension(videoFile.FileName);
        var tempAudioPath = Path.ChangeExtension(tempVideoPath, ".wav");

        // Save video temporarily
        using (var fileStream = new FileStream(tempVideoPath, FileMode.Create))
        {
            await videoFile.CopyToAsync(fileStream);
        }

        // Ensure ffmpeg is in the right directory
        var ffmpegPath = Path.Combine(Environment.CurrentDirectory, "ffmpeg");
        FFmpeg.SetExecutablesPath(ffmpegPath);

        // Try using the downloader for safety (Optional)
        await FFmpegDownloader.GetLatestVersion(FFmpegVersion.Official);

        // Call conversion inside a try/catch to inspect the error
        try
        {
            var conversion = await FFmpeg.Conversions.FromSnippet.ExtractAudio(tempVideoPath, tempAudioPath);
            await conversion.Start();
        }
        catch (Exception ex)
        {
            // Log error details for debugging
            Console.WriteLine(ex.Message);
        }

        // Initialize Azure Speech config
        var speechConfig = SpeechConfig.FromSubscription("6KzSH8uqVcC5UWY50PsMVjVMO6kUNkTud2WH3J05zwWniLYpBLAPJQQJ99BKACYeBjFXJ3w3AAAYACOGOFBS", "eastus");
        speechConfig.SpeechRecognitionLanguage = "en-US";

        // Create audio input from .wav
        using var audioInput = AudioConfig.FromWavFileInput(tempAudioPath);
        using var recognizer = new SpeechRecognizer(speechConfig, audioInput);

        // Run recognition
        var result = await recognizer.RecognizeOnceAsync();
        switch (result.Reason)
        {
            case ResultReason.RecognizedSpeech:
                Console.WriteLine($"Recognized: {result.Text}");
                break;
            case ResultReason.Canceled:
                var cancellation = CancellationDetails.FromResult(result);
                Console.WriteLine($"Canceled: Reason={cancellation.Reason}");

                if (cancellation.Reason == CancellationReason.Error)
                {
                    Console.WriteLine($"ErrorCode={cancellation.ErrorCode}");
                    Console.WriteLine($"ErrorDetails={cancellation.ErrorDetails}");
                    Console.WriteLine("Check your subscription key and region.");
                }
                break;
            default:
                Console.WriteLine($"Speech recognition ended with reason: {result.Reason}");
                break;
        }
        // Cleanup temp files
        System.IO.File.Delete(tempVideoPath);
        //.IO.File.Delete(tempAudioPath);

        return result.Text;
    }


}
