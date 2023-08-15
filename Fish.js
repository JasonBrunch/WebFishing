class Fish {
  constructor(scene, water, x, y, texture) {
    this.scene = scene; // Storing the Phaser scene
    this.water = water; // Storing the water boundaries
    this.isSwimming = true;
    this.isBaited = false;
    this.isHooked = false;
    this.biteDistance = 10;

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
  checkBait(baitLocation) {
    if(this.isSwimming){
      // Get fish position (assuming you have a method to get the position)
      let fishPosition = this.getPosition();

      // Calculate the distance between the fish and the bait
      let dx = baitLocation.x - fishPosition.x;
      let dy = baitLocation.y - fishPosition.y;
      let distance = Math.sqrt(dx * dx + dy * dy);

      // Compare the distance to the bait's lure distance
      if (distance <= currentBait.lureDistance) {
          this.isBaited = true;
          this.isSwimming = false;
      } 
      else {
        // console.log("Fish is not attracted to the bait.");
      }
    }
  //FISH TRIES TO TAKE A BITE OF BAIT
    if(this.isBaited){
      //check how far away the bait is
      let fishPosition = this.getPosition();

      // Calculate the distance between the fish and the bait
      let dx = baitLocation.x - fishPosition.x;
      let dy = baitLocation.y - fishPosition.y;
      let distance = Math.sqrt(dx * dx + dy * dy)

      //if in range consider a bite:
      if(distance <= this.biteDistance){
        let biteChoice = this.considerBiting();
        if(biteChoice == false){
        }
        if(biteChoice == true){
        this.bite();


        }
      }
    }
  }
  

  considerBiting(){
    if (Math.random() < 0.5) {
      return false;
    } else {
      return true;
    }
  }
bite(){
  console.log("FISH BITES THE HOOK")
  this.sprite.setFrame(3);
  //replace the hook sprite with this sprite, but delete the hook sprite...

  //set this guy to bite mode remove is baited
  this.isBaited = false;
  this.isHooked = true;
  //trigger all isbaited fish to swim away
  this.scene.fishManager.fishHooked();
  //trigger a bite mode to get all the other fish to swim away while this one hangs out on the hook here.
}


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
    if(this.isSwimming){
      let speed = 1;
     this.moveTowardsTarget(this.movementTarget,speed)

      // Check if the target has been reached
      if (Math.abs(this.sprite.x - this.movementTarget.x) < speed && Math.abs(this.sprite.y - this.movementTarget.y) < speed) {
        // If so, generate a new target
        this.movementTarget = this.generateNewTarget();
      }
    }

    if(this.isBaited){
      let speed = 0.1;
      let baitLocation = currentBait.getLocation();

      this.movementTarget = baitLocation;

      //Check if close to target
      if (Math.abs(this.sprite.x - this.movementTarget.x) < speed && Math.abs(this.sprite.y - this.movementTarget.y) < speed) {
            console.log("Fish reached Target");
          }
      else{
          console.log("Baited Fish has not reached target");
        let directionX = this.movementTarget.x - this.sprite.x;
        let directionY = this.movementTarget.y - this.sprite.y;
        this.moveTowardsTarget(this.movementTarget, speed)
      }
      

      
    
    }
  }
  getPosition() {
    return { x: this.sprite.x, y: this.sprite.y };
  }
  biteOn(){
    console.log("Bite On Starting");
    if(this.isBaited){
      this.isBaited = false;
      this.isSwimming = true;
    }
  }
}