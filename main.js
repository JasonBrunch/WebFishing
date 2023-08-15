//global variables
let rod;
const gameContainer = document.getElementById('game-area');

const config = {
    type: Phaser.AUTO,
    width: gameContainer.offsetWidth,
    height: gameContainer.offsetHeight,
    parent: 'game-area', // This tells Phaser to append the canvas to the specified element
    scene: {
      preload: preload,
      create: create,
      update: update
    }
};

function preload() {
  // Load assets
  this.load.spritesheet('fish', 'FishSpriteSheetTest.png', { frameWidth: 64, frameHeight: 64 });
  this.load.spritesheet('hooks','HookSpriteSheet.png',{frameWidth: 64, frameHeight: 64});
  this.load.image('fishingRod','FishingRod.png');
  this.load.image('guyInBoat', 'GuyInABoat.png')

}
  // Create objects, initialize variables, set up the game world
function create() {
  //initialize variables
  this.isLineCast = false;
  this.isCastable = true;
  this.isFishOn = false;
  
  
  this.cameras.main.setBackgroundColor('#FFC0CB'); // Light Pink
  //Reel button
  this.buttonShape = this.add.graphics({ fillStyle: { color: 0x00AA00 } }); // Change color as you wish
  this.buttonShape.fillRect(400, 10, 150, 50); // x, y, width, height
  this.buttonShape.setInteractive(new Phaser.Geom.Rectangle(400, 10, 150, 50), Phaser.Geom.Rectangle.Contains);
  this.buttonText = this.add.text(450, 25, 'Reel', { color: '#ffffff' }); // Change position and text as you wish
  this.onClickButton = () => {
      reelLine(this);

  };
  // Then add the event listener
  this.buttonShape.on('pointerdown', this.onClickButton);

  //Create water
  let water = {
    graphics: this.add.graphics(),
    x: 0,
    y: gameContainer.offsetHeight * 0.25, // Start at 25% down from the top
    width: gameContainer.offsetWidth,
    height: gameContainer.offsetHeight * 0.75, // Take up 75% of the height
    fillColor: 0x0000FF,
    draw: function() {
        this.graphics.fillStyle(this.fillColor, 1);
        this.graphics.fillRect(this.x, this.y, this.width, this.height);
    },
    contains: function(x, y) {
        return x >= this.x && x <= this.x + this.width && y >= this.y && y <= this.y + this.height;
    },
    // More methods as needed
  };

  //Fish animation
  this.anims.create({
    key: 'swim',
    frames: this.anims.generateFrameNumbers('fish', { start: 0, end: 2 }), 
    frameRate: 5, // Adjust this value to set the speed of the animation
    repeat: -1 // -1 means the animation will repeat indefinitely
  });
  
  // Create an instance of the FishManager
  this.fishManager = new FishManager(this, water);
  // Create some fish using the FishManager
  this.fishManager.createFish(10);
  // Draw the water
  water.draw();      
  // Store the water object in the scene so you can access it elsewhere
  this.water = water;

  // Add the boat guy first (using a temporary y-coordinate)
  let boatGuy = this.add.sprite(125, 125, 'guyInBoat');
  // Determine the y-coordinate for the boat guy, considering the sprite's height
  let boatGuyY = this.water.y - boatGuy.height / 2; // Assuming the anchor point is at the center of the sprite
  // Update the boat guy's y-coordinate to the correct value
  boatGuy.setY(boatGuyY);

  // Determine where the rod's origin should be, relative to the boat guy
  let rodOffsetX = -30; // Example value, adjust as needed
  let rodOffsetY = 10; // Example value, adjust as needed
  let rodX = boatGuy.x + rodOffsetX;
  let rodY = boatGuy.y + rodOffsetY;

  rod = this.add.sprite(rodX,rodY,'fishingRod');
  rod.setOrigin(0, 1); // Set the origin to the bottom-left corner
  
  createSlider.call(this);
}


/////////////////////////UPDATE SECTION//////////////////////////////////
const CHECK_BAIT_INTERVAL = 1000;
let accumulatedTime = 0;

function update(delta) {
  this.fishManager.activateFish();

  // Increment the accumulated time by the delta (time since last frame)
  accumulatedTime += delta;

  if (accumulatedTime >= CHECK_BAIT_INTERVAL) {
    checkBaitStatus(this); // Call the standalone function with the scene as the context
    accumulatedTime = 0; // Resetting the accumulated time
  }
}

function checkBaitStatus(scene) {
  // ONLY CHECK BAIT IF IT'S CASTED
  if (scene.isLineCast && !scene.isFishOn) {
    if (currentBait) {
      let baitLocation = currentBait.getLocation();
      // Check if baitLocation is not null before proceeding
      if (baitLocation) {
        scene.fishManager.fishes.forEach(fish => fish.checkBait(baitLocation));
      } else {
        console.error('Bait location is null!'); // Logging error if bait location is null
      }
    } else {
      console.error('Current bait is null!'); // Logging error if currentBait is null
    }
  }
}


const game = new Phaser.Game(config);

//Casting Slider Logic
function createSlider() {
  let sliderY = 20;
  let sliderX = 200;
  let sliderWidth = 200;
  let sliderBackground = this.add.rectangle(sliderX, sliderY, sliderWidth, 10, 0x000000);
  let slideAmount = 0;

  // Position the knob at the right end of the slider
  this.sliderKnob = this.add.rectangle(sliderX + (sliderWidth / 2), sliderY, 20, 20, 0xFF0000);
  this.sliderKnob.setInteractive();
  this.input.setDraggable(this.sliderKnob);

  // Add the drag event to capture the movement of the slider
  this.sliderKnob.on('drag', (pointer, dragX, dragY) => {
    //First make sure casting is allowed
    if(this.isCastable == true){

    

      // Make sure to constrain the dragX to the bounds of the slider
      this.sliderKnob.x = Phaser.Math.Clamp(dragX, sliderX - (sliderWidth / 2), sliderX + (sliderWidth / 2));

      slideAmount = this.sliderKnob.x - (sliderX + (sliderWidth / 2));
      slideAmount = Math.abs(this.sliderKnob.x - (sliderX + (sliderWidth / 2)));
      

      let angle = Phaser.Math.Linear(0, -90, slideAmount / 200);
      rod.setAngle(angle);

    }
  });

  // Add the dragend event to reset the knob to the right end of the slider
  this.sliderKnob.on('dragend', () => {
    if(this.isCastable == true){
      this.sliderKnob.x = sliderX + (sliderWidth / 2); // Reset the knob to the right end
      
      //call a cast line method and pass in the slideAmount
      castLine(this, slideAmount);
      //set isCastable to false
      this.isCastable = false;
      this.isLineCast = true;
      
      slideAmount = 0;
      rod.setAngle(0);
    }
  });
}

