

function createHook(sceneContext, x, y, texture) {
    let sprite = sceneContext.add.sprite(x, y, texture, 0);
    sprite.setOrigin(0.5, 0); // Set the origin to the top middle
    return sprite; 
}