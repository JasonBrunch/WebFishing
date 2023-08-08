class Fish {
    constructor(type, x, y, speedX = 1, speedY = 1) { // You can set default values or pass them in when creating the fish
      this.spriteSheet = testFishSpriteSheet;
      this.x = x;
      this.y = y;
      this.frameNumber = 1;
      this.spriteWidth = 64;
      this.spriteHeight = 64;
      this.cols = 4;
      this.speedX = speedX; // Initialize speedX
      this.speedY = speedY; // Initialize speedY
    }

    draw(ctx) {
        
        let row = Math.floor((this.frameNumber - 1) / this.cols);
        let col = (this.frameNumber - 1) % this.cols;
    
        let sourceX = col * this.spriteWidth; 
        let sourceY = row * this.spriteHeight;

        ctx.drawImage(
            this.spriteSheet, 
            sourceX, sourceY, 
            this.spriteWidth, this.spriteHeight, 
            this.x, this.y, 
            this.spriteWidth, this.spriteHeight
        );
        
     

    }

    update() {
        this.x += this.speedX; // Horizontal movement
        this.y += this.speedY; // Vertical movement
      }
    }
