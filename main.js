
//buttons
document.getElementById('reel-button').addEventListener('click', function() {
    console.log("CLICK CLICK");
    // Your reeling in logic here
    reelInLine();
});



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
    this.load.image('fishingRod','FishingRod.png');
    this.load.image('guyInBoat', 'GuyInABoat.png')
  }
  
  function create() {
    // Create objects, initialize variables, set up the game world
    this.cameras.main.setBackgroundColor('#FFC0CB'); // Light Pink
    // Create an instance of the FishManager
    this.fishManager = new FishManager(this);

    // Create a fish using the FishManager
    this.fishManager.createFish();
    let rod = this.add.sprite(125,125,'fishingRod');
    

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
    

    // ...
}


  
  function update() {
    // Update game logic, handle input, move characters, etc.
  }
  const game = new Phaser.Game(config);

