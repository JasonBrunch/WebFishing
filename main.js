//global variables
let rod;
const gameContainer = document.getElementById('game-area');
let backgroundMusic;
let isMusicPlaying = false; 
let initialYValue = gameContainer.offsetHeight * 0.6; // existing code
let backgroundYValue = gameContainer.offsetHeight * 0.4; // new code
let sliderY = 100;
let sliderX = 150;
let playerScore = 0;

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

  let loadingText = this.add.text(gameContainer.offsetWidth / 2, gameContainer.offsetHeight / 2, 'Loading...', { color: '#ffffff' });
  loadingText.setOrigin(0.5, 0.5);

  this.load.on('progress', (value) => {
    loadingText.setText(`Loading... ${parseInt(value * 100)}%`);
  });

  this.load.on('complete', () => {
    loadingText.destroy();
  });
  // Load assets
  this.load.spritesheet('fish', 'FishSpriteSheetTest.png', { frameWidth: 64, frameHeight: 64 });
  this.load.spritesheet('hooks','HookSpriteSheet.png',{frameWidth: 64, frameHeight: 64});
  this.load.image('fishingRod','FishingRod.png');
  this.load.image('soundBtnSprite','SoundBtnSprite.png');
  this.load.image('ReelBtnSprite','ReelBtn.png');
  this.load.image('castBtnSprite','castBtn.png');
  this.load.image('woodenBoatSprite', 'WoodenBoat.png');
  this.load.image('guySprite','Guy.png');


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
  
  
  // Add the boat guy first (using a temporary y-coordinate)
  let guyInBoat = this.add.sprite(300,125,'guySprite');
  let boatSprite = this.add.sprite(300, 125, 'woodenBoatSprite');
  
  
  
  //Create water
  this.water = createWater(this, gameContainer, initialYValue, sunCenterX, sunCenterY);

  //Fish animation
  createFishAnimation(this);
  // Create an instance of the FishManager
  this.fishManager = new FishManager(this, this.water);
  // Create some fish using the FishManager
  this.fishManager.createFish(10);
  




  // Determine the y-coordinate for the boat guy, considering the sprite's height
  let boatY = this.water.y; // Assuming the anchor point is at the center of the sprite

  // Update the boat guy's y-coordinate to the correct value
  boatSprite.setY(boatY);
  guyInBoat.setY(boatY);
  

  //put the guy in his boat

  // Determine where the rod's origin should be, relative to the boat guy
  let rodOffsetX = -30; // Example value, adjust as needed
  let rodOffsetY = 10; // Example value, adjust as needed
  let rodX = boatSprite.x + rodOffsetX;
  let rodY = boatSprite.y + rodOffsetY;

  rod = this.add.sprite(rodX,rodY,'fishingRod');
  rod.setOrigin(0, 1); // Set the origin to the bottom-left corner
  
  createSlider.call(this);

  this.bubbles = createBubbles(this, this.water);

  this.scoreText = this.add.text(gameContainer.offsetWidth - 250, 10, `Score: ${playerScore}`, { fontSize: '32px', fill: '#fff' });
}

////////////////////////////////UPDATE SECTION//////////////////////////////////
function update(delta) {
  if (this.isReeling) {
    testReelLine(this);
  }
  this.fishManager.activateFish(delta); // Existing code
  updateBubbles(this.bubbles, this.water);
  this.water.updateSurface();
  this.water.draw(this, sunCenterX, sunCenterY);
}

const game = new Phaser.Game(config);

/////////////////////////FUNCTIONS SECTION ///////////////////////////////////
function createFishAnimation(scene) {
  scene.anims.create({
    key: 'swim',
    frames: scene.anims.generateFrameNumbers('fish', { start: 0, end: 2 }),
    frameRate: 5, // Adjust this value to set the speed of the animation
    repeat: -1 // -1 means the animation will repeat indefinitely
  });
}


