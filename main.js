//global variables
let rod;
const gameContainer = document.getElementById('game-area');
let backgroundMusic;
let isMusicPlaying = false; 
let initialYValue = gameContainer.offsetHeight * 0.4;//water height drawn size intially
let sliderY = 100;
let sliderX = 150;

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
  this.load.image('guyInBoat', 'GuyInABoat.png');
  this.load.image('soundBtnSprite','SoundBtnSprite.png');
  this.load.image('ReelBtnSprite','ReelBtn.png');
  this.load.image('castBtnSprite','castBtn.png');

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
  //const reelButtonShape = createButton(this, 600, 10, 150, 50, 'Reel');
  this.reelBtnShape = this.add.sprite(sliderX, sliderY, 'ReelBtnSprite');
  this.reelBtnShape.setInteractive();
  this.reelBtnShape.setVisible(false);

  this.reelBtnShape.on('pointerdown', () => this.isReeling = true);
  this.reelBtnShape.on('pointerup', () => this.isReeling = false);

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

  const musicOnButton = this.add.sprite(gameContainer.offsetWidth - 30, 40, 'soundBtnSprite'); // Adjust 50 based on the size of your sprite
  musicOnButton.setInteractive();
  musicOnButton.on('pointerdown', musicToggle);
  

  //Create water
  this.water = createWater(this, gameContainer, initialYValue);

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
  let sliderWidth = 200;
  this.sliderBackground = this.add.rectangle(sliderX, sliderY, sliderWidth, 10, 0x000000);
  let slideAmount = 0;

  // Position the knob at the right end of the slider
  this.sliderKnob = this.add.sprite(sliderX + (sliderWidth / 2), sliderY, 'castBtnSprite');
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
      this.reelBtnShape.setVisible(true);
      this.sliderBackground.setVisible(false);
      this.sliderKnob.setVisible(false);
      
      slideAmount = 0;
      rod.setAngle(0);
      this.reelBtnShape.setPosition(this.sliderKnob.x, this.sliderKnob.y);

    
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
function createWater(scene, gameContainer, yValue) {
  const water = {
    graphics: scene.add.graphics(),
    x: 0,
    y: yValue || gameContainer.offsetHeight * 0.30, // use provided yValue or default
    width: gameContainer.offsetWidth,
    height: gameContainer.offsetHeight * 0.70,
    fillColor: 0x0000FF,

    draw(scene) {
      // Remove any existing water image before drawing new one
      if (this.waterImage) this.waterImage.destroy();
      
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
      this.waterImage = scene.add.image(this.x, this.y, 'waterGradient').setOrigin(0, 0);
    },
    contains(x, y) {
      return x >= this.x && x <= this.x + this.width && y >= this.y && y <= this.y + this.height;
    },
    updateY(newY) {
      this.y = newY;
      this.draw(scene); // Redraw the water
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
function testButtonFunction(fishmanager, scene){
  let testicleFish = fishmanager.createOneFish();
  showFishCaughtScreen(scene, testicleFish);
}


function createBackground(scene, gameContainer) {
  // Create a canvas element for gradient
  var gradientCanvas = scene.textures.createCanvas('backgroundGradient', gameContainer.offsetWidth, gameContainer.offsetHeight);
  var ctx = gradientCanvas.context;
  
  // Create radial gradient
  const centerX = gameContainer.offsetWidth / 2;
  const centerY = gameContainer.offsetHeight / 2;
  const radius = Math.sqrt(centerX * centerX + centerY * centerY);
  var gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
  gradient.addColorStop(0, '#FFC0CB');
  gradient.addColorStop(1, '#000044');
  
  // Draw gradient on canvas
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, gameContainer.offsetWidth, gameContainer.offsetHeight);
  
  // Refresh the texture so the drawn gradient gets reflected
  gradientCanvas.refresh();
  
// Add the sun using Phaser
//let sun = scene.add.circle(centerX, centerY, 50, 0xFFFF00, 1);
//sun.setDepth(1); // Higher value means it will be rendered on top

// Add the gradient background image
let bg = scene.add.image(0, 0, 'backgroundGradient').setOrigin(0, 0);
bg.setDepth(0); // Lower value means it will be rendered below
}


