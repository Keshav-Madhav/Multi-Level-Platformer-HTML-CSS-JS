///// Variable declarations /////

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// height and width of the canvas
var width = window.innerWidth;
var height = window.innerHeight;

// desired frames per second
const desiredFPS = 120;


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
  }

  draw(){
    ctx.fillStyle = 'red';
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  update(deltaTime){
    this.x += this.velX * deltaTime;
    this.y += this.velY * deltaTime;

    if(this.x + this.width > canvas.width || this.x < 0){
      this.velX *= -1;
    }
    if(this.y + this.height > canvas.height || this.y < 0){
      this.velY *= -1;
    }
  }
}
const player = new Player(100, 100, 64, 64, 6, 2);

///// Game loop /////
function draw(){
  const deltaTime = getDeltaTime() * 100;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  player.draw();

  player.update(deltaTime);

  drawFPS(ctx);
}

createConstantFPSGameLoop(desiredFPS, draw);