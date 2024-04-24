// eyeViz2 function
function eyeViz(dataArray) {
  for (let j = 0; j < dataArray.length; j++) {
    //Fetching Data
    let data = dataArray[j];
    let perPerson = data.perPerson;
    let percentUnder18 = data.percentUnder18;
    let percentElderly = data.percentElderly;

    //Line Coordinates
    let X1 = data.X1;
    let X2 = data.X2;
    let Y1 = data.Y1;
    let Y2 = data.Y2;
    let circleY = data.circleY1;
    let circleThreshold = data.circleRadius;

    // Color Logic
    let red1;
    let green1;
    let blue1;
    [red1, green1, blue1] = colorLogic(percentElderly, percentUnder18);

    masterCountyData[j].red1 = red1;
    masterCountyData[j].green1 = green1;
    masterCountyData[j].blue1 = blue1;

    //Checking Theshold
    let lineOpacity = stateHoverOpacity(X1, circleY, circleThreshold)

    //Drawing
    lineWeight = 0.5;
    push();
    stroke(red1, green1, blue1, lineOpacity);
    strokeWeight(lineWeight);
    line(X1, Y1, X2, Y2);
    pop();
  }
}

function drawCircles() {
  let startX = firstPointX;
  let startY = firstPointY;
  let circlesDrawn = 0;
  let countyCounter = 0;
  let stateCounter = 0;
  for (let i = 0; i < masterCountyData.length - 1; i++) {
    let data = masterCountyData[i];
    let dataCompare = masterCountyData[i + 1];
    let circleX = data.X1;
    let circleY = data.circleY1;
    let circleThreshold = data.circleRadius;

    let stateA = data.state;
    let stateB = dataCompare.state;

    // Awards and Apps Stuff
    let awards = data.awards;
    let apps = data.apps;
    let appsPlotted = Math.sqrt(map(apps, 0, 150000, 0, pieRadius));
    let awardsPlotted = Math.sqrt(map(awards, 0, 150000, 0, pieRadius));

    // Rings
    let ring1 = ((400 - 371.79) / scaleFactor) * 2;
    let ring2 = ((500 - 371.79) / scaleFactor) * 2;
    let ring3 = ((600 - 371.79) / scaleFactor) * 2;
    let ring4 = ((700 - 371.79) / scaleFactor) * 2;

    //Checking Theshold
    let lineOpacity = stateHoverOpacity(circleX, circleY, circleThreshold)
    let hoverTextSize;

    if (lineOpacity == 255) {
      hoverTextSize = 12;
      }else{
        hoverTextSize = 10;
      }

    if (circlesDrawn == 0) {
      push();
      translate(startX, startY);
      noStroke();
      fill(204, 204, 204, lineOpacity);
      ellipse(0, 0, appsPlotted, appsPlotted);
      strokeWeight(0.5);
      stroke(0, 0, 0, lineOpacity);
      fill(50, 50, 50, lineOpacity);
      ellipse(0, appsPlotted / 2 - awardsPlotted / 2, awardsPlotted, awardsPlotted);

      noFill();
      stroke(75, 75, 75, (100 * lineOpacity / 255));
      ellipse(0, 0, ring1 + appsPlotted, ring1 + appsPlotted);
      ellipse(0, 0, ring2 + appsPlotted, ring2 + appsPlotted);
      ellipse(0, 0, ring3 + appsPlotted, ring3 + appsPlotted);
      ellipse(0, 0, ring4 + appsPlotted, ring4 + appsPlotted);

      noStroke();
      fill(75, 75, 75, lineOpacity);
      textFont(PPMono);
      textSize(hoverTextSize);
      textAlign(CENTER);
      text(stateA, 0, 120);
      pop();
    }

    if (stateA === stateB) {
      countyCounter++;
      circlesDrawn = 1;
    } else {
      startX += moveFactorX;
      stateCounter++;
      countyCounter = 0;
      circlesDrawn = 0;
      if (stateCounter === 4) {
        startY += moveFactorY;
        startX = firstPointX;
        stateCounter = 0;
      }
    }
  }
}