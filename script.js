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


///// Canvas setup /////

window.addEventListener('resize', resizeCanvas);
function resizeCanvas() {
  width = window.innerWidth;
  height = window.innerHeight;
  
  // Check if height exceeds the 16:9 ratio
  if(height > width * 0.5625) {
    height = width * 0.5625;
  } else {
    width = height * 1.77777778;
  }

  height = Math.floor(height/64) * 64;
  width = Math.floor(width/64) * 64;

  canvas.width = width;
  canvas.height = height;
}
resizeCanvas();



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

///// Game loop /////
function draw(){
  const deltaTime = getDeltaTime() ;
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  player.draw();

  player.update(deltaTime);

  if(keys.left) player.velX = -player.speed;
  else if(keys.right) player.velX = player.speed;
  else player.velX = 0;
  if(keys.up && player.velY == 0) player.velY = -player.jumpHeight;

  drawFPS(ctx);
}

createConstantFPSGameLoop(desiredFPS, draw);