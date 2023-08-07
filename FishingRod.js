fishingRod = document.getElementById('fishing-rod');

let startMouseX = 0;
let startRotation = 0;
let totalRotation = 0;
let isMouseDown = false;
let isReeledIn = true;
let isCasting = false;

function handleMouseDown(event){

    startMouseX = event.clientX; //store the current mouseX position
    //check if line is reeled in
    if(isReeledIn)
    {
        startCast();
    }
    
    
}
function startCast(){
    
    isCasting = true;
    //rotate the rod
    startRotation = getRotation(fishingRod.style.transform);
    startRotation = getRotation(fishingRod.style.transform);
    
}

function handleMouseUp(event) {
    if(isCasting)
    {
        if (rodTipPosition.x === 0 && rodTipPosition.y === 0) return;  // Return early if rodTipPosition hasn't been set
        isMouseDown = false; // Set isMouseDown to false
        let currentRotation = getRotation(fishingRod.style.transform);
        
        if(fishingRod.style.transform !== startRotation)
        {
            HandleCast(totalRotation);
        }
        totalRotation = 0;
        fishingRod.style.transform = 'rotate(-30deg)';

        isCasting = false;
    }
  
}

function handleMouseMove(event) {
   
    /* adjust the rotation based on the mouse position */
    if(isCasting)
    {
        console.log("MOVING MOUSE!");
        let mouseX = event.clientX; //get current mouse pos
        let diffX = startMouseX - mouseX; //calculates the difference

        // Calculate the new rotation, taking into account the startRotation and clamping it between -180 and -30
        let newRotation = Math.max(-180, Math.min(-30, startRotation - diffX));
        totalRotation += newRotation - startRotation;
        
        // Set the rotation of the fishing Rod
        fishingRod.style.transform = `rotate(${newRotation}deg)`;
    }
}

function HandleCast(totalRotation){
    let absoluteRotation = Math.abs(totalRotation);
    let scaledRotation = absoluteRotation / 100;
    let castPower = Math.min(scaledRotation, 100); //caps it to a maximum of 100
    castLine(castPower);
}

// helper function to extract rotation angle from transform style
window.getRotation = function(transform) {
    let angle = transform.replace('rotate(','').replace('deg)','');
    return parseInt(angle);
}
function getRodTipPosition() {
    const rodBorderWidth = 3; // the border width in px that represents the rod
    const rodLength = 100 + rodBorderWidth; // adjust the rod's length
    const angle = -30; // fixed angle

    // Calculate tip position relative to rod's base
    let rodTipXRelative = rodLength * Math.cos(Math.PI / 6); // 30 degrees in radians
    let rodTipYRelative = rodLength * Math.sin(Math.PI / 6);

    // Get the rod's base coordinates on screen
    let rodRect = fishingRod.getBoundingClientRect();
    let rodBaseX = rodRect.left;
    let rodBaseY = rodRect.bottom;

    // Adjust relative coordinates
    let rodTipX = rodBaseX + rodTipXRelative;
    let rodTipY = rodBaseY - rodTipYRelative;

    return { x: rodTipX, y: rodTipY };
}
//THIS IS FOR TESTING IF OUR TIP FINDER IS WORKING:
function createTipIndicator(x, y) {
    let indicator = document.createElement('div');
    indicator.style.width = '10px';
    indicator.style.height = '10px';
    indicator.style.backgroundColor = 'red';
    indicator.style.position = 'absolute';

    // Adjusting for the indicator's size to center it on the rod tip
    indicator.style.left = `${x - 5}px`;  // half of its width
    indicator.style.top = `${y - 5}px`;  // half of its height

    indicator.style.borderRadius = '50%'; // makes it a circle
    indicator.style.zIndex = '1000'; // to ensure it appears above other elements

    document.body.appendChild(indicator);
}
function reelInLine() {
    // Check if a line exists and delete it
    if (currentLine) {
        currentLine.remove();
        currentLine = null;
    }
    isReeledIn = true;
}