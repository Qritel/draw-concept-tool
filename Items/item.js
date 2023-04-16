import { items, activeItem, id } from "../sketch";
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
}
export default Item;
  