const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const box = 20;

let snake;
let food;
let direction;
let score;
let game;

function startGame() {
  snake = [
    { x: 200, y: 200 },
    { x: 180, y: 200 },
    { x: 160, y: 200 }
  ];

  direction = "RIGHT";
  score = 0;

  document.getElementById("score").textContent = score;

  createFood();

  clearInterval(game);
  game = setInterval(drawGame, 100);
}

function createFood() {
  food = {
    x: Math.floor(Math.random() * (canvas.width / box)) * box,
    y: Math.floor(Math.random() * (canvas.height / box)) * box
  };
}

document.addEventListener("keydown", changeDirection);

function changeDirection(event) {
  const key = event.key;

  if (key === "ArrowUp" && direction !== "DOWN") {
    direction = "UP";
  } else if (key === "ArrowDown" && direction !== "UP") {
    direction = "DOWN";
  } else if (key === "ArrowLeft" && direction !== "RIGHT") {
    direction = "LEFT";
  } else if (key === "ArrowRight" && direction !== "LEFT") {
    direction = "RIGHT";
  }
}

function drawGame() {
  ctx.fillStyle = "#222";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw snake
  snake.forEach((part, index) => {
    ctx.fillStyle = index === 0 ? "lime" : "green";
    ctx.fillRect(part.x, part.y, box, box);
  });

  // Draw food
  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, box, box);

  let headX = snake[0].x;
  let headY = snake[0].y;

  if (direction === "UP") headY -= box;
  if (direction === "DOWN") headY += box;
  if (direction === "LEFT") headX -= box;
  if (direction === "RIGHT") headX += box;

  // Game over if snake hits wall
  if (
    headX < 0 ||
    headY < 0 ||
    headX >= canvas.width ||
    headY >= canvas.height ||
    hitSnake(headX, headY)
  ) {
    clearInterval(game);
    alert("Game Over! Your score: " + score);
    return;
  }

  const newHead = {
    x: headX,
    y: headY
  };

  snake.unshift(newHead);

  // Eat food
  if (headX === food.x && headY === food.y) {
    score++;
    document.getElementById("score").textContent = score;
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

document.getElementById("restart").addEventListener("click", startGame);

startGame();
