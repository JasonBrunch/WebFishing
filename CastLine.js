function castLine(power){
    console.log("CASTING WITH POWER: " + power);

    let offsetX = 0; // Example value, adjust as needed
    let offsetY = 30; // Example value, adjust as needed
    
    let startX = rod.x + rod.width + offsetX;
    let startY = rod.y - rod.height + offsetY;

    // The ending point of the first line (where it lands on the water's surface)
    let endX = startX + power;
    let endY = game.scene.scenes[0].water.y;

    // Depth of the line into the water, you can adjust this value
    let depth = 250;
    let endYDepth = endY + depth; // Adding depth to endY

    // Draw a red circle at the starting point
    let startCircle = game.scene.scenes[0].add.circle(startX, startY, 5, 0xff0000);

    // Draw a red circle at the ending point
    let endCircle = game.scene.scenes[0].add.circle(endX, endY, 5, 0xff0000);

    // Draw a black line between the start and end points (horizontal casting line)
    let lineGraphics = game.scene.scenes[0].add.graphics();
    lineGraphics.lineStyle(2, 0x000000);
    lineGraphics.lineBetween(startX, startY, endX, endY);

    // Draw a black line from the water's surface down to the depth (vertical line)
    lineGraphics.lineBetween(endX, endY, endX, endYDepth);
}