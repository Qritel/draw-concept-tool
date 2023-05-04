import { mySketch as p } from "../sketch";

export default function drawResizingCorner(_item) {
    p.push();
    p.fill('#000000');
    p.rectMode(p.CENTER);
    p.translate(_item.x, _item.y);
    p.angleMode(p.DEGREES);
    p.rotate(_item.angle);
    p.textSize(20);
    p.textStyle(p.BOLD);
    p.textAlign(p.CENTER, p.CENTER);
    if(_item.name.startsWith('Rectangle') || _item.name.startsWith('Line')) {
      p.text('⬌', _item.swidth / 2, 1);
      p.text('⬌', -_item.swidth / 2 + 1, 1);
      if(_item.name.startsWith('Rectangle')){
        p.text('⬍', 0, -_item.sheight / 2 + 4);
        p.text('⬍', 0, _item.sheight /2);
      }
    }
    p.pop();
}