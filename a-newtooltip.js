let table;
let masterCountyData = [];
let textSizeValue = 6;
let PPMono;

//Grid Setup
let scaleFactor = 10;
let moveFactorX = 125;
let moveFactorY = 125;
let pieRadius = 2400;

// Variables for tooltip
let lineWeight;
let tooltipVisible = false;
let tooltipText = "";
let tooltipX, tooltipY;
let buffer = 1;

//Testing
let testLineStartX, testLineStartY;
let testLineEndX, testLineEndY;

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
          Circle2Y: 0,
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
  // console.log(masterCountyData);
  // console.log(mouseX, mouseY);
}


//locateLineValues
function locate() {
  let startX = 100;
  let startY = 100;
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

    let invRotation = -lineRotation;
    let invTranslationX = -startX;
    let invTranslationY = -startY;

    X1 = (rotatedLineStartX * cos(invRotation) - rotatedLineStartY * sin(invRotation) + invTranslationX) * -1;
    Y1 = (rotatedLineStartX * sin(invRotation) + rotatedLineStartY * cos(invRotation) + invTranslationY) * -1;
    X2 = (rotatedLineEndX * cos(invRotation) - rotatedLineEndY * sin(invRotation) + invTranslationX) * -1;
    Y2 = (rotatedLineEndX * sin(invRotation) + rotatedLineEndY * cos(invRotation) + invTranslationY) * -1;

    // Assigning values to line properties in masterCountyData
    masterCountyData[i].X1 = X1;
    masterCountyData[i].X2 = X2;
    masterCountyData[i].Y1 = Y1;
    masterCountyData[i].Y2 = Y2;
    masterCountyData[i].awardsRadius = awardsPlotted;
    masterCountyData[i].appsRadiius = appsPlotted;
    pop();

    if (circlesDrawn == 0) {
      push();
      translate(startX, startY);
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

    // Calculate translated start and end points
    let rotatedLineStartX = 0;
    let rotatedLineStartY = lineOffset;
    let rotatedLineEndX = 0;
    let rotatedLineEndY = plottedPerPerson + lineOffset;

    // Perform reverse transformations
    let invRotation = -lineRotation;
    let invTranslationX = -startX;
    let invTranslationY = -startY;


    lineStartX = (rotatedLineStartX * cos(invRotation) - rotatedLineStartY * sin(invRotation) + invTranslationX) * -1;
    lineStartY = (rotatedLineStartX * sin(invRotation) + rotatedLineStartY * cos(invRotation) + invTranslationY) * -1;
    lineEndX = (rotatedLineEndX * cos(invRotation) - rotatedLineEndY * sin(invRotation) + invTranslationX) * -1;
    lineEndY = (rotatedLineEndX * sin(invRotation) + rotatedLineEndY * cos(invRotation) + invTranslationY) * -1;

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
function eyeViz2(){
  for (let j = 0; j < masterCountyData.length - 1; j++){
    let data = masterCountyData[j];
    let dataCompare = masterCountyData[j + 1];

    let stateA = data.state;
    let stateB = dataCompare.state;
    let county = data.county;
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
    let green2;
    let blue3;
    colorLogic(percentElderly, percentUnder18);

    //Drawing
    lineWeight = 0.5;
    push();
    stroke(255, 0, 0);
    strokeWeight(lineWeight);
    line(X1, Y1, X2, Y2);
    pop();
  }
}

//Color Logic
function colorLogic(percentElderly, percentUnder18){
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
}

// function checkTooltip(lineStartX, lineEndX, lineStartY, lineEndY, mouseX, mouseY, data) {
//   // Check if mouse is hovering over the line
//   let county = data.county;
//   let perPerson = data.perPerson;
//   let lineX1 = lineStartX;
//   let lineX2 = lineEndX;
//   let lineY1 = lineStartY;
//   let lineY2 = lineEndY;

//   if (
//     mouseX >= min(lineX1, lineX2) - buffer &&
//     mouseX <= max(lineX1, lineX2) + buffer &&
//     mouseY >= min(lineY1, lineY2) - buffer &&
//     mouseY <= max(lineY1, lineY2) + buffer
//   ) {
//     // Set tooltip info
//     tooltipVisible = true;
//     tooltipText = `County: ${county}, Per Person: ${perPerson}`; // Customize tooltip text as needed
//     tooltipX = mouseX + 10; // Adjust tooltip position
//     tooltipY = mouseY - 20; // Adjust tooltip position
//   } else {
//     // Hide tooltip
//     tooltipVisible = false;
//   }
// }

// // Function to draw tooltip
// function drawTooltip() {
//   if (tooltipVisible) {
//     fill(255); // Tooltip background color
//     stroke(0); // Tooltip border color
//     rect(tooltipX, tooltipY, textWidth(tooltipText) + 10, 20); // Draw tooltip rectangle
//     fill(0); // Tooltip text color
//     text(tooltipText, tooltipX + 5, tooltipY + 15); // Draw tooltip text
//   }
// }