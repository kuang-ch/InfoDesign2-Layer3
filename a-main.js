let table;
let masterCountyData = [];
let textSizeValue = 6;
let PPMono;

//Grid Setup
let scaleFactor = 10;
let moveFactorX = 125;
let moveFactorY = 150;
let pieRadius = 1500;

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
                apps: int(row.get("Applications"))
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
  eyeViz();
}

// eyeViz function
function eyeViz() {
  let startX = 100;
  let startY = 110;
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
    let lineWeight = 0.5;

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