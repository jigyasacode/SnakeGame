const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const snakeColor = '#37044b'; // Snake color (e.g., green)
const snakeSize = 20; // Snake size (20x20 pixels)

const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

let snake = [{ x: 100, y: 100 }];
let food = { x: 200, y: 200 };
let dx = snakeSize; // Horizontal velocity
let dy = 0; // Vertical velocity
let gameOver = false; // Flag to indicate game over

function drawSnakePart(snakePart) {
    ctx.fillStyle = snakeColor;
    ctx.fillRect(snakePart.x, snakePart.y, snakeSize, snakeSize);
    ctx.strokeStyle = '#5f097f'; // Border color for each snake part
    ctx.strokeRect(snakePart.x, snakePart.y, snakeSize, snakeSize);
}

function drawSnake() {
    snake.forEach(drawSnakePart);
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawFood() {
    ctx.fillStyle = 'yellow';
    ctx.fillRect(food.x, food.y, snakeSize, snakeSize);
    ctx.strokeStyle = 'black';
}

function advanceSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    
    // Wrap snake position if it crosses the canvas border
    if (head.x >= canvasWidth) head.x = 0;
    if (head.x < 0) head.x = canvasWidth - snakeSize;
    if (head.y >= canvasHeight) head.y = 0;
    if (head.y < 0) head.y = canvasHeight - snakeSize;

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        generateFood();
    } else {
        snake.pop();
    }

    // Check for self-collision
    if (checkSelfCollision(head)) {
        gameOver = true;
    }
}

function checkSelfCollision(head) {
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === head.x && snake[i].y === head.y) {
            return true;
        }
    }
    return false;
}

function generateFood() {
    food.x = Math.floor(Math.random() * canvasWidth / snakeSize) * snakeSize;
    food.y = Math.floor(Math.random() * canvasHeight / snakeSize) * snakeSize;

    // Ensure food doesn't appear on the snake
    if (snake.some(part => part.x === food.x && part.y === food.y)) {
        generateFood();
    }
}

function changeDirection(event) {
    const keyPressed = event.keyCode;

    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;

    const goingUp = dy === -snakeSize;
    const goingDown = dy === snakeSize;
    const goingRight = dx === snakeSize;
    const goingLeft = dx === -snakeSize;

    if (keyPressed === LEFT_KEY && !goingRight) {
        dx = -snakeSize;
        dy = 0;
    }

    if (keyPressed === UP_KEY && !goingDown) {
        dx = 0;
        dy = -snakeSize;
    }

    if (keyPressed === RIGHT_KEY && !goingLeft) {
        dx = snakeSize;
        dy = 0;
    }

    if (keyPressed === DOWN_KEY && !goingUp) {
        dx = 0;
        dy = snakeSize;
    }
}

function main() {
    if (gameOver) {
        alert("Game Over");
        document.location.reload();
        return;
    }

    setTimeout(function onTick() {
        clearCanvas();
        drawFood();
        advanceSnake();
        drawSnake();

        main();
    }, 100);
}

document.addEventListener("keydown", changeDirection);
main();
