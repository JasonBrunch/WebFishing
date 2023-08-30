const sunConfig = {
    offsetX: 300, // Change these values to move the sun and gradient
    offsetY: 70  
};
let sunCenterX = 0;
let sunCenterY = 0;


function createBackground(scene, gameContainer) {
    // Calculate sun's position with offset
    sunCenterX = (gameContainer.offsetWidth / 2) + sunConfig.offsetX;
    sunCenterY = ((gameContainer.offsetHeight - backgroundYValue) / 2) + sunConfig.offsetY;

    // Create a canvas element for gradient
    var gradientCanvas = scene.textures.createCanvas('backgroundGradient', gameContainer.offsetWidth, gameContainer.offsetHeight);
    var ctx = gradientCanvas.context;

    // Create radial gradient
    const radius = Math.sqrt(sunCenterX * sunCenterX + sunCenterY * sunCenterY);
    var gradient = ctx.createRadialGradient(sunCenterX, sunCenterY, 0, sunCenterX, sunCenterY, radius);
    gradient.addColorStop(0, '#CC3700');  // Close to the sun: Darker Sunset orange
    //gradient.addColorStop(0.2, '#CC7000');  // Even closer: Darker shade of orange
    gradient.addColorStop(0.4, '#3A0066');  // Even closer: Darker Indigo
    gradient.addColorStop(1, '#000000');  // Edge: Pure black

    // Draw gradient on canvas
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, gameContainer.offsetWidth, backgroundYValue);

    // Refresh the texture so the drawn gradient gets reflected
    gradientCanvas.refresh();

    // Add the gradient background image
    let bg = scene.add.image(0, 0, 'backgroundGradient').setOrigin(0, 0);
    //bg.setDepth(0);

    // Add the sun using Phaser
    let sun = scene.add.circle(sunCenterX, sunCenterY, 50, 0xFF69B4, 1);
    sun.setAlpha(0.5);
    //sun.setDepth(1);
}