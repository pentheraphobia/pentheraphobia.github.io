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

var laserTimer = 0;
var laserParticles = [];
var laserHeight = 3;
var laserWidth = 8;
var laserSpeed = 5;

var starAmount = 0;
var starMax = 25;
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

var smallEnemyHeight = 25;
var smallEnemyWidth = 10;

var enemies = [];

function generateRandomSmallEnemy(c) {
 for (i=0; i<c; i++) {
  var ex = canvas.width-20;
  var ey = Math.floor(Math.random()*(canvas.height-smallEnemyHeight*2)+smallEnemyHeight);
  enemies.push([ex,ey,smallEnemyWidth,smallEnemyHeight,"#FF0000","line",0,1]);
 }
}

function enemyPathing(strang) {
 if (strang == "line") {
  enemies[i][0] -= 0.5;
 }
}

function drawEnemies() {
 for (i=0; i<enemies.length; i++) {
  ctx.beginPath();
  ctx.rect(enemies[i][0],enemies[i][1],enemies[i][2],enemies[i][3])
  ctx.fillStyle = enemies[i][4];
  ctx.fill();
  ctx.closePath();
  enemyPathing(enemies[i][5]);
  if (enemies[i][0] + enemies[i][2] < 0) {
   enemies.splice(i,1);
  }
 }
}

function enemyCollisionDetection() {
 for (i = 0; i < laserParticles.length; i++) {
  for (j = 0; j < enemies.length; j++) {
   var las = [laserParticles[i][0],laserParticles[i][1],laserWidth,laserHeight];
   var ene = [enemies[j][0],enemies[j][1],enemies[j][2],enemies[j][3]];
   if (las[0] < ene[0] + ene[2] &&
       las[0] + las[2] > ene[0] &&
       las[1] < ene[1] + ene[3] &&
       las[1] + las[3] > ene[1]) {
    enemies.splice(j,1);
    laserParticles.splice(i,1);
    continue;
   }
  }
 }
}

function fireLaser() {
 if (laserTimer > 0) {                 //laser cooling down
  laserTimer -= 1;
 }
 if (spacePressed && laserTimer == 0) {
  var getShipX = shipX+shipWidth;                   //laser starts at
  var getShipY = shipY+(shipHeight-laserHeight)/2;  //ships nose
  laserParticles.push([getShipX,getShipY,1]);    //add laser to array
  laserTimer += 10;                   //laser has a cool down
 }
}

function drawLasers() {
 for (i=0; i < laserParticles.length; i++) {         //draws only existing lasers
  if (laserParticles[i][2] == 1) {                   
   ctx.beginPath();
   ctx.rect(laserParticles[i][0],laserParticles[i][1],laserWidth,laserHeight);
   ctx.fillStyle = "#00FFFF";
   ctx.fill();
   ctx.closePath();
   laserParticles[i][0] += laserSpeed;             //laser moves
   if (laserParticles[i][0] + laserSpeed >= canvas.width) {
    laserParticles[i][2] = 0;                      //mark laser for deletion
   }
  } else if (laserParticles[i][2] == 0) {
   laserParticles.splice(i,1);                     //delete laser
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
    starAmount -= 1;
   }
  }
 }
}

var enemyCount = 1;

function draw() {
 ctx.clearRect(0,0,canvas.width,canvas.height);
 generateStars();
 drawStars();
 fireLaser();
 drawLasers();
 if (enemies.length == 0) {
  generateRandomSmallEnemy(enemyCount);
  enemyCount += 1;
 }
 drawEnemies();
 moveShip();
 drawShip();
 enemyCollisionDetection();

 requestAnimationFrame(draw);
}

draw();