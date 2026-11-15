const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const box = 20;
const speed = 150;

let snake;
let food;
let direction;
let score = 0;
let level = 1;
let game;
let paused = false;
let gameOver = false;
let audio;

let highScore = Number(localStorage.getItem("snakeHighScore")) || 0;

// SOUND SYSTEM
function playSound(frequency, duration) {
  try {
    const AudioContextClass =
      window.AudioContext || window.webkitAudioContext;

    if (!AudioContextClass) return;

    if (!audio) {
      audio = new AudioContextClass();
    }

    if (audio.state === "suspended") {
      audio.resume();
    }

    const oscillator = audio.createOscillator();
    const gain = audio.createGain();

    oscillator.connect(gain);
    gain.connect(audio.destination);

    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0.1, audio.currentTime);
    gain.gain.exponentialRampToValueAtTime(
      0.001,
      audio.currentTime + duration
    );

    oscillator.start();
    oscillator.stop(audio.currentTime + duration);
  } catch (error) {
    console.log("Sound error:", error);
  }
}

function eatSound() {
  playSound(600, 0.15);
}

function gameOverSound() {
  playSound(150, 0.5);
}

// START GAME
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
  game = setInterval(drawGame, speed);

  const pauseButton = document.getElementById("pause");
  if (pauseButton) {
    pauseButton.textContent = "⏸️ Pause";
  }

  hideGameOver();
  drawGame();
}

// CREATE FOOD
function createFood() {
  let newFood;

  do {
    newFood = {
      x: Math.floor(Math.random() * (canvas.width / box)) * box,
      y: Math.floor(Math.random() * (canvas.height / box)) * box
    };
  } while (
    snake.some(part =>
      part.x === newFood.x && part.y === newFood.y
    )
  );

  food = newFood;
}

// CHANGE DIRECTION
function changeDirection(newDirection) {
  if (paused || gameOver) return;

  if (newDirection === "UP" && direction !== "DOWN") {
    direction = "UP";
  } else if (newDirection === "DOWN" && direction !== "UP") {
    direction = "DOWN";
  } else if (newDirection === "LEFT" && direction !== "RIGHT") {
    direction = "LEFT";
  } else if (newDirection === "RIGHT" && direction !== "LEFT") {
    direction = "RIGHT";
  }
}

// KEYBOARD CONTROLS
document.addEventListener("keydown", function(event) {
  if (event.key === "ArrowUp") changeDirection("UP");
  if (event.key === "ArrowDown") changeDirection("DOWN");
  if (event.key === "ArrowLeft") changeDirection("LEFT");
  if (event.key === "ArrowRight") changeDirection("RIGHT");

  if (event.key === " " || event.key.toLowerCase() === "p") {
    event.preventDefault();
    togglePause();
  }
});

// DRAW GAME
function drawGame() {
  ctx.fillStyle = "#222";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (!snake || !food) return;

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

  const eating = headX === food.x && headY === food.y;

  if (
    headX < 0 ||
    headY < 0 ||
    headX >= canvas.width ||
    headY >= canvas.height ||
    hitSnake(headX, headY, eating)
  ) {
    endGame();
    return;
  }

  snake.unshift({ x: headX, y: headY });

  if (eating) {
    score++;
    eatSound();

    level = Math.floor(score / 5) + 1;

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

// CHECK COLLISION
function hitSnake(x, y, eating) {
  const body = eating ? snake : snake.slice(0, -1);

  return body.some(part => part.x === x && part.y === y);
}

// PAUSE AND RESUME
function togglePause() {
  if (gameOver) return;

  paused = !paused;

  const pauseButton = document.getElementById("pause");

  if (pauseButton) {
    pauseButton.textContent = paused ? "▶️ Resume" : "⏸️ Pause";
  }

  if (!paused) {
    drawGame();
  }
}

// UPDATE SCORE
function updateInfo() {
  const scoreElement = document.getElementById("score");
  const levelElement = document.getElementById("level");
  const highScoreElement = document.getElementById("highScore");

  if (scoreElement) scoreElement.textContent = score;
  if (levelElement) levelElement.textContent = level;
  if (highScoreElement) highScoreElement.textContent = highScore;
}

// GAME OVER
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

// HIDE GAME OVER
function hideGameOver() {
  const gameOverScreen = document.getElementById("gameOver");

  if (gameOverScreen) {
    gameOverScreen.style.display = "none";
  }
}

// BUTTONS
const restartButton = document.getElementById("restart");
if (restartButton) {
  restartButton.addEventListener("click", startGame);
}

const pauseButton = document.getElementById("pause");
if (pauseButton) {
  pauseButton.addEventListener("click", togglePause);
}

const gameOverRestart = document.getElementById("gameOverRestart");
if (gameOverRestart) {
  gameOverRestart.addEventListener("click", startGame);
}

// START
startGame();
