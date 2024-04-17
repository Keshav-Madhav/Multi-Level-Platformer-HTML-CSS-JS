// Instructions and Theory:

// The FPS display function is used to calculate the frames per second (FPS) of a game or animation.
// It uses a simple formula to calculate the FPS based on the time elapsed between frames.
// The FPS value is then displayed on the canvas to provide real-time feedback to the user.

// The drawFPS function takes a single required argument, context, which is the 2D rendering context of the canvas.
// It also takes four optional arguments: positionX, positionY, BackgroundColor, and TextColor.
// Call this function at the end of your game loop to display the FPS on the canvas. 
// It will automatically update the FPS value every second and display it on the canvas.

// For Eg: Call this function at the end of the draw function and pass the canvas context as an argument.
// You can also customize the position and colors of the FPS display by passing additional arguments.

// function draw(){
//   .. game logic ..

//   drawFPS(ctx, 5, 10, 'rgba(255, 255, 255, 0.5)', 'black');
//   -- OR -- 
//   drawFPS(ctx);

//   requestAnimationFrame(draw);
// }
// draw();

let fps = 60;
let fpsInterval = 1000 / fps;
let lastFrameTime = Date.now();
let lastframe = 0;
let frameCount = 0;
let currentFps = 0;

function drawFPS(context, positonX = 5, positionY = 10, BackgroundColor = 'rgba(255, 255, 255, 0.5)', TextColor = 'black'){
  // Calculate FPS
  frameCount++;
  let now = Date.now();
  let elapsed = now - lastFrameTime;
  if (elapsed > fpsInterval) {
      currentFps = Math.round(frameCount / (elapsed / 1000));
      frameCount = 0;
      lastFrameTime = now;
  }

  // Draw FPS on canvas
  context.clearRect(0, 0, 60, 15); // Clear the area where FPS will be drawn
  context.fillStyle = BackgroundColor;
  context.fillRect(0, 0, 60, 15); // Background for FPS display
  context.fillStyle = TextColor;
  context.font = '11px sans-serif';
  context.fillText('FPS: ' + currentFps, positonX, positionY); // Align text against the left edge
}
