var buttonquizID = "button-quiz"; // All buttons start with this id
var pickID = "pick"; // Term for the attribute holding the pick of the option
var scoreLocaleStorage = "quiz_score"; // Key for locally stored scores

var highscoresTab = document.querySelector("#highscores-tab");//
var pageHeader = document.querySelector("header"); //Display the header
var mainContent = document.querySelector("main");//Display the body content
var quizHeader = document.querySelector("#quiz-header");//Will help displays the questions
var quizPrompt = document.querySelector("#prompt");//Display the prompt
var startbuttonquiz = document.querySelector("#" + buttonquizID);// When clicked on, the quiz starts

var timeSpan = document.querySelector("#time");//Display the time left to finish
var questionNum = -1; // Will help with which question the prompt is on
var timeLeft = 0;
var timerInterval = undefined;// 
var resultInterval = undefined;

var scores = {}; //

var questions = [
    {
        prompt: "Commonly used data types DO NOT include:",
        a: "strings",
        b: "booleans",
        c: "alerts",
        d: "numbers",
        answer: "c"
    },
    {
        prompt: "The condition is an if/else statement is enclosed within _____.",
        a: "quotes",
        b: "curly braces",
        c: "parenthesis",
        d: "square brackets",
        answer: "d",
    },
    {
        prompt: "Strings values must be enclosed within ____ when assisgned to variables.",
        a: "commas",
        b: "curly braces",
        c: "quotes",
        d: "parenthesis",
        answer: "c",
    },
    {
        prompt: "A very useful tool used during development and debugging for printing content to the debugger is:",
        a: "JavaScript",
        b: "terminal/bash",
        c: "for loops",
        d: "console.log",
        answer: "d"
    }
];

var defaultquizHeaderText = quizHeader.textContent;
var defaultquizPromptText = quizPrompt.textContent;

highscoresTab.addEventListener('click', (event) => {
    displayHighScores();
});

var optionList = document.createElement("ol"); //Creates a button layout for answer, and helps verifying the answers

var buttonA = document.createElement("button");
var buttonB = document.createElement("button");
var buttonC = document.createElement("button");
var buttonD = document.createElement("button");

buttonA.id = buttonquizID + "-a";
buttonB.id = buttonquizID + "-b";
buttonC.id = buttonquizID + "-c";
buttonD.id = buttonquizID + "-d";

var buttons = [buttonA, buttonB, buttonC, buttonD];

var questionSpanResult = document.createElement("span");
questionSpanResult.id = "question-result";

function loadScores() {
    var scoresString = localStorage.getItem(scoreLocaleStorage);
    if (scoresString === undefined) {
        localStorage.setItem(scoreLocaleStorage, JSON.stringify(scores));
        return;
    }

    JSON.parse(scoresString, (b, m) => {
        if (b !== "") {
            scores[b] = m;
        }
    });
}

loadScores();

function savedScores() {
    localStorage.setItem(scoreLocaleStorage, JSON.stringify(scores));
}

function addScore(name, score) {
    scores[name] = score;
    if (scores.length > scoreListEL.length) {
        var el = document.createElement("li");
        el.textContent = ". " + name + " - " + score;
        el.setAttribute("name", name);
        el.setAttribute("score", score.toString());
        scoreListEL.push(el);
    }
    fillScores();
    savedScores();
}

function clearScores() {
    scores = [];
    fillScores();
    savedScores();
}

function alignText (element, type) {
    element.setAttribute("style", "text-align: " + ";");
}
function updateTime(skipRemain) {
    if (skipRemain) {
        timeleft = 0;
    }
    timeSpan.textContent = timeleft.toString();
}
