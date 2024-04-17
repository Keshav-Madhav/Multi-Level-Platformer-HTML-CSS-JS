const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

//resize canvas
window.addEventListener('resize', resizeCanvas);
function resizeCanvas() {
  var width = window.innerWidth;
  var height = window.innerHeight;
  
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

  ctx.fillStyle = 'gray';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}
resizeCanvas();

function draw(){
  const deltaTime = getDeltaTime();

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'gray';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  requestAnimationFrame(draw);
}
draw();
