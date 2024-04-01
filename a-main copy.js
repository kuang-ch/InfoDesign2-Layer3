let masterTabletable;
let textSizeValue = 6;
let PPMono;

//Setting up Grid
let cols = 10; // Number of columns in the grid
let rows = 5; // Number of rows in the grid
let spacing = 200;

// Arrays to hold data
let countyList = [];
let processedStates = {};

// Preload function to load external data
function preload() {
  masterTable = loadTable('assets/masterDF.csv', 'csv', ' header', () => {
    for(let row of masterTable.rows){
        let rowData = {
            state: String(row.get('State')),
            county: String(row.get('County')),
            peopleTotal: int(row.get('Total')),
            perPerson: float(row.get('perPerson')),
            percentUnder18: float(row.get('percentageUnder18'))
        }
    }
  });
  PPMono = loadFont('assets/PPSupplyMono-Regular.otf');
}

// Setup function
function setup() {
  createCanvas(2000, 1000);
  
  if (table === null) {
    console.error("Error loading the table. Make sure the file is in the correct location.");
    return;
  }

  // Iterate over the table
  for (let i = 0; i < table.getRowCount(); i++) {
    let tableRow = table.getRows(i);
    let state = tableRow.getString("State");
    let county = tableRow.getString("County");
    let peopleTotal = tableRow.getNum("Total");
    let perPerson = tableRow.getFloat("perPerson");
    let percentUnder18 = tableRow.getFloat("percentageUnder18");
    let percentElderly = tableRow.getFloat("percentageElderly");
    let awards = tableRow.getNum("Awards");
    let apps = tableRow.getNum("Applications");

    // Create a CountyData object and add it to the array
    let countyData = new CountyData(state, county, peopleTotal, perPerson, percentUnder18, percentElderly, awards, apps);
    countyList.push(countyData);
  }
}

// Draw function
function draw() {
  eyeViz();
}

// eyeViz function
function eyeViz() {
  background(255);
  for (let i = 0; i < countyList.length - 1; i++) {
    // Get Initial County
    let data = countyList[i];
    let dataCompare = countyList[i + 1];

    let stateA = data.state;
    let stateCompare = dataCompare.state;
    let county = data.county;

    let perPerson = data.perPerson;
    let percentUnder18 = data.percentUnder18;
    let percentElderly = data.percentElderly;
    let plottedPerPerson = (perPerson - 371.79) / 5;

    // Rings
    let ring1 = ((400 - 371.79) / 5) * 2;
    let ring2 = ((500 - 371.79) / 5) * 2;
    let ring3 = ((600 - 371.79) / 5) * 2;
    let ring4 = ((700 - 371.79) / 5) * 2;

    // Awards and Apps Stuff
    let awards = data.awards;
    let apps = data.apps;
    let appsPlotted = Math.sqrt(map(apps, 0, 150000, 0, 4000));
    let awardsPlotted = Math.sqrt(map(awards, 0, 150000, 0, 4000));

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
    let lineWeight = 0.2;

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
      stroke(255, 0, 0);
      ellipse(0, 0, ring1 + appsPlotted, ring1 + appsPlotted);
      stroke(250, 0, 0);
      ellipse(0, 0, ring2 + appsPlotted, ring2 + appsPlotted);
      stroke(245, 0, 0);
      ellipse(0, 0, ring3 + appsPlotted, ring3 + appsPlotted);
      stroke(240, 0, 0);
      ellipse(0, 0, ring4 + appsPlotted, ring4 + appsPlotted);

      // Text
      textFont(PPMono);
      textSize(10);
      textAlign(CENTER);
      text(stateA, 0, 50);
      pop();
    }

    if (stateA === stateCompare) {
      countyCounter++;
      circlesDrawn = 1;
    } else {
      startX += 200;
      stateCounter++;
      countyCounter = 0;
      circlesDrawn = 0;
      if (stateCounter === 10) {
        startY += 200;
        startX = 100;
        stateCounter = 0;
      }
    }
  }
}