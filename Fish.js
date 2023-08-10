class Fish {
  constructor(scene, water, x, y, texture) {
    this.scene = scene; // Storing the Phaser scene
    this.water = water; // Storing the water boundaries

    // Creating the sprite and storing it in the instance
    this.sprite = this.scene.add.sprite(x, y, texture, 0);

    // Play the 'swim' animation
  this.sprite.anims.play('swim');
    // Set an initial target for the fish
    this.movementTarget = this.generateNewTarget();
  }

  // Generates a new random target within the water boundaries
  generateNewTarget() {
    // Generate a new target x-coordinate within the water boundaries
    let targetX = this.water.x + Math.random() * this.water.width;
  
    // Determine the range for y-coordinate (e.g., 10% of fish sprite's height)
    let yRange = this.sprite.height * 0.1;
    
    // Generate a random y value within the range of the current y-coordinate
    let targetY = this.sprite.y + (Math.random() * yRange - yRange / 2);
  
    // Ensure that the target y-coordinate is still within the water boundaries
    targetY = Math.max(this.water.y, targetY);
    targetY = Math.min(this.water.y + this.water.height, targetY);
  
    return { x: targetX, y: targetY };
  }
  // You can add methods to move the fish, check boundaries, etc.
  updateFish() {
    // Move towards the target (you can adjust the speed)
    let speed = 1;
    let directionX = this.movementTarget.x - this.sprite.x;
    let directionY = this.movementTarget.y - this.sprite.y;

    // Normalize the direction
    let magnitude = Math.sqrt(directionX * directionX + directionY * directionY);
    directionX /= magnitude;
    directionY /= magnitude;

    // Update the sprite's position
    this.sprite.x += directionX * speed;
    this.sprite.y += directionY * speed;

    // Flip the sprite if it's moving to the left
  if (directionX < 0) {
    this.sprite.setScale(-1, 1); // Flips the sprite horizontally
  } else {
    this.sprite.setScale(1, 1); // Resets the flip when moving right
  }




    // Check if the target has been reached
    if (Math.abs(this.sprite.x - this.movementTarget.x) < speed && Math.abs(this.sprite.y - this.movementTarget.y) < speed) {
      // If so, generate a new target
      this.movementTarget = this.generateNewTarget();
    }
  }
}