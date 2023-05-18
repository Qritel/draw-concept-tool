import { mySketch as p } from "../sketch";

// this function highlight and indicate the active item by drawing a stroke outline around it.
// and lines to represent its position in the canvas.
export default function drawStrokeItem(_item) {
    let d = p.dist(0,0,p.width,p.height);
    p.push();
    p.stroke('#2e7bf6');
    p.rectMode(p.CENTER);
    p.translate(_item.x, _item.y);
    p.angleMode(p.DEGREES);
    p.rotate(_item.angle);
    p.drawingContext.setLineDash([5, 5]);
    if(_item.name.startsWith('Line')) {
      p.line(-_item.swidth / 2, -d, -_item.swidth / 2, d);
      p.line(_item.swidth / 2, -d, _item.swidth / 2, d);
      p.line(-d, 0, d, 0);
    }
    else {
      p.line(-_item.swidth / 2, -d, -_item.swidth / 2, d);
      p.line(_item.swidth / 2, -d, _item.swidth / 2, d);
      p.line(-d, -_item.sheight / 2, d, -_item.sheight / 2);
      p.line(-d, _item.sheight / 2, d, _item.sheight / 2);
    }
    p.drawingContext.setLineDash([]);
    p.noFill();
    p.strokeWeight(1);
    p.rect(0, 0, _item.swidth, _item.sheight,
      _item.topLeftRadius, _item.topRightRadius, _item.bottomRightRadius, _item.bottomLeftRadius);
    p.pop();
}