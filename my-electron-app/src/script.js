// script.js
const gameArea = document.getElementById('gameArea');
const ball = document.getElementById('ball');
const platform = document.getElementById('platform');
const scoreElement = document.getElementById('score');
const gameOverScreen = document.getElementById('gameOver');
const finalScoreElement = document.getElementById('finalScore');

let gameRunning = true;
let score = 0;
let ballSpeed = 2;

// Ball properties
let ballX = Math.random() * (gameArea.clientWidth - 30);
let ballY = 0;
let ballVelX = (Math.random() - 0.5) * 4; // Random horizontal velocity
let ballVelY = ballSpeed;

// Platform properties
let platformX = gameArea.clientWidth / 2 - 60; // Center the platform initially

// Game constants
const GRAVITY = 0.1;
const BOUNCE_DAMPING = 0.8;
const PLATFORM_BOUNCE = 0.9;

function updateBall() {
    if (!gameRunning) return;

    // Apply gravity
    ballVelY += GRAVITY;
    
    // Update position
    ballX += ballVelX;
    ballY += ballVelY;

    // Bounce off walls
    if (ballX <= 0 || ballX >= gameArea.clientWidth - 30) {
        ballVelX = -ballVelX * BOUNCE_DAMPING;
        ballX = Math.max(0, Math.min(ballX, gameArea.clientWidth - 30));
    }

    // Bounce off top
    if (ballY <= 0) {
        ballVelY = -ballVelY * BOUNCE_DAMPING;
        ballY = 0;
    }

    // Check collision with platform
    const ballCenterX = ballX + 15;
    const ballCenterY = ballY + 15;
    const platformCenterY = gameArea.clientHeight - 30;
    
    if (ballCenterY >= platformCenterY - 10 && 
        ballCenterY <= platformCenterY + 10 &&
        ballCenterX >= platformX && 
        ballCenterX <= platformX + 120) {
        
        // Collision detected
        ballVelY = -Math.abs(ballVelY) * PLATFORM_BOUNCE;
        ballY = platformCenterY - 25; // Position ball above platform
        
        // Add some horizontal velocity based on where it hit the platform
        const hitPosition = (ballCenterX - platformX) / 120; // 0 to 1
        ballVelX += (hitPosition - 0.5) * 2; // Add spin effect
        
        // Increase score and speed
        score += 10;
        scoreElement.textContent = score;
        ballSpeed += 0.1;
        
        // Add bounce animation
        ball.classList.add('bounce');
        setTimeout(() => ball.classList.remove('bounce'), 200);
    }

    // Check if ball fell below platform
    if (ballY > gameArea.clientHeight) {
        gameOver();
        return;
    }

    // Update ball position
    ball.style.left = ballX + 'px';
    ball.style.top = ballY + 'px';
}

function updatePlatform(event) {
    if (!gameRunning) return;
    
    const rect = gameArea.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    
    // Center platform on mouse position
    platformX = mouseX - 60;
    
    // Keep platform within bounds
    platformX = Math.max(0, Math.min(platformX, gameArea.clientWidth - 120));
    
    platform.style.left = platformX + 'px';
}

function gameOver() {
    gameRunning = false;
    finalScoreElement.textContent = score;
    gameOverScreen.style.display = 'block';
}

function resetGame() {
    gameRunning = true;
    score = 0;
    ballSpeed = 2;
    
    // Reset ball position
    ballX = Math.random() * (gameArea.clientWidth - 30);
    ballY = 0;
    ballVelX = (Math.random() - 0.5) * 4;
    ballVelY = ballSpeed;
    
    // Reset platform position
    platformX = gameArea.clientWidth / 2 - 60;
    
    // Update display
    scoreElement.textContent = score;
    gameOverScreen.style.display = 'none';
    
    // Update positions
    ball.style.left = ballX + 'px';
    ball.style.top = ballY + 'px';
    platform.style.left = platformX + 'px';
}

// Event listeners
gameArea.addEventListener('mousemove', updatePlatform);

// Game loop
function gameLoop() {
    updateBall();
    requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop();