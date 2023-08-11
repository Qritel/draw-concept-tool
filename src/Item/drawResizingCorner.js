import { mySketch as p } from "../app";

export default function drawResizingCorner(_item) {
  p.push();
  p.noStroke();
  p.fill('#2e7bf6');
  p.rectMode(p.CENTER);
  p.translate(_item.x, _item.y);
  p.angleMode(p.DEGREES);
  p.rotate(_item.angle);
  if (_item.name.startsWith('Rectangle') || _item.name.startsWith('Ellipse') || _item.name.startsWith('Line')
    || _item.name.startsWith('Text') || _item.name.startsWith('Img')) {
    p.rect(_item.swidth / 2 - 5, 0, 10);
    p.rect(-_item.swidth / 2 + 5, 0, 10);
    if (_item.name.startsWith('Rectangle') || _item.name.startsWith('Ellipse') || _item.name.startsWith('Text')
      || _item.name.startsWith('Img')) {
      p.rect(0, _item.sheight / 2 - 5, 10);
      p.rect(0, -_item.sheight / 2 + 5, 10);
      p.rect(_item.swidth / 2 - 5, _item.sheight / 2 - 5, 10);
      p.rect(_item.swidth / 2 - 5, -_item.sheight / 2 + 5, 10);
      p.rect(-_item.swidth / 2 + 5, _item.sheight / 2 - 5, 10);
      p.rect(-_item.swidth / 2 + 5, -_item.sheight / 2 + 5, 10);
    }
  }
  p.pop();
}