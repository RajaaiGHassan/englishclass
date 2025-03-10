// Function to setup audio synchronization for sentence highlighting only
function setupAudioSync(pair) {
    const textContainer = pair.querySelector(".text-container");

    textContainer.addEventListener("click", (event) => {
        let sentence = event.target.closest(".sentence");
        if (sentence) {
            let audioSrc = sentence.dataset.audio;
            let start = parseFloat(sentence.dataset.start);
            let end = parseFloat(sentence.dataset.end);

            // Remove any existing audio element
            let existingAudio = pair.querySelector("audio");
            if (existingAudio) existingAudio.remove();

            // Create new audio dynamically
            let audio = document.createElement("audio");
            audio.src = audioSrc;
            audio.dataset.sentenceStart = start;
            audio.dataset.sentenceEnd = end;
            audio.autoplay = true;
            pair.appendChild(audio);

            audio.currentTime = start;
            audio.play();

            // Highlight entire sentence while playing
            sentence.classList.add("highlight-sentence");

            // Remove highlight when audio ends
            audio.addEventListener("timeupdate", () => {
                if (audio.currentTime >= end) {
                    audio.pause();
                    sentence.classList.remove("highlight-sentence"); // Remove highlight when done
                }
            });

            // Remove highlight when audio fully stops
            audio.addEventListener("ended", () => {
                sentence.classList.remove("highlight-sentence");
            });
        }
    });
}

// Initialize all audio-text pairs
document.querySelectorAll(".audio-text-pair").forEach(setupAudioSync);




document.querySelectorAll(".image-card").forEach(card => {
    card.addEventListener("click", () => {
        let audioSrc = card.dataset.audio;
        let audio = new Audio(audioSrc);
        audio.play();
    });
});











// 1️⃣ Flip Flashcards Correctly
function flipCard(card) {
    card.classList.toggle('flipped');
}



// 2️⃣ Word Matching Game
// Word Matching Game
const wordBoxes = document.querySelectorAll('.word-box');
const definitionBoxes = document.querySelectorAll('.definition-box');

// Allow words to be dragged
wordBoxes.forEach(word => {
    word.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', word.dataset.match);
    });
});

// Allow definitions to accept words
definitionBoxes.forEach(def => {
    def.addEventListener('dragover', (e) => {
        e.preventDefault();
    });

    def.addEventListener('drop', (e) => {
        e.preventDefault();
        const draggedWord = e.dataTransfer.getData('text/plain');

        if (draggedWord === def.dataset.answer) {
            def.classList.add('correct-match');
            def.textContent += " ✅";
        } else {
            def.classList.add('incorrect-match');
        }
    });
});






// 3️⃣ Gap-Fill Exercise
// Gap-Fill Exercise
function checkGapFill() {
    const answers = {
        gap1: "overcrowding",
        gap2: "sustainable tourism",
        gap3: "cultural impact"
    };

    let score = 0;
    Object.keys(answers).forEach(gap => {
        const userAnswer = document.getElementById(gap).value.trim().toLowerCase();
        if (userAnswer === answers[gap]) {
            document.getElementById(gap).classList.add("correct-answer");
            score++;
        } else {
            document.getElementById(gap).classList.add("wrong-answer");
        }
    });

    document.getElementById("gap-fill-result").innerHTML = `Your score: ${score}/3`;
}










































