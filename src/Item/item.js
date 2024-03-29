import { itemList, activeItem, selectedItems, id, imageMap, mySketch as p } from "../app";
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
    this.strokeWeight = array[8];
    this.l = array[9];
    this.angle = array[10];
    this.topLeftRadius = array[11];
    this.topRightRadius = array[12];
    this.bottomRightRadius = array[13];
    this.bottomLeftRadius = array[14];
    this.strokeColor = array[15];
    this.noStroke = array[16];
    this.fillColor = array[17];
    this.fillTransparency = array[18];
    this.noFill = array[19];
    this.color = array[20];
    this.numPlace = array[21];
    this.typeChair = array[22];
    this.inputText = array[23];
    this.textStyle = array[24];
    this.size = array[25];
    this.type = array[26];
    this.swidth = array[27];
    this.sheight = array[28];
    this.dash = array[29];
    this.img64 = array[30];
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
    if (_item.name && !_item.name.endsWith('drawing') && _item.name != 'Rectangle Select') {
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
    // deselect all
    if (activeItem) activeItem.selected = false;
    if (selectedItems.length > 0) {
      selectedItems.forEach(_item => _item.selected = false);
      selectedItems = [];
    }
    if (!['Rectangle drawing', 'Ellipse drawing', 'Line drawing', 'Rectangle Select'].includes(_item.name)) {
      activeItem = _item;
      activeItem.selected = true;
    }
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
      if (itemList.length == 0) activeItem = null;
      else if (index == 0) activeItem = itemList[index];
      else activeItem = itemList[index - 1];
      if (activeItem) activeItem.selected = true;
    }
    if (_item.name && !_item.name.endsWith('drawing') && _item.name != 'Rectangle Select') {
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

  static addItems(_items) {
    undoManager.add({
      undo: function () {
        Item.removeItems(_items);
      },
      redo: function () {
        Item.addItems(_items);
      }
    });
    _items.forEach(_item => {
      _item.selected = false;
      itemList.splice(_item.index, 0, _item);
      id++;
    });
    // deselect all
    if (activeItem) activeItem.selected = false;
    if (selectedItems.length > 0) {
      selectedItems.forEach(_item => _item.selected = false);
      selectedItems = [];
    }
    activeItem = _items[0];
    activeItem.selected = true;
  }

  static removeItems(_items) {
    undoManager.add({
      undo: function () {
        Item.addItems(_items);
      },
      redo: function () {
        Item.removeItems(_items);
      }
    });
    _items.forEach(_item => {
      const index = itemList.indexOf(_item);
      if (index > -1) {
        itemList.splice(index, 1);
        // Update indexes of items after the removed item
        for (let i = index; i < itemList.length; i++) {
          if (!_items.includes(itemList[i]))
            itemList[i].index--;
        }
      }
    });
    if (_items.includes(activeItem)) {
      if (itemList.length == 0) activeItem = null;
      else activeItem = itemList[0];
      if (activeItem) activeItem.selected = true;
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

  static dragItems(_dx, _dy, _items) {
    _items.forEach(_item => {
      const index = itemList.indexOf(_item);
      itemList[index].x += _dx;
      itemList[index].y += _dy;
    });
    undoManager.add({
      undo: function () {
        Item.dragItems(-_dx, -_dy, _items);
      },
      redo: function () {
        Item.dragItems(_dx, _dy, _items);
      }
    });
  }

  static resizeItem(_dx, _dy, _dw, _dh, _item) {
    const index = itemList.indexOf(_item);
    itemList[index].x += _dx;
    itemList[index].y += _dy;
    if (itemList[index].name.startsWith('Rectangle') || itemList[index].name.startsWith('Ellipse')
      || itemList[index].name.startsWith('Text') || itemList[index].name.startsWith('Img')) {
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
      p.strokeWeight(_item.strokeWeight);
      p.stroke(_item.strokeColor);
      let color = p.color(_item.fillColor);
      color.setAlpha(_item.fillTransparency)
      p.fill(color);
      if (_item.noFill) p.noFill();
      if (_item.noStroke) p.noStroke();
      p.drawingContext.setLineDash([_item.dash, _item.dash]);
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
      p.strokeWeight(_item.strokeWeight);
      p.stroke(_item.strokeColor);
      let color = p.color(_item.fillColor);
      color.setAlpha(_item.fillTransparency)
      p.fill(color);
      if (_item.noFill) p.noFill();
      if (_item.noStroke) p.noStroke();
      p.drawingContext.setLineDash([_item.dash, _item.dash]);
      p.rectMode(p.CENTER);
      p.translate(_item.x, _item.y);
      p.angleMode(p.DEGREES);
      p.rotate(_item.angle);
      p.ellipse(0, 0, _item.w, _item.h);
      p.pop();
    }
    else if (_item.name.startsWith('Line')) {
      p.push();
      p.strokeWeight(_item.strokeWeight);
      p.drawingContext.setLineDash([_item.dash, _item.dash]);
      p.stroke(_item.color);
      p.translate(_item.x, _item.y);
      p.angleMode(p.DEGREES);
      p.rotate(_item.angle);
      p.line(-_item.l / 2, 0, _item.l / 2, 0);
      p.fill(_item.color);
      p.drawingContext.setLineDash([]);
      switch (_item.type) {
        case 'leftwards arrow':
          p.triangle(-_item.l / 2, -5, -_item.l / 2, 5, -_item.l / 2 - 15, 0);
          break;
        case 'rightwards arrow':
          p.triangle(_item.l / 2, -5, _item.l / 2, 5, _item.l / 2 + 15, 0);
          break;
        case 'left right arrow':
          p.triangle(_item.l / 2, -5, _item.l / 2, 5, _item.l / 2 + 15, 0);
          p.triangle(-_item.l / 2, -5, -_item.l / 2, 5, -_item.l / 2 - 15, 0);
          break;
      }
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
      switch (_item.textStyle) {
        case 'normal':
          p.textStyle(p.NORMAL);
          break;
        case 'italic':
          p.textStyle(p.ITALIC);
          break;
        case 'bold':
          p.textStyle(p.BOLD);
          break;
        case 'bold & italic':
          p.textStyle(p.BOLDITALIC);
          break;
      }
      p.fill(_item.color);
      p.translate(_item.x, _item.y);
      p.angleMode(p.DEGREES);
      p.rotate(_item.angle);
      p.text(_item.inputText, - _item.swidth / 2, - _item.sheight / 2, _item.swidth, _item.sheight);
      p.pop();
    }
    else if (_item.name.startsWith('Img')) {
      p.push();
      p.imageMode(p.CENTER);
      p.translate(_item.x, _item.y);
      p.angleMode(p.DEGREES);
      p.rotate(_item.angle);
      p.image(imageMap[_item.img64], 0, 0, _item.w, _item.h);
      p.pop();
    }
  }
}
export default Item;
