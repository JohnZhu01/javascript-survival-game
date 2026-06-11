// Player class//
class playerSprite {
  constructor() {
    this.x = 600;
    this.y = 350;
    this.width = 64;
    this.height = 64;

    this.frameWidth = 32;
    this.frameHeight = 32;
    // animation states
    this.animations = {
      idle: { row: 0, frames: 2, frameDuration: 300 },
      walk: { row: 2, frames: 4, frameDuration: 120 },
      run: { row: 3, frames: 8, frameDuration: 100 },
      attack: { row: 8, frames: 8, frameDuration: 100 },
      damage: { row: 6, frames: 3, frameDuration: 250 },
      death: { row: 7, frames: 8, frameDuration: 100 },
    };
    this.animation = "idle";
    this.frameX = 0;
    this.frameTimer = 0;


    // attack
    this.isAttacking=false;
    this.attackDamage=1;
    this.attackRate=500;
    this.lastAttackTime=0;
    this.attackRange=80;
    // player health
    this.playerHealth=3;


    this.playerImage = new Image();
    this.playerImage.src = "character/hood.png";
  }

  // Change animation state.
  setAnimation(animationName) {
    if (this.animation === animationName) {
      return;
    }

    this.animation = animationName;
    this.frameX = 0;
    this.frameTimer = 0;
  }

  updateAnimation(deltaTime) {
    const currentAnimation = this.animations[this.animation];
    this.frameTimer += deltaTime;

    if (this.frameTimer < currentAnimation.frameDuration) {
      return;
    }

    this.frameTimer -= currentAnimation.frameDuration;

    if (
      this.animation === "attack" &&
      this.frameX === currentAnimation.frames - 1
    ) {
      this.isAttacking = false;
      this.setAnimation("idle");
      return;
    }

    this.frameX = (this.frameX + 1) % currentAnimation.frames;
  }

  draw(ctx) {
    const row = this.animations[this.animation].row;

    ctx.drawImage(
      this.playerImage,
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
//
// player generated on canvas//

const player = new playerSprite();

// Player movement//
const playerSpeed = 3;
const keys = {};
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
});

document.addEventListener("keyup", (event) => {
  if (movementKeys.includes(event.key)) {
    event.preventDefault();
  }

  keys[event.key] = false;
});

function playerMovement() {
  if (keys.ArrowUp || keys.w) {
    player.y -= playerSpeed;
  }

  if (keys.ArrowDown || keys.s) {
    player.y += playerSpeed;
  }

  if (keys.ArrowLeft || keys.a) {
    player.x -= playerSpeed;
  }

  if (keys.ArrowRight || keys.d) {
    player.x += playerSpeed;
  }
  //-----//

  // Player Canvas boundaries//
  // horizontal boundary
  player.x = Math.max(0, Math.min(player.x, canvas.width - player.width));
  //vertical boundary
  player.y = Math.max(0, Math.min(player.y, canvas.height - player.height));
}
// attack
function playerAttack(){
  // attack rate
  const currentTime=Date.now();

  if(currentTime-player.lastAttackTime<player.attackRate){return;}
  player.lastAttackTime=currentTime;
  player.isAttacking=true;
  player.setAnimation("attack");

  // attack range
  const playerCenterX=player.x+player.width/2;
  const playerCenterY=player.y + player.height/2;
  const enemyCenterX= enemy.x+enemy.width/2;
  const enemyCenterY=enemy.y+enemy.height/2;

  const distance=Math.hypot(enemyCenterX-playerCenterX, enemyCenterY-playerCenterY);

  if (distance <=player.attackRange){enemy.health -=player.attackDamage}
}


// Player Attack Event//
document.addEventListener("click", playerAttack);

