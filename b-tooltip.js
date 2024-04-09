let mouseClickedFlag = false;
let clickedX = 0;
let clickedY = 0;

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

function tooltipPanel(){
  if(!mouseClickedFlag){
    checkThreshold(mouseX, mouseY);
  } else {
    checkThreshold(clickedX, clickedY);
    console.log("clicked ran");
  }
}

function checkThreshold(userX, userY) {  
  for (let i = 0; i < masterCountyData.length; i++) {
    let data = masterCountyData[i];
    let county = data.county;
    let state = data.state;
    let perPersonText = data.perPerson.toFixed(2);
    let total = data.peopleTotal;

    let percentUnder18 = data.percentUnder18;
    let percentElderly = data.percentElderly;
    let percentWorking = 1 - percentUnder18 - percentElderly;

    let printUnder18 = (percentUnder18 * 100).toFixed(2);
    let printElderly = (percentElderly * 100).toFixed(2);
    let printWorking = (percentWorking * 100).toFixed(2);


    let X1 = data.X1;
    let X2 = data.X2;
    let Y1 = data.Y1;
    let Y2 = data.Y2;

    let red1 = data.red1;
    let green1 = data.green1;
    let blue1 = data.blue1;

    let d = distToSegment(userX, userY, X1, Y1, X2, Y2);
   
    tooltipText = county + " county" + 
    "\n" + state + 
    "\n$" + perPersonText + " per participant" + 
    "\n" + total + " total participants" +
    "\n\n" + printUnder18 + "% participants younger than 18" +
    "\n" + printWorking + "% participants aged 18 to 65" +
    "\n" + printElderly + "% participants older than 65"; // Customize tooltip text as needed

    let stateSubarray = masterCountyData.filter(item => item.state === state);
      if (d < threshold) {
        drawTooltip(X1, Y1, X2, Y2, red1, green1, blue1, tooltipText);
        tooltipCallout(stateSubarray, data);
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

function tooltipCallout(dataArray, highlightedLine) {
  let countyCounter = 0;
  let circlesDrawn = 0;
  for (let j = 0; j < dataArray.length; j++) {
    let data = dataArray[j];
    let special = highlightedLine;

    let perPerson = data.perPerson;
    let county = data.county;
    let appsPlotted = data.appsRadius;
    let awardsPlotted = data.awardsRadius;

    let red1 = data.red1;
    let green1 = data.green1;
    let blue1 = data.blue1;

    let plottedPerPerson = (perPerson - 371.79) / 2;

    //Drawing
    let angleIncrement = radians(360.0 / 202);
    let lineRotation = HALF_PI + (angleIncrement * countyCounter);
    let lineOffset = appsPlotted * 2;

    if (county == special.county){
      lineWeight = 2;
      alpha1 = 255;
    } else {
      lineWeight = 1;
      alpha1 = 100;
    }

    push();
    translate(1175, window.scrollY + 400);
    rotate(lineRotation);
    stroke(red1, green1, blue1, alpha1);
    strokeWeight(lineWeight);
    line(0, lineOffset, 0, plottedPerPerson + lineOffset);
    pop();

    if (circlesDrawn == 0){
      let awards = data.awards;
      let apps = data.apps;
      let acceptance = awards/apps;
      let acceptanceDisplay = (acceptance*100).toFixed(2) + "% acceptance rate";

      push();
      translate(1175, window.scrollY + 400);
      noStroke();
      fill(204);
      ellipse(0, 0, appsPlotted * 4, appsPlotted * 4);
      fill(255, 0, 100);
      ellipse(0, appsPlotted * 2 - awardsPlotted * 2, awardsPlotted * 4, awardsPlotted *4);
      textAlign(CENTER, CENTER);
      textSize(12);
      textFont(PPMono);
      text(acceptanceDisplay, 0, appsPlotted * 4 + 50);
      pop();

      circlesDrawn = 1;
    }
    countyCounter++;
  }
}