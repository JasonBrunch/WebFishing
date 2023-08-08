const fishCanvas = document.getElementById('fish-canvas');
const ctx = fishCanvas.getContext('2d');

function resizeCanvas() {
  fishCanvas.width = window.innerWidth;
  fishCanvas.height = window.innerHeight;
}

// Call resizeCanvas when the page loads
resizeCanvas();

// Call resizeCanvas whenever the window is resized
window.addEventListener('resize', resizeCanvas);





const fishes = [];


function createFish(type, x, y, speedX = 1, speedY = 0) { // Added default values for speedX and speedY
    const fish = new Fish(type, x, y, speedX, speedY); // Passing speedX and speedY to the constructor
    console.log('Fish created:', fish); // Log the created fish object
    return fish;
}
function drawFish(fish) {
    fish.draw(ctx);
}
function animate() {
    ctx.clearRect(0, 0, fishCanvas.width, fishCanvas.height); // Clear the canvas
  
    fishes.forEach(fish => {
      fish.update(); // Update the fish's position
      drawFish(fish); // Draw the updated fish
    });
  
    requestAnimationFrame(animate); // Request the next frame
  }
  
  animate(); // Start the animation loop