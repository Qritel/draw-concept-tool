import { mySketch as p, canvasWidth, canvasHeight, zoomR } from "../app";

export default function drawBackground() {
  p.push();
  p.background('#ffffff');
  p.noFill();
  p.stroke('#808080');
  p.rect(0, 0, canvasWidth, canvasHeight);
  // Draw a pointillism background
  let pointSize = 2; // Size of each point
  let spacing = 25 / zoomR; // Spacing between points
  for (let x = 0; x < canvasWidth; x += spacing) {
    for (let y = 0; y < canvasHeight; y += spacing) {
      p.fill('#808080');
      p.noStroke();
      p.circle(x, y, pointSize);
    }
  }
  p.pop();
}