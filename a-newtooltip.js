let table;
let masterCountyData = [];
let textSizeValue = 6;
let PPMono;

//Grid Setup
let scaleFactor = 4;
let moveFactorX = 200;
let moveFactorY = 200;
let pieRadius = 4000;

// Variables for tooltip
let lineWeight;
let tooltipVisible;
let tooltipText = "";
let tooltipX, tooltipY;
let textHeight = 70;
let buffer = 0;

//Testing
let testLineStartX, testLineStartY;
let testLineEndX, testLineEndY;
let threshold = 0.5;


// Arrays to hold data
let countyList = [];
let processedStates = {};

// Preload function to load external data
function preload() {
  table = loadTable('assets/masterDF.csv'
    , 'csv', 'header', () => {
      for (let row of table.rows) {
        let rowData = {
          state: String(row.get("State")),
          county: String(row.get("County")),
          peopleTotal: int(row.get("Total")),
          perPerson: float(row.get("perPerson")),
          percentUnder18: float(row.get("percentageUnder18")),
          percentElderly: float(row.get("percentageElderly")),
          awards: int(row.get("Awards")),
          apps: int(row.get("Applications")),
          X1: 0,
          X2: 0,
          Y1: 0,
          Y2: 0,
          circleX1: 0,
          circleY1: 0,
          circleY2: 0,
          appsRadius: 0,
          awardsRadius: 0,
        }
        masterCountyData.push(rowData);
      }
    })
  PPMono = loadFont('assets/PPSupplyMono-Regular.otf');
};

// Setup function
function setup() {
  createCanvas(2000, 1000);

  if (PPMono === null) {
    console.error("Error loading the table. Make sure the file is in the correct location.");
    return;
  } else {
  }

}
// Draw function
function draw() {
  locate();
  // console.log(masterCountyData);
  eyeViz2();
  mouseMoved();
  // console.log(masterCountyData);
  console.log(mouseX, mouseY);
}


//locateLineValues
function locate() {
  let startX = 150;
  let startY = 150;
  let countyCounter = 0;
  let circlesDrawn = 0;
  let stateCounter = 0;

  background(255);

  for (let i = 0; i < masterCountyData.length - 1; i++) {
    // Getting Data from masterCountyDataArray
    let data = masterCountyData[i];
    let dataCompare = masterCountyData[i + 1];

    let awards = data.awards;
    let apps = data.apps;
    let stateA = data.state;
    let stateCompare = dataCompare.state;
    let county = data.county;
    let perPerson = data.perPerson;
    let percentUnder18 = data.percentUnder18;
    let percentElderly = data.percentElderly;

    // Calculating Values from initial data
    let plottedPerPerson = (perPerson - 371.79) / scaleFactor;
    let appsPlotted = Math.sqrt(map(apps, 0, 150000, 0, pieRadius));
    let awardsPlotted = Math.sqrt(map(awards, 0, 150000, 0, pieRadius));

    // Translation and Rotation
    let angleIncrement = radians(360.0 / 202);
    let lineRotation = HALF_PI + (angleIncrement * countyCounter);
    let lineOffset = appsPlotted / 2 + 0.5;
    lineWeight = 0.5;

    //Calculating Translated Values
    push();
    translate(startX, startY);
    rotate(lineRotation);

    let rotatedLineStartX = 0;
    let rotatedLineStartY = lineOffset;
    let rotatedLineEndX = 0;
    let rotatedLineEndY = plottedPerPerson + lineOffset;
    let circleOGX1 = 0;
    let circleOGY1 = 0;
    let circleOGY2 = appsPlotted / 2 - awardsPlotted / 2;

    let invRotation = -lineRotation;
    let invTranslationX = startX;
    let invTranslationY = -startY;

    X1 = (rotatedLineStartX * cos(invRotation) - rotatedLineStartY * sin(invRotation) - invTranslationX) * -1;
    Y1 = (rotatedLineStartX * sin(invRotation) + rotatedLineStartY * cos(invRotation) - invTranslationY);
    X2 = (rotatedLineEndX * cos(invRotation) - rotatedLineEndY * sin(invRotation) - invTranslationX) * -1;
    Y2 = (rotatedLineEndX * sin(invRotation) + rotatedLineEndY * cos(invRotation) - invTranslationY);
    circleX1 = (circleOGX1 * cos(invRotation) - rotatedLineStartY * sin(invRotation) - invTranslationX) * -1;
    circleY1 = (rotatedLineStartX * sin(invRotation) + circleOGY1 * cos(invRotation) - invTranslationY);
    circleY2 = (rotatedLineStartX * sin(invRotation) + circleOGY2 * cos(invRotation) - invTranslationY);

    // console.log(X1, Y1, X2, Y2);

    // Assigning values to line properties in masterCountyData
    masterCountyData[i].X1 = X1;
    masterCountyData[i].X2 = X2;
    masterCountyData[i].Y1 = Y1;
    masterCountyData[i].Y2 = Y2;
    masterCountyData[i].awardsRadius = awardsPlotted / 2;
    masterCountyData[i].appsRadius = appsPlotted / 2;
    masterCountyData[i].circleX1 = circleX1;
    masterCountyData[i].circleY1 = circleY1;
    masterCountyData[i].circleY2 = circleY2;
    pop();

    if (circlesDrawn == 0) {
    }
    if (stateA === stateCompare) {
      countyCounter++;
      circlesDrawn = 1;
    } else {
      startX += moveFactorX;
      stateCounter++;
      countyCounter = 0;
      circlesDrawn = 0;
      if (stateCounter === 10) {
        startY += moveFactorY;
        startX = 100;
        stateCounter = 0;
      }
    }
  }
}

