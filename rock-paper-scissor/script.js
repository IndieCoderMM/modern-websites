const selectionButtons = document.querySelectorAll("[data-selection]");
const pScoreText = document.getElementById("p-score");
const aiScoreText = document.getElementById("ai-score");
const resultContainer = document.getElementsByClassName("result-history")[0];
// const playerBox = document.getElementById("player-selection");
// const aiBox = document.getElementById("ai-selection");

let pScore = 0;
let aiScore = 0;
const SELECTIONS = [
  {
    name: "rock",
    emoji: "✊",
    win: "scissors",
  },
  {
    name: "paper",
    emoji: "🖐",
    win: "rock",
  },
  {
    name: "scissors",
    emoji: "✌",
    win: "paper",
  },
];

selectionButtons.forEach((selectionButton) => {
  selectionButton.addEventListener("click", (e) => {
    const selectedName = selectionButton.dataset.selection;
    const selection = SELECTIONS.find(
      (selection) => selection.name === selectedName
    );
    makeSelection(selection);
  });
});

function makeSelection(selection) {
  // console.log(selection)
  const aiMove = aiSelection();
  const playerWins = isWinner(selection, aiMove);
  const aiWins = isWinner(aiMove, selection);
  if (playerWins) {
    pScore += 1;
    pScoreText.innerText = pScore;
  } else if (aiWins) {
    aiScore += 1;
    aiScoreText.innerText = aiScore;
  } else console.log("Draw!");
  const pDiv = createSelectionElement(selection.emoji, playerWins);
  const aiDiv = createSelectionElement(aiMove.emoji, aiWins);
  appendResultSelection(pDiv, aiDiv);
  deleteHistory(3);
}

function deleteHistory(max) {
  for (let i = resultContainer.childNodes.length - max; i > 0; i--) {
    const div = resultContainer.childNodes[i];
    resultContainer.removeChild(div);
  }
}

function appendResultSelection(playerDiv, aiDiv) {
  const elem = document.createElement("div");
  elem.appendChild(playerDiv);
  elem.appendChild(aiDiv);
  resultContainer.appendChild(elem);
}

function createSelectionElement(content, winner) {
  const elem = document.createElement("div");
  elem.innerHTML = content;
  elem.classList.add("result-selection");
  if (winner) {
    elem.classList.add("result-winner");
  }
  return elem;
}

function aiSelection() {
  const randIndex = Math.floor(Math.random() * SELECTIONS.length);
  return SELECTIONS[randIndex];
}

function isWinner(selection, oppoSelection) {
  return selection.win == oppoSelection.name;
}
