const canvas = document.querySelector('#game-board');
const ctx = canvas.getContext('2d');
const scoreEl = document.querySelector('#score');
const bestScoreEl = document.querySelector('#best-score');
const statusEl = document.querySelector('#status');
const startButton = document.querySelector('#start-button');
const pauseButton = document.querySelector('#pause-button');

const gridSize = 24;
const tileCount = canvas.width / gridSize;
const tickMs = 120;

let snake;
let food;
let direction;
let nextDirection;
let score;
let bestScore = Number(localStorage.getItem('snake-best-score') || 0);
let timer = null;
let running = false;
let paused = false;

bestScoreEl.textContent = bestScore;
resetGame();
draw();

startButton.addEventListener('click', () => {
  if (running) resetGame();
  startGame();
});

pauseButton.addEventListener('click', togglePause);

document.addEventListener('keydown', (event) => {
  const keyMap = {
    ArrowUp: 'up',
    ArrowDown: 'down',
    ArrowLeft: 'left',
    ArrowRight: 'right',
    w: 'up',
    s: 'down',
    a: 'left',
    d: 'right'
  };
  const mapped = keyMap[event.key];
  if (!mapped) return;
  event.preventDefault();
  changeDirection(mapped);
});

document.querySelectorAll('[data-direction]').forEach((button) => {
  button.addEventListener('click', () => changeDirection(button.dataset.direction));
});

function resetGame() {
  snake = [
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 }
  ];
  direction = 'right';
  nextDirection = 'right';
  score = 0;
  food = makeFood();
  scoreEl.textContent = score;
  statusEl.textContent = '准备好了。点击开始游戏，吃掉发光果实。';
  startButton.textContent = '开始游戏';
  pauseButton.textContent = '暂停';
  pauseButton.disabled = true;
  running = false;
  paused = false;
  clearInterval(timer);
}

function startGame() {
  clearInterval(timer);
  running = true;
  paused = false;
  startButton.textContent = '重新开始';
  pauseButton.disabled = false;
  pauseButton.textContent = '暂停';
  statusEl.textContent = '游戏进行中！使用方向键或屏幕按钮控制小蛇。';
  timer = setInterval(tick, tickMs);
  draw();
}

function togglePause() {
  if (!running) return;
  paused = !paused;
  pauseButton.textContent = paused ? '继续' : '暂停';
  statusEl.textContent = paused ? '已暂停。点击继续恢复游戏。' : '游戏进行中！';
}

function tick() {
  if (!running || paused) return;
  direction = nextDirection;
  const head = { ...snake[0] };

  if (direction === 'up') head.y -= 1;
  if (direction === 'down') head.y += 1;
  if (direction === 'left') head.x -= 1;
  if (direction === 'right') head.x += 1;

  if (isWallHit(head) || isSnakeHit(head)) {
    endGame();
    return;
  }

  snake.unshift(head);
  if (head.x === food.x && head.y === food.y) {
    score += 10;
    scoreEl.textContent = score;
    food = makeFood();
  } else {
    snake.pop();
  }
  draw();
}

function changeDirection(newDirection) {
  const opposite = { up: 'down', down: 'up', left: 'right', right: 'left' };
  if (opposite[direction] === newDirection) return;
  nextDirection = newDirection;
}

function makeFood() {
  let candidate;
  do {
    candidate = {
      x: Math.floor(Math.random() * tileCount),
      y: Math.floor(Math.random() * tileCount)
    };
  } while (snake.some((part) => part.x === candidate.x && part.y === candidate.y));
  return candidate;
}

function isWallHit(head) {
  return head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount;
}

function isSnakeHit(head) {
  return snake.some((part) => part.x === head.x && part.y === head.y);
}

function endGame() {
  clearInterval(timer);
  running = false;
  pauseButton.disabled = true;
  startButton.textContent = '再玩一次';
  if (score > bestScore) {
    bestScore = score;
    localStorage.setItem('snake-best-score', String(bestScore));
    bestScoreEl.textContent = bestScore;
    statusEl.textContent = `新纪录！最终得分 ${score}。点击再玩一次继续挑战。`;
  } else {
    statusEl.textContent = `游戏结束，最终得分 ${score}。点击再玩一次。`;
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawGrid();
  drawFood();
  drawSnake();
}

function drawGrid() {
  ctx.fillStyle = '#020617';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = 'rgba(148, 163, 184, 0.08)';
  ctx.lineWidth = 1;
  for (let i = 0; i <= tileCount; i += 1) {
    const p = i * gridSize;
    ctx.beginPath();
    ctx.moveTo(p, 0);
    ctx.lineTo(p, canvas.height);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, p);
    ctx.lineTo(canvas.width, p);
    ctx.stroke();
  }
}

function drawSnake() {
  snake.forEach((part, index) => {
    const gradient = ctx.createLinearGradient(
      part.x * gridSize,
      part.y * gridSize,
      (part.x + 1) * gridSize,
      (part.y + 1) * gridSize
    );
    gradient.addColorStop(0, index === 0 ? '#bbf7d0' : '#86efac');
    gradient.addColorStop(1, index === 0 ? '#22c55e' : '#16a34a');
    ctx.fillStyle = gradient;
    roundRect(part.x * gridSize + 2, part.y * gridSize + 2, gridSize - 4, gridSize - 4, 7);
  });
}

function drawFood() {
  const centerX = food.x * gridSize + gridSize / 2;
  const centerY = food.y * gridSize + gridSize / 2;
  const glow = ctx.createRadialGradient(centerX, centerY, 2, centerX, centerY, 18);
  glow.addColorStop(0, '#fef3c7');
  glow.addColorStop(0.45, '#fb923c');
  glow.addColorStop(1, 'rgba(251, 146, 60, 0)');
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(centerX, centerY, 18, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#f97316';
  ctx.beginPath();
  ctx.arc(centerX, centerY, 8, 0, Math.PI * 2);
  ctx.fill();
}

function roundRect(x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + width, y, x + width, y + height, radius);
  ctx.arcTo(x + width, y + height, x, y + height, radius);
  ctx.arcTo(x, y + height, x, y, radius);
  ctx.arcTo(x, y, x + width, y, radius);
  ctx.closePath();
  ctx.fill();
}
