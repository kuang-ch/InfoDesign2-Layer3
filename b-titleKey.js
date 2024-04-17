//Title
function titleDraw(){
  let title = "Supplemental Security" + "\n" + "Income in the U.S."
  
  push();
  fill("#333333");
  textFont(PPMono);
  textSize(48);
  text(title, 65, 75);
  pop();
}

function toggleButton() {
  keyButtonPressed = !keyButtonPressed; // Toggle the value of buttonPressed between true and false
}

function displayImage(){
  if(keyButtonPressed){
  image(img, 0, 0, imgWidth, imgHeight);
  }else{
  }
}