class Collisions {
  constructor({x, y}){
    this.x= x;
    this.y= y;
    this.width= cellSize;
    this.height= cellSize;
  }
  
  draw(){
    ctx.fillStyle= 'rgba(255, 0, 0, 0.3)';
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  updateSize(){
    this.x = this.x/this.width * cellSize;
    this.y = this.y/this.height * cellSize;
    this.width= cellSize;
    this.height= cellSize;
  }
}
