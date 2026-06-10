// Player//
class playerSprite {
  constructor() {
    this.x = 600;
    this.y = 350;
    this.width = 64;
    this.height = 64;

    this.frameWidth = 32;
    this.frameHeight = 32;
    this.animations = {
      idle: { row: 0, frames: 1 },
    };
    this.animation = "idle";
    this.frameX = 0;

    this.playerImage = new Image();
    this.playerImage.src = "/character/hood.png";
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
// player generated on canvas//

const player = new playerSprite();

//----//
//----- Player Animation----//
this.animations={
  idle:{row:}
}


// Player movement//
const playerSpeed = 4;
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

// Player Attack//