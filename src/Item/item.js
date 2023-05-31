import { items, activeItem, id, mySketch as p } from "../app";
import { tableimg, chairimg, sofaimg, doorimg, windowimg, sinkimg, toiletimg, tvimg} from "../app";
import { undoManager } from "../app";

class Item {
  constructor(array) {
    this.visibility = array[0];
    this.selected = array[1];
    this.index = array[2];
    this.name = array[3];
    this.x = array[4];
    this.y = array[5];
    this.w = array[6];
    this.h = array[7];
    this.l = array[8];
    this.angle = array[9];
    this.topLeftRadius = array[10];
    this.topRightRadius = array[11];
    this.bottomRightRadius = array[12];
    this.bottomLeftRadius = array[13];
    this.strokeColor = array[14];
    this.noStroke = array[15];
    this.fillColor = array[16];
    this.noFill = array[17];
    this.color = array[18];
    this.numPlace = array[19];
    this.typeChair = array[20];
    this.inputText = array[21];
    this.size = array[22];
    this.swidth = array[23];
    this.sheight = array[24];
  }

  static loadItems(_savedData) {
    items = _savedData;
  }

  static addItem(_item) {
    Object.keys(_item).forEach(key => {
      if (_item[key] === undefined) {
        delete _item[key];
      }
    });
    if(_item.name && !_item.name.endsWith('drawing')) {
      id ++;
      undoManager.add({
        undo: function() {
          Item.removeItem(_item);
        },
        redo: function() {
          Item.addItem(_item);
        }
      });
    }
    items.splice(_item.index, 0, _item);
    activeItem = _item;
  }

  static removeItem(_item) {
    const index = items.indexOf(_item);
    if (index > -1) {
      items.splice(index, 1);
    }
    if(activeItem === _item) {
      if(items.length == 0) activeItem = {};
      else if(index == 0) activeItem = items[index];
      else activeItem = items[index-1];
    }
    if(_item.name && !_item.name.endsWith('drawing')) {
      undoManager.add({
        undo: function() {
          Item.addItem(_item);
        },
        redo: function() {
          Item.removeItem(_item);
        }
      });
    }
  }

  static moveUpItem(_name) {
    const index = items.findIndex(_item => _item.name === _name);
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
    const index = items.findIndex(_item => _item.name === _name);
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

  static drawItem(_item){
    if(_item.name.startsWith('Rectangle')) {
      p.push();
      p.strokeWeight(3);
      p.stroke(_item.strokeColor);
      p.fill(_item.fillColor);
      if(_item.noFill) p.noFill();
      if(_item.noStroke) p.noStroke();
      p.rectMode(p.CENTER); 
      p.translate(_item.x, _item.y);
      p.angleMode(p.DEGREES);
      p.rotate(_item.angle);
      p.rect(0, 0, _item.w, _item.h,
        _item.topLeftRadius, _item.topRightRadius, _item.bottomRightRadius, _item.bottomLeftRadius);
      p.pop();
    }
    else if(_item.name.startsWith('Line')) {
      p.push();
      p.strokeWeight(_item.w);
      p.stroke(_item.color);
      p.rectMode(p.CENTER); 
      p.translate(_item.x, _item.y);
      p.angleMode(p.DEGREES);
      p.rotate(_item.angle);
      p.rect(0,0,_item.l,1);
      p.pop();
    }
    else if(_item.name.startsWith('Table')) {
      p.push();
      p.imageMode(p.CENTER);
      p.translate(_item.x, _item.y);
      p.angleMode(p.DEGREES);
      p.rotate(_item.angle)
      p.image(tableimg, 0, 0, 100, 73);
      // draw chairs arranged in a circle
      for(let i = 0; i < _item.numPlace; i++) {

        let angle = p.TWO_PI / _item.numPlace * i;
        let x = p.cos(angle) * 55;
        let y = p.sin(angle) * 55;

        switch(_item.typeChair) {

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
    else if(_item.name.startsWith('Door')) {
      p.push();
      p.imageMode(p.CENTER);
      p.translate(_item.x, _item.y);
      p.angleMode(p.DEGREES);
      p.rotate(_item.angle);
      p.image(doorimg, 0, 0, 200, 75);
      p.pop();
    }
    else if(_item.name.startsWith('Window')) {
      p.push();
      p.imageMode(p.CENTER);
      p.translate(_item.x, _item.y);
      p.angleMode(p.DEGREES);
      p.rotate(_item.angle);
      p.image(windowimg, 0, 0, 200, 150);
      p.pop();
    }
    else if(_item.name.startsWith('TV')) {
      p.push();
      p.imageMode(p.CENTER);
      p.translate(_item.x, _item.y);
      p.angleMode(p.DEGREES);
      p.rotate(_item.angle);
      p.image(tvimg, 0, 0, 120, 75);
      p.pop();
    }
    else if(_item.name.startsWith('Toilet')) {
      p.push();
      p.imageMode(p.CENTER);
      p.translate(_item.x, _item.y);
      p.angleMode(p.DEGREES);
      p.rotate(_item.angle);
      p.image(toiletimg, 0, 0, 55, 70);
      p.pop();
    }
    else if(_item.name.startsWith('sink')) {
      p.push();
      p.imageMode(p.CENTER);
      p.translate(_item.x, _item.y);
      p.angleMode(p.DEGREES);
      p.rotate(_item.angle);
      p.image(sinkimg, 0, 0, 70, 85);
      p.pop();
    }
    else if(_item.name.startsWith('Text')) {
      p.push();
      p.noStroke();
      p.textSize(_item.size);
      p.fill(_item.color);
      p.translate(_item.x, _item.y);
      p.angleMode(p.DEGREES);
      p.rotate(_item.angle);
      p.text(_item.inputText, -60, -30, _item.swidth, _item.sheight);
      p.pop();
    }
  }
}
export default Item;
  