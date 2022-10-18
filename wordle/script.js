import dictJson from "./dictionary.json" assert { type: "json" };
import puzzleJson from "./puzzle_words.json" assert { type: "json" };

const LOCAL_GAMES = "games";
const LOCAL_WINS = "wins";
const LOCAL_LAST_GAME = "lastGame";
const LOCAL_STREAK = "currentStreak";
const LOCAL_MAX_STREAK = "maxStreak";

if (localStorage.getItem(LOCAL_GAMES) == null) {
  initLocalStorage(
    LOCAL_GAMES,
    LOCAL_MAX_STREAK,
    LOCAL_STREAK,
    LOCAL_WINS,
    LOCAL_LAST_GAME
  );
}

const guessBoard = document.querySelector("[data-guess-board]");
const alertContainer = document.querySelector("[data-alert-container");
const keyboard = document.querySelector("[data-keyboard]");
const scoreboard = document.querySelector("[data-scoreboard]");
const nextGameBtn = document.querySelector("[data-next-btn]");

const dictionary = dictJson["1"];
const puzzleWords = puzzleJson["1"];
const WORD_LENGTH = 5;
const MAX_TRIAL = 6;

let totalSubmit = 0;
let targetWord = "lucky";
let victory = false;

startNewGame();

function updateStatistics() {
  let totalGames = getLocalData(LOCAL_GAMES) + 1;
  let currentWin = victory ? 1 : 0;
  let totalWins = getLocalData(LOCAL_WINS) + currentWin;
  let lastWin = getLocalData(LOCAL_LAST_GAME);
  let currentStreak =
    lastWin == 1 && victory ? getLocalData(LOCAL_STREAK) + 1 : currentWin;
  let maxStreak = getLocalData(LOCAL_MAX_STREAK);
  maxStreak = currentStreak > maxStreak ? currentStreak : maxStreak;

  localStorage.setItem(LOCAL_GAMES, totalGames);
  localStorage.setItem(LOCAL_WINS, totalWins);
  localStorage.setItem(LOCAL_LAST_GAME, currentWin);
  localStorage.setItem(LOCAL_STREAK, currentStreak);
  localStorage.setItem(LOCAL_MAX_STREAK, maxStreak);
}

function updateScoreboard() {
  scoreboard.querySelector("[data-games]").textContent =
    localStorage.getItem(LOCAL_GAMES);
  let winRate = getLocalData(LOCAL_WINS) / getLocalData(LOCAL_GAMES);

  scoreboard.querySelector("[data-win-rate]").textContent = winRate.toFixed(2);
  scoreboard.querySelector("[data-streak]").textContent =
    localStorage.getItem(LOCAL_STREAK);
  scoreboard.querySelector("[data-max-streak]").textContent =
    localStorage.getItem(LOCAL_MAX_STREAK);
}

function startNewGame() {
  victory = false;
  totalSubmit = 0;
  targetWord = getPuzzleWord();
  resetDisplay();
  startInteraction();
  scoreboard.classList.add("hide");
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
  nextGameBtn.removeEventListener("click", startNewGame);
}

function stopInteraction() {
  document.removeEventListener("click", handleClick);
  nextGameBtn.addEventListener("click", startNewGame);
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
    victory = true;
    updateStatistics();
    updateScoreboard();
    stopInteraction();
    setTimeout(() => {
      showScoreboard(`Guess Count : ${totalSubmit}`);
    }, 1000);
  } else if (totalSubmit >= MAX_TRIAL) {
    victory = false;
    updateStatistics();
    updateScoreboard();
    stopInteraction();
    setTimeout(() => {
      showScoreboard(`Correct Word : ${targetWord.toUpperCase()}`);
    }, 1000);
  }
}

function getActiveLetters() {
  return guessBoard.querySelectorAll('[data-state="active"]');
}

function resetDisplay() {
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
  scoreboard.classList.remove("hide");
  scoreboard.querySelector("[data-status]").textContent = status;
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

function initLocalStorage(...keys) {
  for (let key of keys) {
    if (localStorage.getItem(key) == null) {
      localStorage.setItem(key, 0);
      console.log("Set up storage for", key);
    }
  }
}

function getLocalData(key) {
  return parseInt(localStorage.getItem(key));
}

// getRandomWord();
