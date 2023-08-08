class Fish {
    constructor(type, x, y) {
        this.spriteSheet = testFishSpriteSheet;
        this.x = x;
        this.y = y;
        this.frameNumber = 1;
        this.spriteWidth = 64;
        this.spriteHeight = 64;
        this.cols = 4;
    }

    


    draw(ctx) {
        
        let row = Math.floor((this.frameNumber - 1) / this.cols);
        let col = (this.frameNumber - 1) % this.cols;
    
        let sourceX = col * this.spriteWidth; 
        let sourceY = row * this.spriteHeight;
    
        console.log(`Drawing sprite at: x=${this.x}, y=${this.y}`);
        console.log(`Source: x=${sourceX}, y=${sourceY}`);
        console.log(`Dimensions: width=${this.spriteWidth}, height=${this.spriteHeight}`);
    
        ctx.drawImage(
            this.spriteSheet, 
            sourceX, sourceY, 
            this.spriteWidth, this.spriteHeight, 
            this.x, this.y, 
            this.spriteWidth, this.spriteHeight
        );
        
       /*
       ctx.drawImage(this.spriteSheet, this.x, this.y);

       // Logging to help with debugging
       console.log(`Drawing entire sprite sheet at: x=${this.x}, y=${this.y}`);
        */

    }

    // Other fish-related methods can go here
}
