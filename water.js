function createWater(scene, gameContainer, yValue, sunCenterX, sunCenterY) {
    const numVertices = 100; // Number of points along the surface
    const amplitude = 5; // Height of the waves
    const frequency = 0.11; // How fast the wave moves
        
    const water = {
      graphics: scene.add.graphics(),
      x: 0,
      y: backgroundYValue,
      width: gameContainer.offsetWidth,
      height: gameContainer.offsetHeight - backgroundYValue,
      fillColor: 0x0000FF,

      surfaceVertices: Array.from({ length: numVertices }, (_, i) => i * (gameContainer.offsetWidth / (numVertices - 1))),
      tick: 0,

      updateSurface() {
        console.log("updateSurfacing......");
        this.tick += 0.02; // Adjust the value for speed
        for (let i = 0; i < this.surfaceVertices.length; i++) {
          const x = this.surfaceVertices[i];
          this.surfaceVertices[i] = Math.sin(this.tick + x * frequency) * amplitude;
        }
      },
    
      draw(scene, sunCenterX, sunCenterY) {
        // Clear existing graphics
        const graphics = this.graphics;
        graphics.clear();
        
        // Update the graphics to draw the wave curve based on updated surfaceVertices
        graphics.fillStyle(0x0000FF, 1);  // Set fill color to blue
        graphics.beginPath();
        graphics.moveTo(this.x, this.y); // Starting point
    
        // Draw the surface using surfaceVertices
        for (let i = 0; i < this.surfaceVertices.length; i++) {
            const x = this.x + i * (this.width / (this.surfaceVertices.length - 1));
            const y = this.y + this.surfaceVertices[i];
            graphics.lineTo(x, y);
        }
    
        graphics.lineTo(this.x + this.width, this.y + this.height);
        graphics.lineTo(this.x, this.y + this.height);
        graphics.closePath();
        graphics.fillPath();
    },
      
      contains(x, y) {
        return x >= this.x && x <= this.x + this.width && y >= this.y && y <= this.y + this.height;
      },
      updateY(newY, sunCenterX, sunCenterY) {
        this.y = newY;
        this.draw(scene, sunCenterX, sunCenterY); // Redraw the water
      }
    }
    
    water.draw(scene, sunCenterX, sunCenterY); // draw the water initially
    return water;
  }

  function createBubbles(scene, water) {
    let numberOfBubbles = 10;
    let bubbles = [];
  
    for (let i = 0; i < numberOfBubbles; i++) {
      let x = Phaser.Math.Between(water.x, water.x + water.width);
      let y = Phaser.Math.Between(water.y, water.y + water.height);
      
      let bubbleSize = Phaser.Math.Between(0.5, 15);
      let bubbleOpacity = 0.5 - ((bubbleSize - 0.5) / (15 - 0.5)) * 0.4;
  
      let bubble = scene.add.circle(x, y, bubbleSize, 0xFFFFFF, bubbleOpacity);
      bubble.speed = Phaser.Math.Between(5, 15); // Multiply the speed values by 10 or choose a higher range
      bubbles.push(bubble);
    }
  
    return bubbles;
  }
  function updateBubbles(bubbles, water) {
    for (let bubble of bubbles) {
      bubble.y -= bubble.speed * 0.1; // Multiplying by a fractional value to slow down the bubbles
      if (bubble.y < water.y) {
        bubble.y = water.y + water.height; // Reset the y position to the bottom of the water
        bubble.x = Phaser.Math.Between(water.x, water.x + water.width); // Randomize the x position
      }
    }
  }