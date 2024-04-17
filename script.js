///// Variable declarations /////

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// height and width of the canvas
var width = window.innerWidth;
var height = window.innerHeight;

// desired frames per second
const desiredFPS = 120;

// gravity
const gravity = 9.81;

const keys = {
  left: false,
  right: false,
  up: false
}



///// Event listeners /////

window.addEventListener('keydown', function(event){
  if( event.key == 'a' || event.key == 'ArrowLeft'){
    keys.left = true;
  }
  if( event.key == 'd' || event.key == 'ArrowRight'){
    keys.right = true;
  }
  if( event.key == 'w' || event.key == 'ArrowUp'){
    keys.up = true;
  }
});

window.addEventListener('keyup', function(event){
  if( event.key == 'a' || event.key == 'ArrowLeft'){
    keys.left = false;
  }
  if( event.key == 'd' || event.key == 'ArrowRight'){
    keys.right = false;
  }
  if( event.key == 'w' || event.key == 'ArrowUp'){
    keys.up = false;
  }
});


///// Utility functions /////

function getCollisionBlocks(array){
  const objectArray= [];

  const collisions= array.parse2D();
  collisions.forEach((row, y) => {
    row.forEach((cell, x) => {
      if(cell === 210){
        objectArray.push(new Collisions({x: x * cellSize, y: y * cellSize}));
      }
    })
  });

  return objectArray
}
const collisionBlocks= getCollisionBlocks(collisionsLevel1);


///// Classes /////
class Player {
  constructor(x, y, width, height, velX, velY) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.velX = velX;
    this.velY = velY;
    this.speed = 200;
    this.jumpHeight = 800;
  }

  draw(){
    ctx.fillStyle = 'red';
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  update(deltaTime){
    this.x += this.velX * deltaTime;
    this.y += this.velY * deltaTime;

    this.velY += gravity * deltaTime * 100;

    this.checkCanvasBounds();
  }

  checkCanvasBounds(){
    if(this.x < 0){
      this.x = 0;
      this.velX = 0;
    }
    if(this.x + this.width > canvas.width){
      this.x = canvas.width - this.width;
      this.velX = 0;
    }
    if(this.y < 0){
      this.y = 0;
      this.velY = 0;
    }
    if(this.y + this.height > canvas.height){
      this.y = canvas.height - this.height;
      this.velY = 0;
    }
  }
}
const player = new Player(100, 100, 64, 64, 0, 0);

class sprite {
  constructor({x, y}, imageSrc){
    this.x = x;
    this.y = y;
    this.image = new Image();
    this.image.src = imageSrc;
    this.image.onload = () => this.loaded = true;
    this.loaded = false;
  }

  draw(){
    if(!this.loaded) return;
    ctx.drawImage(this.image, this.x, this.y, canvas.width, canvas.height);
  }
}

levelBackground = new sprite({x: 0, y: 0}, './images/backgroundLevel1.png');



///// Game loop /////
function draw(){
  const deltaTime = getDeltaTime() ;

  levelBackground.draw();

  collisionBlocks.forEach(block => block.draw());

  player.draw();

  player.update(deltaTime);

  if(keys.left) player.velX = -player.speed;
  else if(keys.right) player.velX = player.speed;
  else player.velX = 0;
  if(keys.up && player.velY == 0) player.velY = -player.jumpHeight;

  drawFPS(ctx);
}

createConstantFPSGameLoop(desiredFPS, draw);