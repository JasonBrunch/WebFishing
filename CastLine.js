let lineGraphics;
let bobber;
let hookSprite;

function castLine(sceneContext, power) {
        

        console.log("CASTING WITH POWER: " + power);

        let offsetX = 0; // Example value, adjust as needed
        let offsetY = 30; // Example value, adjust as needed

        let startX = rod.x + rod.width + offsetX;
        let startY = rod.y - rod.height + offsetY;

        let minX = startX; // Minimum x-coordinate is the starting x-coordinate
        let maxX = gameContainer.offsetWidth * 0.9; // 90% of the screen width

        // Map the power value (0 to 200) to the x-coordinate range (minX to maxX)
        let endX = Phaser.Math.Linear(minX, maxX, power / 200);
        let endY = game.scene.scenes[0].water.y; // Clamp to the water's surface

        // Depth of the line into the water, you can adjust this value
        let depth = 250;
        let endYDepth = endY + depth; // Adding depth to endY

        // Draw a red circle at the starting point
        //let startCircle = game.scene.scenes[0].add.circle(startX, startY, 5, 0xff0000);

        // Draw a red circle at the ending point, this can be used for the bobber
        bobber = game.scene.scenes[0].add.circle(endX, endY, 5, 0xff0000);

        // Draw a black line between the start and end points (horizontal casting line)
        lineGraphics = game.scene.scenes[0].add.graphics();
        lineGraphics.lineStyle(2, 0x000000);
        lineGraphics.lineBetween(startX, startY, endX, endY);

        // Draw a black line from the water's surface down to the depth (vertical line)
        lineGraphics.lineBetween(endX, endY, endX, endYDepth);

        // Create the hook sprite at the end of the line
        hookSprite = createHook(sceneContext, endX, endYDepth, 'hooks');

 
    
}
function reelLine(sceneContext) {
        if (sceneContext.isLineCast) {

            // Remove the line graphics by destroying the object
            if (lineGraphics) {
                lineGraphics.clear();
                lineGraphics.destroy();
            }
            if(bobber){
                bobber.destroy();
            }
            if (hookSprite) {
                hookSprite.destroy();
            }
            sceneContext.isLineCast = false;
            sceneContext.isCastable = true;
    
        }
    }