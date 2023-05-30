import { mySketch as p } from "../sketch";

export default function drawResizingCorner(_item) {
    p.push();
    p.noStroke();
    p.fill('#2e7bf6');
    p.rectMode(p.CENTER);
    p.translate(_item.x, _item.y);
    p.angleMode(p.DEGREES);
    p.rotate(_item.angle);
    if(_item.name.startsWith('Rectangle') || _item.name.startsWith('Line')) {
      p.rect(_item.swidth / 2, 0,10);
      p.rect(-_item.swidth / 2, 0,10);
      if(_item.name.startsWith('Rectangle')){
        p.rect(0,_item.sheight / 2,10);
        p.rect(0,-_item.sheight / 2,10);
      }
    }
    p.pop();
}