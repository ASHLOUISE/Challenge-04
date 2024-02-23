const quizData = [
  {
    "question": "Commonly used data types DO NOT include:",
    "options": ["Strings", "Booleans", "Alerts", "Numbers"],
    "answer": "Alerts"
  },
  {
    "question": "The condition in an if/else statement is enclosed with ___________.",
      "options": ["Quotes", "Curly brackets", "Parenthesis", "Square brackets"],
      "answer": "Parenthesis"
  },
  {
    "question": "Arrays in JavaScript can be used to store __________.",  
      "options": ["Numbers and strings", "Other arrays", "Booleans", "All of the above"],
      "answer": "All of the above"
  },
  {
    "question": "String values must be enclosed within __________ when being assigned to variables.",
      "options": ["Commas", "Curly brackets", "Quotes", "Parenthesis"],
      "answer": "Quotes"
  },
  {
    "question": "A very useful tool used during development and debugging for printing content to the debugger is:",
      "options": ["JavaScript", "Terminal/Bash", "For loops", "Console.log"],
      "answer": "Console.log"
  }
];


let currentQuestion = 0;
let score = 0;
let highScores = JSON.parse(localStorage.getItem("highScores")) || [];
let userName = "";
let selectedOption = "";


const loadQuestion = () => {
  const questionObj = quizData[currentQuestion];
  document.getElementById("question").innerText = questionObj.question;
  for (let i = 0; i < 4; i++) {
    const btn = document.getElementById(`btn${i}`);
    btn.innerText = questionObj.options[i];
    btn.className = "option-btn";
    btn.disabled = false;
    btn.style.opacity = 1;
    btn.style.cursor = "default";
  }
  document.getElementById("message").innerText = "";
  document.getElementById("next-btn").style.display = "none";
};


const startQuiz = () => {
  userName = prompt("Enter your username");
  document.getElementById("start-page").style.display = "none";
  document.getElementById("quiz-container").style.display = "block";
  loadQuestion();
};


const endQuiz = () => {
  document.getElementById("quiz-container").style.display = "none";
  document.getElementById("score-container").style.display = "block";
  document.getElementById("final-score").innerText = score;

  const previousHighScore = JSON.parse(localStorage.getItem("highScore")) || 0;

  if (score > previousHighScore) {
    localStorage.setItem("highScore", JSON.stringify(score));
    document.getElementById("final-high-score").innerText = score;
  } else {
    document.getElementById("final-high-score").innerText = previousHighScore;
  }
  highScores.push({
    username: userName,
    score: score,
    date: new Date().toISOString(),
  });
  highScores.sort((a, b) => b.score - a.score);
  localStorage.setItem("highScores", JSON.stringify(highScores));
};



const showHighscores = () => {
  document.getElementById("start-page").style.display = "none";
  document.getElementById("highscore-page").style.display = "block";
  document.getElementById("highscores").innerHTML = highScores
    .map(
      (item) =>
        `<p>${item.username}: ${item.score} (on ${new Date(
          item.date
        ).toLocaleDateString()} at ${new Date(
          item.date
        ).toLocaleTimeString()})</p>`
    )
    .join("");

  if (highScores.length == 0) {
    document.getElementById("highscores").innerHTML =
      "<h3>No Scores Yet!</h3><h4>Play the game to see your scores here.</h4>";
  }
};


document.getElementById("start-btn").addEventListener("click", startQuiz);
document
  .getElementById("highscore-btn")
  .addEventListener("click", showHighscores);

// Next Question button
document.getElementById("next-btn").addEventListener("click", () => {
  currentQuestion++;
  if (currentQuestion < quizData.length) {
    loadQuestion();
    const progress = (currentQuestion / quizData.length) * 100;
    document.getElementById("progress-bar-fill").style.width = `${progress}%`;
    document.getElementById("progress-bar-text").innerText = `${Math.round(
      progress
    )}%`;
  } else {
    endQuiz();
  }
});


for (let i = 0; i < 4; i++) {
  document.getElementById(`btn${i}`).addEventListener("click", (event) => {
    selectedOption = event.target;
    if (
      quizData[currentQuestion].options[i] === quizData[currentQuestion].answer
    ) {
      score++;
      document.getElementById("score").innerText = score;
      selectedOption.className = "option-btn correct";
      document.getElementById("message").innerText = "Correct Answer!";
    } else {
      selectedOption.className = "option-btn wrong";
      document.getElementById("message").innerText = "Wrong Answer!";
    }
    for (let j = 0; j < 4; j++) {
      document.getElementById(`btn${j}`).disabled = true;
      document.getElementById(`btn${j}`).style.cursor = "not-allowed";
      document.getElementById(`btn${j}`).style.opacity = 0.5;
    }
    selectedOption.style.opacity = 1;
    document.getElementById("next-btn").style.display = "block";
  });
}
