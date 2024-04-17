let cellSize = 64;

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

  cellSize = (height / 9 + width / 16) / 2;

  canvas.width = width;
  canvas.height = height;
}
resizeCanvas();
