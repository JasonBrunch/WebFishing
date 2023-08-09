class Fish {
  constructor(scene, water, x, y, texture) {
    this.scene = scene; // Storing the Phaser scene
    this.water = water; // Storing the water boundaries

    // Creating the sprite and storing it in the instance
    this.sprite = this.scene.add.sprite(x, y, texture, 0);

    // Set an initial target for the fish
    this.movementTarget = this.generateNewTarget();
  }

  // Generates a new random target within the water boundaries
  generateNewTarget() {
    let targetX = this.water.x + Math.random() * this.water.width;
    let targetY = this.water.y + Math.random() * this.water.height;
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

    // Check if the target has been reached
    if (Math.abs(this.sprite.x - this.movementTarget.x) < speed && Math.abs(this.sprite.y - this.movementTarget.y) < speed) {
      // If so, generate a new target
      this.movementTarget = this.generateNewTarget();
    }
  }
}