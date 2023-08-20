class Bait {
    constructor(type, lureDistance) {
        this.type = type;
        this.lureDistance = lureDistance;
        this.sprite = null;
        this.bitePoint = { x: 0, y: 0 }; // Initialize with a default value
    }

    setSprite(sprite) {
        this.sprite = sprite;
        this.bitePoint = {
            x: sprite.x, // Center of the sprite (origin is at top-middle)
            y: sprite.y + sprite.height * 0.5 // Middle of the sprite
        };
    }

    getLocation() {
        return this.bitePoint;
    }
    updateLocation(x, y) {
        this.bitePoint.x = x;
        this.bitePoint.y = y;
        if (this.sprite) { // Add this check to make sure sprite is not null
            this.sprite.x = x;
            this.sprite.y = y - this.sprite.height * 0.5; // Adjusting based on how you calculate the bite point
        }
    }
}
const wormBait = new Bait('Worm', 100);
let currentBait = wormBait;

class Hook {
    constructor(sceneContext, x, y, texture) {
        this.sprite = sceneContext.add.sprite(x, y, texture);
        this.sprite.setOrigin(0.5, 0);
        this.hookPoint = {
            x: this.sprite.x,
            y: this.sprite.y
        };
        this.bitePoint = {
            x: this.sprite.x,
            y: this.sprite.y + this.sprite.height * 0.5
        };
    }
    
    setSpriteTexture(newTexture, frameIndex) {
        this.sprite.setTexture(newTexture);
        if (typeof frameIndex !== 'undefined') {
            this.sprite.setFrame(frameIndex);
        }
        this.updateBitePoint();
    }
    
    updateBitePoint() {
        this.bitePoint = {
            x: this.sprite.x,
            y: this.sprite.y + this.sprite.height * 0.5
        };
    }
    
    // Other hook-related methods can be placed here
}

function createHook(sceneContext, x, y, texture) {
    let hook = new Hook(sceneContext, x, y, texture);
    return { sprite: hook.sprite, hookPoint: hook.hookPoint, bitePoint: hook.bitePoint };
}

function swapHookSpriteTexture(sceneContext, newTexture, frameIndex) {
    if (hookSprite) { // assuming hookSprite is globally accessible
        hookSprite.setTexture(newTexture, frameIndex);
    } else {
        console.error("hookSprite is not defined");
    }
}


let lineGraphics;
let bobber;

let hookSprite;
let hookPoint;
let rodOffsetX = 0; 
let rodOffsetY = 30; 

function castLine(sceneContext, power) {
   
        let startX = rod.x + rod.width + rodOffsetX;
        let startY = rod.y - rod.height + rodOffsetY;

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
        let hookInfo = createHook(sceneContext, endX, endYDepth, 'hooks');
    hookSprite = hookInfo.sprite;
    hookPoint = hookInfo.hookPoint;
    // Save bite point if you need it later
    let bitePoint = hookInfo.bitePoint;


    currentBait = wormBait;
    if (currentBait) {
        currentBait.updateLocation(hookSprite.x, hookSprite.y + hookSprite.height * 0.5);
    }

    

}

  function testReelLine(sceneContext) {
        if (sceneContext.isLineCast) {
            let reelSpeed = 5; // Speed at which the line reels in
            let startX = rod.x + rod.width + rodOffsetX;
            let startY = rod.y - rod.height + rodOffsetY;
    
            let reelingUp = hookSprite.x <= rod.x + rod.width; // Check if it's time to reel upwards
    
            if (reelingUp) {
                hookSprite.y -= reelSpeed; // Move the hook y-coordinate towards the bobber
                hookPoint.y -= reelSpeed;  // Update the hookPoint y-coordinate
            } else {
                bobber.x -= reelSpeed; // Move the bobber x-coordinate towards the boat
                hookSprite.x -= reelSpeed; // Move the hook x-coordinate towards the boat
                hookPoint.x -= reelSpeed;  // Update the hookPoint x-coordinate
            }
            // Check if current bait exists before updating its location
            if (currentBait) {
                currentBait.updateLocation(hookSprite.x, hookSprite.y + hookSprite.height * 0.5);
            }
    
            lineGraphics.clear();
            lineGraphics.lineStyle(2, 0x000000);
            lineGraphics.lineBetween(startX, startY, bobber.x, bobber.y); // Draw to the bobber
            lineGraphics.lineBetween(bobber.x, bobber.y, hookPoint.x, hookPoint.y); // Draw to the hookPoint

            // Check if the line has reached the closest point in y-direction
            if (reelingUp && hookSprite.y <= bobber.y) {
                reelLine(sceneContext); // Call reelLine to complete
            }
        }

function reelLine(sceneContext) {
        if (sceneContext.isLineCast) {

            //CHECK IF FISH IS CAUGHT and trigger a function with the following:
            if(currentFishHooked != null){
                
            //show the fish caught screen
            showFishCaughtScreen(sceneContext, currentFishHooked);
            
            }
            


            //set state of fish back to swimming
            sceneContext.fishManager.resetFish();
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
            currentFishHooked = null;
            
            
        }
    }
  
    }
    
    
    
    
    
    