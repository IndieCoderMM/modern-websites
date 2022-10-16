const guessBoard = document.querySelector("[data-guess-board]");
const alertContainer = document.querySelector("[data-alert-container");
const keyboard = document.querySelector("[data-keyboard]");
const targetWord = "lucky";

const WORD_LENGTH = 5;
let totalSubmit = 0;

startInteraction();

function startInteraction() {
  document.addEventListener("click", handleClick);
}

function stopInteraction() {
  document.removeEventListener("click");
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
  totalSubmit++;
  activeLetters.forEach(highlightLetters);
  const guessWord = activeLetters.reduce(
    (word, item) => word + item.dataset.letter,
    ""
  );
  if (targetWord.toLowerCase() === guessWord.toLowerCase()) {
    showAlert("Congrats! You guessed the correct word.");
    stopInteraction();
  }
  if (totalSubmit == 6)
    showAlert(`The correct word is ${targetWord.toUpperCase()}`);
}

function getActiveLetters() {
  return guessBoard.querySelectorAll('[data-state="active"]');
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
