import { mySketch as p } from "../sketch";

export default function drawStrokeItem(_item) {
    p.push();
    p.rectMode(p.CENTER);
    p.translate(_item.x, _item.y);
    p.stroke('#2e7bf6');
    p.noFill();
    p.strokeWeight(1);
    p.drawingContext.setLineDash([5, 5]);
    p.angleMode(p.DEGREES);
    p.rotate(_item.angle);
    p.rect(0, 0, _item.swidth, _item.sheight,
      _item.topLeftRadius, _item.topRightRadius, _item.bottomRightRadius, _item.bottomLeftRadius);
    p.pop();
}