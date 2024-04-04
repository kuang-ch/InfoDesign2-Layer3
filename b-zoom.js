// Zoom in function
function zoomIn() {
    scaleFactor *= zoomInFactor;
    moveFactorX *= zoomOutFactor;
    moveFactorY *= zoomOutFactor;
    pieRadius *= zoomOutFactor;
  }
  
  // Zoom out function
  function zoomOut() {
    scaleFactor *= zoomOutFactor;
    moveFactorX *= zoomInFactor;
    moveFactorY *= zoomInFactor;
    pieRadius *= zoomOutFactor;
  }
  
  // Call zoom functions based on user input
  function keyPressed() {
    if (key === 'z') {
      zoomIn(); // Zoom in when '+' key is pressed
      console.log(key);
    } else if (key === 'x') {
      zoomOut(); // Zoom out when '-' key is pressed
      console.log(key);
    }
  }