// Player class//
class playerSprite {
  constructor() {
    this.x = 600;
    this.y = 350;
    this.width = 64;
    this.height = 64;

    this.frameWidth = 32;
    this.frameHeight = 32;

    this.animations = {
      idle: { row: 0, frames: 2, frameDuration: 300 },
      walk: { row: 2, frames: 4, frameDuration: 120 },
      run: { row: 3, frames: 8, frameDuration: 100 },
      attack: { row: 8, frames: 8, frameDuration: 100 },
      damage: { row: 6, frames: 3, frameDuration: 250 },
      death: { row: 7, frames: 8, frameDuration: 100 },
    };

    this.animation = "idle";
    this.facingDirection = "right";
    this.frameX = 0;
    this.frameTimer = 0;

    this.isAttacking = false;
    this.attackDamage = 2;
    this.attackRate = 500;
    this.lastAttackTime = 0;
    this.attackRange = 44;
    this.attackHeight = 40;

    this.playerHealth = 3;
    this.lastDamageTime = 0;
    this.damageCooldown = 1000;
    this.isDead = false;

    this.playerImage = new Image();
    this.playerImage.src = "character/hood.png";
  }

  setAnimation(animationName, restart = false) {
    if (this.animation === animationName && !restart) {
      return;
    }

    this.animation = animationName;
    this.frameX = 0;
    this.frameTimer = 0;
  }

  updateAnimation(deltaTime) {
    const currentAnimation = this.animations[this.animation];
    this.frameTimer += deltaTime;

    while (this.frameTimer >= currentAnimation.frameDuration) {
      this.frameTimer -= currentAnimation.frameDuration;

      if (
        this.animation === "attack" &&
        this.frameX === currentAnimation.frames - 1
      ) {
        this.isAttacking = false;
        this.setAnimation("idle");
        return;
      }

      if (
        this.animation === "damage" &&
        this.frameX === currentAnimation.frames - 1
      ) {
        this.setAnimation("idle");
        return;
      }

      if (
        this.animation === "death" &&
        this.frameX === currentAnimation.frames - 1
      ) {
        return;
      }

      this.frameX = (this.frameX + 1) % currentAnimation.frames;
    }
  }

  draw(ctx) {
    const row = this.animations[this.animation].row;
    ctx.save();

    if (this.facingDirection === "left") {
      ctx.translate(this.x + this.width, this.y);
      ctx.scale(-1, 1);
    } else {
      ctx.translate(this.x, this.y);
    }

    ctx.drawImage(
      this.playerImage,
      this.frameX * this.frameWidth,
      row * this.frameHeight,
      this.frameWidth,
      this.frameHeight,
      0,
      0,
      this.width,
      this.height,
    );

    ctx.restore();
  }
}

// player generated on canvas//
const player = new playerSprite();
const playerSpeed = 3;
const keys = {};
let lastHorizontalKey = null;
const movementKeys = [
  "ArrowUp",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "w",
  "a",
  "s",
  "d",
];

document.addEventListener("keydown", (event) => {
  if (movementKeys.includes(event.key)) {
    event.preventDefault();
  }

  keys[event.key] = true;

  if (event.key === "ArrowLeft" || event.key === "a") {
    lastHorizontalKey = "left";
  }

  if (event.key === "ArrowRight" || event.key === "d") {
    lastHorizontalKey = "right";
  }
});

document.addEventListener("keyup", (event) => {
  if (movementKeys.includes(event.key)) {
    event.preventDefault();
  }

  keys[event.key] = false;
});

// Player movement//
function playerMovement() {
  if (player.isDead) {
    return;
  }

  const movingLeft = keys.ArrowLeft || keys.a;
  const movingRight = keys.ArrowRight || keys.d;

  if (keys.ArrowUp || keys.w) {
    player.y -= playerSpeed;
  }

  if (keys.ArrowDown || keys.s) {
    player.y += playerSpeed;
  }

  if (movingLeft && (!movingRight || lastHorizontalKey === "left")) {
    player.x -= playerSpeed;

    if (!player.isAttacking) {
      player.facingDirection = "left";
    }
  }

  if (movingRight && (!movingLeft || lastHorizontalKey === "right")) {
    player.x += playerSpeed;

    if (!player.isAttacking) {
      player.facingDirection = "right";
    }
  }

  player.x = Math.max(0, Math.min(player.x, canvas.width - player.width));
  player.y = Math.max(0, Math.min(player.y, canvas.height - player.height));
}

// attack//
function playerAttack(event) {
  if (gameState !== "playing") {
    return;
  }

  if (player.isDead) {
    return;
  }

  if (event.button !== 0) {
    return;
  }

  const currentTime = Date.now();

  if (currentTime - player.lastAttackTime < player.attackRate) {
    return;
  }

  player.lastAttackTime = currentTime;
  player.isAttacking = true;
  player.setAnimation("attack", true);

  const attackBox = getAttackBox();

  enemies.forEach((enemy) => {
    if (enemy.isDead) {
      return;
    }

    if (checkBoxCollision(attackBox, getHitbox(enemy, 18))) {
      enemy.health -= player.attackDamage;

      if (enemy.health <= 0) {
        enemy.death();
      }
    }
  });
}

function getAttackBox() {
  const playerCenterY = player.y + player.height / 2;
  const y = playerCenterY - player.attackHeight / 2;

  if (player.facingDirection === "left") {
    return {
      left: player.x - player.attackRange,
      right: player.x + 10,
      top: y,
      bottom: y + player.attackHeight,
    };
  }

  return {
    left: player.x + player.width - 10,
    right: player.x + player.width + player.attackRange,
    top: y,
    bottom: y + player.attackHeight,
  };
}

function checkBoxCollision(boxA, boxB) {
  const separated =
    boxA.right < boxB.left ||
    boxA.left > boxB.right ||
    boxA.bottom < boxB.top ||
    boxA.top > boxB.bottom;

  return !separated;
}

// Player Attack Event//
canvas.addEventListener("pointerdown", playerAttack);
