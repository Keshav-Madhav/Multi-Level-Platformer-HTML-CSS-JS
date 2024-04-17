let lastTime = 0;

function getDeltaTime(currentTime = 0) {
  const deltaTime = (currentTime - lastTime) / 1000;
  lastTime = currentTime;
  return deltaTime;
}