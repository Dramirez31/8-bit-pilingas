let selectedCharacter = null;

document.querySelectorAll('.character').forEach(char => {
    char.addEventListener('click', () => {
        selectedCharacter = char.getAttribute('data-name');
        startGame();
    });
});

function startGame() {
    document.getElementById('character-selection').style.display = 'none';
    document.getElementById('game-container').style.display = 'block';

    const canvas = document.getElementById('game');
    const ctx = canvas.getContext('2d');
    canvas.width = 800;
    canvas.height = 400;

    let player = {
        x: 50,
        y: 300,
        width: 50,
        height: 50,
        color: '#fff',
        velocityY: 0,
        isJumping: false
    };

    let obstacles = [];
    let frameCount = 0;

    function drawPlayer() {
        ctx.fillStyle = player.color;
        ctx.fillRect(player.x, player.y, player.width, player.height);
    }

    function createObstacle() {
        let obstacle = {
            x: canvas.width,
            y: 300,
            width: 20,
            height: 50,
            speed: 5
        };
        obstacles.push(obstacle);
    }

    function drawObstacles() {
        ctx.fillStyle = '#f00';
        obstacles.forEach(obstacle => {
            ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        });
    }

    function moveObstacles() {
        obstacles.forEach(obstacle => {
            obstacle.x -= obstacle.speed;
        });

        // Remove obstacles that are off-screen
        obstacles = obstacles.filter(obstacle => obstacle.x + obstacle.width > 0);
    }

    function detectCollision() {
        obstacles.forEach(obstacle => {
            if (
                player.x < obstacle.x + obstacle.width &&
                player.x + player.width > obstacle.x &&
                player.y < obstacle.y + obstacle.height &&
                player.y + player.height > obstacle.y
            ) {
                alert("Game Over! Refresh to play again.");
                player.y = 300; // Reset player position
                obstacles = []; // Clear obstacles
                return;
            }
        });
    }

    function gameLoop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawPlayer();
        drawObstacles();
        moveObstacles();
        detectCollision();

        // Gravity effect
        if (player.y < 300) {
            player.velocityY += 1;
        } else {
            player.velocityY = 0;
            player.isJumping = false;
        }

        player.y += player.velocityY;

        // Create obstacles periodically
        if (frameCount % 100 === 0) {
            createObstacle();
        }

        frameCount++;
        requestAnimationFrame(gameLoop);
    }

    document.addEventListener('keydown', e => {
        if (e.code === 'Space' && !player.isJumping) {
            player.velocityY = -15;
            player.isJumping = true;
        }
    });

    gameLoop();
}
