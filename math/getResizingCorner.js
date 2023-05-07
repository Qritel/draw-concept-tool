import { mySketch, items } from "../sketch";

//This function determines which corner of '_activeItem', the mouse is currently hovering over.
export default function getResizingCorner(_activeItem, _mouseX, _mouseY) {
    if(!items.length) return false;
    let corner;
     // This formula uses trigonometry to apply a rotation to the mouse coordinates and then translates them back to the original coordinate system.
    let xPrime = (_mouseX - _activeItem.x) * mySketch.cos(_activeItem.angle) + (_mouseY-_activeItem.y) * mySketch.sin(_activeItem.angle) + _activeItem.x;
    let yPrime = (_mouseY- _activeItem.y) * mySketch.cos(_activeItem.angle) - (_mouseX-_activeItem.x) * mySketch.sin(_activeItem.angle) + _activeItem.y;
  
    if(_activeItem.name.startsWith('Rectangle') || _activeItem.name.startsWith('Line')){
      if(xPrime < _activeItem.x + 5 && xPrime > _activeItem.x - 5 && yPrime < _activeItem.y - _activeItem.sheight / 2 + 10
        && yPrime > _activeItem.y - _activeItem.sheight / 2 - 10){
        corner = 'T'; // top corner.
      }
      else if(xPrime < _activeItem.x + 5 && xPrime > _activeItem.x - 5 && yPrime < _activeItem.y + _activeItem.sheight / 2 + 10
        && yPrime > _activeItem.y + _activeItem.sheight / 2 - 10){
        corner = 'B'; // bottom corner.
      }
      else if(xPrime < _activeItem.x - _activeItem.swidth / 2 + 10 && xPrime > _activeItem.x - _activeItem.swidth / 2 - 10 
        && yPrime < _activeItem.y + 5 && yPrime > _activeItem.y - 5){
        corner = 'L'; // left corner.
      }
      else if(xPrime < _activeItem.x + _activeItem.swidth / 2 + 10 && xPrime > _activeItem.x + _activeItem.swidth / 2 - 10 
        && yPrime < _activeItem.y + 5 && yPrime > _activeItem.y - 5){
        corner = 'R'; //right corner.
      }
    }
    return corner;
}