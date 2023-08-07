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

