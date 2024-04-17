let cellSize = 64;

window.addEventListener('resize', resizeCanvas);
function resizeCanvas() {
  let width = window.innerWidth;
  let height = window.innerHeight;
  
  // Check if height exceeds the 16:9 ratio
  if(height > width * 0.5625) {
    height = width * 0.5625;
  } else {
    width = height * 1.77777778;
  }

  // Calculate the width and height based on the cell size and maintain the aspect ratio
  width = Math.floor(width / cellSize) * cellSize;
  height = Math.floor(width * 0.5625 / cellSize) * cellSize;

  cellSize = (height / 9 + width / 16) / 2;

  canvas.width = width;
  canvas.height = height;
}
resizeCanvas();
