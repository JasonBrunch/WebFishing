//let fishingRod = window.fishingRod;
let maxCastDistance = 500;

function castLine(castPower)
{

    let rodTip = getRodTipPosition();
    console.log(`rodTip: ${JSON.stringify(rodTip)}`);
    let target = getTarget(castPower, rodTip);
    console.log(`target: ${JSON.stringify(target)}`);
    let line = drawLine(rodTip, target);

}

function getRodTipPosition() {
  //GET THE CONSTANT POSTIION TEST ZONE FOR NOW
  const rodTip = { x: 100, y: 100 }; // Replace with your specific constant values
  return rodTip;
}

function getTarget(castPower, rodTip){
    let waterY = document.getElementById("water").getBoundingClientRect().top; //gets the y-coordinate of the top of the water
    let castDistance = (castPower / 100) * maxCastDistance; //cast power is out of 100 so this scales it to the max distance to gives a value between 0 and 1
    
    let target = {x: rodTip.x + castDistance, y: waterY}; //returns the xy coordinate for the target on the water
    console.log(`target.x: ${target.x}, target.y: ${target.y}`);
    return target;

}

function drawLine(rodTip, target)
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

    //Create a new line element and set its attributes
    let line = document.createElementNS(svgNameSpace, "line");
    
    console.log(`rodTip.x: ${rodTip.x}, rodTip.y: ${rodTip.y}, target.x: ${target.x}, target.y: ${target.y}`);
    line.setAttribute('x1', rodTip.x);
    line.setAttribute('y1', rodTip.y);
    line.setAttribute('x2', target.x);
    line.setAttribute('y2', target.y);
    line.setAttribute('stroke', 'black'); // set the color of the line
    line.setAttribute('stroke-width', '2'); // set the thickness of the line

    //add the line to the SVG element container, and the svg element to the document body
    svg.appendChild(line);
    document.body.appendChild(svg);

    return svg;
}