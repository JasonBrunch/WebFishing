let fishingRod = window.fishingRod;

function castLine()
{
    let rodTip = getRodTipPosition();

    let target = getTarget();

    drawLine(rodTip, target);

}

function getRodTipPosition() {
    let rodRect = fishingRod.getBoundingClientRect();
    let rodBaseX = rodRect.left;
    let rodBaseY = rodRect.top + rodRect.height; // because y coordinate increases going down

    let rodAngleInDegrees = window.getRotation(fishingRod.style.transform);
    let rodAngleInRadians = (rodAngleInDegrees - 90) * Math.PI / 180; // Subtract 90 because 0 degrees in CSS is rightward, but in math it's upward

    let rodLength = rodRect.width; // this assumes the width of the rod div is the length of the rod

    let rodTipX = rodBaseX + rodLength * Math.cos(rodAngleInRadians);
    let rodTipY = rodBaseY - rodLength * Math.sin(rodAngleInRadians); // subtract because y coordinate increases going down

    return { x: rodTipX, y: rodTipY };
}