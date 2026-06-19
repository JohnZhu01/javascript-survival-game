// Enemy logic //
class enemySprite {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 64;
    this.height = 64;

    this.frameWidth = 310;
    this.frameHeight = 310;
    this.frameX = 0;
    this.frameY = 0;

    this.animations = {
      move: { row: 2, frames: 4, frameDuration: 200 },
      death: { row: 3, frames: 4, frameDuration: 100 },
    };
    this.animation = "move";
    this.isDead = false;
    this.deathAnimationFinished = false;
    this.deathX = null;
    this.deathY = null;
    this.frameTimer = 0;
    this.speed = Math.min(0.5 + difficultyLevel * 0.1, 1.5);

    this.health = 2 + Math.floor(difficultyLevel / 3);
    this.damage = 1;

    this.image = new Image();
    this.image.src = "enemy/LargeSlime_Grey.png";
  }

  death() {
    if (this.isDead) return;

    this.isDead = true;
    this.deathX = this.x;
    this.deathY = this.y;
    this.speed = 0;
    this.animation = "death";
    this.frameX = 0;
    this.frameTimer = 0;
  }

  update(player) {
    if (this.isDead) {
      this.x = this.deathX;
      this.y = this.deathY;
      return;
    }

    const enemyCenterX = this.x + this.width / 2;
    const enemyCenterY = this.y + this.height / 2;
    const playerCenterX = player.x + player.width / 2;
    const playerCenterY = player.y + player.height / 2;

    const distanceX = playerCenterX - enemyCenterX;
    const distanceY = playerCenterY - enemyCenterY;
    const distance = Math.hypot(distanceX, distanceY);

    if (distance <= this.speed) {
      return;
    }

    this.x += (distanceX / distance) * this.speed;
    this.y += (distanceY / distance) * this.speed;
  }

  updateAnimation(deltaTime) {
    const currentAnimation = this.animations[this.animation];
    this.frameTimer += deltaTime;

    while (this.frameTimer >= currentAnimation.frameDuration) {
      this.frameTimer -= currentAnimation.frameDuration;

      if (
        this.animation === "death" &&
        this.frameX === currentAnimation.frames - 1
      ) {
        this.deathAnimationFinished = true;
        return;
      }

      this.frameX = (this.frameX + 1) % currentAnimation.frames;
    }
  }

  draw(ctx) {
    const row = this.animations[this.animation].row;

    ctx.drawImage(
      this.image,
      this.frameX * this.frameWidth,
      row * this.frameHeight,
      this.frameWidth,
      this.frameHeight,
      this.x,
      this.y,
      this.width,
      this.height,
    );
  }
}

// enemy player collision//
function checkCollision(player, enemy) {
  const padding = 18;
  const playerBox = getHitbox(player, padding);
  const enemyBox = getHitbox(enemy, padding);

  const separated =
    playerBox.right < enemyBox.left ||
    playerBox.left > enemyBox.right ||
    playerBox.bottom < enemyBox.top ||
    playerBox.top > enemyBox.bottom;

  return !separated;
}

function getHitbox(sprite, padding) {
  return {
    left: sprite.x + padding,
    right: sprite.x + sprite.width - padding,
    top: sprite.y + padding,
    bottom: sprite.y + sprite.height - padding,
  };
}

// spawn multiple enemies//
const enemies = [];

// enemy spawn//
function spawnEnemy() {
  const spawnSide = Math.floor(Math.random() * 3);
  let x;
  let y;

  if (spawnSide === 0) {
    // left spawn//
    x = -64;
    y = canvas.height / 3 + Math.random() * (canvas.height * 2 / 3);
  } else if (spawnSide === 1) {
    // right spawn//
    x = canvas.width;
    y = canvas.height / 3 + Math.random() * (canvas.height * 2 / 3);
  } else {
    // bottom spawn//
    x = Math.random() * canvas.width;
    y = canvas.height;
  }

  enemies.push(new enemySprite(x, y));
}

function getMaxEnemies() {
  return Math.min(5 + difficultyLevel, 12);
}

// spawn timer//
setInterval(() => {
  if (gameState === "playing" && enemies.length < getMaxEnemies()) {
    spawnEnemy();
  }
}, 2000);
