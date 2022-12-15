var quizButtonIDStart = "quiz-button"; 
var choiceAttribute = "choice"; 
var quizScoresLocalStorageKey = "quiz_scores"; 

var pageHeader = document.querySelector("header"); 
var highscoresTab = document.querySelector("#highscores-tab");
var mainBodyContent = document.querySelector("main"); 
var quizHeader = document.querySelector("#quiz-header"); 
var quizDescription = document.querySelector("#quiz-description"); 
var startQuizButton = document.querySelector("#" + quizButtonIDStart); 
var timeSpan = document.querySelector("#time"); 
var questionNumber = -1; 

var timeLeft = 0; 
var timerInterval = undefined; 
var resultInterval = undefined; 
var scores = {}; 

function loadScores() {
    var scoresString = localStorage.getItem(quizScoresLocalStorageKey);

    if(scoresString === undefined) {
        localStorage.setItem(quizScoresLocalStorageKey, JSON.stringify(scores));
        return;
    }

    JSON.parse(scoresString, (k, v) => {
        if(k !== "") {
            scores[k] = v;
        }
    });
}

loadScores();

function saveScores() {
    localStorage.setItem(quizScoresLocalStorageKey, JSON.stringify(scores));
}

function addScore(name, score) {
    scores[name] = score;
    if(scores.length > scoreListElements.length) {
        var el = document.createElement("li");
        el.textContent = ". " + name + " - " + score;
        el.setAttribute("name", name);
        el.setAttribute("score", score.toString());
        scoreListElements.push(el);
    }
    populateScores();
    saveScores();
}

function clearScores() {
    scores = [];
    populateScores();
    saveScores();
}

function alignText(element, type) {
    element.setAttribute("style", "text-align: " + type + ";");
}