document.addEventListener("DOMContentLoaded", () => {
    
    const exercisesSection = document.getElementById("exercises");
    const submitBtn = document.getElementById("submitBtn");
    const scoreDisplay = document.getElementById("score");

    // Handle form submission
    submitBtn?.addEventListener("click", (event) => {
        event.preventDefault(); // Prevent form from reloading page
        
        let score = 0;
        let totalQuestions = 16; // Default total questions before adding Word Matching

        // Define correct answers
        const correctAnswers = {
            "q1": "1", "q2": "1", "q3": "1", "q4": "1", // Multiple Choice
            "q5": "phenomena", "q6": "overcrowding", "q7": "caps", "q8": "degradation", // Fill in the Blank
            "q9": "1", "q10": "1", "q11": "1", "q12": "1", // True or False
        };

        // Remove previous feedback before checking new answers
        document.querySelectorAll(".feedback").forEach(el => el.remove());

        // ✅ Check Multiple Choice & True/False Questions
        Object.keys(correctAnswers).forEach(question => {
            const selected = document.querySelector(`input[name="${question}"]:checked`);
            const correctAnswer = correctAnswers[question];
            const parent = document.querySelector(`input[name="${question}"][value="${correctAnswer}"]`)?.parentElement;
            
            if (parent) {
                removeExistingFeedback(parent);
                const feedback = createFeedback(selected?.value === correctAnswer, correctAnswer);
                parent.appendChild(feedback);
                
                if (selected?.value === correctAnswer) {
                    score++;
                } else {
                    const correctAnswerSpan = document.createElement("span");
                    correctAnswerSpan.textContent = ` ✅ ${correctAnswer}`;
                    correctAnswerSpan.style.color = "green";
                    correctAnswerSpan.style.fontWeight = "bold";
                    parent.appendChild(correctAnswerSpan);
                }
            }
        });

        // ✅ Check Fill in the Blank Questions
        Object.keys(correctAnswers).forEach(question => {
            const input = document.getElementById(question);
            if (input) {
                const correctAnswer = correctAnswers[question].toLowerCase().trim();
                removeExistingFeedback(input.parentElement);

                const isCorrect = input.value.trim().toLowerCase() === correctAnswer;
                const feedback = createFeedback(isCorrect, correctAnswer);
                input.insertAdjacentElement("afterend", feedback);

                if (isCorrect) {
                    input.style.border = "2px solid green";
                    score++;
                } else {
                    input.style.border = "2px solid red";
                    const correctAnswerSpan = document.createElement("span");
                    correctAnswerSpan.textContent = ` ✅ ${correctAnswer}`;
                    correctAnswerSpan.style.color = "green";
                    correctAnswerSpan.style.fontWeight = "bold";
                    input.insertAdjacentElement("afterend", correctAnswerSpan);
                }
            }
        });

        // ✅ Check Order Sequence
        const correctOrder = ["4", "2", "3", "1"];
        correctOrder.forEach((correctValue, index) => {
            const answer = document.getElementById(`q${13 + index}`);
            if (answer) {
                removeExistingFeedback(answer.parentElement);

                const isCorrect = answer.value === correctValue;
                const feedback = createFeedback(isCorrect, correctValue);
                answer.insertAdjacentElement("afterend", feedback);

                if (isCorrect) {
                    answer.style.border = "2px solid green";
                    score++;
                } else {
                    answer.style.border = "2px solid red";
                    const correctOrderSpan = document.createElement("span");
                    correctOrderSpan.textContent = ` ✅ ${correctValue}`;
                    correctOrderSpan.style.color = "green";
                    correctOrderSpan.style.fontWeight = "bold";
                    answer.insertAdjacentElement("afterend", correctOrderSpan);
                }
            }
        });

        // ✅ Check Word Matching Game
        let matchingScore = 0;
        document.querySelectorAll(".definition-box").forEach(def => {
            if (def.classList.contains("correct-match")) {
                matchingScore++;
            }
        });

        totalQuestions += 3; // Adding Word Matching Questions
        score += matchingScore; // Adding Word Matching Score

        // ✅ Update score display
        if (scoreDisplay) {
            scoreDisplay.textContent = `Score: ${score}/${totalQuestions}`;
        } else {
            console.error("Score display element not found!");
        }

        // ✅ Show final score alert
        alert(`Your score: ${score}/${totalQuestions}`);
    });

    // 🔄 Function to Create Feedback Message
    function createFeedback(isCorrect, correctAnswer) {
        const feedback = document.createElement("span");
        feedback.classList.add("feedback");
        feedback.style.fontWeight = "bold";
        feedback.style.marginLeft = "10px";
        
        if (isCorrect) {
            feedback.style.color = "green";
            feedback.textContent = "✔ Correct";
        } else {
            feedback.style.color = "red";
            feedback.textContent = `❌ Correct: ${correctAnswer}`;
        }
        return feedback;
    }

    // 🗑 Function to Remove Existing Feedback (Prevents Duplication)
    function removeExistingFeedback(parentElement) {
        parentElement?.querySelectorAll(".feedback").forEach(el => el.remove());
    }

    // ✅ Word Matching Game Logic
    const wordBoxes = document.querySelectorAll('.word-box');
    const definitionBoxes = document.querySelectorAll('.definition-box');

    wordBoxes.forEach(word => {
        word.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', word.dataset.match);
        });
    });

    definitionBoxes.forEach(def => {
        def.addEventListener('dragover', (e) => {
            e.preventDefault();
        });

        def.addEventListener('drop', (e) => {
            e.preventDefault();
            const draggedWord = e.dataTransfer.getData('text/plain');

            if (draggedWord === def.dataset.answer) {
                def.classList.add('correct-match');
                def.textContent += " ✅";
            } else {
                def.classList.add('incorrect-match');
            }
        });
    });

});











