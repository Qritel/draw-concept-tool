import { itemList, activeItem, id, mySketch as p } from "../app";
import { tableimg, chairimg, sofaimg, doorimg, windowimg, sinkimg, toiletimg, tvimg } from "../app";
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
    itemList = _savedData;
  }

  static addItem(_item) {
    Object.keys(_item).forEach(key => {
      if (_item[key] === undefined) {
        delete _item[key];
      }
    });
    if (_item.name && !_item.name.endsWith('drawing')) {
      id++;
      undoManager.add({
        undo: function () {
          Item.removeItem(_item);
        },
        redo: function () {
          Item.addItem(_item);
        }
      });
    }
    itemList.splice(_item.index, 0, _item);
    if (activeItem) activeItem.selected = false;
    activeItem = _item;
  }

  static removeItem(_item) {
    const index = itemList.indexOf(_item);
    if (index > -1) {
      itemList.splice(index, 1);
      // Update indexes of items after the removed item
      for (let i = index; i < itemList.length; i++) {
        itemList[i].index--;
      }
    }
    if (activeItem === _item) {
      if (itemList.length == 0) activeItem = {};
      else if (index == 0) activeItem = itemList[index];
      else activeItem = itemList[index - 1];
      activeItem.selected = true;
    }
    if (_item.name && !_item.name.endsWith('drawing')) {
      undoManager.add({
        undo: function () {
          Item.addItem(_item);
        },
        redo: function () {
          Item.removeItem(_item);
        }
      });
    }
  }

  static moveUpItem(_item) {
    const index = itemList.indexOf(_item);
    const len = itemList.length;
    if (index < len - 1) {
      [itemList[index].index, itemList[index + 1].index] = [itemList[index + 1].index, itemList[index].index];
      [itemList[index], itemList[index + 1]] = [itemList[index + 1], itemList[index]];
      undoManager.add({
        undo: function () {
          Item.moveDownItem(_item);
        },
        redo: function () {
          Item.moveUpItem(_item);
        }
      });
    }
  }

  static moveDownItem(_item) {
    const index = itemList.indexOf(_item);
    if (index > 0) {
      [itemList[index].index, itemList[index - 1].index] = [itemList[index - 1].index, itemList[index].index];
      [itemList[index], itemList[index - 1]] = [itemList[index - 1], itemList[index]];
      undoManager.add({
        undo: function () {
          Item.moveUpItem(_item);
        },
        redo: function () {
          Item.moveDownItem(_item);
        }
      });
    }
  }

  static dragItem(_dx, _dy, _item) {
    const index = itemList.indexOf(_item);
    itemList[index].x += _dx;
    itemList[index].y += _dy;
    undoManager.add({
      undo: function () {
        Item.dragItem(-_dx, -_dy, _item);
      },
      redo: function () {
        Item.dragItem(_dx, _dy, _item);
      }
    });
  }

  static resizeItem(_dx, _dy, _dw, _dh, _item) {
    const index = itemList.indexOf(_item);
    itemList[index].x += _dx;
    itemList[index].y += _dy;
    if (itemList[index].name.startsWith('Rectangle') || itemList[index].name.startsWith('Ellipse')) {
      itemList[index].h += _dh;
      itemList[index].w += _dw;
    }
    else if (itemList[index].name.startsWith('Line')) {
      itemList[index].l += _dw;
    }
    itemList[index].swidth += _dw;
    itemList[index].sheight += _dh;
    undoManager.add({
      undo: function () {
        Item.resizeItem(-_dx, -_dy, -_dw, -_dh, _item);
      },
      redo: function () {
        Item.resizeItem(_dx, _dy, _dw, _dh, _item);
      }
    });
  }

  static rotateItem(_da, _item) {
    const index = itemList.indexOf(_item);
    itemList[index].angle += _da;
    undoManager.add({
      undo: function () {
        Item.rotateItem(-_da, _item);
      },
      redo: function () {
        Item.rotateItem(_da, _item);
      }
    });
  }

  static drawItem(_item) {
    if (_item.name.startsWith('Rectangle')) {
      p.push();
      p.strokeWeight(3);
      p.stroke(_item.strokeColor);
      p.fill(_item.fillColor);
      if (_item.noFill) p.noFill();
      if (_item.noStroke) p.noStroke();
      p.rectMode(p.CENTER);
      p.translate(_item.x, _item.y);
      p.angleMode(p.DEGREES);
      p.rotate(_item.angle);
      p.rect(0, 0, _item.w, _item.h,
        _item.topLeftRadius, _item.topRightRadius, _item.bottomRightRadius, _item.bottomLeftRadius);
      p.pop();
    }
    if (_item.name.startsWith('Ellipse')) {
      p.push();
      p.strokeWeight(3);
      p.stroke(_item.strokeColor);
      p.fill(_item.fillColor);
      if (_item.noFill) p.noFill();
      if (_item.noStroke) p.noStroke();
      p.rectMode(p.CENTER);
      p.translate(_item.x, _item.y);
      p.angleMode(p.DEGREES);
      p.rotate(_item.angle);
      p.ellipse(0, 0, _item.w, _item.h);
      p.pop();
    }
    else if (_item.name.startsWith('Line')) {
      p.push();
      p.strokeWeight(_item.w);
      p.stroke(_item.color);
      p.rectMode(p.CENTER);
      p.translate(_item.x, _item.y);
      p.angleMode(p.DEGREES);
      p.rotate(_item.angle);
      p.rect(0, 0, _item.l, 1);
      p.pop();
    }
    else if (_item.name.startsWith('Table')) {
      p.push();
      p.imageMode(p.CENTER);
      p.translate(_item.x, _item.y);
      p.angleMode(p.DEGREES);
      p.rotate(_item.angle)
      p.image(tableimg, 0, 0, 100, 73);
      // draw chairs arranged in a circle
      for (let i = 0; i < _item.numPlace; i++) {

        let angle = p.TWO_PI / _item.numPlace * i;
        let x = p.cos(angle) * 55;
        let y = p.sin(angle) * 55;

        switch (_item.typeChair) {

          case 'chair':
            //p5: The push() function saves the current drawing style settings and transformations, while pop() restores these settings
            p.push();
            p.imageMode(p.CENTER);
            p.translate(x, y);
            p.angleMode(p.RADIANS);
            p.rotate(angle + p.PI / 2);
            p.image(chairimg, 0, 0, 200, 130);
            p.pop();
            break;

          case 'sofa':
            p.push();
            p.imageMode(p.CENTER);
            p.translate(x, y);
            p.angleMode(p.RADIANS);
            p.rotate(angle + p.PI / 2);
            p.image(sofaimg, 0, 0, 200, 130);
            p.pop();
            break;
        }
      }
      p.pop();
    }
    else if (_item.name.startsWith('Door')) {
      p.push();
      p.imageMode(p.CENTER);
      p.translate(_item.x, _item.y);
      p.angleMode(p.DEGREES);
      p.rotate(_item.angle);
      p.image(doorimg, 0, 0, 200, 75);
      p.pop();
    }
    else if (_item.name.startsWith('Window')) {
      p.push();
      p.imageMode(p.CENTER);
      p.translate(_item.x, _item.y);
      p.angleMode(p.DEGREES);
      p.rotate(_item.angle);
      p.image(windowimg, 0, 0, 200, 150);
      p.pop();
    }
    else if (_item.name.startsWith('TV')) {
      p.push();
      p.imageMode(p.CENTER);
      p.translate(_item.x, _item.y);
      p.angleMode(p.DEGREES);
      p.rotate(_item.angle);
      p.image(tvimg, 0, 0, 120, 75);
      p.pop();
    }
    else if (_item.name.startsWith('Toilet')) {
      p.push();
      p.imageMode(p.CENTER);
      p.translate(_item.x, _item.y);
      p.angleMode(p.DEGREES);
      p.rotate(_item.angle);
      p.image(toiletimg, 0, 0, 55, 70);
      p.pop();
    }
    else if (_item.name.startsWith('Sink')) {
      p.push();
      p.imageMode(p.CENTER);
      p.translate(_item.x, _item.y);
      p.angleMode(p.DEGREES);
      p.rotate(_item.angle);
      p.image(sinkimg, 0, 0, 70, 85);
      p.pop();
    }
    else if (_item.name.startsWith('Text')) {
      p.push();
      p.noStroke();
      p.textSize(_item.size);
      p.fill(_item.color);
      p.translate(_item.x, _item.y);
      p.angleMode(p.DEGREES);
      p.rotate(_item.angle);
      p.text(_item.inputText, - _item.swidth / 2, - _item.sheight / 2, _item.swidth, _item.sheight);
      p.pop();
    }
  }
}
export default Item;
