///// Variable declarations /////

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// desired frames per second
const desiredFPS = 120;

// gravity
const gravity = 9.81;

const keys = {
  left: false,
  right: false,
  up: false
}

let paused = false;


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
  if( event.key == 'p'){
    paused = !paused;
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

window.addEventListener('resize', function(){
  collisionBlocks.forEach(block => block.updateSize());
  player.updateSize();
});

window.addEventListener('blur', function(){
  paused = true;
});

window.addEventListener('focus', function(){
  paused = false;
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
    this.speed = this.width * 6;
    this.jumpHeight = this.height * 20;
    this.collisionBlocks = collisionBlocks;
  }

  draw(){
    ctx.fillStyle = 'rgba(0, 0, 255, 0.5)';
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  update(deltaTime){
    this.x += this.velX * deltaTime;

    this.checkHorzCollision(deltaTime);

    this.y += this.velY * deltaTime;
    this.velY += gravity * deltaTime * 350;

    this.checkVertCollision(deltaTime);
  }

  checkHorzCollision(deltaTime){
    //floor collision
    for(let i=0; i< this.collisionBlocks.length; i++){
      const block = this.collisionBlocks[i];

      if(collisionDetection({object1: this, object2: block})){
        if(this.velX * deltaTime > 0){
          this.velX = 0;
          const offset= this.x - this.x + this.width;
          this.x = block.x - offset - 0.01;
          break;
        }
        if(this.velX * deltaTime < 0){
          this.velX = 0;
          const offset= this.x - this.x;
          this.x = block.x + block.width -offset + 0.01;
          break
        }
      }
    }
  }

  checkVertCollision(deltaTime){
    //floor collision
    for(let i=0; i< this.collisionBlocks.length; i++){
      const block = this.collisionBlocks[i];

      if(collisionDetection({object1: this, object2: block})){
        if(this.velY*deltaTime > 0){
          this.velY = 0;
          const offset= this.y - this.y + this.height;
          this.y = block.y - offset  - 0.01;
          break;
        }
        if(this.velY*deltaTime < 0){
          this.velY = 0;
          const offset= this.y - this.y;
          this.y = block.y + block.height - offset + 0.01;
          break;
        }
      }
    }
  }

  updateSize(){
    this.x = Math.floor(this.x / this.width) * cellSize;
    this.y = Math.floor(this.y / this.height) * cellSize;
    this.width = cellSize/2;
    this.height = cellSize/2;
    this.speed = this.width * 6;
    this.jumpHeight = this.height * 20;
  }
}
const player = new Player(canvas.width/2, canvas.height/2, cellSize/2, cellSize/2, 0, 0);

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

  if(!paused){
    player.update(deltaTime);

    if(keys.left) player.velX = -player.speed;
    else if(keys.right) player.velX = player.speed;
    else player.velX = 0;
    if(keys.up && player.velY === 0) player.velY = -player.jumpHeight;
  }

  drawFPS(ctx);
}

createConstantFPSGameLoop(desiredFPS, draw);