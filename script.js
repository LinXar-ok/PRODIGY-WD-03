const cells = document.querySelectorAll(".cell");
const gameStatus = document.getElementById("gameStatus");
const restartBtn = document.getElementById("restartBtn");
const difficultySelector = document.getElementById("difficulty");
const aiModeBtn = document.getElementById("aiModeBtn");
const playerModeBtn = document.getElementById("playerModeBtn");
const difficultyContainer = document.getElementById("difficultyContainer");

let currentPlayer = "X";
let gameState = Array(9).fill("");
let gameActive = true;
let isVsAI = true;

const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

aiModeBtn.addEventListener("click", () => {
  isVsAI = true;
  difficultyContainer.style.display = "block";
  restartGame();
});

playerModeBtn.addEventListener("click", () => {
  isVsAI = false;
  difficultyContainer.style.display = "none";
  restartGame();
});

cells.forEach((cell) => {
  cell.addEventListener("click", handleClick);
});

function handleClick(e) {
  const cell = e.target;
  const index = cell.getAttribute("data-index");

  if (gameState[index] !== "" || !gameActive) {
    return;
  }

  gameState[index] = currentPlayer;
  cell.textContent = currentPlayer;

  if (checkWinner()) {
    gameStatus.textContent = `Player ${currentPlayer} wins!`;
    gameActive = false;
  } else if (gameState.every((cell) => cell !== "")) {
    gameStatus.textContent = "It's a tie!";
    gameActive = false;
  } else {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    gameStatus.textContent = `Player ${currentPlayer}'s turn`;

    if (isVsAI && currentPlayer === "O") {
      setTimeout(makeAIMove, 600);
    }
  }
}

function checkWinner() {
  return winningCombinations.some((combination) => {
    return combination.every((index) => gameState[index] === currentPlayer);
  });
}

restartBtn.addEventListener("click", restartGame);

function restartGame() {
  gameState.fill("");
  gameActive = true;
  currentPlayer = "X";
  gameStatus.textContent = `Player ${currentPlayer}'s turn`;
  cells.forEach((cell) => {
    cell.textContent = "";
  });
}

// Function for Move based on selected difficulty
function makeAIMove() {
  const difficulty = difficultySelector.value;

  if (difficulty === "easy") {
    makeBasicAIMove();
  } else {
    makeSmartAIMove();
  }
}

// Basic AI
function makeBasicAIMove() {
  if (!gameActive) return;

  let availableCells = [];
  gameState.forEach((cell, index) => {
    if (cell === "") {
      availableCells.push(index);
    }
  });

  if (availableCells.length > 0) {
    const randomIndex =
      availableCells[Math.floor(Math.random() * availableCells.length)];
    gameState[randomIndex] = currentPlayer;
    cells[randomIndex].textContent = currentPlayer;

    if (checkWinner()) {
      gameStatus.textContent = `Player ${currentPlayer} wins!`;
      gameActive = false;
    } else if (gameState.every((cell) => cell !== "")) {
      gameStatus.textContent = "It's a tie!";
      gameActive = false;
    } else {
      currentPlayer = "X";
      gameStatus.textContent = `Player ${currentPlayer}'s turn`;
    }
  }
}

// Smart AI using Minimax
function makeSmartAIMove() {
  if (!gameActive) return;

  const bestMove = findBestMove(gameState);
  gameState[bestMove] = currentPlayer;
  cells[bestMove].textContent = currentPlayer;

  if (checkWinner()) {
    gameStatus.textContent = `Player ${currentPlayer} wins!`;
    gameActive = false;
  } else if (gameState.every((cell) => cell !== "")) {
    gameStatus.textContent = "It's a tie!";
    gameActive = false;
  } else {
    currentPlayer = "X";
    gameStatus.textContent = `Player ${currentPlayer}'s turn`;
  }
}

function findBestMove(board) {
  let bestScore = -Infinity;
  let move = -1;

  board.forEach((cell, index) => {
    if (cell === "") {
      board[index] = currentPlayer;
      let score = minimax(board, 0, false);
      board[index] = "";

      if (score > bestScore) {
        bestScore = score;
        move = index;
      }
    }
  });

  return move;
}

function minimax(board, depth, isMaximizing) {
  let scores = {
    X: -1,
    O: 1,
    tie: 0,
  };

  let winner = checkWinnerAI(board);
  if (winner !== null) {
    return scores[winner];
  }

  if (isMaximizing) {
    let bestScore = -Infinity;
    board.forEach((cell, index) => {
      if (cell === "") {
        board[index] = "O";
        let score = minimax(board, depth + 1, false);
        board[index] = "";
        bestScore = Math.max(score, bestScore);
      }
    });
    return bestScore;
  } else {
    let bestScore = Infinity;
    board.forEach((cell, index) => {
      if (cell === "") {
        board[index] = "X";
        let score = minimax(board, depth + 1, true);
        board[index] = "";
        bestScore = Math.min(score, bestScore);
      }
    });
    return bestScore;
  }
}

function checkWinnerAI(board) {
  for (let combination of winningCombinations) {
    const [a, b, c] = combination;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }

  if (board.every((cell) => cell !== "")) {
    return "tie";
  }

  return null;
}
