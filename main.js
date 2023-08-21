//global variables
let rod;
const gameContainer = document.getElementById('game-area');
let backgroundMusic;
let isMusicPlaying = false; 

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

  //LOAD MUSIC FILE HERE:
  this.load.audio('backgroundMusic',"Alan Špiljak - On the edge of silence - Extended Mix.mp3");
}



//////////////////////////CREATE FUNCTION/////////////////////////////
// Create objects, initialize variables, set up the game world
function create() {
  //initialize variables
  this.isLineCast = false;
  this.isCastable = true;
  this.isFishOn = false;
  this.isReeling = false;
  createBackground(this, gameContainer);
  
  //new test reel button
  const reelButtonShape = createButton(this, 600, 10, 150, 50, 'Reel');
  reelButtonShape.on('pointerdown', () => this.isReeling = true);
  reelButtonShape.on('pointerup', () => this.isReeling = false);

  const testicleButtonShape = createButton(this,400,0,50,50,'test');
  testicleButtonShape.on('pointerdown', () => {
    testButtonFunction(this.fishManager, this);
  });
  backgroundMusic = this.sound.add('backgroundMusic',{loop: true});

  const musicToggle = () => {
    if (isMusicPlaying) {
      backgroundMusic.stop(); // Turn off music
      console.log("turned off music");
    } else {
      backgroundMusic.play(); // Play music
      console.log("Music turned On");
    }
    isMusicPlaying = !isMusicPlaying; // Toggle the state
  };

  const musicOnButton = createButton(this,800,0,50,50,'Music');
  musicOnButton.on('pointerdown', musicToggle); // use the local function
  

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

  this.bubbles = createBubbles(this, this.water);


  
}

////////////////////////////////UPDATE SECTION//////////////////////////////////
function update(delta) {
  if (this.isReeling) {
    testReelLine(this);
  }
  this.fishManager.activateFish(delta); // Existing code
  updateBubbles(this.bubbles, this.water);
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

function createButton(scene, x, y, width, height, text) {
  const buttonShape = scene.add.graphics({ fillStyle: { color: 0x00AA00 } });
  buttonShape.fillRect(x, y, width, height);
  buttonShape.setInteractive(new Phaser.Geom.Rectangle(x, y, width, height), Phaser.Geom.Rectangle.Contains);

  const buttonText = scene.add.text(x + width / 4, y + height / 4, text, { color: '#ffffff' });
  return buttonShape;
}
function createWater(scene, gameContainer) {
  const water = {
    graphics: scene.add.graphics(),
    x: 0,
    y: gameContainer.offsetHeight * 0.25,
    width: gameContainer.offsetWidth,
    height: gameContainer.offsetHeight * 0.75,
    fillColor: 0x0000FF,
    
    
    draw(scene) {
      // Create a canvas element
      var gradientCanvas = document.createElement('canvas');
      gradientCanvas.width = this.width;
      gradientCanvas.height = this.height;
    
      // Get the canvas rendering context
      var ctx = gradientCanvas.getContext('2d');
    
      // Create a linear gradient (from top to bottom)
      var gradient = ctx.createLinearGradient(0, 0, 0, this.height);
      gradient.addColorStop(0, '#0099FF'); // Top color
      gradient.addColorStop(1, '#000066'); // Bottom color
    
      // Apply the gradient to the entire canvas
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, this.width, this.height);
    
      // Create a Phaser texture from the canvas
      var gradientTexture = scene.textures.createCanvas('waterGradient', this.width, this.height);
      gradientTexture.context.drawImage(gradientCanvas, 0, 0);
      gradientTexture.refresh();
    
      // Draw the texture using an image object (instead of a Graphics object)
      scene.add.image(this.x, this.y, 'waterGradient').setOrigin(0, 0);
    },
    contains(x, y) {
      return x >= this.x && x <= this.x + this.width && y >= this.y && y <= this.y + this.height;
    }
  };
  water.draw(scene); // draw the water initially
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

function createBubbles(scene, water) {
  let numberOfBubbles = 10;
  let bubbles = [];

  for (let i = 0; i < numberOfBubbles; i++) {
    let x = Phaser.Math.Between(water.x, water.x + water.width);
    let y = Phaser.Math.Between(water.y, water.y + water.height);
    let bubble = scene.add.circle(x, y, 2, 0xFFFFFF, 0.5);
    bubble.speed = Phaser.Math.Between(1, 3);
    bubbles.push(bubble);
  }

  return bubbles;
}
function updateBubbles(bubbles, water) {
  for (let bubble of bubbles) {
    bubble.y -= bubble.speed;
    if (bubble.y < water.y) {
      bubble.y = water.y + water.height; // Reset the y position to the bottom of the water
      bubble.x = Phaser.Math.Between(water.x, water.x + water.width); // Randomize the x position
    }
  }
}
function testButtonFunction(fishmanager, scene){
  let testicleFish = fishmanager.createOneFish();
  showFishCaughtScreen(scene, testicleFish);
}


function createBackground(scene, gameContainer) {
  // Create a canvas element
  var gradientCanvas = document.createElement('canvas');
  gradientCanvas.width = gameContainer.offsetWidth;
  gradientCanvas.height = gameContainer.offsetHeight;

  // Get the canvas rendering context
  var ctx = gradientCanvas.getContext('2d');

  // Create a linear gradient (from top to bottom)
  var gradient = ctx.createLinearGradient(0, 0, 0, gradientCanvas.height);
  gradient.addColorStop(0, '#000044'); // Top color (dark blue)
  gradient.addColorStop(1, '#FFC0CB'); // Bottom color (light pink)

  // Apply the gradient to the entire canvas
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, gradientCanvas.width, gradientCanvas.height);

  // Create a Phaser texture from the canvas
  var gradientTexture = scene.textures.createCanvas('backgroundGradient', gradientCanvas.width, gradientCanvas.height);
  gradientTexture.context.drawImage(gradientCanvas, 0, 0);
  gradientTexture.refresh();

  // Draw the texture using an image object
  scene.add.image(0, 0, 'backgroundGradient').setOrigin(0, 0);
}