function updateTime(skipRemaining) {
    if(skipRemaining) {
        timeLeft = 0;
    }

    timeSpan.textContent = timeLeft.toString();
}

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
        prompt: "The condition in an if/else statement is enclosed within ____.",
        a: "quotes",
        b: "curly braces",
        c: "parenthesis",
        d: "square brackets",
        answer: "c"
    },
    {
        prompt: "Arrays in JavaScript can be used to store ____.",
        a: "numbers and strings",
        b: "other arrays",
        c: "booleans",
        d: "all of the above",
        answer: "d"
    },
    {
        prompt: "Strings values must be enclosed within ____ when assigned to variables.",
        a: "commas",
        b: "curly braces",
        c: "quotes",
        d: "parenthesis",
        answer: "c"
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

function shuffleQuestions() {
    for(var i = questions.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var qai = questions[i];
        questions[i] = questions[j];
        questions[j] = qai;
    }
}

shuffleQuestions();

function getCurrentQuestion() {
    if(questionNumber < 0 || questionNumber > questions.length - 1) {
        return undefined;
    }
    return questions[questionNumber];
}
var defaultQuizHeaderText = quizHeader;
var defaultQuizDescriptionText = quizDescription;

highscoresTab.addEventListener('click', (event) => {
    displayHighScores();
});

var optionList = document.createElement("ol");
var buttonA = document.createElement("button");
var buttonB = document.createElement("button");
var buttonC = document.createElement("button");
var buttonD = document.createElement("button");

buttonA.id = quizButtonIDStart + "-a";
buttonB.id = quizButtonIDStart + "-b";
buttonC.id = quizButtonIDStart + "-c";
buttonD.id = quizButtonIDStart + "-d";

var buttons = [buttonA, buttonB, buttonC, buttonD];

var questionResultSpan = document.createElement("span");
questionResultSpan.id = "question-result";

var saveScoreElement = document.createElement("div");
saveScoreElement.id = "quiz-save-score";

var saveScoreLabel = document.createElement("label");
saveScoreLabel.id = "quiz-label-save-score";
saveScoreLabel.textContent = "Enter your initials: ";
saveScoreLabel.setAttribute("for", "quiz-input-save-score");
var saveScoreInput = document.createElement("input");
saveScoreInput.id = "quiz-input-save-score";
saveScoreInput.setAttribute("name", "quiz-input-save-score");
saveScoreInput.addEventListener('keypress', (event) => {
    if(event.target.nodeName === "INPUT" && event.key === 'Enter') {
        onSaveScoreEvent(event);
    }
})
var saveScoreButton = document.createElement("button");
saveScoreButton.id = "quiz-button-save-score";
saveScoreButton.textContent = "Submit";
saveScoreButton.addEventListener('click', onSaveScoreEvent);

function onSaveScoreEvent(event) {
    var initials = saveScoreInput.value.trim().toUpperCase();

    if(initials.length > 2 || initials.length < 2) {
        var splitInitials = initials.split(/\s+/);
        var splitLen = splitInitials.length;
        if(splitLen > 2 || splitLen < 2) {
            initials = "";
        } else {
            initials = splitInitials[0].charAt(0) + splitInitials[splitLen - 1].charAt(0);
        }
    }

    saveScoreInput.value = "";

    if(initials.length == 0) {
        window.alert("Please enter your first and last initials or a full name for your score!");
        return;
    }

    addScore(initials, timeLeft);

    displayHighScores();
}

saveScoreElement.append(saveScoreLabel);
saveScoreElement.append(saveScoreInput);
saveScoreElement.append(saveScoreButton);

var scoreList = document.createElement("ol");
var goBackButton = document.createElement("button");
goBackButton.id = "quiz-button-go-back";
goBackButton.textContent = "Go Back";
goBackButton.addEventListener('click', (event) => {
    scoreList.remove();
    goBackButton.remove();
    clearScoresButton.remove();
    resetDefaultPageText();
    mainBodyContent.append(quizDescription);
    mainBodyContent.append(startQuizButton);
});
var clearScoresButton = document.createElement("button");
clearScoresButton.id = "quiz-button-clear-scores";
clearScoresButton.textContent = "Clear Scores";
clearScoresButton.addEventListener('click', () => {
    clearScores();
})

var scoreListElements = [];

function populateScores() {
    scoreListElements.forEach((scoreEl) => {
        scoreEl.remove();
    });
    scoreListElements = [];
    for(key in scores) {
        var value = scores[key];
        var el = document.createElement("li");
        el.setAttribute("name", key);
        el.setAttribute("score", value.toString());
        scoreListElements.push(el);
    }

    sortScores();
}

populateScores();

function sortScores() {
    scoreListElements.sort(function(el1, el2) {
        return el2.getAttribute("score") - el1.getAttribute("score");
    });

    scoreListElements.forEach((el, i) => {
        el.remove();
        el.textContent = (i + 1).toString() + ". " + el.getAttribute("name") + " - " + el.getAttribute("score");
        scoreList.append(el);
    });
}

function displayQuestionResultSpan(correct, endQuiz) {
    questionResultSpan.textContent = correct? "Correct!" : "Wrong";

    if(resultInterval !== undefined) {
        clearInterval(resultInterval);
        if(endQuiz) {
            questionResultSpan.remove();
            mainBodyContent.append(questionResultSpan);
        }
    } else {
        mainBodyContent.append(questionResultSpan);
    }

    resultInterval = setInterval(() => {
        questionResultSpan.remove();
        clearInterval(resultInterval);
        resultInterval = undefined;
    }, 1500); 
}

function loadNextQuestion() {
    questionNumber++; 
    var question = getCurrentQuestion();

    if(question === undefined) {
        return false;
    }

    quizHeader.textContent = question.prompt;

    buttons.forEach((button) => {
        var choice = button.getAttribute(choiceAttribute);
        button.textContent = choice.toUpperCase() + ": " + question[choice];
    });

    return true; 
}

function endQuiz(timeOut, displayEndScorePage) {
    clearInterval(timerInterval);
    updateTime(timeOut); 
    shuffleQuestions(); 
    optionList.remove();

    if(!displayEndScorePage) {
        return;
    }

    quizHeader.textContent = "All done!";
    alignText(quizHeader, "left"); 
    quizDescription.textContent = "Your final score is: " + timeLeft;
    alignText(quizDescription, "left"); 
    mainBodyContent.append(quizDescription);

    mainBodyContent.append(saveScoreElement);
}

function resetDefaultPageText() {
    quizHeader.textContent = defaultQuizHeaderText;
    alignText(quizHeader, "center");
    quizDescription.textContent = defaultQuizDescriptionText;
    alignText(quizDescription, "center");

}

function onOptionButtonPress(event) {
    var buttonId = event.target.getAttribute(choiceAttribute);
    var correct = buttonId === questions[questionNumber].answer;
    if(!correct) {
        timeLeft = Math.max(timeLeft - 15, 0);
        if(timeLeft > 0) {
            updateTime(false);
        } else {
            endQuiz(true, true);
            displayQuestionResultSpan(correct, true);
            return; 
        }
    }

    if(!loadNextQuestion()) {
        endQuiz(false, true);
        displayQuestionResultSpan(correct, true);
        return;
    }

    displayQuestionResultSpan(correct, false);
}

function displayHighScores() {
    if(questionNumber === -1) {
        quizDescription.remove();
        startQuizButton.remove();
    } else if(questionNumber === questions.length) {
        quizDescription.remove();
        saveScoreElement.remove();
    } else {
        endQuiz(true, false);
    }

    mainBodyContent.append(scoreList);
    mainBodyContent.append(goBackButton);
    mainBodyContent.append(clearScoresButton);

    questionNumber = -1;
    timeLeft = 0;
    quizHeader.textContent = "High Scores";
}

buttons.forEach((button) => {
    button.addEventListener('click', onOptionButtonPress);
    var listItem = document.createElement("li");

    var choice = button.id.charAt(button.id.length - 1);
    button.setAttribute(choiceAttribute, choice);

    listItem.appendChild(button);
    optionList.appendChild(listItem);
});

startQuizButton.addEventListener('click', function(event) {
    loadNextQuestion();

    quizDescription.remove(); 
    startQuizButton.remove();
    alignText(quizHeader, "left");

    mainBodyContent.appendChild(optionList);
    timeLeft = 75;
    updateTime(false);
    timerInterval = setInterval(() => {
        timeLeft--;
        if(timeLeft <= 0) {
            endQuiz(true, true);
        } else {
            updateTime(false);
        }
    }, 1000); 
});
