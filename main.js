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
  // Reel button
  createButton(this, 400, 10, 150, 50, 'Reel', () => reelLine(this));
  //new test reel button
  createButton(this, 600, 10, 150, 50, 'Test', () => testReelLine(this));
  //Create water
  this.water = createWater(this, gameContainer);
  //Fish animation
  createFishAnimation(this);
  // Create an instance of the FishManager
  this.fishManager = new FishManager(this, this.water);
  // Create some fish using the FishManager
  this.fishManager.createFish(10);
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

////////////////////////////////UPDATE SECTION//////////////////////////////////
function update(delta) {
  this.fishManager.activateFish(delta); // This will handle both fish activation and bait checking
}

const game = new Phaser.Game(config);

/////////////////////////FUNCTIONS SECTION ///////////////////////////////////
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

function createButton(scene, x, y, width, height, text, callback) {
  const buttonShape = scene.add.graphics({ fillStyle: { color: 0x00AA00 } });
  buttonShape.fillRect(x, y, width, height);
  buttonShape.setInteractive(new Phaser.Geom.Rectangle(x, y, width, height), Phaser.Geom.Rectangle.Contains);

  const buttonText = scene.add.text(x + width / 4, y + height / 4, text, { color: '#ffffff' });
  buttonShape.on('pointerdown', callback);
}
function createWater(scene, gameContainer) {
  const water = {
    graphics: scene.add.graphics(),
    x: 0,
    y: gameContainer.offsetHeight * 0.25,
    width: gameContainer.offsetWidth,
    height: gameContainer.offsetHeight * 0.75,
    fillColor: 0x0000FF,
    draw() {
      this.graphics.fillStyle(this.fillColor, 1);
      this.graphics.fillRect(this.x, this.y, this.width, this.height);
    },
    contains(x, y) {
      return x >= this.x && x <= this.x + this.width && y >= this.y && y <= this.y + this.height;
    }
  };
  water.draw(); // draw the water initially
  return water;
}
function createFishAnimation(scene) {
  scene.anims.create({
    key: 'swim',
    frames: scene.anims.generateFrameNumbers('fish', { start: 0, end: 2 }),
    frameRate: 5, // Adjust this value to set the speed of the animation
    repeat: -1 // -1 means the animation will repeat indefinitely
  });
}

