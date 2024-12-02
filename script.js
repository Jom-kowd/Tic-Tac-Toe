const board = document.getElementById("board");
const status = document.getElementById("status");
const modeSelection = document.getElementById("mode-selection");
const difficultySelection = document.getElementById("difficulty-selection");
const gameContainer = document.getElementById("game");

let gameBoard = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameActive = true;
let mode = "single"; // Default mode
let difficulty = "easy"; // Default difficulty

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

function initializeGame() {
    board.innerHTML = "";
    gameBoard = ["", "", "", "", "", "", "", "", ""];
    gameActive = true;
    currentPlayer = "X";
    status.textContent = mode === "single" ? "Your turn!" : "Player X's turn!";
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.dataset.index = i;
        cell.addEventListener("click", handleMove);
        board.appendChild(cell);
    }
}

function setMode(selectedMode) {
    mode = selectedMode;
    modeSelection.style.display = "none";
    if (mode === "single") {
        difficultySelection.style.display = "block";
    } else {
        startGame();
    }
}

function setDifficulty(selectedDifficulty) {
    difficulty = selectedDifficulty;
    difficultySelection.style.display = "none";
    startGame();
}

function startGame() {
    gameContainer.style.display = "block";
    initializeGame();
}

function handleMove(event) {
    const index = event.target.dataset.index;
    if (gameBoard[index] !== "" || !gameActive) return;

    gameBoard[index] = currentPlayer;
    event.target.textContent = currentPlayer;
    event.target.classList.add("taken");

    if (checkWin(currentPlayer)) {
        status.textContent = `${currentPlayer === "X" ? "You" : "Bot"} win!`;
        gameActive = false;
        return;
    }

    if (isDraw()) {
        status.textContent = "It's a draw!";
        gameActive = false;
        return;
    }

    currentPlayer = currentPlayer === "X" ? "O" : "X";
    status.textContent = mode === "single" 
        ? currentPlayer === "X" ? "Your turn!" : "Bot's turn..."
        : `Player ${currentPlayer}'s turn!`;

    if (mode === "single" && currentPlayer === "O") {
        setTimeout(botMove, 500);
    }
}

function botMove() {
    if (!gameActive) return;

    let moveIndex;
    if (difficulty === "easy") {
        moveIndex = gameBoard.findIndex(cell => cell === "");
    } else if (difficulty === "medium") {
        moveIndex = mediumBotLogic();
    } else {
        moveIndex = hardBotLogic();
    }

    if (moveIndex !== -1) {
        gameBoard[moveIndex] = currentPlayer;
        const cell = document.querySelector(`[data-index='${moveIndex}']`);
        cell.textContent = currentPlayer;
        cell.classList.add("taken");
    }

    if (checkWin(currentPlayer)) {
        status.textContent = "Bot wins!";
        gameActive = false;
        return;
    }

    if (isDraw()) {
        status.textContent = "It's a draw!";
        gameActive = false;
        return;
    }

    currentPlayer = "X";
    status.textContent = "Your turn!";
}

function mediumBotLogic() {
    // Medium bot will block or pick randomly
    for (let combo of winningCombinations) {
        let [a, b, c] = combo;
        if (gameBoard[a] === "O" && gameBoard[b] === "O" && gameBoard[c] === "") return c;
        if (gameBoard[a] === "O" && gameBoard[c] === "O" && gameBoard[b] === "") return b;
        if (gameBoard[b] === "O" && gameBoard[c] === "O" && gameBoard[a] === "") return a;
    }
    return gameBoard.findIndex(cell => cell === "");
}

function hardBotLogic() {
    // Hard bot will try to win or block the player
    for (let combo of winningCombinations) {
        let [a, b, c] = combo;
        if (gameBoard[a] === "O" && gameBoard[b] === "O" && gameBoard[c] === "") return c;
        if (gameBoard[a] === "O" && gameBoard[c] === "O" && gameBoard[b] === "") return b;
        if (gameBoard[b] === "O" && gameBoard[c] === "O" && gameBoard[a] === "") return a;
        if (gameBoard[a] === "X" && gameBoard[b] === "X" && gameBoard[c] === "") return c;
        if (gameBoard[a] === "X" && gameBoard[c] === "X" && gameBoard[b] === "") return b;
        if (gameBoard[b] === "X" && gameBoard[c] === "X" && gameBoard[a] === "") return a;
    }
    return gameBoard.findIndex(cell => cell === "");
}

function checkWin(player) {
    return winningCombinations.some(combo => combo.every(index => gameBoard[index] === player));
}

function isDraw() {
    return gameBoard.every(cell => cell !== "");
}

function resetGame() {
    startGame();
}

document.addEventListener("DOMContentLoaded", () => {
    modeSelection.style.display = "block";
});