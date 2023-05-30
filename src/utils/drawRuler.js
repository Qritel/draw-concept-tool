import { zoomR, mySketch as p } from "../sketch";
let tickLengthMajor = 10;
let tickLengthMinor = 5;
let tickDistance = 5;
let majorTickFrequency = 5;

export default function drawRuler() {
    // Draw ticks on the top edge
    for (let x = 0; x < p.width * zoomR; x += tickDistance) {
        if (x % (tickDistance * majorTickFrequency) === 0) {
            // Draw major tick
            p.line(x, 0, x, tickLengthMajor);
        } else {
            // Draw minor tick
            p.line(x, 0, x, tickLengthMinor);
        }
    }

    // Draw ticks on the right edge
    for (let y = 0; y < p.height * zoomR; y += tickDistance) {
        if (y % (tickDistance * majorTickFrequency) === 0) {
            // Draw major tick
            p.line(p.width * zoomR - tickLengthMajor, y, p.width * zoomR, y);
        } else {
            // Draw minor tick
            p.line(p.width * zoomR - tickLengthMinor, y, p.width * zoomR, y);
        }
    }

    // Draw ticks on the bottom edge
    for (let x = 0; x < p.width * zoomR; x += tickDistance) {
        if (x % (tickDistance * majorTickFrequency) === 0) {
            // Draw major tick
            p.line(x, p.height * zoomR - tickLengthMajor, x, p.height * zoomR);
        } else {
            // Draw minor tick
            p.line(x, p.height * zoomR - tickLengthMinor, x, p.height * zoomR);
        }
    }

    // Draw ticks on the left edge
    for (let y = 0; y < p.height * zoomR; y += tickDistance) {
        if (y % (tickDistance * majorTickFrequency) === 0) {
            // Draw major tick
            p.line(0, y, tickLengthMajor, y);
        } else {
            // Draw minor tick
            p.line(0, y, tickLengthMinor, y);
        }
    }
}