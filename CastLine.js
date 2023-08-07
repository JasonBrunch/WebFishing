
let maxCastDistance = 500;
let currentLine = null;

function castLine(castPower)
{
    if (isNaN(castPower)) {
        console.error('Invalid castPower: NaN');
        return;  // Exit the function if castPower is NaN
    }
    isReeledIn = false;
    let target = getTarget(castPower);
 
    currentLine = drawLine(target); // Save the line globally after it's drawn
    

}

function getTarget(castPower){
    console.log(`Cast Power: ${castPower}`);
    console.log(`RodTipPosition: ${JSON.stringify(rodTipPosition)}`);
    let waterY = document.getElementById("water").getBoundingClientRect().top; //gets the y-coordinate of the top of the water
    let castDistance = (castPower / 100) * maxCastDistance; //cast power is out of 100 so this scales it to the max distance to gives a value between 0 and 1
    let target = {x: rodTipPosition.x + castDistance, y: waterY}; //returns the xy coordinate for the target on the water

    return target;

}

function drawLine(target)
{
    let svgNameSpace = "http://www.w3.org/2000/svg"; //namespace where svg elements are kept

    //create new SVG element
    let svg = document.createElementNS(svgNameSpace, "svg");
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "100%");
    svg.style.position = "absolute";
    svg.style.top = 0;
    svg.style.left = 0;
    svg.style.zIndex = 1; //Line appears infront of other elements
    svg.style.pointerEvents = "none";
    //Create a new line element and set its attributes
    let line = document.createElementNS(svgNameSpace, "line");
    

    line.setAttribute('x1', rodTipPosition.x);
    line.setAttribute('y1', rodTipPosition.y);
    line.setAttribute('x2', target.x);
    line.setAttribute('y2', target.y);
    line.setAttribute('stroke', 'black'); // set the color of the line
    line.setAttribute('stroke-width', '2'); // set the thickness of the line

    //add the line to the SVG element container, and the svg element to the document body
    svg.appendChild(line);
    document.body.appendChild(svg);

    return svg;
}