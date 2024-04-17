// Instructions and Theory:

// Delta time is a concept used in game development to keep track of the time that has passed between frames.
// This is useful for creating smooth animations and for making sure that the game runs at the same speed on different devices.

// The deltaTime function takes a single argument, currentTime, which is the current time in milliseconds.
// If no argument is provided, the default value is 0.
// Call this function at the beginning of your game loop and get the deltaTime value returned

// For Eg: Call this function at the beginning of the draw function, assign the value to a variable and multiply it 
// with any velocity you wish to follow consistently across different devices.

// function draw(){
//   const deltaTime = getDeltaTime();

//   object.x += object.velX * deltaTime;
//   object.y += object.velY * deltaTime;

//   requestAnimationFrame(draw);
// }
// draw();

let lastTime = 0;

function getDeltaTime(currentTime = 0) {
  const deltaTime = (currentTime - lastTime) / 1000;
  lastTime = currentTime;
  return deltaTime;
}