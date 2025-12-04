//// interviewPopup.js
//window.openInterviewPopup = function (questions, skills, experience) {

//    const popup = window.open('', 'cameraWindow', 'width=900,height=600,resizable=yes');
//    if (!popup) {
//        alert('Popup blocked. Please allow popups.');
//        return;
//    }
//    popup.candidateSkills = skills;
//    popup.candidateExperience = experience;
//    const htmlContent = `
//    <!DOCTYPE html>
//    <html>
//    <head>
//        <title>Interview Camera & Questions</title>
//        <style>
//            body {
//                margin: 0;
//                display: flex;
//                height: 100vh;
//                font-family: Arial, sans-serif;
//                overflow: hidden;
//            }
//            #cameraContainer {
//                flex: 0 0 300px;
//                height: 100vh;
//                background: black;
//                display: flex;
//                flex-direction: column;
//                justify-content: center;
//                align-items: center;
//                padding: 10px;
//            }
//            video {
//                width: 280px;
//                height: 280px;
//                object-fit: cover;
//                border-radius: 10px;
//                background: black;
//            }
//            #questionContainer {
//                flex: 1;
//                padding: 20px;
//                display: flex;
//                flex-direction: column;
//                justify-content: center;
//                overflow-y: auto;
//            }
//            #timer {
//                font-size: 24px;
//                margin-bottom: 12px;
//                font-weight: bold;
//                color: #007bff;
//            }
//            #questionText {
//                font-size: 1.3rem;
//                border: 1px solid #ccc;
//                border-radius: 8px;
//                padding: 20px;
//                min-height: 120px;
//                margin-bottom: 20px;
//            }
//            #navButtons {
//                display: flex;
//                gap: 10px;
//                margin-bottom: 20px;
//            }
//            button {
//                padding: 10px 20px;
//                font-size: 1rem;
//                border-radius: 6px;
//                border: none;
//                cursor: pointer;
//                background-color: #007bff;
//                color: white;
//            }
//            button:disabled {
//                background-color: #aaa;
//                cursor: not-allowed;
//            }
//        </style>
//    </head>
//    <body>
//        <div id="cameraContainer">
//            <video autoplay muted playsinline id="video"></video>
//            <button id="stopRecordingBtn">Stop Recording</button>
//        </div>

//        <div id="questionContainer">
//            <div id="timer">01:00</div>
//            <div id="questionText">Loading questions...</div>
//            <div id="navButtons">
//                <button id="nextBtn" disabled>Next</button>
//            </div>
//        </div>

//        <script>
//            const questions = ${JSON.stringify(questions)};
//            let currentIndex = 0;
//            let countdown = 60;
//            let intervalId;
//            let mediaRecorder = null;
//            let recordedChunks = [];
//            let stream = null;

//            const timerElem = document.getElementById('timer');
//            const questionTextElem = document.getElementById('questionText');
//            const nextBtn = document.getElementById('nextBtn');
//            const videoElem = document.getElementById('video');
//            const stopBtn = document.getElementById('stopRecordingBtn');

//            function showQuestion(index) {
//                questionTextElem.textContent = questions[index];
//                nextBtn.disabled = index === questions.length - 1;
//                resetTimer();
//            }

//            function resetTimer() {
//                countdown = 60;
//                updateTimerDisplay();
//                if (intervalId) clearInterval(intervalId);
//                intervalId = setInterval(() => {
//                    countdown--;
//                    if (countdown <= 0) {
//                        clearInterval(intervalId);
//                        if(currentIndex < questions.length - 1) {
//                            currentIndex++;
//                            showQuestion(currentIndex);
//                        }
//                    }
//                    updateTimerDisplay();
//                }, 1000);
//            }

//            function updateTimerDisplay() {
//                const minutes = Math.floor(countdown / 60);
//                const seconds = countdown % 60;
//                timerElem.textContent = \`\${minutes.toString().padStart(2, '0')}:\${seconds.toString().padStart(2, '0')}\`;
//            }

//            nextBtn.onclick = () => {
//                if (currentIndex < questions.length - 1) {
//                    currentIndex++;
//                    showQuestion(currentIndex);
//                }
//            };

