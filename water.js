function createWater(scene, gameContainer, yValue, sunCenterX, sunCenterY) {
    const water = {
      graphics: scene.add.graphics(),
      x: 0,
      y: backgroundYValue,
      width: gameContainer.offsetWidth,
      height: gameContainer.offsetHeight - backgroundYValue,
      fillColor: 0x0000FF,
  
      draw(scene, sunCenterX, sunCenterY) {
        // Remove any existing water image before drawing new one
        if (this.waterImage) this.waterImage.destroy();
        
        // Create a canvas element
        var gradientCanvas = document.createElement('canvas');
        gradientCanvas.width = this.width;
        gradientCanvas.height = this.height;
      
        // Get the canvas rendering context
        var ctx = gradientCanvas.getContext('2d');
      
        // Create a radial gradient (from the sun position)
        var gradient = ctx.createRadialGradient(sunCenterX, sunCenterY - backgroundYValue, 0, sunCenterX, sunCenterY - backgroundYValue, Math.sqrt(this.width * this.width + this.height * this.height));
        gradient.addColorStop(0, '#0099FF'); // Near the sun
        gradient.addColorStop(1, '#000066'); // Far from the sun
      
        // Apply the gradient to the entire canvas
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, this.width, this.height);
      
        // Create a Phaser texture from the canvas
        var gradientTexture = scene.textures.createCanvas('waterGradient', this.width, this.height);
        gradientTexture.context.drawImage(gradientCanvas, 0, 0);
        gradientTexture.refresh();
      
        // Draw the texture using an image object (instead of a Graphics object)
        this.waterImage = scene.add.image(this.x, this.y, 'waterGradient').setOrigin(0, 0);
      },
      contains(x, y) {
        return x >= this.x && x <= this.x + this.width && y >= this.y && y <= this.y + this.height;
      },
      updateY(newY, sunCenterX, sunCenterY) {
        this.y = newY;
        this.draw(scene, sunCenterX, sunCenterY); // Redraw the water
      }
    };
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