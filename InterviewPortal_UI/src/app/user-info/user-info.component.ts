import { Component } from '@angular/core';
import { UserInfoServiceService } from '../user-info-service.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-user-info',
  standalone: true,
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule],
  providers: [UserInfoServiceService],
  templateUrl: './user-info.component.html',
  styleUrl: './user-info.component.css'
})
export class UserInfoComponent {
  message: string = '';
  questions: string[] = [];
  interviewForm: FormGroup;
  cameraWindow: Window | null = null;

  constructor(private fb: FormBuilder, private http: HttpClient, private userinfoservice: UserInfoServiceService, @Inject(PLATFORM_ID) private platformId: Object) {
    this.interviewForm = this.fb.group({
      yearsOfExperience: ['', Validators.required],
      skills: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.interviewForm.valid) {
      const skills = this.interviewForm.value.skills;
      const experience = this.interviewForm.value.yearsOfExperience;

      this.userinfoservice.getQuestions(skills, experience).subscribe({
        next: (res: any) => {
          this.questions = res.questions; // Map API response to your local questions array
          this.startCameraWithQuestions(this.questions);
        },
        error: (err) => console.error(err)
      });
    }
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      // Safe to use window here
      window.addEventListener('message', this.handlePopupMessage.bind(this));
    }
  }

  handlePopupMessage(event: MessageEvent) {
    if (event.data && event.data.type === 'InterviewRecorded') {
      const formData = new FormData();
      formData.append('CandidateName', "TestUser");
      formData.append('video', event.data.video, 'interview.mp4');
      formData.append('experience', this.interviewForm.value.yearsOfExperience);
      formData.append('skills', this.interviewForm.value.skills);
      formData.append('Questions', JSON.stringify(this.questions));
      this.userinfoservice.uploadDetails(formData).subscribe(res => {
        console.log('Interview uploaded:', res);
        if (this.cameraWindow && !this.cameraWindow.closed) {
          this.stopCamera();
        }
      });
    }
  }

  checkApi() {
    this.userinfoservice.ping().subscribe({
      next: (res) => this.message = res,
      error: (err) => this.message = 'API call failed: ' + err.message
    });
  }
 
  startCameraWithQuestions(questions: string[]) {
    const popup = window.open('', 'cameraWindow', 'width=900,height=600,resizable=yes');
    if (!popup) {
      alert('Popup blocked. Please allow popups and try again.');
      return;
    }
    const experience = this.interviewForm.value.yearsOfExperience;
    const skills = this.interviewForm.value.skills;

    const htmlContent = `
  <html>
  <head>
    <title>Interview Camera & Questions</title>
    <style>
      body {
        margin: 0;
        display: flex;
        height: 100vh;
        font-family: Arial, sans-serif;
        overflow: hidden;
      }
      #cameraContainer {
        flex: 0 0 300px;
        height: 100vh;
        background: black;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 10px;
      }
      video {
        width: 280px;
        height: 280px;
        object-fit: cover;
        border-radius: 10px;
        background: black;
      }
      #questionContainer {
        flex: 1;
        padding: 20px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        overflow-y: auto;
      }
      #timer {
        font-size: 24px;
        margin-bottom: 12px;
        font-weight: bold;
        color: #007bff;
      }
      #questionText {
        font-size: 1.3rem;
        border: 1px solid #ccc;
        border-radius: 8px;
        padding: 20px;
        min-height: 120px;
        margin-bottom: 20px;
      }
      #navButtons {
        display: flex;
        gap: 10px;
        margin-bottom: 20px;
      }
      button {
        padding: 10px 20px;
        font-size: 1rem;
        border-radius: 6px;
        border: none;
        cursor: pointer;
        background-color: #007bff;
        color: white;
      }
      button:disabled {
        background-color: #aaa;
        cursor: not-allowed;
      }
    </style>
  </head>
  <body>
    <div id="cameraContainer">
      <video autoplay muted playsinline id="video"></video>
      <button id="stopRecordingBtn">Stop Recording</button>
    </div>
    
    <div id="questionContainer">
      <div id="timer">01:00</div>
      <div id="questionText">Loading questions...</div>
      <div id="navButtons">
        <button id="nextBtn" disabled>Next</button>
      </div>
    </div>

    <script>
      const questions = [];
      let currentIndex = 0;
      let countdown = 60;
      let intervalId;

      const timerElem = document.getElementById('timer');
      const questionTextElem = document.getElementById('questionText');
      const nextBtn = document.getElementById('nextBtn');
      const videoElem = document.getElementById('video');
      const stopBtn = document.getElementById('stopRecordingBtn');

      let mediaRecorder = null;
      let recordedChunks = [];
      let stream = null;

      function showQuestion(index) {
        questionTextElem.textContent = questions[index];
        nextBtn.disabled = index === questions.length - 1;
        resetTimer();
      }

      function resetTimer() {
        countdown = 60;
        updateTimerDisplay();
        if (intervalId) clearInterval(intervalId);
        intervalId = setInterval(() => {
          countdown--;
          if (countdown <= 0) {
            clearInterval(intervalId);
            if(currentIndex < questions.length - 1) {
              currentIndex++;
              showQuestion(currentIndex);
            }
          }
          updateTimerDisplay();
        }, 1000);
      }

      function updateTimerDisplay() {
        const minutes = Math.floor(countdown / 60);
        const seconds = countdown % 60;
        timerElem.textContent = \`\${minutes.toString().padStart(2, '0')}:\${seconds.toString().padStart(2, '0')}\`;
      }

      nextBtn.onclick = () => {
        if (currentIndex < questions.length - 1) {
          currentIndex++;
          showQuestion(currentIndex);
        }
      };

      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(s => {
          stream = s;
          videoElem.srcObject = stream;

          recordedChunks = [];
          mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm; codecs=vp9' });

          mediaRecorder.ondataavailable = event => {
            if (event.data.size > 0) recordedChunks.push(event.data);
          };

    mediaRecorder.onstop = () => {
  const blob = new Blob(recordedChunks, { type: 'video/webm' });
  // Instead of uploading directly from here, send data to the opener (Angular)
  window.opener.postMessage({
    type: 'InterviewRecorded',
    video: blob,
    experience: window.candidateExperience,
    skills: window.candidateSkills
  }, '*');
};

          mediaRecorder.start();
          console.log('Recording started automatically');
        })
        .catch(err => {
          alert('Error accessing camera: ' + err);
        });

      stopBtn.onclick = () => {
        if (mediaRecorder && mediaRecorder.state === 'recording') {
          mediaRecorder.stop();
          console.log('Recording stopped by user');
          stopBtn.disabled = true;
          window.close();
        }
      };

      function saveBlob(blob, fileName) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }

      window.loadQuestions = function(newQuestions) {
        questions.length = 0;
        Array.prototype.push.apply(questions, newQuestions);
        if (questions.length > 0) {
          currentIndex = 0;
          showQuestion(currentIndex);
        } else {
          questionTextElem.textContent = 'No questions available.';
          nextBtn.disabled = true;
        }
      };
    </script>
  </body>
  </html>
  `;

    popup.document.write(htmlContent);
    popup.document.close();

    popup.onload = () => {
      popup.loadQuestions(questions);
    };
  }



  stopCamera() {
    if (this.cameraWindow && !this.cameraWindow.closed) {
      this.cameraWindow.close();
      this.cameraWindow = null;
    }
  }
}
