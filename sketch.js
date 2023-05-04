/*
This code uses 2 libraries :
  QuickSettings : http://bit101.github.io/quicksettings/doc/module-QuickSettings.html
  P5 : https://p5js.org/reference/
*/

import p5 from 'p5';
import UndoManager from 'undo-manager';
import QuickSettings from 'quicksettings';

import Item from './Item/item';
import drawStrokeItem from './Item/drawStrokeItem';
import drawResizingCorner from './Item/drawResizingCorner';
import drawRotatingCorner from './Item/drawRotatingCorner';
import createPanel from './interactions/createPanel';
import refresh from './utilities/refresh';
import createBtnTool from './interactions/createBtnTool';
import getResizingCorner from './math/getResizingCorner';
import isRotatingCorner from './math/isRotatingCorner';
import getSelectedItem from './math/getSelectedItem';

import './styles/quicksettings.css';

let x1 = 0, y1 = 0, x2 = 0, y2 = 0;
let clickEvent = '';
let tmpClickEvent = '';
let corner ='';
let id = 1;
let canvasWidth;
let canvasHeight;
let canvasX;
let canvasY;
let diffPositionX;
let diffPositionY;
let tableimg;
let chairimg;
let sofaimg;
let doorimg;
let windowimg;
let sinkimg;
let toiletimg;
let tvimg;
let slider;
let zoom;
let zoomR;
let buttons = [];
let btnUndo;
let btnRedo;
let btnUp;
let btnDown;
let btnDelete;

//An array will contain all the items on the map -canvas-
let items = [];
let tmpItem = {};
let activeItem = {};

//A panel lists the names of the created items
let layers;

//A panel lists the properties of selected item
let panel;

let undoManager = new UndoManager();

let mySketch;

