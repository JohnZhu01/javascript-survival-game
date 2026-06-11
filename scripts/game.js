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
    enemy.update(player);
  });

  enemies.forEach((enemy) => {
    enemy.draw(ctx);

    if (checkCollision(player, enemy)) {
      console.log("Player collided with enemy");
    }
  });

  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
