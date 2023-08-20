function showFishCaughtScreen(scene, fish) {
  // Create a background rectangle
  const bgRect = scene.add.rectangle(scene.cameras.main.centerX, scene.cameras.main.centerY, 400, 300, 0xFFFFFF);

  // Create a new sprite using the fish's texture key
  const fishSprite = scene.add.sprite(scene.cameras.main.centerX, scene.cameras.main.centerY, fish.sprite.texture.key);

  // Create text for the "Fish Caught" title
  const titleText = scene.add.text(scene.cameras.main.centerX, scene.cameras.main.centerY - 70, 'Fish Caught', { fontSize: '24px', align: 'center', fill: '#000' });
  titleText.setOrigin(0.5, 0.5);

  // Display fish stats
  const statsText = scene.add.text(scene.cameras.main.centerX, scene.cameras.main.centerY - 30, `Size: 10.2`, { fontSize: '18px', align: 'center', fill: '#000' });
  statsText.setOrigin(0.5, 0.5);

  // Create a close button
  const closeButton = createRectangleButton(scene, scene.cameras.main.centerX, scene.cameras.main.centerY + 100, 150, 50, 'Close');
  
  closeButton.on('pointerdown', () => {
    bgRect.destroy();
    titleText.destroy();
    statsText.destroy();
    fishSprite.destroy(); // Destroy the fish sprite
    closeButton.text.destroy(); // Destroy the button text
    closeButton.destroy();
  });
}
  
function createRectangleButton(scene, x, y, width, height, text) {
  const button = scene.add.rectangle(x, y, width, height, 0x00FF00);
  const buttonText = scene.add.text(x, y, text, { fontSize: '18px', align: 'center', fill: '#000' }).setOrigin(0.5, 0.5);

  // Attach text to the button so that it's destroyed together
  button.text = buttonText;

  // Make the button interactive
  button.setInteractive();

  // Optional: Change the cursor to a pointer when hovering over the button
  button.on('pointerover', () => scene.input.setDefaultCursor('pointer'));
  button.on('pointerout', () => scene.input.setDefaultCursor('default'));

  return button;
}