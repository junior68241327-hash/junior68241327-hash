const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
function playSound(frequency, duration) {
  const audio = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audio.createOscillator();
  const gain = audio.createGain();

  oscillator.connect(gain);
  gain.connect(audio.destination);

  oscillator.frequency.value = frequency;
  gain.gain.value = 0.1;

  oscillator.start();

  gain.gain.exponentialRampToValueAtTime(
    0.001,
    audio.currentTime + duration
  );

  oscillator.stop(audio.currentTime + duration);
}

function eatSound() {
  playSound(600, 0.15);
}

function gameOverSound() {
  playSound(150, 0.5);
}
const box = 20;

let snake;
let food;
let direction;
let score;
let level;
let game;
let paused = false;
let gameOver = false;

let highScore = localStorage.getItem("snakeHighScore") || 0;

function startGame() {
  snake = [
    { x: 200, y: 200 },
    { x: 180, y: 200 },
    { x: 160, y: 200 }
  ];

  direction = "RIGHT";
  score = 0;
  level = 1;
  paused = false;
  gameOver = false;

  updateInfo();
  createFood();

  clearInterval(game);
  game = setInterval(drawGame, 150);

  hideGameOver();
}

function createFood() {
  food = {
    x: Math.floor(Math.random() * (canvas.width / box)) * box,
    y: Math.floor(Math.random() * (canvas.height / box)) * box
  };
}

function changeDirection(newDirection) {
  if (paused || gameOver) return;

  if (newDirection === "UP" && direction !== "DOWN") {
    direction = "UP";
  }

  if (newDirection === "DOWN" && direction !== "UP") {
    direction = "DOWN";
  }

  if (newDirection === "LEFT" && direction !== "RIGHT") {
    direction = "LEFT";
  }

  if (newDirection === "RIGHT" && direction !== "LEFT") {
    direction = "RIGHT";
  }
}

document.addEventListener("keydown", function(event) {
  if (event.key === "ArrowUp") changeDirection("UP");
  if (event.key === "ArrowDown") changeDirection("DOWN");
  if (event.key === "ArrowLeft") changeDirection("LEFT");
  if (event.key === "ArrowRight") changeDirection("RIGHT");

  if (event.key === " " || event.key === "p") {
    togglePause();
  }
});

function drawGame() {
  ctx.fillStyle = "#222";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  snake.forEach((part, index) => {
    ctx.fillStyle = index === 0 ? "lime" : "green";
    ctx.fillRect(part.x, part.y, box, box);
  });

  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, box, box);

  if (paused || gameOver) return;

  let headX = snake[0].x;
  let headY = snake[0].y;

  if (direction === "UP") headY -= box;
  if (direction === "DOWN") headY += box;
  if (direction === "LEFT") headX -= box;
  if (direction === "RIGHT") headX += box;

  if (
    headX < 0 ||
    headY < 0 ||
    headX >= canvas.width ||
    headY >= canvas.height ||
    hitSnake(headX, headY)
  ) {
    endGame();
    return;
  }

  const newHead = {
    x: headX,
    y: headY
  };

  snake.unshift(newHead);

  if (headX === food.x && headY === food.y) {
  score++;
  eatSound();

    if (score % 5 === 0) {
      level++;
      changeSpeed();
    }

    if (score > highScore) {
      highScore = score;
      localStorage.setItem("snakeHighScore", highScore);
    }

    updateInfo();
    createFood();
  } else {
    snake.pop();
  }
}

function hitSnake(x, y) {
  for (let i = 0; i < snake.length; i++) {
    if (snake[i].x === x && snake[i].y === y) {
      return true;
    }
  }

  return false;
}

function changeSpeed() {
  clearInterval(game);

  let speed = 200;

  game = setInterval(drawGame, speed);
}

function togglePause() {
  if (gameOver) return;

  paused = !paused;

  const pauseButton = document.getElementById("pause");

  if (pauseButton) {
    pauseButton.textContent = paused ? "▶️ Resume" : "⏸️ Pause";
  }
}

function updateInfo() {
  const scoreElement = document.getElementById("score");
  const levelElement = document.getElementById("level");
  const highScoreElement = document.getElementById("highScore");

  if (scoreElement) scoreElement.textContent = score;
  if (levelElement) levelElement.textContent = level;
  if (highScoreElement) highScoreElement.textContent = highScore;
}

function endGame() {
  clearInterval(game);
  gameOver = true;
gameOverSound();
  const finalScore = document.getElementById("finalScore");

  if (finalScore) {
    finalScore.textContent = score;
  }

  const gameOverScreen = document.getElementById("gameOver");

  if (gameOverScreen) {
    gameOverScreen.style.display = "flex";
  }
}

function hideGameOver() {
  const gameOverScreen = document.getElementById("gameOver");

  if (gameOverScreen) {
    gameOverScreen.style.display = "none";
  }
}

document.getElementById("restart").addEventListener("click", startGame);

const pauseButton = document.getElementById("pause");

if (pauseButton) {
  pauseButton.addEventListener("click", togglePause);
}

const gameOverRestart = document.getElementById("gameOverRestart");

if (gameOverRestart) {
  gameOverRestart.addEventListener("click", startGame);
}

startGame();
