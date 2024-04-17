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

class sprite {
  constructor({x, y}, imageSrc, isbg=true, frameRate=1){
    this.x = x;
    this.y = y;
    this.image = new Image();
    this.image.src = imageSrc;
    this.image.onload = () => {
      this.loaded = true;
      this.width = this.image.width / frameRate;
      this.height = this.image.height;
    }
    this.loaded = false;
    this.isbg = isbg;
    this.frameRate = frameRate;
    this.currentFrame = 0;
    this.elapsedTime = 0;
    this.frameBuffer = 5;
  }

  draw(deltaTime){
    if(!this.loaded) return;
    if(this.isbg) ctx.drawImage(this.image, this.x, this.y, canvas.width, canvas.height);
    else{
      const cropx = this.width * this.currentFrame;
      const cropy = 0;
      const cropWidth = this.width;
      const cropHeight = this.height;

      ctx.drawImage(this.image, cropx, cropy, cropWidth, cropHeight, this.x, this.y, this.width, this.height);
      this.updateFrames();
    };
  }

  updateFrames(){
    this.elapsedTime ++;
    if(this.elapsedTime % this.frameBuffer === 0){
      this.currentFrame = (this.currentFrame + 1) % this.frameRate;
    }
  }
}

levelBackground = new sprite({x: 0, y: 0}, './images/backgroundLevel1.png');

class Player extends sprite{
  constructor(x, y, imageSrc, frameRate) {
    super({x, y}, imageSrc, false, frameRate);
    this.x = x;
    this.y = y;
    this.velX = 0;
    this.velY = 0;
    this.speed = cellSize * 3;
    this.jumpHeight = cellSize * 10;
    this.collisionBlocks = collisionBlocks;
    this.hitbox = {
      x: this.x + 60,
      y: this.y + 34,
      width: 45,
      height: 56
    }
  }

  update(deltaTime){
    ctx.fillStyle= 'rgba(0, 0, 0, 0.3)';
    ctx.fillRect(this.x, this.y, this.width, this.height);

    this.x += this.velX * deltaTime;

    this.updateHitbox();

    this.checkHorzCollision(deltaTime);

    this.y += this.velY * deltaTime;
    this.velY += gravity * deltaTime * 350;

    this.updateHitbox();

    this.checkVertCollision(deltaTime);

    ctx.fillStyle= 'rgba(255, 0, 0, 0.3)';
    ctx.fillRect(this.hitbox.x, this.hitbox.y, this.hitbox.width, this.hitbox.height);
  }

  updateHitbox(){
    this.hitbox={
      x: this.x + 60,
      y: this.y + 34,
      width: 45,
      height: 56
    }
  }

  checkHorzCollision(deltaTime){
    //floor collision
    for(let i=0; i< this.collisionBlocks.length; i++){
      const block = this.collisionBlocks[i];

      if(collisionDetection({object1: this.hitbox, object2: block})){
        if(this.velX * deltaTime > 0){
          this.velX = 0;
          const offset= this.hitbox.x - this.x + this.hitbox.width;
          this.x = block.x - offset - 0.01;
          break;
        }
        if(this.velX * deltaTime < 0){
          this.velX = 0;
          const offset=  this.hitbox.x - this.x;
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

      if(collisionDetection({object1: this.hitbox, object2: block})){
        if(this.velY*deltaTime > 0){
          this.velY = 0;
          const offset= this.hitbox.y - this.y + this.hitbox.height;
          this.y = block.y - offset  - 0.01;
          break;
        }
        if(this.velY*deltaTime < 0){
          this.velY = 0;
          const offset= this.hitbox.y - this.y;
          this.y = block.y + block.height - offset + 0.01;
          break;
        }
      }
    }
  }

  updateSize(){
    this.speed = this.width * 3;
    this.jumpHeight = this.height * 10;
  }
}
const player = new Player(canvas.width/2, canvas.height/2, './images/king/idle.png', 11);



///// Game loop /////
function draw(){
  const deltaTime = getDeltaTime() ;

  levelBackground.draw();

  collisionBlocks.forEach(block => block.draw());

  player.draw(deltaTime);

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