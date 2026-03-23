const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gridSize = 20;
const tileCount = 20;
let snake = [{x: 10, y: 10}];
let direction = 'RIGHT';
let food = {x: 15, y: 10};
let score = 0;
let gameSpeed = 400;
const gameOver = new Audio('food_G1U6tlb.mp3');
const eatSound = new Audio('punch.mp3');
let highScore = localStorage.getItem('highScore')
function draw() {
  // Clear canvas
  ctx.fillStyle = '#1a1a1a';
  ctx.fillRect(0, 0, canvas.width,
    canvas.height);
    drawGrid();
  // Draw snake (green)
  ctx.fillStyle = '#00FF00';
  snake.forEach(segment => {
    ctx.fillRect(
      segment.x * gridSize,
      segment.y * gridSize,
      gridSize - 2,
      gridSize - 2
    );
  });

  // Draw food (red)
  ctx.fillStyle = '#FF0000';
  ctx.fillRect(
    food.x * gridSize,//its tell about coordinates
    food.y * gridSize,//same as
    gridSize - 2,//it is height
    gridSize - 2//it is width
  );
  ctx.fillStyle = "#2ecc71";
  ctx.textAlign = 'left';
  ctx.fillText("Score"+" "+score,10,25);
  ctx.fillStyle = "#3498db";
  ctx.textAlign = 'right';
  ctx.fillText("High Score: " + highScore,canvas.width-10, 25);
}



function move() {
  // Copy head position
  let head = {
    x: snake[0].x,//it tell about cordinate of head of snake
    y: snake[0].y
  };

  // Move head based on direction
  if (direction === 'UP') head.y--;
  if (direction === 'DOWN') head.y++;
  if (direction === 'LEFT') head.x--;
  if (direction === 'RIGHT') head.x++;

  // Add new head to front
  snake.unshift(head);

  // Check if food eaten
  if (head.x === food.x &&
      head.y === food.y) {
    score++;
    eatSound.play();
    placeFood();
    if (score > highScore) {
    highScore = score;
    localStorage.setItem('highScore', highScore);
  }
    if(score%5===0)gameSpeed-=5;
  } else {
    snake.pop(); // Remove tail
  }
}



document.addEventListener('keydown',
  changeDirection);

function changeDirection(event) {
  const key = event.key;

  // Prevent 180° turns
  if (key === 'ArrowUp' &&
      direction !== 'DOWN')
    direction = 'UP';

  if (key === 'ArrowDown' &&
      direction !== 'UP')
    direction = 'DOWN';

  if (key === 'ArrowLeft' &&
      direction !== 'RIGHT')
    direction = 'LEFT';

  if (key === 'ArrowRight' &&
      direction !== 'LEFT')
    direction = 'RIGHT';
}




function checkCollision() {
  const head = snake[0];

  // Wall collision
  if (head.x < 0 ||
      head.x >= tileCount ||
      head.y < 0 ||
      head.y >= tileCount)
    return true;

  // Self collision
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x &&
        head.y === snake[i].y)
      return true;
  }

  return false;
}

function placeFood() {
  food.x = Math.floor(
    Math.random() * tileCount);
  food.y = Math.floor(
    Math.random() * tileCount);
}




let isRunning = false;
function gameLoop() {
  // Update game state
  
   if (!isRunning) return;
  move();

  // Check if game over
  if (checkCollision()) {
   gameOver.play();
    alert('Game Over! Score: '
      + score);
      
    // Reset game
    snake = [{x: 10, y: 10}];
    direction = 'RIGHT';
    score = 0;
    placeFood();
    isRunning = false;
    draw()
    return;
  }

  // Draw everything
  draw();//draw snake

  // Schedule next frame
  setTimeout(gameLoop, gameSpeed);
}

// Start the game!
placeFood();
// gameLoop();
function startGame() {
  if (!isRunning) {
    isRunning = true;
    gameLoop();
  }
}
function drawGrid() {
  ctx.strokeStyle = '#333';

  for (let x = 0; x < canvas.width; x += gridSize) {
    for (let y = 0; y < canvas.height; y += gridSize) {
      ctx.strokeRect(x, y, gridSize, gridSize);
    }
  }
}




