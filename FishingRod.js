class Bait {
    constructor(type, lureDistance) {
        this.type = type;
        this.lureDistance = lureDistance;
        this.sprite = null;
        this.bitePoint = null; // Add a property to store the bite point
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
}
const wormBait = new Bait('Worm', 100);
let currentBait = wormBait;


function createHook(sceneContext, x, y, texture) {
    currentBait = wormBait;
    let sprite = sceneContext.add.sprite(x, y, texture);
    sprite.setOrigin(0.5, 0); // Set the origin to the top-middle of the sprite

    let bitePoint = {
        x: sprite.x, // Center of the sprite
        y: sprite.y + sprite.height * 0.5 // Middle of the sprite
    };

    let hookPoint = {
        x: sprite.x, // Top-middle of the sprite
        y: sprite.y // Top of the sprite
    };

    // Draw a red circle at the bite point for visualization
    let circle = sceneContext.add.circle(bitePoint.x, bitePoint.y, 5, 0xff0000);

    currentBait.setSprite(sprite); // Store the sprite within the bait
    return { sprite: sprite, hookPoint: hookPoint }; // Return both sprite and hook point
}
function swapHookTexture(sceneContext, newTexture) {
    if (hookSprite) {
      hookSprite.setTexture(newTexture); // Change the texture
    }
  }