let table;
let masterCountyData = [];
let textSizeValue = 6;
let PPMono;

//Grid Setup
let statePerRow = 4;
let scaleFactor = 4.5;
let moveFactorX = 200;
let moveFactorY = 300;
let pieRadius = 4000;

//StateCounterSetup
let firstPointX = 150;
let firstPointY = 300;
// let countyCounter = 0;
// let circlesDrawn = 0;
// let stateCounter = 0;

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
let threshold = 1;

// Define zoom factors
let zoomInFactor = 1; // Increase scaleFactor by 10% for zoom in
let zoomOutFactor = 1; // Decrease scaleFactor by 10% for zoom out

// Arrays to hold data
let countyList = [];
let processedStates = {};

//Key Button
let img;
let keyButton;
let keyButtonPressed = false;
let imgWidth = 900;
let imgHeight = 800;

// Preload function to load external data
function preload() {
  img = loadImage('assets/key.jpg');

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
          circleRadius: 0,
          appsRadius: 0,
          awardsRadius: 0,
          red1: 0,
          green1: 0,
          blue1: 0
        }
        masterCountyData.push(rowData);
      }
    })
  PPMono = loadFont('assets/PPSupplyMono-Regular.otf');
};

// Setup function
function setup() {
  createCanvas(1600, 4100);

  if (PPMono === null) {
    console.error("Error loading the table. Make sure the file is in the correct location.");
    return;
  } else {
  }

  keyButton = createButton(`...`);
  keyButton.addClass('custom-button')
  keyButton.position(800, 40);
  keyButton.mousePressed(toggleButton);
}
// Draw function
function draw() {  
  locate();
  drawCircles();
  eyeViz(masterCountyData);

  push();
  noStroke();
  fill(250);
  rect(900, 0, 700, 4100);
  pop();

  tooltipPanel();

  displayImage();
  titleDraw();

  // console.log(windowWidth, windowHeight);
  // console.log(mouseClickedFlag);
  // console.log(clickedX, clickedY);

  // console.log(masterCountyData);
  // console.log(mouseX, mouseY);
}