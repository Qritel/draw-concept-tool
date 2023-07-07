import { zoomR, mySketch as p } from "../app";
let tickLengthMajor = 10;
let tickLengthMinor = 5;
let tickDistance = 5;
let majorTickFrequency = 5;

export default function drawRuler() {
    p.push();
    p.stroke('#808080');
    // Draw ticks on the top edge
    for (let x = 0; x < p.width; x += tickDistance) {
        if (x % (tickDistance * majorTickFrequency) === 0) {
            // Draw major tick
            p.line(x, 0, x, tickLengthMajor);
        } else {
            // Draw minor tick
            p.line(x, 0, x, tickLengthMinor);
        }
    }

    // Draw ticks on the right edge
    for (let y = 0; y < p.height; y += tickDistance) {
        if (y % (tickDistance * majorTickFrequency) === 0) {
            // Draw major tick
            p.line(p.width - tickLengthMajor, y, p.width, y);
        } else {
            // Draw minor tick
            p.line(p.width - tickLengthMinor, y, p.width, y);
        }
    }

    // Draw ticks on the bottom edge
    for (let x = 0; x < p.width; x += tickDistance) {
        if (x % (tickDistance * majorTickFrequency) === 0) {
            // Draw major tick
            p.line(x, p.height - tickLengthMajor, x, p.height);
        } else {
            // Draw minor tick
            p.line(x, p.height - tickLengthMinor, x, p.height);
        }
    }

    // Draw ticks on the left edge
    for (let y = 0; y < p.height; y += tickDistance) {
        if (y % (tickDistance * majorTickFrequency) === 0) {
            // Draw major tick
            p.line(0, y, tickLengthMajor, y);
        } else {
            // Draw minor tick
            p.line(0, y, tickLengthMinor, y);
        }
    }
    p.pop();
}