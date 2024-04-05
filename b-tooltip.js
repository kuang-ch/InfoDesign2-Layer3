let clickedCounty;
let clickedText;
let clickedX1;
let clickedX2;
let clickedY1;
let clickedY2;
let clickedRed;
let clickedGreen;
let clickedBlue;
let tooltipClickedText;
let mouseClickedFlag = false;

function mouseClicked() {
  if (!mouseClickedFlag) {
    mouseClickedFlag = true;
  } else {
    mouseClickedFlag = false;
  }
}

// function clickedOutsideThreshold() {
//   if (mouseClicked) {
//     drawTooltip(clickedX1, clickedY1, clickedX2, clickedY2, clickedRed, clickedGreen, clickedBlue);
//   } else {
//     clickedX1 = 0;
//     clickedX2 = 0;
//     clickedY1 = 0;
//     clickedY2 = 0;
//     clickedRed = 0;
//     clickedGreen = 0;
//     clickedBlue = 0;
//   }
// }

function checkTooltip() {
  let stateSubarray = [];

  for (let i = 0; i < masterCountyData.length; i++) {
    let data = masterCountyData[i];
    let county = data.county;
    let state = data.state;
    let perPerson = data.perPerson;
    let perPersonText = perPerson.toFixed(2);
    let total = data.peopleTotal;

    let X1 = data.X1;
    let X2 = data.X2;
    let Y1 = data.Y1;
    let Y2 = data.Y2;
    let d = distToSegment(mouseX, mouseY, X1, Y1, X2, Y2);

    let red1 = data.red1;
    let green1 = data.green1;
    let blue1 = data.blue1;

    let stateSubarray = masterCountyData.filter(item => item.state === state);

    tooltipText = county + " county" + "\n" + state + "\n$" + perPersonText + " per participant" + "\n" + total + " total participants"; // Customize tooltip text as needed

    if (d < threshold) {
      if (!mouseClickedFlag) {
        drawTooltip(X1, Y1, X2, Y2, red1, green1, blue1, tooltipText);
      } else {
        clickedCounty = county;
        clickedText = tooltipText;
        clickedX1 = X1;
        clickedX2 = X2;
        clickedY1 = Y1;
        clickedY2 = Y2;
        clickedRed = red1;
        clickedGreen = green1;
        clickedBlue = blue1;
      }
    }
  }
}

// Function to draw tooltip
function drawTooltip(X1, Y1, X2, Y2, red1, green1, blue1, tooltipDisplay) {
  let popUpX = 925;
  let popUpY = window.scrollY;

  //background rectangle
  push();
  fill(255);
  rect(900, window.scrollY, 700, 800);
  pop();

  //Highlighted Line
  push();
  stroke(red1, green1, blue1);
  strokeWeight(2);
  line(X1, Y1, X2, Y2);
  pop();

  fill(255); // Tooltip background color
  noStroke(); // Tooltip border color
  fill(0); // Tooltip text color
  textFont(PPMono)
  text(tooltipDisplay, popUpX + 5, popUpY + 50); // Draw tooltip text
}

function distToSegment(x, y, x1, y1, x2, y2) {
  // Calculate the distance between a point (x, y) and a line segment defined by (x1, y1) and (x2, y2)
  let dx = x2 - x1;
  let dy = y2 - y1;
  let t = ((x - x1) * dx + (y - y1) * dy) / (dx * dx + dy * dy);
  t = constrain(t, 0, 1);
  let distX = x - (x1 + t * dx);
  let distY = y - (y1 + t * dy);
  return sqrt(distX * distX + distY * distY);
}