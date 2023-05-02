import { items, activeItem, id, mySketch as p } from "../sketch";
import { tableimg, chairimg, sofaimg, doorimg, windowimg, sinkimg, toiletimg, tvimg} from "../sketch";
import { undoManager } from "../sketch";

class Item {
  constructor(array) {
    this.visibility = array[0];
    this.index = array[1];
    this.name = array[2];
    this.x = array[3];
    this.y = array[4];
    this.w = array[5];
    this.h = array[6];
    this.l = array[7];
    this.angle = array[8];
    this.topLeftRadius = array[9];
    this.topRightRadius = array[10];
    this.bottomRightRadius = array[11];
    this.bottomLeftRadius = array[12];
    this.strokeColor = array[13];
    this.noStroke = array[14];
    this.fillColor = array[15];
    this.noFill = array[16];
    this.color = array[17];
    this.numPlace = array[18];
    this.typeChair = array[19];
    this.inputText = array[20];
    this.size = array[21];
    this.swidth = array[22];
    this.sheight = array[23];
  }

  static addItem(_object) {
    Object.keys(_object).forEach(key => {
      if (_object[key] === undefined) {
        delete _object[key];
      }
    });
    if(_object.name && !_object.name.endsWith('drawing')) {
      id ++;
      undoManager.add({
        undo: function() {
          Item.removeItem(_object);
        },
        redo: function() {
          Item.addItem(_object);
        }
      });
    }
    items.splice(_object.index, 0, _object);
    activeItem = _object;
  }

  static removeItem(_object) {
    const index = items.indexOf(_object);
    if (index > -1) {
      items.splice(index, 1);
    }
    if(activeItem === _object) {
      if(items.length == 0) activeItem = {};
      else if(index == 0) activeItem = items[index];
      else activeItem = items[index-1];
    }
    if(_object.name && !_object.name.endsWith('drawing')) {
      undoManager.add({
        undo: function() {
          Item.addItem(_object);
        },
        redo: function() {
          Item.removeItem(_object);
        }
      });
    }
  }

  static moveUpItem(_name) {
    const index = items.findIndex(_object => _object.name === _name);
    activeItem = items[index];
    const len = items.length;
    if(index < len - 1) {
      [items[index].index, items[index + 1].index] = [items[index + 1].index, items[index].index];
      [items[index], items[index + 1]] = [items[index + 1], items[index]];
      undoManager.add({
        undo: function() {
          Item.moveDownItem(_name);
        },
        redo: function() {
          Item.moveUpItem(_name);
        }
      });
    }
  }
  
  static moveDownItem(_name) {
    const index = items.findIndex(_object => _object.name === _name);
    activeItem = items[index];
    if(index > 0) {
      [items[index].index, items[index - 1].index] = [items[index - 1].index, items[index].index];
      [items[index], items[index - 1]] = [items[index - 1], items[index]];
      undoManager.add({
        undo: function() {
          Item.moveUpItem(_name);
        },
        redo: function() {
          Item.moveDownItem(_name);
        }
      });
    }
  }

  static dragItem(_dx, _dy, _index) {
    items[_index].x += _dx;
    items[_index].y += _dy;
    activeItem = items[_index];
    undoManager.add({
      undo: function() {
        Item.dragItem(-_dx, -_dy, _index);
      },
      redo: function() {
        Item.dragItem(_dx, _dy, _index);
      }
    });
  }

  static resizeItem(_dx, _dy, _dw, _dh, _index){
    items[_index].x += _dx;
    items[_index].y += _dy;
    if(items[_index].name.startsWith('Rectangle')){
      items[_index].h += _dh;
      items[_index].w += _dw;
    }
    else if(items[_index].name.startsWith('Line')){
      items[_index].l += _dw;
    }
    items[_index].swidth += _dw;
    items[_index].sheight += _dh;
    activeItem = items[_index];
    undoManager.add({
      undo: function() {
        Item.resizeItem(-_dx, -_dy, -_dw, -_dh, _index);
      },
      redo: function() {
        Item.resizeItem(_dx, _dy, _dw, _dh, _index);
      }
    });
  }
  
  static rotateItem(_da, _index){
    items[_index].angle += _da;
    activeItem = items[_index];
    undoManager.add({
      undo: function() {
        Item.rotateItem(-_da, _index);
      },
      redo: function() {
        Item.rotateItem(_da, _index);
      }
    });
  }

