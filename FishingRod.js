class Bait {
    constructor(type, lureDistance) {
        this.type = type;
        this.lureDistance = lureDistance;
        this.sprite = null; // Add a property to store the sprite
    }

    setSprite(sprite) {
        this.sprite = sprite;
    }

    getLocation() {
        return this.sprite ? { x: this.sprite.x, y: this.sprite.y } : null;
    }
}
const wormBait = new Bait('Worm', 10)
let currentBait = wormBait;


function createHook(sceneContext, x, y, texture) {
    currentBait = wormBait;
    let sprite = sceneContext.add.sprite(x, y, texture, 0);
    sprite.setOrigin(0.5, 0); // Set the origin to the top middle
    currentBait.setSprite(sprite); // Store the sprite within the bait
    return sprite; 
}