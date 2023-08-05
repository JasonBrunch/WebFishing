var fishingRod = document.getElementById('fishing-rod');

let startMouseX = 0;
let isMouseDown = false;

document.addEventListener('mousedown', function(event){
    /*Rotate Fishing Rod*/
    startMouseX = event.clientX; //store the current mouseX position
    isMouseDown = true; 
    console.log("Mouse down event triggered");
});

document.addEventListener('mouseup', function() {
    isMouseDown = false; // Set isMouseDown to false
    console.log("Mouse up event triggered");
});

document.addEventListener('mousemove', function(event) {
    /* adjust the rotation based on the mouse position */
    if(isMouseDown)
    {
        let mouseX = event.clientX; //get current mouse pos
        let diffX = mouseX - startMouseX; //calculates the difference
        //Calculate the new rotation( clamped beween 0 and 180 so you dont rotate past the horizon)
        let newRotation = Math.max(0, Math.min(180, diffX));
        //Det the rotation of the fishing Rod
        fishingRod.style.transform = `rotate(${newRotation}deg)`;
        console.log("Mouse move event triggered with isMouseDown set to true");
    }
});