// speech recognition
// Speech Recognition Quiz
// Speech Recognition Quiz

// ✅ Vocabulary for English Learning
const vocabulary = [
    { word: "overcrowding", audio: "audio/overcrowding.mp3" },
    { word: "sustainability", audio: "audio/sustainability.mp3" },
    { word: "tourism", audio: "audio/tourism.mp3" },
    { word: "degradation", audio: "audio/degradation.mp3" }
];

let askedWords = [];
let correctAnswers = 0;

function createSpeechRecognitionQuiz(vocabulary) {
    const app = document.getElementById("app");
    if (!app) {
        console.error("Container with ID 'app' not found.");
        return;
    }

    // ✅ Check if all words have been asked
    if (askedWords.length === vocabulary.length) {
        app.innerHTML = `
            <div style="text-align: center; margin-top: 20px;">
                <h3>All words have been asked! Quiz completed! 🎉</h3>
                <p>Your Score: ${correctAnswers}/${vocabulary.length}</p>
                <button id="choose-another-quiz" style="margin-top: 20px; padding: 10px 20px; font-size: 16px; cursor: pointer; border-radius: 5px; border: none; background-color: #00bcd4; color: white;">
                    Choose Another Quiz
                </button>
            </div>
        `;

        // 🔄 Allow users to restart the quiz
        document.getElementById("choose-another-quiz").addEventListener("click", () => {
            askedWords = [];
            correctAnswers = 0;
            createSpeechRecognitionQuiz(vocabulary);
        });

        return;
    }

    app.innerHTML = ""; // Clear the container

    // ✅ Pick a random word that hasn’t been asked yet
    const remainingWords = vocabulary.filter((item) => !askedWords.includes(item.word));
    const randomWord = remainingWords[Math.floor(Math.random() * remainingWords.length)];
    askedWords.push(randomWord.word);

    // ✅ Display question
    const progress = document.createElement("p");
    progress.textContent = `Question ${askedWords.length} of ${vocabulary.length}`;
    progress.style.fontWeight = "bold";
    progress.style.textAlign = "center";

    const question = document.createElement("h2");
    question.textContent = `Say this word: "${randomWord.word}"`;
    question.style.textAlign = "center";

    // 🎧 Audio Button
    const audioButton = document.createElement("button");
    audioButton.textContent = "🔊 Listen to the Word";
    audioButton.classList.add("quiz-button");
    audioButton.onclick = () => playAudio(randomWord.audio);

    // 🎙️ Speech Recognition Button
    const speakButton = document.createElement("button");
    speakButton.textContent = "🎤 Start Speaking";
    speakButton.classList.add("quiz-button");

    const feedback = document.createElement("div");
    feedback.style.textAlign = "center";
    feedback.style.marginTop = "20px";
    feedback.style.fontSize = "18px";

    speakButton.onclick = () => {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            alert("Speech Recognition is not supported in this browser. Try using Chrome.");
            return;
        }

        const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.lang = "en-US"; // Set language to English
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.start();

        recognition.onresult = (event) => {
            const userSpeech = event.results[0][0].transcript.toLowerCase();
            console.log("User Speech:", userSpeech);

            if (userSpeech === randomWord.word.toLowerCase()) {
                correctAnswers++;
                feedback.textContent = "✅ Correct! Your pronunciation was accurate.";
                feedback.style.color = "green";
            } else {
                feedback.textContent = `❌ Incorrect! You said "${userSpeech}". The correct word is "${randomWord.word}".`;
                feedback.style.color = "red";
            }

            setTimeout(() => createSpeechRecognitionQuiz(vocabulary), 3000); // Move to the next question
        };

        recognition.onerror = (event) => {
            console.error("Recognition Error:", event.error);
            feedback.textContent = "⚠️ Error! Please try again.";
            feedback.style.color = "red";
        };
    };

    // ✅ Append elements to the app container
    app.appendChild(progress);
    app.appendChild(question);
    app.appendChild(audioButton);
    app.appendChild(speakButton);
    app.appendChild(feedback);
}

