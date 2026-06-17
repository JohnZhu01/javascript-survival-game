let previousTime = 0;
let score=0;

function drawScore(){
  ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
  ctx.fillRect(12, 12, 150, 42);
  ctx.strokeStyle = "#f5d76e";
  ctx.lineWidth = 2;
  ctx.strokeRect(12, 12, 150, 42);

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 24px Arial";
  ctx.fillText(`Score: ${score}`, 24, 40);
}

function gameLoop(currentTime) {
  const deltaTime = currentTime - previousTime;
  previousTime = currentTime;

  playerMovement();
  player.updateAnimation(deltaTime);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawBackground();
  player.draw(ctx);

  enemies.forEach((enemy) => {
    if (enemy.health <= 0) {
      enemy.death();
    }

    enemy.update(player);
    enemy.updateAnimation(deltaTime);
  });

  for (let i = enemies.length - 1; i >= 0; i--) {
    if (enemies[i].deathAnimationFinished) {
      enemies.splice(i, 1);
      score++;
    }
  }

  enemies.forEach((enemy) => {
    enemy.draw(ctx);

    if (!enemy.isDead && checkCollision(player, enemy)) {
      console.log("Player collided with enemy");
    }
  });

  // Score//
  drawScore();

  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
