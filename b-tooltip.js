let mouseClickedFlag = false;
let stateHoverFlag = false;
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

function tooltipPanel() {
  if (!mouseClickedFlag) {
    checkThreshold(mouseX, mouseY);
  } else {
    checkThreshold(clickedX, clickedY);
  }
}

function checkThreshold(userX, userY) {
  for (let i = 0; i < masterCountyData.length; i++) {
    let data = masterCountyData[i];
    let county = data.county;
    let state = data.state;
    let perPersonText = data.perPerson.toFixed(2);
    let total = data.peopleTotal;

    let X1 = data.X1;
    let X2 = data.X2;
    let Y1 = data.Y1;
    let Y2 = data.Y2;
    let circleY1 = data.circleY1;
    let circleRadius = data.circleRadius;

    let red1 = data.red1;
    let green1 = data.green1;
    let blue1 = data.blue1;

    let d = distToSegment(userX, userY, X1, Y1, X2, Y2);

    //Radar Plot
    let radarScaleFactor = 1;
    
    let percentUnder18 = data.percentUnder18;
    let percentElderly = data.percentElderly;
    let percentWorking = 1 - percentUnder18 - percentElderly;

    let printUnder18 = (percentUnder18 * 100).toFixed(2);
    let printElderly = (percentElderly * 100).toFixed(2);
    let printWorking = (100 - printUnder18 - printElderly).toFixed(2);

    //TooltipText
    tooltipText1 = county + " county" +
      "\n" + state +
      "\n$" + perPersonText + " per participant" +
      "\n" + total + " total participants";

    tooltipText2 = printUnder18 + "% participants younger than 18";
    tooltipText3 = printWorking + "% participants aged 18 to 65";
    tooltipText4 = printElderly + "% participants older than 65"; 

    let stateSubarray = masterCountyData.filter(item => item.state === state);

    if (d < threshold) {
      drawTooltip(X1, Y1, X2, Y2, red1, green1, blue1, tooltipText1, tooltipText2, tooltipText3, tooltipText4);
      tooltipCallout(stateSubarray, data);
      radarPlot(radarScaleFactor, printUnder18, printElderly, printWorking)
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

function drawTooltip(X1, Y1, X2, Y2, red1, green1, blue1, tooltipDisplay1, tooltipDisplay2, tooltipDisplay3, tooltipDisplay4) {
  let popUpX = 925;
  let popUpY = window.scrollY;

  //background rectangle
  push();
  fill(250);
  rect(900, window.scrollY, 700, 800);
  pop();

  //Highlighted Line
  push();
  stroke(red1, green1, blue1);
  strokeWeight(2);
  line(X1, Y1, X2, Y2);
  pop();

  noStroke(); // Tooltip border color
  fill(0); // Tooltip text color
  textFont(PPMono)
  text(tooltipDisplay1, popUpX + 5, popUpY + 50); // Draw tooltip text
  fill(252, 179, 22);
  text(tooltipDisplay2, popUpX + 5, popUpY + 500); // Draw tooltip text
  fill(204, 204, 204);
  text(tooltipDisplay3, popUpX + 5, popUpY + 514); // Draw tooltip text
  fill(0, 110, 184);
  text(tooltipDisplay4, popUpX + 5, popUpY + 528); // Draw tooltip text

}

function tooltipCallout(dataArray, highlightedLine) { //Redraws the "Flower" on the tooltip side
  let countyCounter = 0;
  let circlesDrawn = 0;
  let totalUnder18 = 0;
  let totalElderly = 0;
  let totalWorking = 0;

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
    let lineOffset = appsPlotted * 2 + 5;

    if (county == special.county) {
      lineWeight = 2;
      alpha1 = 255;
    } else {
      lineWeight = 1;
      alpha1 = 100;
      alphaRadar = 255;
    }

    push();
    translate(1175, window.scrollY + 350);
    rotate(lineRotation);
    stroke(red1, green1, blue1, alpha1);
    strokeWeight(lineWeight);
    line(0, lineOffset, 0, plottedPerPerson + lineOffset);
    pop();

    if (circlesDrawn == 0) {
      let awards = data.awards;
      let apps = data.apps;
      let acceptance = awards / apps;
      let acceptanceDisplay = (acceptance * 100).toFixed(2) + "% acceptance rate";

      push();
      fill(255, 0, 100);
      textAlign(LEFT, TOP);
      textSize(16);
      textFont(PPMono);
      text(acceptanceDisplay, 930, 120 + window.scrollY);
      pop();

      push();
      translate(1175, window.scrollY + 350);
      noStroke();
      fill(204);
      ellipse(0, 0, appsPlotted * 4, appsPlotted * 4);
      fill(255, 0, 100);
      ellipse(0, appsPlotted * 2 - awardsPlotted * 2, awardsPlotted * 4, awardsPlotted * 4);
      pop();

      circlesDrawn = 1;
    }
        countyCounter++;
  }
}

function radarPlot(radarScaleFactor, inputUnder18, inputElderly, inputWorking) {
  let radarX = 1175;
  let radarY = 650 + window.scrollY;
  let radarStrokeWeight = 2;
  let radarScaleFactorCircles = radarScaleFactor;

  let specialUnder18 = inputUnder18 * radarScaleFactor;
  let specialElderly = inputElderly * radarScaleFactor;
  let specialWorking = inputWorking * radarScaleFactor;

  // console.log(specialWorking, specialUnder18);

  //Circles
  push();
  translate(radarX, radarY);
  noFill();
  stroke(200, 200, 200);
  strokeWeight(1);
  ellipse(0, 0, 40 * radarScaleFactorCircles, 40 * radarScaleFactorCircles);
  ellipse(0, 0, 80 * radarScaleFactorCircles, 80 * radarScaleFactorCircles);
  ellipse(0, 0, 120 * radarScaleFactorCircles, 120 * radarScaleFactorCircles);
  ellipse(0, 0, 160 * radarScaleFactorCircles, 160 * radarScaleFactorCircles);
  ellipse(0, 0, 200 * radarScaleFactorCircles, 200 * radarScaleFactorCircles);
  strokeWeight(0.5);
    // ellipse(0, 0, 20 * radarScaleFactorCircles, 20 * radarScaleFactorCircles);
    // ellipse(0, 0, 60 * radarScaleFactorCircles, 60 * radarScaleFactorCircles);
    // ellipse(0, 0, 100 * radarScaleFactorCircles, 100 * radarScaleFactorCircles);
    // ellipse(0, 0, 140 * radarScaleFactorCircles, 140 * radarScaleFactorCircles);
    // ellipse(0, 0, 180 * radarScaleFactorCircles, 180 * radarScaleFactorCircles);
  pop();


  //Under18
  push();
  translate(radarX, radarY);
  stroke(252, 179, 22);
  strokeWeight(radarStrokeWeight);
  line(0, 0, 0, specialUnder18);
  pop();

  //Working
  push();
  translate(radarX, radarY);
  rotate((TWO_PI)/3);
  stroke(204, 204, 204);
  strokeWeight(radarStrokeWeight);
  line(0, 0, 0, specialWorking);
  pop();

  //Elderly
  push();
  translate(radarX, radarY);
  rotate(((TWO_PI)/3)*2);
  stroke(0, 110, 184);
  strokeWeight(radarStrokeWeight);
  line(0, 0, 0, specialElderly);
  pop();
}

function stateHover(){
  for (let i = 0; i < masterCountyData.length; i++){
    let data = masterCountyData[i];
    let pointX = data.X1;
    let pointY = data.circleY1;
    let distanceThreshold = data.circleRadius;
    let state = data.state;

  if (dist(mouseX, mouseY, pointX, pointY) < distanceThreshold / 2) {
      noStroke();
      fill(0, 255, 0);
      ellipse(0, 0 + window.scrollY, distanceThreshold, distanceThreshold);
      console.log(state);
    }

}
}

function stateHoverOpacity(pointX, pointY, stateCircleThreshold){
  if(dist(mouseX, mouseY, pointX, pointY) < (stateCircleThreshold / 2)){
    return 255;
  } else {
    return 100;
  }
}