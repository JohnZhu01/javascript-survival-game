let previousTime = 0;

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
    }
  }

  enemies.forEach((enemy) => {
    enemy.draw(ctx);

    if (!enemy.isDead && checkCollision(player, enemy)) {
      console.log("Player collided with enemy");
    }
  });

  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
