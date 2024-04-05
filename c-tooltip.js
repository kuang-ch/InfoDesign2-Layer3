let mouseClickedFlag = false;
let clickedX;
let clickedY;

function mouseClicked() {
  if (!mouseClickedFlag) {
    mouseClickedFlag = true;
    clickedX = mouseX;
    clickedY = mouseY;
  } else {
    mouseClickedFlag = false;
    clickedX = 0;
    clickedY = 0;
  }
}

function checkThreshold() {  
  for (let i = 0; i < masterCountyData.length; i++) {
    let data = masterCountyData[i];
    let county = data.county;
    let state = data.state;
    let perPersonText = data.perPerson.toFixed(2);
    let total = data.total;

    let X1 = data.X1;
    let X2 = data.X2;
    let Y1 = data.Y1;
    let Y2 = data.Y2;

    let red1 = data.red1;
    let green1 = data.green1;
    let blue1 = data.blue1;

    let d = distToSegment(mouseX, mouseY, X1, Y1, X2, Y2);
    let e = distToSegment(clickedX, clickedY, X1, Y1, X2, Y2);
    tooltipText = county + " county" + "\n" + state + "\n$" + perPersonText + " per participant" + "\n" + total + " total participants"; // Customize tooltip text as needed

    // let stateSubarray = masterCountyData.filter(item => item.state === state);
    if (!mouseClickedFlag) {
      if (d < threshold) {
        drawTooltip(X1, Y1, X2, Y2, red1, green1, blue1, tooltipText);
      }
    } else {
      if (e < threshold)
    }
  }
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