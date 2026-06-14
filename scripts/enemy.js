// Enemy logic //
class EnemySprite {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 64;
    this.height = 64;

    this.frameWidth = 310;
    this.frameHeight = 310;
    this.frameX = 0;
    this.frameY = 0;

    // animation states
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
    this.speed = 0.5;

    // health
    this.health = 2;
    this.damage = 1;

    this.image = new Image();
    this.image.src = "enemy/LargeSlime_Grey.png";
  }

  death(){
    if (this.isDead) return;

    this.isDead=true;
    this.deathX=this.x;
    this.deathY=this.y;
    this.speed=0;
    this.animation="death";
    this.frameX=0;
    this.frameTimer=0;
  }
  // Move toward the player.
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

    // Stop once the enemy reaches the player's center.
    if (distance <= this.speed) {
      return;
    }

    // Move toward the player at a consistent speed.
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

// enemy player collision

function checkCollision(player, enemy) {
  // sprite dimension variables
  const playerLeft = player.x;
  const playerRight = player.x + player.width;
  const playerTop = player.y;
  const playerBottom = player.y + player.height;

  const enemyLeft = enemy.x;
  const enemyRight = enemy.x + enemy.width;
  const enemyTop = enemy.y;
  const enemyBottom = enemy.y + enemy.height;

  // collision logic
  const separated =
    playerRight < enemyLeft ||
    playerLeft > enemyRight ||
    playerBottom < enemyTop ||
    playerTop > enemyBottom;

  return !separated;
}

// spawn multiple enemies
const enemies = [];

// enemy spawn
function spawnEnemy() {
  const x = Math.random() * (canvas.width - 64);
  const y = Math.random() * (canvas.height - 64);
  enemies.push(new EnemySprite(x, y));
}

// max enemies
const maxEnemies = 5;

// spawn timer
setInterval(() => {
  if (enemies.length < maxEnemies) {
    spawnEnemy();
  }
}, 2000);
