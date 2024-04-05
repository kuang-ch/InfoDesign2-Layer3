// let clickedCounty;
// let clickedText;
// let clickedX1;
// let clickedX2;
// let clickedY1;
// let clickedY2;
// let clickedRed;
// let clickedGreen;
// let clickedBlue;
// let tooltipClickedText;
// let mouseClickedFlag = false;

// function mouseClicked() {
//   if (!mouseClickedFlag) {
//     mouseClickedFlag = true;
//   } else {
//     mouseClickedFlag = false;
//   }
// }

// // function clickedOutsideThreshold() {
// //   if (mouseClicked) {
// //     drawTooltip(clickedX1, clickedY1, clickedX2, clickedY2, clickedRed, clickedGreen, clickedBlue);
// //   } else {
// //     clickedX1 = 0;
// //     clickedX2 = 0;
// //     clickedY1 = 0;
// //     clickedY2 = 0;
// //     clickedRed = 0;
// //     clickedGreen = 0;
// //     clickedBlue = 0;
// //   }
// // }

// function checkTooltip() {
//   let stateSubarray = [];

//   for (let i = 0; i < masterCountyData.length; i++) {
//     let data = masterCountyData[i];
//     let county = data.county;
//     let state = data.state;
//     let perPerson = data.perPerson;
//     let perPersonText = perPerson.toFixed(2);
//     let total = data.peopleTotal;

//     let X1 = data.X1;
//     let X2 = data.X2;
//     let Y1 = data.Y1;
//     let Y2 = data.Y2;
//     let d = distToSegment(mouseX, mouseY, X1, Y1, X2, Y2);

//     let red1 = data.red1;
//     let green1 = data.green1;
//     let blue1 = data.blue1;

//     let stateSubarray = masterCountyData.filter(item => item.state === state);

//     tooltipText = county + " county" + "\n" + state + "\n$" + perPersonText + " per participant" + "\n" + total + " total participants"; // Customize tooltip text as needed

//     if (d < threshold) {
//       if (!mouseClickedFlag) {
//         drawTooltip(X1, Y1, X2, Y2, red1, green1, blue1, tooltipText);
//       } else {
//         clickedCounty = county;
//         clickedText = tooltipText;
//         clickedX1 = X1;
//         clickedX2 = X2;
//         clickedY1 = Y1;
//         clickedY2 = Y2;
//         clickedRed = red1;
//         clickedGreen = green1;
//         clickedBlue = blue1;
//       }
//     }
//   }
// }
