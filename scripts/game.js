// game states//
const menuScreen = document.getElementById("menuScreen");
const gameOverScreen = document.getElementById("gameOverScreen");
const startButton = document.getElementById("startButton");
const playAgainButton = document.getElementById("playAgainButton");
const finalScore = document.getElementById("finalScore");

let gameState = "menu";
let previousTime = 0;
let score = 0;

// background music//
const bgMusic = document.getElementById("bgMusic");

// Player life system//
const heartImage = new Image();
heartImage.src = "life/Heart_container.png";

// difficulty//
let difficultyTimer = 0;
let difficultyLevel = 1;

function updateDifficulty(deltaTime) {
  difficultyTimer += deltaTime;

  if (difficultyTimer >= 10000) {
    difficultyTimer = 0;
    difficultyLevel++;
  }
}

function startGame() {
  menuScreen.classList.add("hidden");
  gameOverScreen.classList.add("hidden");
  gameState = "playing";
  score = 0;
  enemies.length = 0;

  bgMusic.volume = 0.4;
  bgMusic.currentTime = 0;
  bgMusic.play().catch(() => {});

  player.x = 600;
  player.y = 350;
  player.playerHealth = 3;
  player.lastDamageTime = 0;
  player.lastAttackTime = 0;
  player.isDead = false;
  player.isAttacking = false;
  player.attackBox = null;
  player.hitEnemies.clear();
  player.facingDirection = "right";
  player.setAnimation("idle", true);

  for (const key in keys) {
    keys[key] = false;
  }

  lastHorizontalKey = null;
  difficultyTimer = 0;
  difficultyLevel = 1;
}

function endGame() {
  gameState = "gameOver";
  finalScore.textContent = `Score: ${score}`;
  gameOverScreen.classList.remove("hidden");

  bgMusic.pause();
  bgMusic.currentTime = 0;
}

function damagePlayer(damage) {
  const currentTime = Date.now();

  if (currentTime - player.lastDamageTime < player.damageCooldown) {
    return;
  }

  player.playerHealth -= damage;
  player.lastDamageTime = currentTime;

  if (player.playerHealth <= 0) {
    player.playerHealth = 0;
    player.isDead = true;
    player.setAnimation("death", true);
    endGame();
    return;
  }

  player.setAnimation("damage", true);
}

// enemy update//
function updateEnemies(deltaTime) {
  enemies.forEach((enemy) => {
    if (enemy.health <= 0) {
      enemy.death();
    }

    enemy.update(player);
    enemy.updateAnimation(deltaTime);
  });
}

// enemy death//
function removeDeadEnemies() {
  for (let i = enemies.length - 1; i >= 0; i--) {
    if (enemies[i].deathAnimationFinished) {
      enemies.splice(i, 1);
      score++;
    }
  }
}

// enemy draw//
function drawEnemies() {
  enemies.forEach((enemy) => {
    enemy.draw(ctx);

    if (!enemy.isDead && checkCollision(player, enemy)) {
      damagePlayer(enemy.damage);
    }
  });
}

// ---Score Board---//
function drawScore() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
  ctx.fillRect(12, 12, 150, 42);
  ctx.strokeStyle = "#f5d76e";
  ctx.lineWidth = 2;
  ctx.strokeRect(12, 12, 150, 42);

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 24px Arial";
  ctx.fillText(`Score: ${score}`, 24, 40);
}

function drawHearts() {
  for (let i = 0; i < player.playerHealth; i++) {
    ctx.drawImage(heartImage, 20 + i * 40, 65, 32, 32);
  }
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && gameState !== "playing") {
    startGame();
  }
});

startButton.addEventListener("click", startGame);
playAgainButton.addEventListener("click", startGame);

// ---Game Loop--//
function gameLoop(currentTime) {
  const deltaTime = currentTime - previousTime;
  previousTime = currentTime;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBackground();

  if (gameState === "menu") {
    requestAnimationFrame(gameLoop);
    return;
  }

  if (gameState === "gameOver") {
    player.updateAnimation(deltaTime);
    player.draw(ctx);
    drawScore();
    drawHearts();
    requestAnimationFrame(gameLoop);
    return;
  }

  playerMovement();
  player.updateAnimation(deltaTime);
  player.draw(ctx);

  updateDifficulty(deltaTime);
  updateEnemies(deltaTime);
  checkAttackHits();
  removeDeadEnemies();
  drawEnemies();

  drawScore();
  drawHearts();

  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
