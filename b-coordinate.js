//locateLineValues
function locate() {
    let startX = firstPointX;
    let startY = firstPointY;
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
      
      let ring4 = ((700 - 371.79) / scaleFactor) * 2;
      let circleRadius  = awardsPlotted + ring4;
  
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
  
      // Assigning values to line properties in masterCountyData
      masterCountyData[i].X1 = X1;
      masterCountyData[i].X2 = X2;
      masterCountyData[i].Y1 = Y1;
      masterCountyData[i].Y2 = Y2;
      masterCountyData[i].awardsRadius = awardsPlotted / 2;
      masterCountyData[i].appsRadius = appsPlotted / 2;
      masterCountyData[i].circleX1 = circleX1;
      masterCountyData[i].circleY1 = circleY1;
      masterCountyData[i].circleRadius = circleRadius;
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
        if (stateCounter === statePerRow) {
          startY += moveFactorY;
          startX = firstPointX;
          stateCounter = 0;
        }
      }
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