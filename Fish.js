class Fish {
  constructor(scene, water, x, y, texture) {
    this.scene = scene; // Storing the Phaser scene
    this.water = water; // Storing the water boundaries

    this.state = 'swimming'; // Initial state for the fish
    
    this.biteDistance = 10; // Distance for biting

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
///////////////////////FISH CHECKS BAIT SECTION///////////////////////////////////
fishCheckBait() {
  if (!currentBait) {
    console.error("No current bait set");
    return; // Early return if no current bait is set
  }
  let baitLocation = currentBait.getLocation(); 

  if (this.state === 'swimming') {
    let fishPosition = this.getPosition();
    let dx = baitLocation.x - fishPosition.x;
    let dy = baitLocation.y - fishPosition.y;
    let distance = Math.sqrt(dx * dx + dy * dy);

    // Compare the distance to the bait's lure distance
    if (distance <= currentBait.lureDistance) { // Directly access currentBait.lureDistance
      this.state = 'baited';
      this.baitInterest = 0; // Reset or initialize the interest counter
    }
  }

  if (this.state === 'baited') {
    this.baitInterest++; // Increment the interest counter

    if (this.baitInterest >= 3) { // Check if enough interest has accumulated
      // Check how far away the bait is
      let fishPosition = this.getPosition();
      let dx = baitLocation.x - fishPosition.x;
      let dy = baitLocation.y - fishPosition.y;
      let distance = Math.sqrt(dx * dx + dy * dy);

      // If in range, consider a bite
      if (distance <= this.biteDistance) {
        let biteChoice = this.considerBiting();
        if (biteChoice) {
          this.bite();
        }
      }
    }
  }
}
  
//////////////////////////////////////FISH BITING SECTION///////////////////////////////
considerBiting() {
  return Math.random() < 0.5;
}

bite() {
  console.log("FISH BITES THE HOOK");
  this.state = 'hooked';
  // Turn off the animation
  this.sprite.anims.pause();

  this.sprite.setFrame(3);

  // Replace the hook sprite with this sprite, but delete the hook sprite...
  swapHookSpriteTexture(this.scene, this.sprite.texture.key, 3);
  this.sprite.setVisible(false); // Set the fish sprite's visibility to false

  // Trigger all baited fish to swim away
  this.scene.fishManager.fishHooked(this);
  // Trigger a bite mode to get all the other fish to swim away while this one hangs out on the hook here.
}

biteOn() {
  // Make all fish except the one that bit swim away
  if (this.state === 'baited') {
    console.log("DEBUGGED");
    this.state = 'swimming'; // Update state to swimming
    // Get a random movement target
    this.movementTarget = this.generateNewTarget();
    // Swim away
    this.moveTowardsTarget(this.movementTarget, 1);
  }
}





////////////////////////////////SWIMMING SECTION/////////////////////////////

  moveTowardsTarget(target, speed) {
    let directionX = target.x - this.sprite.x;
    let directionY = target.y - this.sprite.y;

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
  }
/////////////////////////////////FISH UPDATE SECTION///////////////////////////////////////
updateFish() {
  if (this.state === 'swimming') {
    let speed = 1;
    this.moveTowardsTarget(this.movementTarget, speed);

    // Check if the target has been reached
    if (Math.abs(this.sprite.x - this.movementTarget.x) < speed && Math.abs(this.sprite.y - this.movementTarget.y) < speed) {
      // If so, generate a new target
      this.movementTarget = this.generateNewTarget();
    }
  }

  if (this.state === 'baited') {
    let speed = 0.1;
    let baitLocation = currentBait.getLocation();

    this.movementTarget = baitLocation;

    // Check if close to target
    if (Math.abs(this.sprite.x - this.movementTarget.x) < speed && Math.abs(this.sprite.y - this.movementTarget.y) < speed) {
      // DO SOMETHING?
    } else {
      this.moveTowardsTarget(this.movementTarget, speed);
    }
  }
}

getPosition() {
  return { x: this.sprite.x, y: this.sprite.y };
}
}