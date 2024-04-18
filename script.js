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
  levelBackground.updateSprite();
  doors.forEach(door => door.updateSprite());
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
  constructor({x, y}, imageSrc, isbg=true, frameRate=1, animations = {}, frameBuffer=5, loop=true){
    this.x = x;
    this.y = y;
    this.image = new Image();
    this.image.src = imageSrc;
    this.image.onload = () => {
      this.loaded = true;
      this.width = this.image.width / frameRate  * cellSize / 64;
      this.height = this.image.height  * cellSize / 64;
    }
    this.loaded = false;
    this.isbg = isbg;
    this.frameRate = frameRate;
    this.currentFrame = 0;
    this.elapsedTime = 0;
    this.frameBuffer = frameBuffer;
    this.animations = animations;
    this.loop = loop;

    if(animations){
      for(const key in this.animations){
        const image = new Image();  
        image.src = this.animations[key].image;
        animations[key].image = image;
      }
    }
  }

  draw(deltaTime){
    if(!this.loaded) return;
    if(this.isbg) ctx.drawImage(this.image, this.x, this.y, canvas.width, canvas.height);
    else{
      const cropx = this.width * this.currentFrame  * 64 / cellSize;
      const cropy = 0;  
      const cropWidth = this.width * 64 / cellSize;
      const cropHeight = this.height * 64 / cellSize;

      ctx.drawImage(this.image, cropx, cropy, cropWidth, cropHeight, this.x, this.y, this.width, this.height);
      this.updateFrames();
    };
  }

  updateFrames(){
    this.elapsedTime ++;
    if(this.elapsedTime % this.frameBuffer === 0){
      this.currentFrame++;
      if(this.currentFrame >= this.frameRate){
        if(this.loop) this.currentFrame = 0;
        else this.currentFrame = this.frameRate - 1;
      }
    }
  }

  updateSprite(){
    // Update position
    const scaleFactor = cellSize / oldCellSize;
    this.x *= scaleFactor;
    this.y *= scaleFactor;

    // Update dimensions
    this.width = this.image.width / this.frameRate  * cellSize / 64;
    this.height = this.image.height  * cellSize / 64;
  }
}

levelBackground = new sprite({x: 0, y: 0}, './images/backgroundLevel1.png');

class Player extends sprite{
  constructor(x, y, imageSrc, frameRate, animations) {
    super({x, y}, imageSrc, false, frameRate, animations);
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
    
    this.x += this.velX * deltaTime;
    
    this.updateHitbox();
    
    this.checkHorzCollision(deltaTime);
    
    this.y += this.velY * deltaTime;
    this.velY += gravity * deltaTime * 350;
    
    this.updateHitbox();
    
    this.checkVertCollision(deltaTime);
    
    //ctx.fillStyle= 'rgba(0, 0, 0, 0.3)';
    //ctx.fillRect(this.x, this.y, this.width, this.height);
    //ctx.fillStyle= 'rgba(255, 0, 0, 0.3)';
    //ctx.fillRect(this.hitbox.x, this.hitbox.y, this.hitbox.width, this.hitbox.height);
  }

  switchSprite(animation){
    if(this.animations[animation].image === this.image) return;

    this.image = this.animations[animation].image;
    this.frameRate = this.animations[animation].frameRate;
    this.frameBuffer = this.animations[animation].frameBuffer;
    this.loop = this.animations[animation].loop;
    this.currentFrame = 0;
  }

  updateHitbox(){
    this.hitbox={
      x: this.x + 62 * cellSize / 64,
      y: this.y + 36 * cellSize / 64,
      width: 40 * cellSize / 64,
      height: 52 * cellSize / 64
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
    const scaleFactor = cellSize / oldCellSize;
    this.x *= scaleFactor;
    this.y *= scaleFactor;
  
    // Update dimensions
    this.width = this.image.width / this.frameRate * cellSize / 64;
    this.height = this.image.height * cellSize / 64;
  
    // Update speed and jump height
    this.speed * scaleFactor;
    this.jumpHeight * scaleFactor;
  
    // Update hitbox
    this.updateHitbox();
  }  
}

const player = new Player(
  canvas.width/2, 
  canvas.height/2, 
  './images/king/idle.png', 
  11, 
  animations={
    idleRight: {
      frameBuffer: 5,
      frameRate: 11,
      loop: true,
      image: './images/king/idle.png'
    },
    idleLeft: {
      frameBuffer: 5,
      frameRate: 11,
      loop: true,
      image: './images/king/idleLeft.png'
    },
    runLeft: {
      frameBuffer: 8,
      frameRate: 8,
      loop: true,
      image: './images/king/runLeft.png'
    },
    runRight: {
      frameBuffer: 8,
      frameRate: 8,
      loop: true,
      image: './images/king/runRight.png'
    }
  }
);

const doors=[
  new sprite( {x:cellSize*12, y:cellSize * 6 - cellSize * 1.77}, './images/doorOpen.png', false, frameRate=5,{}, frameBuffer=15, loop= false),
]


///// Game loop /////
function draw(){
  const deltaTime = getDeltaTime() ;

  levelBackground.draw();

  //collisionBlocks.forEach(block => block.draw());

  doors.forEach(door => door.draw());

  player.draw(deltaTime);

  if(!paused){
    player.update(deltaTime);

    if(keys.left) {
      player.velX = -player.speed;
      player.switchSprite('runLeft');
    }
    else if(keys.right) {
      player.velX = player.speed
      player.switchSprite('runRight');
    }
    else {
      player.velX = 0
      if(player.image.src.includes('runLeft')) player.switchSprite('idleLeft');
      if(player.image.src.includes('runRight')) player.switchSprite('idleRight');
    };
    if(keys.up && player.velY === 0) {
      player.velY = -player.jumpHeight;
    }
  }

  drawFPS(ctx);
}

createConstantFPSGameLoop(desiredFPS, draw);