//            navigator.mediaDevices.getUserMedia({ video: true, audio: true })
//                .then(s => {
//                    stream = s;
//                    videoElem.srcObject = stream;
//                    recordedChunks = [];
//                    mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm; codecs=vp9' });
//                    mediaRecorder.ondataavailable = e => { if (e.data.size > 0) recordedChunks.push(e.data); };
//                     mediaRecorder.onstop = () => {
//      const blob = new Blob(recordedChunks, { type: 'video/webm' });
//      const formData = new FormData();
//      formData.append('video', blob, 'interview.webm');
//      formData.append('experience', window.candidateExperience);
//      formData.append('skills', window.candidateSkills);
//      formData.append('questions', JSON.stringify(questions));
//      formData.append('candidateName', 'TestUser'); // Replace with real name when available
//      debugger;
//      fetch('/Home/AnalyzeAnswer', { method: 'POST', body: formData })
//        .then(response => response.json())
//        .then(data => {
//          alert('Upload successful!');
//          window.close();
//        })
//        .catch(err => alert('Upload failed: ' + err));
//    };
//                    mediaRecorder.start();
//                    showQuestion(currentIndex);
//                })
//                .catch(err => alert('Camera access error: ' + err));

//            stopBtn.onclick = () => {
//                if (mediaRecorder && mediaRecorder.state === 'recording') {
//                    mediaRecorder.stop();
//                    stream.getTracks().forEach(track => track.stop());
//                    stopBtn.disabled = true;

//                }
//            };
//        <\/script>
//    </body>
//    </html>
//    `;

//    popup.document.write(htmlContent);
//    popup.document.close();
//};

// interviewPopup.js

window.openInterviewPopup = function (questions, skills, experience) {

    const popup = window.open('', 'cameraWindow',
        'width=900,height=600,resizable=yes');

    if (!popup) {
        alert('Popup blocked. Please allow popups.');
        return;
    }

    // Force popup to the front
    popup.focus();
    popup.moveTo(screen.width / 2 - 450, screen.height / 2 - 300);

    popup.candidateSkills = skills;
    popup.candidateExperience = experience;

    const htmlContent = `
    <!DOCTYPE html>
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
            // Force popup to front when loaded
            window.onload = () => {
                window.focus();
                setTimeout(() => { window.focus(); }, 200);
            };

            const questions = ${JSON.stringify(questions)};
            let currentIndex = 0;
            let countdown = 60;
            let intervalId;
            let mediaRecorder = null;
            let recordedChunks = [];
            let stream = null;

            const timerElem = document.getElementById('timer');
            const questionTextElem = document.getElementById('questionText');
            const nextBtn = document.getElementById('nextBtn');
            const videoElem = document.getElementById('video');
            const stopBtn = document.getElementById('stopRecordingBtn');

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
                    mediaRecorder.ondataavailable = e => { if (e.data.size > 0) recordedChunks.push(e.data); };

                    mediaRecorder.onstop = () => {
                        const blob = new Blob(recordedChunks, { type: 'video/webm' });
                        const formData = new FormData();
                        formData.append('video', blob, 'interview.webm');
                        formData.append('experience', window.candidateExperience);
                        formData.append('skills', window.candidateSkills);
                        formData.append('questions', JSON.stringify(questions));
                        formData.append('candidateName', 'TestUser');

                        fetch('/Home/AnalyzeAnswer', { method: 'POST', body: formData })
                            .then(r => r.json())
                            .then(() => {
                                alert('Upload successful!');
                                window.close();
                            })
                            .catch(err => alert('Upload failed: ' + err));
                    };

                    mediaRecorder.start();
                    showQuestion(currentIndex);
                })
                .catch(err => alert('Camera access error: ' + err));

            stopBtn.onclick = () => {
                if (mediaRecorder && mediaRecorder.state === 'recording') {
                    mediaRecorder.stop();
                    stream.getTracks().forEach(track => track.stop());
                    stopBtn.disabled = true;
                }
            };
        <\/script>
    </body>
    </html>
    `;

    popup.document.write(htmlContent);
    popup.document.close();

    // Focus again after load
    setTimeout(() => {
        popup.blur();
        popup.focus();
    }, 300);
};
