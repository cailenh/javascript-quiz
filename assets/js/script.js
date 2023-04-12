// DOM elements
const timerEl = document.querySelector("#timer"); // timer
const timeEl = document.querySelector("#time-left"); // location in timer where count will appear
const introEl = document.querySelector("#intro"); // intro message
const questionEl = document.querySelector("#question"); // question section
const answerStatusEl = document.querySelector("#question-answer-status"); // where answer is marked correct/wrong
const gameOverEl = document.querySelector("#game-over"); // game over section
const finalScoreEl = document.querySelector("#final-scoring"); // final score section
const highScoresEl = document.querySelector("#high-scores"); // high score section
const initialsEl = document.querySelector("#initials"); // initials input field
const startBtn = document.querySelector("#start-quiz"); // start quiz button
const viewHighScoresLnk = document.querySelector("#view-high-scores"); // link to high scores

// question array using object properties
const questions = [
    {
        number: 1,
        text: "Commonly used data types DO NOT include:",
        // answers stored as array
        answers: ["strings", "booleans", "alerts", "numbers"],
        // answer that will give correctAnswer condition
        correct: "alerts"
    },
    {
        number: 2,
        text: "The condition in an if / else statement is enclosed with _.",
        answers: ["quotes", "parentheses", "curly brackets", "square brackets"],
        correct: "parentheses"
    },
    {
        number: 3,
        text: "Arrays in JavaScript can be used to store _.",
        answers: ["numbers and strings", "other arrays", "booleans", "all of the above"],
        correct: "all of the above"
    },
    {
        number: 4,
        text: "String values must be enclosed within _ when being assigned to variables.",
        answers: ["quotes", "curly brackets", "commas", "parentheses"],
        correct: "quotes"
    },
    {
        number: 5,
        text: "A very useful tool used during development and debugging for printing content to the debugger is:",
        answers: ["JavaScript", "terminal/bash", "for loops", "console.log"],
        correct: "console.log"
    },
];

// timer count
let time;

// start current question at the first
let currentQuestionIndex = 0;

// START QUIZ
function startQuiz() {
    // hide the intro message
    introEl.setAttribute("class", "display-none");

    // hide the view high scores option so it doesn't interrupt the quiz
    viewHighScoresLnk.textContent = "";

    // unhide the question section
    questionEl.removeAttribute("class");
    answerStatusEl.removeAttribute("class");

    // start the timer
    startTimer();

    // begin questions
    getQuestion ();
};

// START TIMER
function startTimer() {
    // start at this amount of seconds
    time = 100;
    timer = setInterval(function() {
        time--;
        timeEl.textContent = time;
        // if timer reaches 0 before the final question is answered, display game over
        if (time <= 0) {
            gameOver();
        }
    }, 1000);
};

// GET CURRENT QUESTION
function getQuestion() {
    // answer div to append buttons to
    const answersEl = document.querySelector("#question-answers");

    // remove previous answers (if applicable)
    while (answersEl.firstChild) {
        answersEl.removeChild(answersEl.lastChild);
    }

    // set which question the user is currently on
    let currentQuestion = questions[currentQuestionIndex];

    // show the heading and text for the current question
    const questionNumber = document.getElementById("question-number");
    questionNumber.textContent = currentQuestion.number;
    const questionText = document.getElementById("question-text");
    questionText.textContent = currentQuestion.text;

    // for each possible answer from the answers array...
    currentQuestion.answers.forEach(function(answer, i) {
        // create a button
        const answerBtn = document.createElement("button");
        answerBtn.setAttribute("class", "answer");
        answerBtn.textContent = answer;

        // add click event for each button
        answerBtn.onclick = answerClick;

        // add the button to the answers section
        answersEl.appendChild(answerBtn);
    });
};

