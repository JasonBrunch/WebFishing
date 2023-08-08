document.addEventListener('mousedown', handleMouseDown);
document.addEventListener('mouseup', handleMouseUp);
document.addEventListener('mousemove', handleMouseMove);
let rodTipPosition = { x: 0, y: 0 };


document.getElementById('reel-button').addEventListener('click', function() {
    console.log("CLICK CLICK");
    // Your reeling in logic here
    reelInLine();
});





document.addEventListener('DOMContentLoaded', function() {
    rodTipPosition = getRodTipPosition();
    createTipIndicator(rodTipPosition.x, rodTipPosition.y);
});


const testFishSpriteSheet = loadSpriteSheet("FishSpriteSheetTest.png");

function loadSpriteSheet(src) {
    const image = new Image();
    image.src = src;
    image.onload = () => {
        console.log(`Sprite sheet ${src} loaded`);
        let myFish = createFish('testFish', 100, 100);
        drawFish(myFish);
        console.log("FISH MADE");


    };
    return image;
}

//FISH TESTING AREA
// Example of usage


