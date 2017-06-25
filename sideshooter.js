var canvas = document.getElementById("theCanvas");
var ctx = canvas.getContext("2d");
document.getElementById("theCanvas").style.backgroundColor = '#000010'

var shipWidth = 25;
var shipHeight = 10;
var shipX = 30;
var shipY = (canvas.height-shipHeight)/2;
var shipSpeed = 0;
var shipAccel = 0.25;
var shipMaxSpeed = 3;

var starAmount = 0;
var starMax = 30;
var stars = [];
for (i=starAmount; i<starMax; i++) {
 stars[i] = [0,0,0,0];
}

var upPressed = false;
var downPressed = false;
var spacePressed = false;

document.addEventListener("keydown",keyDownHandler,false);
document.addEventListener("keyup",keyUpHandler,false);

function keyDownHandler(e) {
 if (e.keyCode == 38) {
  upPressed = true;
 }
 if (e.keyCode == 40) {
  downPressed = true;
 }
 if (e.keyCode == 32) {
  spacePressed = true;
 }
}

function keyUpHandler(e) {
 if (e.keyCode == 38) {
  upPressed = false;
 }
 if (e.keyCode == 40) {
  downPressed = false;
 }
 if (e.keyCode == 32) {
  spacePressed = false;
 }
}

var laserTimer = 0;
var laserParticles = [];
var laserHeight = 2;
var laserWidth = 3;
var laserSpeed = 5;

function fireLaser() {
 if (laserTimer > 0) {
  laserTimer -= 1;
 }
 if (spacePressed && laserTimer == 0) {
  var getShipX = shipX+shipWidth;
  var getShipY = shipY+(shipHeight-laserHeight)/2;
  laserParticles.push([getShipX,getShipY,1]);
  laserTimer += 10;
 }
}

function drawLasers() {
 for (i=0; i < laserParticles.length; i++) {
  if (laserParticles[i][2] == 1) {
   ctx.beginPath();
   ctx.rect(laserParticles[i][0],laserParticles[i][1],laserHeight,laserWidth);
   ctx.fillStyle = "#00FFFF";
   ctx.fill();
   ctx.closePath();
   laserParticles[i][0] += laserSpeed;
   if (laserParticles[i][0] + laserSpeed >= canvas.width) {
    laserParticles[i][2] = 0;
   }
  } else if (laserParticles[i][2] == 0) {
   laserParticles.splice(i,1);
  }
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
 if (upPressed && shipSpeed < shipMaxSpeed) {
  if (shipSpeed >= 0) {
   shipSpeed -= shipAccel*2; //accelerate up faster from opposite direction
  } else {
   shipSpeed -= shipAccel;   //accelerate up
  }
 } else if (!downPressed && shipSpeed > 0) {
  shipSpeed -= shipAccel;    //deccelerate from down
 }
 if (downPressed && shipSpeed > -shipMaxSpeed) {
  if (shipSpeed <= 0) {
   shipSpeed += shipAccel*2; //accelerate down faster from opposite direction
  } else {
   shipSpeed += shipAccel;   //accelerate down
  }
 } else if (!upPressed && shipSpeed < 0) {
  shipSpeed += shipAccel;    //deccelerate from up
 }
 if (shipY + shipSpeed < 0 || shipY + shipSpeed >= canvas.height-shipHeight) {
  shipSpeed = 0;          //boundaries
 } else {
  shipY += shipSpeed;     //ship moves according to momentum
 }
}

function generateStars() {
 for (i= 0; i < starMax; i++) {                             //check each of 10 each frame?
  var sx = canvas.width;                                    //always start on right
  var sy = Math.floor(Math.random()*canvas.height+1);       //random height
  var ssize = Math.floor(Math.random()*4+1);                //four possibilities
   if (ssize < 3) {
    ssize = 1;                                              //first three are small
   } else {
    ssize = 2;                                              //last one is big
   }
  var sexist = 1;                                           //a star is born
  if (stars[i][3] == 0) {                                   //if it doesn't exist
   if (Math.random()*10*starAmount < 5) {        //10% to make exist, higher chance if low stars
    stars[i] = [sx,sy,ssize,sexist];
    starAmount += 1;
   }
  }
 }
}

function drawStars() {
 for (i = 0; i < starMax; i++) {
  if (stars[i][3] == 1) {
   ctx.beginPath();
   ctx.rect(stars[i][0],stars[i][1],stars[i][2],stars[i][2]);
   ctx.fillStyle = "#FFFFFF";
   ctx.fill();
   ctx.closePath();
   stars[i][0] -= stars[i][2];
   if (stars[i][0] < 10) {
    stars[i][3] = 0;
   }
  }
 }
}

function draw() {
 ctx.clearRect(0,0,canvas.width,canvas.height);
 generateStars();
 drawStars();
 fireLaser();
 drawLasers();
 moveShip();
 drawShip();

 requestAnimationFrame(draw);
}

draw();