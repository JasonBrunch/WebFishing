
let maxCastDistance = 500;
let currentLine = null;
let depth = 100;

function castLine(castPower)
{
    if (isNaN(castPower)) {
        console.error('Invalid castPower: NaN');
        return;  // Exit the function if castPower is NaN
    }
    isReeledIn = false;
    let target = getTarget(castPower);
 
    currentLine = drawLineWithHook(target); // Save the line globally after it's drawn
    

}

function getTarget(castPower){
    console.log(`Cast Power: ${castPower}`);
    console.log(`RodTipPosition: ${JSON.stringify(rodTipPosition)}`);
    let waterY = document.getElementById("water").getBoundingClientRect().top; //gets the y-coordinate of the top of the water
    let castDistance = (castPower / 100) * maxCastDistance; //cast power is out of 100 so this scales it to the max distance to gives a value between 0 and 1
    let target = {x: rodTipPosition.x + castDistance, y: waterY}; //returns the xy coordinate for the target on the water

    return target;

}

function drawLine(target) {  
    let svgNameSpace = "http://www.w3.org/2000/svg";

    // Create new SVG element
    let svg = document.createElementNS(svgNameSpace, "svg");
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "100%");
    svg.style.position = "absolute";
    svg.style.top = 0;
    svg.style.left = 0;
    svg.style.zIndex = 1;
    svg.style.pointerEvents = "none";

    // Line from rod tip to target
    let line1 = document.createElementNS(svgNameSpace, "line");
    line1.setAttribute('x1', rodTipPosition.x);
    line1.setAttribute('y1', rodTipPosition.y);
    line1.setAttribute('x2', target.x);
    line1.setAttribute('y2', target.y);
    line1.setAttribute('stroke', 'black');
    line1.setAttribute('stroke-width', '2');

    // Line going downwards from target
    let line2 = document.createElementNS(svgNameSpace, "line");
    line2.setAttribute('x1', target.x);
    line2.setAttribute('y1', target.y);
    line2.setAttribute('x2', target.x); // x remains the same because we're going vertically down
    line2.setAttribute('y2', target.y + depth);  // add the depth to the y-coordinate
    line2.setAttribute('stroke', 'black');
    line2.setAttribute('stroke-width', '2');

    // Add lines to the SVG element and SVG to the document body
    svg.appendChild(line1);
    svg.appendChild(line2);
    document.body.appendChild(svg);

    return svg;
}
function drawLineWithHook(target) { 
    let svg = drawLine(target);  // assuming drawLine returns the SVG element as before

    // Create hook element (as SVG path for simplicity)
    let hook = document.createElementNS("http://www.w3.org/2000/svg", "path");
    hook.setAttribute('d', "M0 0 Q0 -5, 5 -5 T10 0");
    hook.setAttribute('fill', 'none');
    hook.setAttribute('stroke', 'black');
    hook.setAttribute('stroke-width', '2');
    
    // Position the hook at the end of the vertical line and rotate it
    let transform = `translate(${target.x}, ${target.y + depth}) rotate(90, 0, 0)`;
    hook.setAttribute('transform', transform);

    svg.appendChild(hook);

    // Event listener to detect fish bite, or you could use a collision detection function in your game loop
    hook.addEventListener('mouseover', function() {
        console.log("Fish bite detected!");
    });

    return svg;  // Return the SVG container which now has both line and hook
}



