fishingRod = document.getElementById('fishing-rod');

let startMouseX = 0;
let startRotation = 0;
let totalRotation = 0;
let isMouseDown = false;

function handleMouseDown(event){
    /*Rotate Fishing Rod*/
    startMouseX = event.clientX; //store the current mouseX position
    startRotation = getRotation(fishingRod.style.transform);
    isMouseDown = true; 
    
}

function handleMouseUp(event) {
    isMouseDown = false; // Set isMouseDown to false
    let currentRotation = getRotation(fishingRod.style.transform);
    
    if(fishingRod.style.transform !== startRotation)
    {
        HandleCast(totalRotation);
    }
    totalRotation = 0;
    fishingRod.style.transform = 'rotate(-30deg)';
}

function handleMouseMove(event) {
    /* adjust the rotation based on the mouse position */
    if(isMouseDown)
    {
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