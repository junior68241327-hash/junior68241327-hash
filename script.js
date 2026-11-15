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
  game = setInterval(drawGame, 210);
}

function createFood() {
  food = {
    x: Math.floor(Math.random() * (canvas.width / box)) * box,
    y: Math.floor(Math.random() * (canvas.height / box)) * box
  };
}

function changeDirection(newDirection) {
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
    clearInterval(game);
    alert("Game Over! Score: " + score);
    return;
  }

  const newHead = {
    x: headX,
    y: headY
  };

  snake.unshift(newHead);

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
