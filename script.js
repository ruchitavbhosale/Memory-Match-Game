let playerName = "";
let level = 1;
let chances = 3;
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let matches = 0;
let canClick = false;

const icons = ["🍎","🍌","🍇","🍓","🍒","🥝","🍍","🥥","🍉","🍋","🍑","🥭"];

function startGame() {
  const nameInput = document.getElementById("playerName").value.trim();
  if (nameInput === "") return alert("Enter your name!");
  playerName = nameInput;
  document.getElementById("startScreen").classList.remove("active");
  document.getElementById("gameScreen").classList.add("active");
  document.getElementById("playerDisplay").innerText = "Player: " + playerName;
  startLevel();
}

function startLevel() {
  document.getElementById("levelDisplay").innerText = level;
  chances = 3;
  document.getElementById("chanceDisplay").innerText = chances;

  firstCard = null;
  secondCard = null;
  matches = 0;
  canClick = false;

  const board = document.getElementById("gameBoard");
  board.innerHTML = "";

  let pairCount = level + 2; // level 1 = 3 pairs, level 2 = 4 pairs...
  let selectedIcons = icons.slice(0, pairCount);
  let cardArray = [...selectedIcons, ...selectedIcons];
  cardArray.sort(() => 0.5 - Math.random());

  let cols = Math.min(4, pairCount * 2);
  board.style.gridTemplateColumns = `repeat(${cols}, 100px)`;

  cardArray.forEach(icon => {
    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
      <div class="face front">${icon}</div>
      <div class="face back">❓</div>
    `;

    card.addEventListener("click", () => flipCard(card));
    board.appendChild(card);
  });

  // Show all cards at start
  const allCards = document.querySelectorAll(".card");
  allCards.forEach(c => c.classList.add("flip"));

  setTimeout(() => {
    allCards.forEach(c => c.classList.remove("flip"));
    canClick = true;
  }, 3000);
}

function flipCard(card) {
  if (!canClick || lockBoard || card === firstCard || card.classList.contains("matched")) return;

  card.classList.add("flip");

  if (!firstCard) {
    firstCard = card;
    return;
  }

  secondCard = card;
  checkMatch();
}

function checkMatch() {
  const icon1 = firstCard.querySelector(".front").innerText;
  const icon2 = secondCard.querySelector(".front").innerText;

  if (icon1 === icon2) {
    firstCard.classList.add("matched");
    secondCard.classList.add("matched");
    matches++;

    resetTurn();

    let totalPairs = level + 2;
    if (matches === totalPairs) {
      setTimeout(() => showPopup(true), 800);
    }
  } else {
    chances--;
    document.getElementById("chanceDisplay").innerText = chances;

    lockBoard = true;

    setTimeout(() => {
      firstCard.classList.remove("flip");
      secondCard.classList.remove("flip");
      resetTurn();

      if (chances === 0) {
        showPopup(false);
      }
    }, 1000);
  }
}

function resetTurn() {
  [firstCard, secondCard] = [null, null];
  lockBoard = false;
}

function showPopup(win) {
  const popup = document.getElementById("popup");
  const text = document.getElementById("popupText");

  if (win) {
    text.innerHTML = `🎉 Congratulations ${playerName}!<br>You passed Level ${level}!`;
    popup.dataset.result = "win";
  } else {
    text.innerHTML = `😢 Sorry ${playerName}!<br>You lost Level ${level}!`;
    popup.dataset.result = "lose";
  }

  popup.style.display = "flex";
}

function nextAction() {
  const popup = document.getElementById("popup");
  popup.style.display = "none";

  if (popup.dataset.result === "win") {
    level++;
    startLevel();
  } else {
    level = 1;
    document.getElementById("gameScreen").classList.remove("active");
    document.getElementById("startScreen").classList.add("active");
  }
}