const sketch = (p) => {
  mySketch = p;

//p5 function: used to handle asynchronous loading of external files
p.preload = function () {
  tableimg = p.loadImage('images/table.png');
  chairimg = p.loadImage('images/chair.png');
  sofaimg = p.loadImage('images/sofa.png');
  doorimg = p.loadImage('images/door.png');
  windowimg = p.loadImage('images/window.png');
  sinkimg = p.loadImage('images/sink.png');
  toiletimg = p.loadImage('images/toilet.png');
  tvimg = p.loadImage('images/TV.png');
}

//p5 function: called once when the program starts
p.setup = function () {

  QuickSettings.useExtStyleSheet();

  refresh();

  //p5: Creates a canvas element in the document, and sets the dimensions of it in pixels
  canvasX = 100;
  canvasY = 35;
  canvasWidth = p.windowWidth - 191 - canvasX;
  canvasHeight = p.windowHeight - 2 - canvasY;
  let canv = p.createCanvas(canvasWidth, canvasHeight);
  //p5: Set its postion
  canv.position(canvasX, canvasY);

  createBtnTool('⇱', 0, 60, 'Move');
  createBtnTool('⬛', 0, 100, 'Draw_Rect');
  createBtnTool('▬▬', 0, 140, 'Draw_Line');
  createBtnTool('Table', 0, 180, 'Table');
  createBtnTool('Door', 0, 220, 'Door');
  createBtnTool('Window', 0, 260, 'Window');
  createBtnTool('TV', 0, 300, 'TV');
  createBtnTool('Toilet', 0, 340, 'Toilet');
  createBtnTool('sink', 0, 380, 'sink');
  createBtnTool('Text', 0, 420, 'Text');

  //zoom slider
  slider = p.createSlider(0, 250, 100, 5);
  slider.position(1, canvasHeight + canvasY - 20);
  slider.style('width', '94px');
  slider.input(p.draw);

  btnUndo = p.createButton('⟲');
  btnUndo.position(10, 20);
  btnUndo.mousePressed(function() {
    undoManager.undo();
    refresh();
  });

  btnRedo = p.createButton('⟳');
  btnRedo.position(61, 20);
  btnRedo.mousePressed(function() {
    undoManager.redo();
    refresh();
  });

  btnUp = p.createButton('🡡');
  btnUp.position(canvasWidth, 5);
  btnDown = p.createButton('🡣');
  btnDown.position(canvasWidth + 30, 5);
  btnDelete = p.createButton('🗑️');
  btnDelete.position(canvasWidth + 60, 5);

  p.noLoop();
}

//p5 function: continuously executes the lines of code contained inside its block until the program is stopped or p.noLoop() is called(as our case)
//draw() will be executed one time, when an item is added or its properties is changed.
p.draw = function () {
  //set the color for the background of the canvas
  p.background('#ffffff')
  p.noFill();
  p.stroke('#d8d8d8');
  p.rect(0, 0, canvasWidth - 1, canvasHeight - 1);

  zoom = slider.value();
  zoomR = 100 / zoom;

  p.push();
  p.stroke('#2e7bb6');
  p.text(zoom + '%', 5, canvasHeight - 6);
  p.pop();

  p.push();
  p.scale(zoom / 100);
  
  if(!undoManager.hasUndo()) btnUndo.hide();
  else btnUndo.show();
  
  if(!undoManager.hasRedo()) btnRedo.hide();
  else btnRedo.show();

  //browse all items
  items.forEach(function(_item) {
    if(_item.visibility){
      Item.drawItem(_item);
    }
  });
  if(activeItem.visibility || tmpItem.visibility) {
    const whichItem = tmpItem.visibility ? tmpItem : activeItem;
    drawStrokeItem(whichItem);
    drawResizingCorner(whichItem);
    drawRotatingCorner(whichItem);
  }
  if(activeItem.name != 'Rectangle drawing' && activeItem.name != 'Line drawing'){
    btnUp.mousePressed(function() { Item.moveUpItem(activeItem.name); refresh(); });
    btnDown.mousePressed(function() { Item.moveDownItem(activeItem.name); refresh(); });
    btnDelete.mousePressed(function() { Item.removeItem(activeItem); refresh(); });
  }
  if(items.length){
    btnUp.show();
    btnDown.show();
    btnDelete.show();
  }
  else{
    btnUp.hide();
    btnDown.hide();
    btnDelete.hide();
  }
  p.pop();
}

//p5 function: called once after every time a mouse button is pressed.
p.mousePressed = function () {
  let mouseXR = p.mouseX * zoomR;
  let mouseYR = p.mouseY* zoomR;
  if(p.mouseX > 0 && p.mouseX < canvasWidth && p.mouseY> 0 && p.mouseY< canvasHeight) {
    if(items.length && isRotatingCorner(activeItem, mouseXR, mouseYR)){
      tmpClickEvent = clickEvent;
      clickEvent = 'Rotate';
      diffPositionX = mouseXR;
      diffPositionY = mouseYR;
      tmpItem = { ...activeItem }; //make a copy of 'activeItem', and store it in the new variable 'tmpItem'.
      activeItem.visibility = false;
      items.splice(activeItem.index, 0, tmpItem); //insert 'tmpItem' into the 'items' array at the position 'activeItem.index'.
    }
    else if(items.length && getResizingCorner(activeItem, mouseXR, mouseYR)){
      corner = getResizingCorner(activeItem, mouseXR, mouseYR);
      tmpClickEvent = clickEvent;
      clickEvent = 'Resize';
      diffPositionX = (mouseXR - activeItem.x) * p.cos(activeItem.angle) 
                + (mouseYR - activeItem.y) * p.sin(activeItem.angle) + activeItem.x - panel.getValue('x');
      diffPositionY = (mouseYR - activeItem.y) * p.cos(activeItem.angle)
                - (mouseXR - activeItem.x) * p.sin(activeItem.angle) + activeItem.y - panel.getValue('y');
      tmpItem = { ...activeItem };
      activeItem.visibility = false;
      items.splice(activeItem.index, 0, tmpItem);
    }
    else if(clickEvent == 'Draw_Rect' || clickEvent == 'Draw_Line') {
      x1 = mouseXR;
      y1 = mouseYR;
    }
    else if(getSelectedItem(mouseXR, mouseYR) && clickEvent == 'Move'){
      activeItem = getSelectedItem(mouseXR, mouseYR);
      refresh();
      diffPositionX = mouseXR - panel.getValue('x') + 0.01;
      diffPositionY = mouseYR - panel.getValue('y') + 0.01;
      tmpItem = { ...activeItem };
      activeItem.visibility = false;
      items.splice(activeItem.index, 0, tmpItem);
    }
  }
}

//p5 function: called once every time the mouse moves and a mouse button is pressed.
p.mouseDragged = function () {
  let mouseXR = p.mouseX * zoomR;
  let mouseYR = p.mouseY* zoomR;
  if(p.mouseX > 0 && p.mouseX < canvasWidth && p.mouseY> 0 && p.mouseY< canvasHeight) {
    if(clickEvent == 'Rotate'){
      p.angleMode(p.DEGREES);
      createPanel(tmpItem);
      panel.setValue('angle', activeItem.angle + p.atan2(mouseYR - activeItem.y, mouseXR - activeItem.x) - 
      p.atan2(diffPositionY - activeItem.y, diffPositionX - activeItem.x));
    }
    else if(clickEvent == 'Resize') {
      let dragX = diffPositionX + activeItem.x - ((mouseXR - activeItem.x) * p.cos(activeItem.angle) 
                  + (mouseYR - activeItem.y) * p.sin(activeItem.angle) + activeItem.x);
      let dragY = diffPositionY + activeItem.y - ((mouseYR - activeItem.y) * p.cos(activeItem.angle) 
                  - (mouseXR - activeItem.x) * p.sin(activeItem.angle) + activeItem.y);
      createPanel(tmpItem);
      if((corner == 'T' && activeItem.h + dragY > 0 || corner == 'B'  && activeItem.h - dragY > 0) 
          && activeItem.name.startsWith('Rectangle')){
        panel.setValue('y',Number(activeItem.y - dragY / 2 * p.cos(activeItem.angle)).toFixed(2));
        panel.setValue('x',Number(activeItem.x + dragY / 2 * p.sin(activeItem.angle)).toFixed(2));
        if(corner == 'T'){
          panel.setValue('h',Number(activeItem.h + dragY).toFixed(2));
          tmpItem.sheight = activeItem.sheight + dragY;
        }
        else if(corner == 'B'){
          panel.setValue('h',Number(activeItem.h - dragY).toFixed(2));
          tmpItem.sheight = activeItem.sheight - dragY;
        }
      }
      else if(corner == 'L' && activeItem.w + dragX > 0 || corner == 'R' && activeItem.w - dragX > 0
              || (corner == 'L' || corner == 'R') && activeItem.name.startsWith('Line')){
        panel.setValue('y',Number(activeItem.y - dragX / 2 * p.sin(activeItem.angle)).toFixed(2));
        panel.setValue('x',Number(activeItem.x - dragX / 2 * p.cos(activeItem.angle)).toFixed(2));
        if(corner == 'L'){
          if(activeItem.name.startsWith('Rectangle')){
            panel.setValue('w',Number(activeItem.w + dragX).toFixed(2));
            tmpItem.swidth = activeItem.swidth + dragX;
          }
          else if(activeItem.name.startsWith('Line')){
            panel.setValue('l',Number(activeItem.l + dragX).toFixed(2));
            tmpItem.swidth = activeItem.swidth + dragX;
          }
        }
        else{
          if(activeItem.name.startsWith('Rectangle')){
            panel.setValue('w',Number(activeItem.w - dragX).toFixed(2));
            tmpItem.swidth = activeItem.swidth - dragX;
          }
          else if(activeItem.name.startsWith('Line')){
            panel.setValue('l',Number(activeItem.l - dragX).toFixed(2));
            tmpItem.swidth = activeItem.swidth - dragX;
          }
        }
      }
    }
    else if(x1 && y1 && (clickEvent == 'Draw_Rect' || clickEvent == 'Draw_Line')) {
      x2 = p.mouseX * zoomR;
      y2 = p.mouseY* zoomR;
      if(clickEvent == 'Draw_Rect') {
        if(items.length && items[items.length - 1].name === 'Rectangle drawing') items.pop();
        Item.addItem(new Item([true, items.length, 'Rectangle drawing', x1+(x2-x1)/2, y1+(y2-y1)/2, p.abs (x2-x1), p.abs (y2-y1), undefined,
        0, 0, 0, 0, 0, '#000000', false, '#ffffff', false, undefined, undefined, undefined, undefined, undefined, p.abs (x2-x1) + 5,
        p.abs (y2-y1) + 5]));
      }
      if(clickEvent == 'Draw_Line') {
        if(items.length && items[items.length - 1].name === 'Line drawing') items.pop();
        Item.addItem(new Item([true, items.length, 'Line drawing', x1+(x2-x1)/2, y1+(y2-y1)/2, 2, undefined,
        Number(p.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2))).toFixed(2), p.atan((y2-y1)/(x2-x1)), undefined, undefined, undefined,undefined, undefined,
        undefined, undefined, undefined, '#000000', undefined, undefined, undefined, undefined,
        p.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2)) + 5, 7]));
      }
      p.draw();
    }
    else if(diffPositionX && diffPositionY && clickEvent == 'Move') {
      p.cursor(p.MOVE);
      createPanel(tmpItem);
      panel.setValue('x',Number(p.mouseX * zoomR - diffPositionX).toFixed(2));
      panel.setValue('y',Number(p.mouseY* zoomR - diffPositionY).toFixed(2));
    }
  }
}

