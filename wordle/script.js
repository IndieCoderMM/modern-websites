import dictJson from "./dictionary.json" assert { type: "json" };
import puzzleJson from "./puzzle_words.json" assert { type: "json" };

const LOCAL_GAMES = "games";
const LOCAL_WIN_RATE = "winRate";
const LOCAL_STREAK = "currentStreak";
const LOCAL_MAX_STREAK = "maxStreak";

const guessBoard = document.querySelector("[data-guess-board]");
const alertContainer = document.querySelector("[data-alert-container");
const keyboard = document.querySelector("[data-keyboard]");
const scoreboard = document.querySelector("[data-scoreboard]");

const dictionary = dictJson["1"];
const puzzleWords = puzzleJson["1"];
const WORD_LENGTH = 5;
const MAX_TRIAL = 6;

let totalGames;
let winRate;
let currentStreak;
let MaxStreak;

let totalSubmit;
let targetWord;

initLocalStorage(LOCAL_GAMES, LOCAL_MAX_STREAK, LOCAL_STREAK, LOCAL_WIN_RATE);

startNewGame();

function initLocalStorage(...keys) {
  console.log(keys);
  for (let key of keys) {
    if (localStorage.getItem(key) == null) {
      console.log(key, "not exist!");
    }
  }
}

function startNewGame() {
  totalSubmit = 0;
  targetWord = getPuzzleWord();
  startInteraction();
}

function getPuzzleWord() {
  const index = Math.floor(Math.random() * puzzleWords.length);
  return puzzleWords[index];
}

function isWordExist(word) {
  return dictionary.includes(word);
}

function startInteraction() {
  document.addEventListener("click", handleClick);
}

function stopInteraction() {
  document.removeEventListener("click", handleClick);
}

function handleClick(e) {
  if (e.target.matches("[data-key]")) {
    pressKey(e.target.dataset.key);
    return;
  }

  if (e.target.matches("[data-enter]")) {
    submitGuess();
    return;
  }

  if (e.target.matches("[data-delete]")) {
    deleteLetter();
    return;
  }
}

function pressKey(key) {
  if (getActiveLetters().length >= WORD_LENGTH) return;
  const currentLetter = guessBoard.querySelector(":not([data-letter])");
  currentLetter.dataset.letter = key.toLowerCase();
  currentLetter.textContent = key;
  currentLetter.dataset.state = "active";
}

function deleteLetter() {
  const activeLetters = [...getActiveLetters()];
  if (activeLetters.length < 1) return;
  activeLetters[activeLetters.length - 1].textContent = "";
  delete activeLetters[activeLetters.length - 1].dataset.letter;
  delete activeLetters[activeLetters.length - 1].dataset.state;
}

function submitGuess() {
  const activeLetters = [...getActiveLetters()];
  if (activeLetters.length < WORD_LENGTH) {
    showAlert("Not enough letters!");
    return;
  }
  const guessWord = activeLetters.reduce(
    (word, item) => word + item.dataset.letter,
    ""
  );
  if (!isWordExist(guessWord)) {
    showAlert("Not in the word list!");
    return;
  }
  totalSubmit++;
  activeLetters.forEach(highlightLetters);
  if (targetWord.toLowerCase() === guessWord.toLowerCase()) {
    showScoreboard(`Guess Count : ${totalSubmit}`);
    stopInteraction();
  } else if (totalSubmit >= MAX_TRIAL) {
    showScoreboard(`Correct Word : ${targetWord.toUpperCase()}`);
    stopInteraction();
  }
}

function getActiveLetters() {
  return guessBoard.querySelectorAll('[data-state="active"]');
}

function resetGame() {
  const inputLetters = [...guessBoard.querySelectorAll("[data-letter]")];
  const keys = [...keyboard.querySelectorAll("[data-key]")];
  inputLetters.forEach((letter) => {
    letter.textContent = "";
    delete letter.dataset.state;
    delete letter.dataset.letter;
  });
  keys.forEach((key) => {
    key.classList.remove("correct", "wrong-location", "wrong");
  });
}

function showScoreboard(status) {
  const nextButton = scoreboard.querySelector("[data-next-btn]");
  scoreboard.classList.remove("hide");
  scoreboard.querySelector("[data-status]").textContent = status;
  nextButton.addEventListener("click", () => {
    scoreboard.classList.add("hide");
    resetGame();
    startNewGame();
  });
}

function showAlert(message, duration = 1000) {
  const alert = document.createElement("div");
  alert.textContent = message;
  alert.classList.add("alert");
  alertContainer.prepend(alert);
  if (duration == null) return;

  setTimeout(() => {
    alert.classList.add("hide");
    alert.addEventListener("transitionend", () => {
      alert.remove();
    });
  }, duration);
}

function highlightLetters(item, index, activeLetters) {
  const letter = item.dataset.letter;
  const key = keyboard.querySelector(`[data-key=${letter.toUpperCase()}`);
  if (targetWord[index] === letter) {
    activeLetters[index].dataset.state = "correct";
    key.classList.add("correct");
  } else if (targetWord.includes(letter)) {
    activeLetters[index].dataset.state = "wrong-location";
    key.classList.add("wrong-location");
  } else {
    activeLetters[index].dataset.state = "wrong";
    key.classList.add("wrong");
  }
}

function getRandomWord() {
  return fetch("http://localhost:5000/random-word")
    .then((response) => {
      console.log(response);
      response.json();
    })
    .then((json) => {
      console.log(json);
      targetWord = json.toLowerCase();
    })
    .catch((error) => {
      console.log(error);
      targetWord = "error";
    });
}

// getRandomWord();