// WHAT HAPPENS WHEN ANSWER IS CLICKED
function answerClick() {
    // if the text of the answer chosen doesn't match the correct answer for the current question...
    if (this.textContent !== questions[currentQuestionIndex].correct) {
        // subtract penalty for wrong answer
        time -= 10;

        // and indicate wrong
        answerStatusEl.textContent = "Wrong!";
    } else {
        // otherwise, indicate correct
        answerStatusEl.textContent = "Correct!";
    }

    // clear wrong/correct after 1 second
    setTimeout(function() {
        answerStatusEl.textContent = "";
    }, 1000);

    // set next question
    currentQuestionIndex++;

    // if this was the last question and time hasn't run out, display score
    if (currentQuestionIndex === questions.length && time > 0) {
        displayScore();
    // if this wasn't the final question, ask the next one
    } else if (time > 0){
        getQuestion();
    }
    // otherwise, gameOver will proceed
};

// END GAME IF TIMER REACHES 0 AT ANY POINT
function gameOver() {
    // stop the timer
    clearInterval(timer);

    // set timer text to 0 in case the time went negative
    time = 0;
    timeEl.textContent = time;

    // hide the question
    questionEl.setAttribute("class", "display-none");

    // hide the answer status
    answerStatusEl.setAttribute("class", "display-none");

    // show game over message and button
    gameOverEl.removeAttribute("class");

    // reload page when restart button is pressed
    const restartBtn = document.querySelector("#restart-quiz");
    restartBtn.addEventListener("click", function() {
        location.reload();
    });
};

// DISPLAY FINAL SCORE AND INITIALS INPUT
function displayScore() {
    // stop the timer
    clearInterval(timer);

    // set timer text to show final time
    timeEl.textContent = time;

    // hide the question (but keep the answer status)
    questionEl.setAttribute("class", "display-none");

    // show final score and initials input
    const finalScoreText = document.querySelector("#final-score");
    finalScoreText.textContent = time;
    finalScoreEl.removeAttribute("class");

    // click event to save score
    const submitBtn = document.querySelector("#initials-submit");
    submitBtn.addEventListener("click", saveScore);

};

// SAVE SCORE WHEN SUBMIT IS CLICKED
function saveScore() {
    // get the initials from the input box
    let initials = initialsEl.value.trim();

    // if the initials aren't blank, save them to local storage
    if (initials !== "") {
        // pull current saved scores from local storage, or if none then use an empty array
        let highScores = JSON.parse(window.localStorage.getItem("highScores")) || [];

        // add the new score using object properties
        let newScore = {
            score: time,
            initials: initials
        };

        // save the new score to local storage
        highScores.push(newScore);
        window.localStorage.setItem("highScores", JSON.stringify(highScores));

        // show the score list
        showScores();
    } else {
        // if no initials, just show the score
        showScores();
    };

    
};

// SHOW FULL LIST OF HIGH SCORES
function showScores() {
    // hide the view high scores option since we're already there
    viewHighScoresLnk.textContent = "";

    // hide timer since we don't need it at this point
    timerEl.textContent = "";

    // hide the display score section
    finalScoreEl.setAttribute("class", "display-none");

    // hide intro if we clicked over from there
    introEl.setAttribute("class", "display-none");

    // pull the current saved scores from local storage (or blank array)
    let highScores = JSON.parse(window.localStorage.getItem("highScores")) || [];

    // sort the high scores from highest to lowest based on score property
    highScores.sort(function(a, b) {
        return b.score - a.score;
    });

    // for each stored score...
    highScores.forEach(function(score) {
        // create a list item
        const scoreEntry = document.createElement("li");
        scoreEntry.textContent = score.initials + " - " + score.score;

        // add it to the scores list
        scoresListEl = document.querySelector("#high-scores-list");
        scoresListEl.appendChild(scoreEntry);
    });

    // show the scores list
    highScoresEl.removeAttribute("class");

    // click event to go back (reload whole page)
    const goBackBtn = document.querySelector("#go-back-btn");
    goBackBtn.addEventListener("click", function() {
        location.reload();
    });

    // click event to clear scores
    const clearScoresBtn = document.querySelector("#clear-scores-btn")
    clearScoresBtn.addEventListener("click", function() {
        // remove scores from local storage
        window.localStorage.removeItem("highScores");
        
        // remove all child elements of the score list (clear the list)
        while (scoresListEl.firstChild) {
            scoresListEl.removeChild(scoresListEl.lastChild);
        }
    });
};

// start quiz when button is clicked
startBtn.addEventListener("click", startQuiz);

// show high scores when link is clicked
viewHighScoresLnk.addEventListener("click", showScores);