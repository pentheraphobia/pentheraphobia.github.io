var canvas = document.getElementById("theCanvas");
var ctx = canvas.getContext("2d");

var shipWidth = 25;
var shipHeight = 10;
var shipX = 30;
var shipY = canvas.height/2;

var upPressed = false;
var downPressed = false;

document.addEventListener("keydown",keyDownHandler,false);
document.addEventListener("keyup",keyUpHandler,false);

function keyDownHandler(e) {
 if (e.keyCode == 38) {
  upPressed = true;
 }
 else if (e.keyCode == 40) {
  downPressed = true;
 }
}

function keyUpHandler(e) {
 if (e.keyCode == 38) {
  upPressed = false;
 }
 else if (e.keyCode == 40) {
  downPressed = false;
 }
}

function drawShip() {
 ctx.beginPath();
 ctx.rect(shipX,shipY,shipWidth,shipHeight);
 ctx.fillStyle="#4682b4";
 ctx.fill();
 ctx.closePath();
}

function moveShip() {
 if (upPressed) {
  shipY -= 3;
 } else if (downPressed) {
  shipY += 3;
 }
}

function draw() {
 ctx.clearRect(0,0,canvas.width,canvas.height);
 moveShip();
 drawShip();

 requestAnimationFrame(draw);
}

draw();