const fishCanvas = document.getElementById('fish-canvas');
if (!fishCanvas) console.error('Fish canvas not found');
const ctx = fishCanvas.getContext('2d');
if (!ctx) console.error('Context not found');



function createFish(type, x, y) {
    const fish = new Fish(type, x, y);
    console.log('Fish created:', fish); // Log the created fish object
    return fish;
}

function drawFish(fish) {
    fish.draw(ctx);
}