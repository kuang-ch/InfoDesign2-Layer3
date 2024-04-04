function mouseMoved() {
    checkTooltip();
  }
  
  function checkTooltip() {
    let stateSubarray = [];
  
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
  
      let red1 = data.red1;
      let green1 = data.green1;
      let blue1 = data.blue1;
  
      let stateSubarray = masterCountyData.filter(item => item.state === state);
  
      if (d < threshold) {
        // Set tooltip info
        tooltipVisible = true;
        tooltipText = county + " county" + "\n" + state + "\n$" + perPersonText + " per participant" + "\n" + total + " total participants"; // Customize tooltip text as needed
        tooltipX = mouseX + 10; // Adjust tooltip position
        tooltipY = mouseY - 20; // Adjust tooltip position
  
        drawTooltip(X1, Y1, X2, Y2, red1, green1, blue1, stateSubarray);
        // console.log(county);
      } else {
        // Hide tooltip
        tooltipVisible = false;
        // console.log("false");
      }
    }
  }
  
  // Function to draw tooltip
  function drawTooltip(X1, Y1, X2, Y2, red1, green1, blue1, stateSubarray) {
    let popUpX = 925;
    let popUpY = window.scrollY;
  
    //Highlighted Line
    push();
    stroke(red1, green1, blue1);
    strokeWeight(2);
    line(X1, Y1, X2, Y2);
    pop();
  
    fill(255); // Tooltip background color
    noStroke(); // Tooltip border color
    rect(popUpX, popUpY + 50, textWidth(tooltipText) + 10, textHeight); // Draw tooltip rectangle
    fill(0); // Tooltip text color
    textFont(PPMono)
    text(tooltipText, popUpX + 5, popUpY + 50); // Draw tooltip text
  
    for(let i = 0; i<stateSubarray.length; i++){
    console.log(stateSubarray[1].county);
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