p.mouseReleased = function () {
  let mouseXR = p.mouseX * zoomR;
  let mouseYR = p.mouseY* zoomR;
  if(clickEvent == 'Rotate') {
    items.splice(activeItem.index, 1);
    const index = items.indexOf(activeItem);
    activeItem.visibility = true;
    clickEvent = tmpClickEvent;
    if(tmpItem.angle != activeItem.angle) {
      Item.rotateItem(tmpItem.angle - activeItem.angle, index);
    }
    tmpItem = {};
  }
  else if(clickEvent == 'Resize') {
    items.splice(activeItem.index, 1);
    const index = items.indexOf(activeItem);
    activeItem.visibility = true;
    clickEvent = tmpClickEvent;
    if(tmpItem.x != activeItem.x || tmpItem.y != activeItem.y) {
      if(activeItem.name.startsWith('Rectangle'))
        Item.resizeItem(tmpItem.x - activeItem.x, tmpItem.y - activeItem.y, tmpItem.w - activeItem.w,
          tmpItem.h - activeItem.h, index);
      else if(activeItem.name.startsWith('Line'))
        Item.resizeItem(tmpItem.x - activeItem.x, tmpItem.y - activeItem.y, tmpItem.l - activeItem.l, 0, index);
    }
    tmpItem = {};
  }
  else if(p.mouseX > 0 && p.mouseX < canvasWidth && p.mouseY> 0 && p.mouseY< canvasHeight) {
    if(x1 && y1 && x2 && y2 && (clickEvent == 'Draw_Rect' || clickEvent == 'Draw_Line')) {
      if(clickEvent == 'Draw_Rect') {
        items.pop();
        Item.addItem(new Item([true, items.length, 'Rectangle ' + id, x1+(x2-x1)/2, y1+(y2-y1)/2, p.abs (x2-x1), p.abs (y2-y1), undefined,
        0, 0, 0, 0, 0, '#000000', false, '#ffffff', false, undefined, undefined, undefined, undefined, undefined, p.abs (x2-x1) + 5,
        p.abs (y2-y1) + 5]));
      }
      else if(clickEvent == 'Draw_Line') {
        items.pop();
        Item.addItem(new Item([true, items.length, 'Line ' + id, x1+(x2-x1)/2, y1+(y2-y1)/2, 2, undefined,
        p.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2)), p.atan((y2-y1)/(x2-x1)), undefined, undefined, undefined,undefined,
        undefined, undefined, undefined, undefined, '#000000', undefined, undefined, undefined, undefined,
        p.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2)) + 5, 7]));
      }
      refresh();
      x1 = 0, y1 = 0, x2 = 0, y2 = 0;
    }
    else if(clickEvent == 'Table') {
      Item.addItem(new Item([true, items.length, 'Table ' + id, mouseXR, mouseYR, undefined, undefined, undefined,
      0, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, 2, 'chair', undefined,
      undefined, 75, 75]));
      refresh();
    }
    else if(['Door', 'Toilet', 'sink'].includes(clickEvent)){
      Item.addItem(new Item([true, items.length, clickEvent + ' ' + id, mouseXR, mouseYR, undefined, undefined, undefined,
      0, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined,
      undefined, 75, 75]));
      refresh();
    }
    else if(['Window', 'TV'].includes(clickEvent)){
      Item.addItem(new Item([true, items.length, clickEvent + ' ' + id, mouseXR, mouseYR, undefined, undefined, undefined,
      0, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined,
      undefined, 155, 25]));
      refresh();
    }
    else if(clickEvent == 'Text') {
      Item.addItem(new Item([true, items.length, 'Text ' + id, mouseXR, mouseYR, undefined, undefined, undefined,
      0, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, '#000000', undefined, undefined,
      'Your text', 14, 125, 65]));
      refresh();
    }
    else if(diffPositionX && diffPositionY && items.length && clickEvent == 'Move') {
      items.splice(activeItem.index, 1);
      const index = items.indexOf(activeItem);
      activeItem.visibility = true;
      if(tmpItem.x != activeItem.x)
        {
          Item.dragItem(tmpItem.x - activeItem.x, tmpItem.y - activeItem.y, index);
        }
      tmpItem = {};
      diffPositionX = 0;
      diffPositionY = 0;
      p.cursor(p.ARROW);
    }
  }
}
}

new p5(sketch);

export { mySketch, items, activeItem, id, panel, layers, clickEvent, buttons, undoManager };
export {tableimg, chairimg, sofaimg, doorimg, windowimg, sinkimg, toiletimg, tvimg};