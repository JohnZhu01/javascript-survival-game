function gameLoop() {
  playerMovement();
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawBackground();
  player.draw(ctx);
  requestAnimationFrame(gameLoop);
}

gameLoop();