// eyeViz function
function eyeViz() {
  let startX = 100;
  let startY = 100;
  let countyCounter = 0;
  let circlesDrawn = 0;
  let stateCounter = 0;

  background(255);
  for (let i = 0; i < masterCountyData.length - 1; i++) {
    // Get Initial County
    let data = masterCountyData[i];
    let dataCompare = masterCountyData[i + 1];

    let stateA = data.state;
    let stateCompare = dataCompare.state;
    let county = data.county;

    let perPerson = data.perPerson;
    let percentUnder18 = data.percentUnder18;
    let percentElderly = data.percentElderly;
    let plottedPerPerson = (perPerson - 371.79) / scaleFactor;

    // Rings
    let ring1 = ((400 - 371.79) / scaleFactor) * 2;
    let ring2 = ((500 - 371.79) / scaleFactor) * 2;
    let ring3 = ((600 - 371.79) / scaleFactor) * 2;
    let ring4 = ((700 - 371.79) / scaleFactor) * 2;

    // Awards and Apps Stuff
    let awards = data.awards;
    let apps = data.apps;
    let appsPlotted = Math.sqrt(map(apps, 0, 150000, 0, pieRadius));
    let awardsPlotted = Math.sqrt(map(awards, 0, 150000, 0, pieRadius));

    // Color Logic
    let red;
    let green;
    let blue;

    if (percentElderly >= 0.218 && percentUnder18 <= 0.115) {
      red = 0;
      green = 110;
      blue = 184;
    } else if (percentElderly >= 0.218 && percentUnder18 >= 0.152) {
      red = 163;
      green = 106;
      blue = 165;
    } else if (percentElderly <= 0.172 && percentUnder18 <= 0.115) {
      red = 227;
      green = 31;
      blue = 38;
    } else if (percentElderly <= 0.172 && percentUnder18 >= 0.152) {
      red = 252;
      green = 179;
      blue = 22;
    } else {
      red = 204;
      green = 204;
      blue = 204;
    }

    // Translation and Rotation
    let angleIncrement = radians(360.0 / 202);
    let lineRotation = HALF_PI + (angleIncrement * countyCounter);
    let lineOffset = appsPlotted / 2 + 0.5;
    lineWeight = 0.5;

    push();
    translate(startX, startY);
    rotate(lineRotation);
    stroke(red, green, blue);
    strokeWeight(lineWeight);
    line(0, lineOffset, 0, plottedPerPerson + lineOffset);

    pop();

    if (circlesDrawn == 0) {
      push();
      translate(startX, startY);
      noStroke();
      fill(204);
      ellipse(0, 0, appsPlotted, appsPlotted);
      strokeWeight(lineWeight);
      stroke(0);
      fill(50);
      ellipse(0, appsPlotted / 2 - awardsPlotted / 2, awardsPlotted, awardsPlotted);

      // Reference circles
      noFill();
      stroke(75, 75, 75, 100);
      ellipse(0, 0, ring1 + appsPlotted, ring1 + appsPlotted);
      ellipse(0, 0, ring2 + appsPlotted, ring2 + appsPlotted);
      ellipse(0, 0, ring3 + appsPlotted, ring3 + appsPlotted);
      ellipse(0, 0, ring4 + appsPlotted, ring4 + appsPlotted);

      // Text
      noStroke();
      fill("#333333");
      textFont(PPMono);
      textSize(10);
      textAlign(CENTER);
      text(stateA, 0, 65);
      pop();
    }

    if (stateA === stateCompare) {
      countyCounter++;
      circlesDrawn = 1;
    } else {
      startX += moveFactorX;
      stateCounter++;
      countyCounter = 0;
      circlesDrawn = 0;
      if (stateCounter === 10) {
        startY += moveFactorY;
        startX = 100;
        stateCounter = 0;
      }
    }
  }
}

