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

    this.speed = 1;

    this.image = new Image();
    this.image.src = "enemy/LargeSlime_Grey.png";
  }

  draw(ctx) {
    ctx.drawImage(
      this.image,
      this.frameX * this.frameWidth,
      this.frameY * this.frameHeight,
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

function checkCollision(player,enemy)
{
    // sprite dimension variables
    const playerLeft=player.x;
    const playerRight=player.x +player.width;
    const playerTop=player.y;
    const playerBottom= player.y +player.height;

    const enemyLeft = enemy.x;
    const enemyRight = enemy.x + enemy.width;
    const enemyTop = enemy.y;
    const enemyBottom = enemy.y + enemy.height;

    // collision logic
    const separated=
    playerRight<enemyLeft||playerLeft>enemyRight||playerBottom<enemyTop||playerTop>enemyBottom

    return !separated
}

const enemies = [];
enemies.push(new EnemySprite(500, 600));
