
const board = document.querySelector(".board");

const blockHeight = 30;
const blockWidth = 30;

const cols = Math.floor(board.clientWidth / blockWidth);
const rows = Math.floor(board.clientHeight / blockHeight);
let intervalId = null 
let food = {x:Math.floor(Math.random() * rows), y:Math.floor(Math.random() * cols)}
let gameOver = false;

const blocks = []
let snake = [{x:1, y:3}]
let direction = "down"

board.innerHTML = ""; 

for(let row = 0; row < rows; row++){
  for(let col = 0; col < cols; col++){
    const block = document.createElement("div");
    block.classList.add("block");
    board.appendChild(block);
    block.innerText = `${row},${col}`
    blocks[`${row}-${col}`] = block;
  }
}


function render(){
  if(gameOver) return;

  let head = null

  blocks[`${food.x}-${food.y}`].classList.add("food");

  switch(direction){
    case "left":
      head = {x:snake[0].x-1, y:snake[0].y}
      break
    case "right":
      head = {x:snake[0].x+1, y:snake[0].y}
      break
    case "up":
      head = {x:snake[0].x, y:snake[0].y-1}
      break
    case "down":
      head = {x:snake[0].x, y:snake[0].y+1}
      break
    default:
      break
  }

  if(head.x < 0 || head.x >= cols || head.y < 0 || head.y >= rows){
    gameOver = true;
    clearInterval(intervalId);
    alert("Game Over");
    return;
  }

  if(head.x == food.x && head.y == food.y){


  }

  snake.forEach(segment =>{
    blocks[`${segment.y}-${segment.x}`].classList.remove("fill");
  })

  snake.unshift(head)
  snake.pop()
  snake.forEach(segment =>{
    blocks[`${segment.y}-${segment.x}`].classList.add("fill");
  })
}


intervalId = setInterval(()=>{
  render()
}, 400)


window.addEventListener("keydown", e =>{
  switch(e.key){
    case "ArrowLeft":
      direction = "left"
      break
    case "ArrowRight":
      direction = "right"
      break
    case "ArrowUp":
      direction = "up"
      break
    case "ArrowDown":
      direction = "down"
      break
    default:
      break
  }

})


// window.addEventListener("resize", buildGrid); 