// ✅ Function to Play Audio
function playAudio(audioSrc) {
    const audio = new Audio(audioSrc);
    audio.play();
}

// ✅ Initialize the Quiz
document.addEventListener("DOMContentLoaded", () => {
    createSpeechRecognitionQuiz(vocabulary);
});
























document.addEventListener("DOMContentLoaded", function () {
    // Select all elements with the "sync-audio" class
    const syncAudioElements = document.querySelectorAll(".sync-audio");
  
    syncAudioElements.forEach(syncText => {
      const audioFile = syncText.dataset.audio;
      const totalDuration = parseFloat(syncText.dataset.length);
  
      if (!audioFile || isNaN(totalDuration)) {
        console.error("Missing audio file or incorrect duration.");
        return;
      }
  
      // Create an audio element dynamically and append it to the syncText element
      const audio = new Audio(audioFile);
      syncText.appendChild(audio);
  
      // Get all word spans within this syncText element
      const words = syncText.querySelectorAll("span");
  
      // Function to calculate timings for each word
      function autoCalculateTimings() {
        audio.addEventListener("loadedmetadata", () => {
          let manualTimeUsed = 0;
  
          // Account for manually set pauses
          words.forEach(word => {
            if (word.dataset.manualStart && word.dataset.manualEnd) {
              const start = parseFloat(word.dataset.manualStart);
              const end = parseFloat(word.dataset.manualEnd);
              if (!isNaN(start) && !isNaN(end)) {
                manualTimeUsed += end - start;
              }
            }
          });
  
          // Calculate remaining time for words without manual timing
          let remainingTime = totalDuration - manualTimeUsed;
          let wordsWithoutManualTiming = words.length - syncText.querySelectorAll("[data-manual-start]").length;
          let timePerWord = wordsWithoutManualTiming > 0 ? remainingTime / wordsWithoutManualTiming : 0;
          let currentTimeCounter = 0;
  
          // Set start and end times for each word
          words.forEach(word => {
            if (word.dataset.manualStart && word.dataset.manualEnd) {
              word.dataset.start = word.dataset.manualStart;
              word.dataset.end = word.dataset.manualEnd;
              currentTimeCounter = parseFloat(word.dataset.manualEnd);
            } else {
              word.dataset.start = currentTimeCounter.toFixed(2);
              currentTimeCounter += timePerWord;
              word.dataset.end = currentTimeCounter.toFixed(2);
            }
          });
        });
      }
      autoCalculateTimings();
  
      // Update highlights using requestAnimationFrame for smooth syncing
      function updateHighlights() {
        const currentTime = audio.currentTime;
        words.forEach(word => {
          const start = parseFloat(word.dataset.start);
          const end = parseFloat(word.dataset.end);
          if (!isNaN(start) && !isNaN(end)) {
            if (currentTime >= start && currentTime <= end) {
              word.classList.add("highlight");
            } else {
              word.classList.remove("highlight");
            }
          }
        });
        requestAnimationFrame(updateHighlights);
      }
  
      // Start the highlight update loop when the audio plays
      audio.addEventListener("play", () => {
        requestAnimationFrame(updateHighlights);
      });
  
      // Toggle play/pause when the text is clicked
      syncText.addEventListener("click", function () {
        if (audio.paused) {
          audio.play();
        } else {
          audio.pause();
          resetHighlights();
        }
      });
  
      // Reset all highlights when audio ends
      audio.addEventListener("ended", function () {
        resetHighlights();
      });
  
      function resetHighlights() {
        words.forEach(word => {
          word.classList.remove("highlight");
        });
      }
    });
  });
  






















// Select all images with the 'audio-image' class
const images = document.querySelectorAll('.audio-image');

images.forEach(image => {
  // Create an Audio object using the file specified in the data attribute
  const audio = new Audio(image.dataset.audio);

  // Toggle play/pause on click
  image.addEventListener('click', () => {
    if (audio.paused) {
      audio.play();
      image.classList.add('playing'); // add the class when playing
    } else {
      audio.pause();
      audio.currentTime = 0;
      image.classList.remove('playing'); // remove the class when paused
    }
  });

  // Remove the 'playing' class when audio naturally ends
  audio.addEventListener('ended', () => {
    image.classList.remove('playing');
  });
});