  static drawItem(_object){
    if(_object.name.startsWith('Rectangle')) {
      p.push();
      p.strokeWeight(3);
      p.stroke(_object.strokeColor);
      p.fill(_object.fillColor);
      if(_object.noFill) p.noFill();
      if(_object.noStroke) p.noStroke();
      p.rectMode(p.CENTER); 
      p.translate(_object.x, _object.y);
      p.angleMode(p.DEGREES);
      p.rotate(_object.angle);
      p.rect(0, 0, _object.w, _object.h,
        _object.topLeftRadius, _object.topRightRadius, _object.bottomRightRadius, _object.bottomLeftRadius);
      p.pop();
    }
    else if(_object.name.startsWith('Line')) {
      p.push();
      p.strokeWeight(_object.w);
      p.stroke(_object.color);
      p.rectMode(p.CENTER); 
      p.translate(_object.x, _object.y);
      p.angleMode(p.DEGREES);
      p.rotate(_object.angle);
      p.rect(0,0,_object.l,1);
      p.pop();
    }
    else if(_object.name.startsWith('Table')) {
      p.push();
      p.imageMode(p.CENTER);
      p.translate(_object.x, _object.y);
      p.angleMode(p.DEGREES);
      p.rotate(_object.angle)
      p.image(tableimg, 0, 0, 100, 73);
      // draw chairs arranged in a circle
      for(let i = 0; i < _object.numPlace; i++) {

        let angle = p.TWO_PI / _object.numPlace * i;
        let x = p.cos(angle) * 55;
        let y = p.sin(angle) * 55;

        switch(_object.typeChair) {

          case 'chair':
          //p5: The push() function saves the current drawing style settings and transformations, while pop() restores these settings
            p.push();
            p.imageMode(p.CENTER);
            p.translate(x, y);
            p.angleMode(p.RADIANS);
            p.rotate(angle+p.PI/2);
            p.image(chairimg,0, 0, 200, 130);
            p.pop();
            break;

          case 'sofa':
            p.push();
            p.imageMode(p.CENTER);
            p.translate(x, y);
            p.angleMode(p.RADIANS);
            p.rotate(angle+p.PI/2);
            p.image(sofaimg,0, 0, 200, 130);
            p.pop();
            break;
        }
      }
      p.pop();
    }
    else if(_object.name.startsWith('Door')) {
      p.push();
      p.imageMode(p.CENTER);
      p.translate(_object.x, _object.y);
      p.angleMode(p.DEGREES);
      p.rotate(_object.angle);
      p.image(doorimg, 0, 0, 200, 75);
      p.pop();
    }
    else if(_object.name.startsWith('Window')) {
      p.push();
      p.imageMode(p.CENTER);
      p.translate(_object.x, _object.y);
      p.angleMode(p.DEGREES);
      p.rotate(_object.angle);
      p.image(windowimg, 0, 0, 200, 150);
      p.pop();
    }
    else if(_object.name.startsWith('TV')) {
      p.push();
      p.imageMode(p.CENTER);
      p.translate(_object.x, _object.y);
      p.angleMode(p.DEGREES);
      p.rotate(_object.angle);
      p.image(tvimg, 0, 0, 120, 75);
      p.pop();
    }
    else if(_object.name.startsWith('Toilet')) {
      p.push();
      p.imageMode(p.CENTER);
      p.translate(_object.x, _object.y);
      p.angleMode(p.DEGREES);
      p.rotate(_object.angle);
      p.image(toiletimg, 0, 0, 55, 70);
      p.pop();
    }
    else if(_object.name.startsWith('sink')) {
      p.push();
      p.imageMode(p.CENTER);
      p.translate(_object.x, _object.y);
      p.angleMode(p.DEGREES);
      p.rotate(_object.angle);
      p.image(sinkimg, 0, 0, 70, 85);
      p.pop();
    }
    else if(_object.name.startsWith('Text')) {
      p.push();
      p.noStroke();
      p.textSize(_object.size);
      p.fill(_object.color);
      p.translate(_object.x, _object.y);
      p.angleMode(p.DEGREES);
      p.rotate(_object.angle);
      p.text(_object.inputText, -60, -30, _object.swidth, _object.sheight);
      p.pop();
    }
  }
}
export default Item;
  