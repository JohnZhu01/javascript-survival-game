const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");

//Canvas dimensions//
canvas.width = 1280;
canvas.height = 720;

// Canvas background//
const backgroundImage = new Image();
backgroundImage.src =
  "background/PNG/game_background_1/game_background_1.png";

function drawBackground() {
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
}

backgroundImage.addEventListener("load", drawBackground);
