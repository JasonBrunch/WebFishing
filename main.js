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
  //LOADING SCREEN
  let loadingText = this.add.text(gameContainer.offsetWidth / 2, gameContainer.offsetHeight / 2, 'Loading...', { color: '#ffffff' });
  loadingText.setOrigin(0.5, 0.5);
  this.load.on('progress', (value) => {
  loadingText.setText(`Loading... ${parseInt(value * 100)}%`);
  });
  this.load.on('complete', () => {
    loadingText.destroy();
  });
  //LOAD SPRITES
  this.load.spritesheet('fish', 'FishSpriteSheetTest.png', { frameWidth: 64, frameHeight: 64 });
  this.load.spritesheet('hooks','HookSpriteSheet.png',{frameWidth: 64, frameHeight: 64});
  this.load.spritesheet('musicBtnSpriteSheet','MusicBtns.png',{frameWidth: 64, frameHeight: 64});
  this.load.image('fishingRod','FishingRod.png');
  //this.load.image('soundBtnSprite','SoundBtnSprite.png');
  this.load.image('ReelBtnSprite','ReelBtn.png');
  this.load.image('castBtnSprite','castBtn.png');
  this.load.image('woodenBoatSprite', 'WoodenBoat.png');
  this.load.image('guySprite','Guy.png');
  this.load.image('conversationBackground','conversationBubble.png');
  //LOAD MUSIC 
  this.load.audio('backgroundMusic',"The_Bubbling_Stream.mp3");
}

//////////////////////////CREATE FUNCTION/////////////////////////////
function create() {
  //SCENE VARIABLES
  this.isLineCast = false;
  this.isCastable = true;
  this.isFishOn = false;
  this.isReeling = false;

  createBackground(this, gameContainer);
  this.reelBtn = createReelBtn(this);
  backgroundMusic = this.sound.add('backgroundMusic',{loop: true});
  const createMusicBtn = createMusicBtnFunction(this);

  let guyInBoat = this.add.sprite(250,125,'guySprite');//temporary Y coordinates, changes later
  rod = createFishingRod(this, guyInBoat);
  let boatSprite = this.add.sprite(300, 140, 'woodenBoatSprite');
  this.water = createWater(this, gameContainer, initialYValue, sunCenterX, sunCenterY);

  createFishAnimation(this);

  this.fishManager = new FishManager(this, this.water);
  this.fishManager.createFish(10);
  
  //SET UP THE BOAT GUYS POSITION RELATIVE TO THE WATER
  let boatY = this.water.y - 10; // Assuming the anchor point is at the center of the sprite
  boatSprite.setY(boatY);
  guyInBoat.setY(boatY - 30);
  
  createSlider.call(this);
  this.bubbles = createBubbles(this, this.water);
  
  this.scoreText = this.add.text(gameContainer.offsetWidth - 180, 10, `Score: ${playerScore}`, { fontSize: '32px', fill: '#fff' });
  
  
  
  
  /*
  //TEST FOR THE FISH CAUGHT SCREEN - DELETE LATER
  const testicleButtonShape = createButton(this,400,0,50,50,'test');
  testicleButtonShape.on('pointerdown', () => {
    testFishCaughtScreen(this.fishManager, this);
     });
    */
 
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


