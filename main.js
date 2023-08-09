//Controls events
document.addEventListener('mousedown', handleMouseDown);
document.addEventListener('mouseup', handleMouseUp);
document.addEventListener('mousemove', handleMouseMove);

//buttons
document.getElementById('reel-button').addEventListener('click', function() {
    console.log("CLICK CLICK");
    // Your reeling in logic here
    reelInLine();
});

//important variables..
//let rodTipPosition = { x: 0, y: 0 };


//stuff we want to set in the begining after dom loaded
//document.addEventListener('DOMContentLoaded', function() {
    //rodTipPosition = getRodTipPosition();
    //createTipIndicator(rodTipPosition.x, rodTipPosition.y);
//});


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
    // Load assets here, such as images or spritesheets
    this.load.spritesheet('fish', 'FishSpriteSheetTest.png', { frameWidth: 64, frameHeight: 64 });
  }
  
  function create() {
    // Create objects, initialize variables, set up the game world
    this.cameras.main.setBackgroundColor('#FFC0CB'); // Light Pink
    let fish = this.add.sprite(100, 100, 'fish', 0);//0 refers to sprite sheet frame

    
  }
  
  function update() {
    // Update game logic, handle input, move characters, etc.
  }
  const game = new Phaser.Game(config);

