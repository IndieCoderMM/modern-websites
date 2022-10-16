const guessBoard = document.querySelector("[data-guess-board]");
const targetWord = "Lucky";

startInteraction();

function startInteraction() {
  document.addEventListener("click", handleClick);
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
  if (getActiveLetters().length >= 5) return;
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

function getActiveLetters() {
  return guessBoard.querySelectorAll('[data-state="active"]');
}
