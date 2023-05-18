import { mySketch, items } from "../sketch";

// This function determines if the mouse is over a rotating corner of '_activeItem'.
export default function isRotatingCorner(_activeItem, _mouseX, _mouseY){
    if(!items.length) return false;
    // This formula uses trigonometry to apply a rotation to the mouse coordinates and then translates them back to the original coordinate system.
    let xPrime = (_mouseX - _activeItem.x) * mySketch.cos(_activeItem.angle) + (_mouseY-_activeItem.y) * mySketch.sin(_activeItem.angle) + _activeItem.x;
    let yPrime = (_mouseY- _activeItem.y) * mySketch.cos(_activeItem.angle) - (_mouseX-_activeItem.x) * mySketch.sin(_activeItem.angle) + _activeItem.y;
  
    //Check if the active item is a line and if the mouse is over an endpoint of the line.
    if(_activeItem.name.startsWith('Line') && 
      ((xPrime < _activeItem.x + _activeItem.swidth / 2 + 20 && xPrime > _activeItem.x + _activeItem.swidth / 2 + 10
        && yPrime < _activeItem.y + 5 && yPrime > _activeItem.y - 5)
      || (xPrime < _activeItem.x - _activeItem.swidth / 2 - 10 && xPrime > _activeItem.x - _activeItem.swidth / 2 - 20
        && yPrime < _activeItem.y + 5 && yPrime > _activeItem.y - 5))){
      return true;
    }

    // If the active item is not a line annd the mouse is over one of the four corners, return true.
    else if((xPrime < _activeItem.x + _activeItem.swidth / 2 + 10 && xPrime > _activeItem.x + _activeItem.swidth / 2
              && yPrime < _activeItem.y - _activeItem.sheight / 2 && yPrime > _activeItem.y - _activeItem.sheight / 2 - 10)
          || (xPrime < _activeItem.x + _activeItem.swidth / 2 + 10 && xPrime > _activeItem.x + _activeItem.swidth / 2
              && yPrime < _activeItem.y + _activeItem.sheight / 2 + 10 && yPrime > _activeItem.y + _activeItem.sheight / 2)
          || (xPrime < _activeItem.x - _activeItem.swidth / 2 && xPrime > _activeItem.x - _activeItem.swidth / 2 - 10
              && yPrime < _activeItem.y + _activeItem.sheight / 2 + 10 && yPrime > _activeItem.y + _activeItem.sheight / 2)
          || (xPrime < _activeItem.x - _activeItem.swidth / 2 && xPrime > _activeItem.x - _activeItem.swidth / 2 - 10
              && yPrime < _activeItem.y - _activeItem.sheight / 2 && yPrime > _activeItem.y - _activeItem.sheight / 2 - 10)){
      return true;
    }
    return false;
  }