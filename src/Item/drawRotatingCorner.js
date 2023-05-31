import { mySketch as p } from "../app";

export default function drawRotatingCorner(_item) {
    p.push();
    p.fill('#2e7bf6');
    p.rectMode(p.CENTER);
    p.translate(_item.x, _item.y);
    p.angleMode(p.DEGREES);
    p.rotate(_item.angle);
    p.textSize(20);
    p.textStyle(p.BOLD);
    p.textAlign(p.CENTER, p.CENTER);
    p.translate(_item.swidth / 2, - _item.sheight /2);
    if(_item.name.startsWith('Line')) {
        p.translate(7, 3);
        p.rotate(-45);
        p.text('⤾', 2, 7);
        p.rotate(-90);
        p.text('⤿', -3, 6);
        p.rotate(-45);
        p.translate(_item.swidth + 14, 0);
        p.rotate(-45);
        p.text('⤾', 2, 7);
        p.rotate(-90);
        p.text('⤿', -3, 6);
        }
    else{
        p.rotate(-90);
        p.text('⤾', 2, 7);
        p.rotate(-90);
        p.text('⤿', -3, 6)
        p.translate(0, - _item.sheight);
        p.rotate(180);
        p.text('⤾', 2, 7);
        p.rotate(-90);
        p.text('⤿', -3, 6);
        p.translate(0, - _item.swidth);
        p.rotate(180);
        p.text('⤾', 2, 7);
        p.rotate(-90);
        p.text('⤿', -3, 6);
        p.translate(0, - _item.sheight);
        p.rotate(180);
        p.text('⤾', 2, 7);
        p.rotate(-90);
        p.text('⤿', -3, 6);
    }
    p.pop();
}