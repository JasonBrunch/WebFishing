class Fish {
  constructor(scene, water, x, y, texture) {
    this.scene = scene; // Storing the Phaser scene
    this.water = water; // Storing the water boundaries
    this.swimSpeed = getRandomSwimSpeed(); // Calls the function to get a random swim speed
    this.laziness = 0.95;//stop at target timer
    this.isMoving = true;
    this.weight = this.getRandomWeight();
    this.sprite = this.scene.add.sprite(x, y, texture, 0);
    this.setUpSize(this.weight);
    this.state = 'swimming'; // Initial state for the fish
    this.fishType = 'Angler';
    
    this.biteDistance = 10; // Distance for biting

    // Creating the sprite and storing it in the instance
    

    this.depth = Math.random(); // Value between 0 (far) and 1 (near)
    // Apply a random opacity between 0.5 and 1
    this.sprite.alpha = 0.3 + (1 - this.depth) * 0.7; // Closer fish have higher opacity

    // Play the 'swim' animation
    this.sprite.anims.play('swim');

    // Set an initial target for the fish
    this.movementTarget = this.generateNewTarget();
  }
  getRandomWeight(min = 1, max = 10) {
    let weight = Math.random() * (max - min) + min;
    weight = parseFloat(weight.toFixed(1));
    return weight
  }
  setUpSize(weight){
    // Normalize the weight to a range of [0.5, 1.5]
    let scale = 0.5 + (weight / 10);
  
    // Apply the scale to the sprite
    this.sprite.setScale(scale, scale);
  }

  // Generates a new random target within the water boundaries
  generateNewTarget() {
    // Create a buffer of 200 pixels (or whatever you feel appropriate) on both sides
    let buffer = 500;
  
    // Now, the fish can have a target between water.x - buffer to water.x + water.width + buffer
    let targetX = this.water.x + Math.random() * (this.water.width + 2 * buffer) - buffer;

  
    // Determine the range for y-coordinate (e.g., 10% of fish sprite's height)
    let yRange = this.sprite.height;
  
    // Generate a random y value within the range of the current y-coordinate
    let targetY = this.sprite.y + (Math.random() * yRange - yRange / 2);
  
    // Ensure that the target y-coordinate is still within the water boundaries, considering the fish sprite's height
    targetY = Math.max(this.water.y + this.sprite.height, targetY);
    targetY = Math.min(this.water.y + this.water.height - this.sprite.height, targetY);
  
    return { x: targetX, y: targetY };
  }
  setDepth(newDepth) {
    // Ensure newDepth is between 0 and 1
    this.depth = Math.max(0, Math.min(1, newDepth));
  
    // Update the alpha value based on the new depth
    this.sprite.alpha = 0.3 + (1 - this.depth) * 0.7;
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

  this.setDepth(1); 

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

  // Calculate the scale based on weight
  let scale = 0.5 + (this.weight / 10);
  
  // Update the sprite's position
  this.sprite.x += directionX * speed;
  this.sprite.y += directionY * speed;

  // Flip the sprite if it's moving to the left
  if (directionX < 0) {
    this.sprite.setScale(-scale, scale); // Flips the sprite horizontally
  } else {
    this.sprite.setScale(scale, scale); // Resets the flip when moving right
  }
}
/////////////////////////////////FISH UPDATE SECTION/////////////////////////////////////////////////
updateFish() {
  if (this.state === 'swimming') {
    let speed = this.swimSpeed;

    // Check if the target has been reached
    if (Math.abs(this.sprite.x - this.movementTarget.x) < speed && Math.abs(this.sprite.y - this.movementTarget.y) < speed) {
      // If so, generate a new target
      this.reachedDestination();//sometimes pauses the fish sometimes moved to new target
    }
    if (this.isMoving) {
      this.moveTowardsTarget(this.movementTarget, speed);
    }


  }

  if (this.state === 'baited') {
    let speed = 0.1;
    let baitLocation = currentBait.getLocation();

    this.movementTarget = baitLocation;

    // Check if close to target
    if (Math.abs(this.sprite.x - this.movementTarget.x) < speed && Math.abs(this.sprite.y - this.movementTarget.y) < speed) {
      // DO SOMETHING?
    } 
    else {
      this.moveTowardsTarget(this.movementTarget, speed);
    }
  }
}
reachedDestination() {
  let randomValue = Math.random(); // Generates a random number between 0 and 1

  if (randomValue >= this.laziness) {
    //console.log("new movement target");
    this.movementTarget = this.generateNewTarget();
    this.isMoving = true; // The fish should move to the new target
  } else {
    //console.log("does nothing");
    this.isMoving = false; // The fish should not move
  }
}
getPosition() {
  return { x: this.sprite.x, y: this.sprite.y };
}
}

function getRandomSwimSpeed(min = 0.3, max = 1) {
  return Math.random() * (max - min) + min;
}