// eyeViz2 function
function eyeViz2() {
  let countyCounter = 0;
  let circlesDrawn = 0;
  for (let j = 0; j < masterCountyData.length - 1; j++) {
    let data = masterCountyData[j];
    let dataCompare = masterCountyData[j + 1];

    let stateA = data.state;
    let stateB = dataCompare.state;
    let county = data.county;
    let appsPlotted = data.appsRadius;
    let awardsPlotted = data.awardsRadius;
    let circleX1 = data.circleX1;
    let circleY1 = data.circleY1;
    let circleY2 = data.circleY2;
    let perPerson = data.perPerson;
    let percentUnder18 = data.percentUnder18;
    let percentElderly = data.percentElderly;

    let X1 = data.X1;
    let X2 = data.X2;
    let Y1 = data.Y1;
    let Y2 = data.Y2;

    let plottedPerPerson = (perPerson - 371.79) / scaleFactor;

    // Color Logic
    let red1;
    let green1;
    let blue1;
    [red1, green1, blue1] = colorLogic(percentElderly, percentUnder18);

    //Drawing
    lineWeight = 0.5;
    push();
    stroke(red1, green1, blue1);
    strokeWeight(lineWeight);
    line(X1, Y1, X2, Y2);
    pop();

    //Broken Circle Functionality
    // if (stateA === stateB){
    //   countyCounter++;
    //   circlesDrawn = 1;
    // } else {
    //   countyCounter = 0;
    //   circlesDrawn = 0;
    // }
    // if (circlesDrawn == 0){
    //   push();
    //   noStroke();
    //   fill(204);
    //   ellipse(circleX1, circleY1, appsPlotted * 2, appsPlotted * 2);
    //   strokeWeight(lineWeight);
    //   stroke(0);
    //   fill(50);
    //   ellipse(circleX1, circleY2, awardsPlotted * 2, awardsPlotted * 2)
    //   pop();
    // }

    //Drawing Pie Charts
  }
}

//Color Logic
function colorLogic(percentElderly, percentUnder18) {
  if (percentElderly >= 0.218 && percentUnder18 <= 0.115) {
    red1 = 0;
    green1 = 110;
    blue1 = 184;
  } else if (percentElderly >= 0.218 && percentUnder18 >= 0.152) {
    red1 = 163;
    green1 = 106;
    blue1 = 165;
  } else if (percentElderly <= 0.172 && percentUnder18 <= 0.115) {
    red1 = 227;
    green1 = 31;
    blue1 = 38;
  } else if (percentElderly <= 0.172 && percentUnder18 >= 0.152) {
    red1 = 252;
    green1 = 179;
    blue1 = 22;
  } else {
    red1 = 204;
    green1 = 204;
    blue1 = 204;
  }
  return [red1, green1, blue1];
}

function mouseMoved() {
  checkTooltip();
}

function checkTooltip() {
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
    if (d < threshold) {
      // Set tooltip info
      tooltipVisible = true;
      tooltipText = county + " county"+ "\n" + state + "\n$" + perPersonText + " per participant" + "\n" + total + " total participants"; // Customize tooltip text as needed
      tooltipX = mouseX + 10; // Adjust tooltip position
      tooltipY = mouseY - 20; // Adjust tooltip position

      drawTooltip(X1, Y1, X2, Y2);
      // console.log(county);
    } else {
      // Hide tooltip
      tooltipVisible = false;
      // console.log("false");
    }
  }
}

// Function to draw tooltip
function drawTooltip(X1, Y1, X2, Y2) {
  //Highlighted Line
  push();
  stroke(255, 0, 0);
  strokeWeight(2);
  line(X1, Y1, X2, Y2);
  pop();

  fill(255); // Tooltip background color
  noStroke(); // Tooltip border color
  rect(tooltipX, tooltipY, textWidth(tooltipText) + 10, textHeight); // Draw tooltip rectangle
  fill(0); // Tooltip text color
  textFont(PPMono)
  text(tooltipText, tooltipX + 5, tooltipY + 15); // Draw tooltip text
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