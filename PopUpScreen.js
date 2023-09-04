function showFishCaughtScreen(scene, fish) {
  // Create a background rectangle with a border
  const bgRect = scene.add.sprite(scene.cameras.main.centerX + 90, scene.cameras.main.centerY + -200, 'conversationBackground');
  bgRect.setDepth(0);

  // Create a new sprite using the fish's texture key
  const fishSprite = scene.add.sprite(bgRect.x - 200, bgRect.y, fish.sprite.texture.key);

  // Create text for the "Fish Caught" title
  const titleText = scene.add.text(bgRect.x + -125, bgRect.y - 50, 'You Caught A Fish!', { 
    fontSize: '32px', 
    fontFamily: 'PixelFont2',
    fontStyle: 'bold',
    align: 'left', 
    fill: '#FFFFFF' // Hex code for white
});; 

  const nameText = scene.add.text(titleText.x, titleText.y + 40, 'Type: ' + fish.fishType, { fontSize: '24px', align: 'center', fill: '#FFFFFF' }); 

  // Display fish stats
  const statsText = scene.add.text(titleText.x, titleText.y + 75, `Weight: ` + fish.weight + 'lbs', { fontSize: '18px', align: 'left', fill: '#FFFFFF' });
  const fishWorth = setFishWorth(fish.weight);
  const fishWorthText = scene.add.text(titleText.x, titleText.y + 100, `Cash:   ` + fishWorth + '$', { fontSize: '18px', align: 'left', fill: '#FFFFFF' });
  // Create a close button
  const closeButtonObj = createRectangleButton(scene, bgRect.x + 200, bgRect.y + 55, 120, 40, 'Close');
  
  closeButtonObj.button.on('pointerdown', () => {
    bgRect.destroy();
    titleText.destroy();
    statsText.destroy();
    nameText.destroy();
    fishWorthText.destroy();  // Destroy the text showing fish worth
    fishSprite.destroy(); // Destroy the fish sprite
    closeButtonObj.button.text.destroy(); // Destroy the button text
    closeButtonObj.button.destroy(); // Destroy the button zone
    closeButtonObj.graphics.destroy(); // Destroy the button graphics
  
    // Update the score
    updateScore(fishWorth, scene);
  });}
function setFishWorth(weight) {
  const roundedWeight = Math.ceil(weight);  // Rounds up to the nearest whole number
  const fishWorth = roundedWeight * 1;  // Here, each weight unit is worth $1
  return fishWorth;
}
function updateScore(fishWorth, scene) {  // Pass scene as an argument
  playerScore += fishWorth;
  scene.scoreText.setText(`Score: $${playerScore}`);  // Use scene.scoreText
}
  
function createRectangleButton(scene, x, y, width, height, text) {
  const graphics = scene.add.graphics();
  graphics.lineStyle(2, 0xFFFFFF);  // 2 is the line width, 0xFFFFFF is white
  graphics.strokeRoundedRect(x - width / 2, y - height / 2, width, height, 16);  // 16 is the corner radius

  const buttonText = scene.add.text(x, y, text, { fontSize: '18px', align: 'center', fill: '#FFFFFF' }).setOrigin(0.5, 0.5);

  const button = scene.add.zone(x, y, width, height).setInteractive();

  // Attach text to the button so that it's destroyed together
  button.text = buttonText;

  // Make the button interactive and change the appearance on hover
  button.on('pointerover', () => {
    graphics.clear();
    graphics.lineStyle(2, 0xFFFFFF);
    graphics.fillStyle(0xFFFFFF, 0.3);  // 0.3 is the alpha value for semi-transparent white
    graphics.fillRoundedRect(x - width / 2, y - height / 2, width, height, 16);
    graphics.strokeRoundedRect(x - width / 2, y - height / 2, width, height, 16);
    scene.input.setDefaultCursor('pointer');
  });

  button.on('pointerout', () => {
    graphics.clear();
    graphics.lineStyle(2, 0xFFFFFF);
    graphics.strokeRoundedRect(x - width / 2, y - height / 2, width, height, 16);
    scene.input.setDefaultCursor('default');
  });

   return { button, graphics };
}