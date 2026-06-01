const board = document.querySelector("#game-board");
const ctx = board.getContext("2d");
const scoreElement = document.querySelector("#score");
const bestScoreElement = document.querySelector("#best-score");
const messageElement = document.querySelector("#message");
const startButton = document.querySelector("#start-button");
const pauseButton = document.querySelector("#pause-button");
const touchButtons = document.querySelectorAll("[data-direction]");

const gridSize = 20;
const tileCount = board.width / gridSize;
const initialSnake = [
  { x: 10, y: 10 },
  { x: 9, y: 10 },
  { x: 8, y: 10 },
];

const directions = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

const keyMap = {
  ArrowUp: "up",
  KeyW: "up",
  ArrowDown: "down",
  KeyS: "down",
  ArrowLeft: "left",
  KeyA: "left",
  ArrowRight: "right",
  KeyD: "right",
};

let snake;
let food;
let direction;
let nextDirection;
let score;
let bestScore = loadBestScore();
let gameTimer;
let isRunning = false;
let isPaused = false;

function loadBestScore() {
  try {
    return Number(localStorage.getItem("snake-best-score")) || 0;
  } catch {
    return 0;
  }
}

function saveBestScore(value) {
  try {
    localStorage.setItem("snake-best-score", String(value));
    return true;
  } catch {
    return false;
  }
}

bestScoreElement.textContent = bestScore;
resetGame();
drawGame();

function resetGame() {
  snake = initialSnake.map((segment) => ({ ...segment }));
  direction = directions.right;
  nextDirection = directions.right;
  score = 0;
  scoreElement.textContent = score;
  food = createFood();
}

function startGame() {
  clearInterval(gameTimer);
  resetGame();
  isRunning = true;
  isPaused = false;
  startButton.textContent = "重新开始";
  pauseButton.disabled = false;
  pauseButton.textContent = "暂停";
  messageElement.textContent = "加油！继续吃果实";
  gameTimer = setInterval(updateGame, 115);
  drawGame();
}

function togglePause() {
  if (!isRunning) return;

  isPaused = !isPaused;
  pauseButton.textContent = isPaused ? "继续" : "暂停";
  messageElement.textContent = isPaused ? "游戏已暂停" : "继续前进！";
}

function updateGame() {
  if (isPaused) return;

  direction = nextDirection;
  const head = {
    x: snake[0].x + direction.x,
    y: snake[0].y + direction.y,
  };

  if (hasCollision(head)) {
    endGame();
    return;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score += 10;
    scoreElement.textContent = score;
    food = createFood();
  } else {
    snake.pop();
  }

  drawGame();
}

function endGame() {
  clearInterval(gameTimer);
  isRunning = false;
  pauseButton.disabled = true;
  startButton.textContent = "再玩一次";

  if (score > bestScore) {
    bestScore = score;
    const saved = saveBestScore(bestScore);
    bestScoreElement.textContent = bestScore;
    messageElement.textContent = saved
      ? `新纪录：${score} 分！按空格再来一局`
      : `新纪录：${score} 分！当前浏览器未允许保存最高分`;
  } else {
    messageElement.textContent = `游戏结束：${score} 分。按空格重新开始`;
  }

  drawGame();
}

function createFood() {
  let nextFood;

  do {
    nextFood = {
      x: Math.floor(Math.random() * tileCount),
      y: Math.floor(Math.random() * tileCount),
    };
  } while (snake.some((segment) => segment.x === nextFood.x && segment.y === nextFood.y));

  return nextFood;
}

function hasCollision(head) {
  const wallHit = head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount;
  const bodyHit = snake.some((segment) => segment.x === head.x && segment.y === head.y);
  return wallHit || bodyHit;
}

function changeDirection(directionName) {
  const requested = directions[directionName];
  const reversing = requested.x + direction.x === 0 && requested.y + direction.y === 0;

  if (!reversing) {
    nextDirection = requested;
  }
}

function drawGame() {
  drawBoard();
  drawFood();
  drawSnake();
}

function drawBoard() {
  ctx.fillStyle = "#081521";
  ctx.fillRect(0, 0, board.width, board.height);

  ctx.strokeStyle = "rgba(255, 255, 255, 0.045)";
  ctx.lineWidth = 1;

  for (let position = 0; position <= board.width; position += gridSize) {
    ctx.beginPath();
    ctx.moveTo(position, 0);
    ctx.lineTo(position, board.height);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, position);
    ctx.lineTo(board.width, position);
    ctx.stroke();
  }
}

function drawSnake() {
  snake.forEach((segment, index) => {
    const gradient = ctx.createLinearGradient(
      segment.x * gridSize,
      segment.y * gridSize,
      (segment.x + 1) * gridSize,
      (segment.y + 1) * gridSize,
    );

    gradient.addColorStop(0, index === 0 ? "#bcffd7" : "#5cf2a4");
    gradient.addColorStop(1, index === 0 ? "#5cf2a4" : "#1aa36c");
    ctx.fillStyle = gradient;
    roundRect(segment.x * gridSize + 2, segment.y * gridSize + 2, gridSize - 4, gridSize - 4, 6);
  });
}

function drawFood() {
  const centerX = food.x * gridSize + gridSize / 2;
  const centerY = food.y * gridSize + gridSize / 2;
  const glow = ctx.createRadialGradient(centerX, centerY, 2, centerX, centerY, gridSize);

  glow.addColorStop(0, "#fff4b8");
  glow.addColorStop(0.45, "#f9d15f");
  glow.addColorStop(1, "rgba(249, 209, 95, 0)");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(centerX, centerY, gridSize * 0.72, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#f9d15f";
  ctx.beginPath();
  ctx.arc(centerX, centerY, gridSize * 0.32, 0, Math.PI * 2);
  ctx.fill();
}

function roundRect(x, y, width, height, radius) {
  if (typeof ctx.roundRect === "function") {
    ctx.beginPath();
    ctx.roundRect(x, y, width, height, radius);
    ctx.fill();
    return;
  }

  const right = x + width;
  const bottom = y + height;

  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(right - radius, y);
  ctx.quadraticCurveTo(right, y, right, y + radius);
  ctx.lineTo(right, bottom - radius);
  ctx.quadraticCurveTo(right, bottom, right - radius, bottom);
  ctx.lineTo(x + radius, bottom);
  ctx.quadraticCurveTo(x, bottom, x, bottom - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.fill();
}

startButton.addEventListener("click", startGame);
pauseButton.addEventListener("click", togglePause);

touchButtons.forEach((button) => {
  button.addEventListener("click", () => changeDirection(button.dataset.direction));
});

document.addEventListener("keydown", (event) => {
  if (event.code === "Space") {
    event.preventDefault();
    startGame();
    return;
  }

  if (event.code === "KeyP") {
    togglePause();
    return;
  }

  const directionName = keyMap[event.code];

  if (directionName) {
    event.preventDefault();
    changeDirection(directionName);
  }
});
