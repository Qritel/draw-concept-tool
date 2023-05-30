import { items, mySketch as p } from "../sketch";

export default function getSelectedItem(_mouseX, _mouseY){
    let sItem = [];
    let xPrime;
    let yPrime;
    items.forEach(function(_object) {
      if(_object.angle){
        xPrime = (_mouseX - _object.x) * p.cos(_object.angle) + (_mouseY-_object.y) * p.sin(_object.angle) + _object.x;
        yPrime = (_mouseY- _object.y) * p.cos(_object.angle) - (_mouseX-_object.x) * p.sin(_object.angle) + _object.y;
      }
      else{
        xPrime = _mouseX;
        yPrime = _mouseY;
      }
      if(xPrime < _object.x + _object.swidth / 2 && xPrime > _object.x - _object.swidth / 2
      && yPrime < _object.y + _object.sheight / 2 && yPrime > _object.y - _object.sheight / 2){
        sItem.push(_object);
      }
    });
    const maxI =  Math.max(...sItem.map(_object => _object.index));
    const index = sItem.findIndex(_object => _object.index === maxI);
    return sItem[index];
  }
  