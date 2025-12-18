const board = document.querySelector(".board");
const startButton = document.querySelector(".btn-start")
const modal = document.querySelector(".modal")
const startGameModal = document.querySelector(".start-game")
const gameOverModal = document.querySelector(".game-over")
const restartButton = document.querySelector(".btn-restart")
const scoreDisplay = document.querySelector(".score")
const highScoreDisplay = document.querySelector(".high-score")

const blockHeight = 30;
const blockWidth = 30;

const cols = Math.floor(board.clientWidth / blockWidth);
const rows = Math.floor(board.clientHeight / blockHeight);

let intervalId = null;
let gameOver = false;
const score = 0;

const blocks = {};

let food = {
  x: Math.floor(Math.random() * cols),
  y: Math.floor(Math.random() * rows),
};

let snake = [{ x: 1, y: 3 }];
let direction = "right"; // Start moving right

board.innerHTML = "";

// build grid
for (let row = 0; row < rows; row++) {
  for (let col = 0; col < cols; col++) {
    const block = document.createElement("div");
    block.classList.add("block");
    board.appendChild(block);

    // key = row-col
    blocks[`${row}-${col}`] = block;
  }
}

function render() {
  if (gameOver) return;

  let head;

  // render food (row-col)
  blocks[`${food.y}-${food.x}`].classList.add("food");

  const currentHead = snake[0];

  switch (direction) {
    case "left":
      head = { x: currentHead.x - 1, y: currentHead.y };
      break;
    case "right":
      head = { x: currentHead.x + 1, y: currentHead.y };
      break;
    case "up":
      head = { x: currentHead.x, y: currentHead.y - 1 };
      break;
    case "down":
      head = { x: currentHead.x, y: currentHead.y + 1 };
      break;
  }

  // bounds check
  if (
    head.x < 0 ||
      head.x >= cols ||
      head.y < 0 ||
      head.y >= rows
  ) {
    gameOver = true;
    clearInterval(intervalId);
    modal.style.display="flex"
    startGameModal.style.display = "none"
    gameOverModal.style.display = "flex"
    return;
  }
  
  // self collision check
  if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
    gameOver = true;
    clearInterval(intervalId);
    modal.style.display="flex"
    startGameModal.style.display = "none"
    gameOverModal.style.display = "flex"
    return;
  }

  const ateFood = food.x === head.x && food.y === head.y;

  if (ateFood) {
    blocks[`${food.y}-${food.x}`].classList.remove("food");
    // Generate new food position that's not on the snake
    let newFood;
    do {
      newFood = { 
        x: Math.floor(Math.random() * cols), 
        y: Math.floor(Math.random() * rows) 
      };
    } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    
    food = newFood;
  }

  // remove snake from previous cells
  snake.forEach(segment => {
    blocks[`${segment.y}-${segment.x}`].classList.remove("fill");
  });

  // move snake
  snake.unshift(head);
  if (!ateFood) {
    snake.pop();
  }

  // draw snake
  snake.forEach(segment => {
    blocks[`${segment.y}-${segment.x}`].classList.add("fill");
  });
}


startButton.addEventListener("click", () => {
  modal.style.display = "none";
  intervalId = setInterval(render, 400);
})

restartButton.addEventListener("click", restartGame)

function restartGame(){
  // Clear any existing interval first
  if (intervalId) {
    clearInterval(intervalId);
  }
  
  // Clear food and snake from board
  blocks[`${food.y}-${food.x}`].classList.remove("food");
  snake.forEach(segment => {
    blocks[`${segment.y}-${segment.x}`].classList.remove("fill");
  })

  // Reset game state
  gameOver = false;
  snake = [{ x: 1, y: 3 }];
  direction = "down";
  food = {
    x: Math.floor(Math.random() * cols),
    y: Math.floor(Math.random() * rows),
  };
  
  // Hide modals
  modal.style.display = "none";
  gameOverModal.style.display = "none";
  startGameModal.style.display = "none";
  
  // Start new game loop
  intervalId = setInterval(render, 400);
}

window.addEventListener("keydown", e => {
  switch (e.key) {
    case "ArrowLeft":
      if (direction !== "right") direction = "left";
      break;
    case "ArrowRight":
      if (direction !== "left") direction = "right";
      break;
    case "ArrowUp":
      if (direction !== "down") direction = "up";
      break;
    case "ArrowDown":
      if (direction !== "up") direction = "down";
      break;
  }
});
