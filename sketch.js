/*
This code uses 2 libraries :
  QuickSettings : http://bit101.github.io/quicksettings/doc/module-QuickSettings.html
  P5 : https://p5js.org/reference/
*/

import p5 from 'p5';
import UndoManager from 'undo-manager';
import QuickSettings from 'quicksettings';
import Item from './shapes/item';
import createPanel from './interactions/createPanel';
import refresh from './utilities/refresh';
import createBtnTool from './interactions/createBtnTool';

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
  slider.input(p.redraw);

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
  p.stroke('#2e7bb6');
  p.text(zoom + '%', 5, canvasHeight - 6);
  p.push();
  p.scale(zoom / 100);
  
  if(!undoManager.hasUndo()) btnUndo.hide();
  else btnUndo.show();
  
  if(!undoManager.hasRedo()) btnRedo.hide();
  else btnRedo.show();

  //browse all items
  items.forEach(function(_object) {
    if(_object.visibility){
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
  });
  if(activeItem.visibility || tmpItem.visibility){
    let whichObject;
    if(tmpItem.visibility)
      whichObject = tmpItem;
    else
      whichObject = activeItem;
    p.push();
    p.rectMode(p.CENTER);
    p.translate(whichObject.x, whichObject.y);
    p.stroke('#2e7bf6');
    p.noFill();
    p.strokeWeight(1);
    p.drawingContext.setLineDash([5, 5]);
    p.angleMode(p.DEGREES);
    p.rotate(whichObject.angle);
    p.rect(0, 0, whichObject.swidth, whichObject.sheight,
      whichObject.topLeftRadius, whichObject.topRightRadius, whichObject.bottomRightRadius, whichObject.bottomLeftRadius);
    p.stroke('#999999');
    p.drawingContext.setLineDash([]);
    p.fill('#000000');
    p.textSize(20);
    p.textStyle(p.BOLD);
    p.textAlign(p.CENTER, p.CENTER);
    if(whichObject.name.startsWith('Rectangle') || whichObject.name.startsWith('Line')){
      p.text('⬌', whichObject.swidth / 2, 1);
      p.text('⬌', -whichObject.swidth / 2 + 1, 1);
      if(whichObject.name.startsWith('Rectangle')){
        p.text('⬍', 0, -whichObject.sheight / 2 + 4);
        p.text('⬍', 0, whichObject.sheight /2);
      }
    }
    p.translate(whichObject.swidth / 2, - whichObject.sheight /2);
    p.noStroke();
    if(!whichObject.name.startsWith('Line')){
      p.rotate(-90);
      p.text('⤾', 2, 7);
      p.rotate(-90);
      p.text('⤿', -3, 6)
      p.translate(0, - whichObject.sheight);
      p.rotate(180);
      p.text('⤾', 2, 7);
      p.rotate(-90);
      p.text('⤿', -3, 6);
      p.translate(0, - whichObject.swidth);
      p.rotate(180);
      p.text('⤾', 2, 7);
      p.rotate(-90);
      p.text('⤿', -3, 6);
      p.translate(0, - whichObject.sheight);
      p.rotate(180);
      p.text('⤾', 2, 7);
      p.rotate(-90);
      p.text('⤿', -3, 6);
    }
    else{
      p.translate(7, 3);
      p.rotate(-45);
      p.text('⤾', 2, 7);
      p.rotate(-90);
      p.text('⤿', -3, 6);
      p.rotate(-45);
      p.translate(whichObject.swidth + 14, 0);
      p.rotate(-45);
      p.text('⤾', 2, 7);
      p.rotate(-90);
      p.text('⤿', -3, 6);
    }
    p.pop();
  }
  if(activeItem.name != 'Rectangle drawing' && activeItem.name != 'Line drawing'){
    btnUp.mousePressed(function() { moveUpObject(activeItem.name); refresh(); });
    btnDown.mousePressed(function() { moveDownObject(activeItem.name); refresh(); });
    btnDelete.mousePressed(function() { removeObject(activeItem); refresh(); });
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
    if(items.length && rotateCorner(mouseXR, mouseYR)){
      tmpClickEvent = clickEvent;
      clickEvent = 'Rotate';
      diffPositionX = mouseXR;
      diffPositionY = mouseYR;
      tmpItem = { ...activeItem }; //make a copy of 'activeItem', and store it in the new variable 'tmpItem'.
      activeItem.visibility = false;
      items.splice(activeItem.index, 0, tmpItem); //insert 'tmpItem' into the 'items' array at the position 'activeItem.index'.
    }
    else if(items.length && resizeCorner(mouseXR, mouseYR)){
      corner = resizeCorner(mouseXR, mouseYR);
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
    else if(selectedObject(mouseXR, mouseYR) && clickEvent == 'Move'){
      activeItem = selectedObject(mouseXR, mouseYR);
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
        addObject(new Item([true, items.length, 'Rectangle drawing', x1+(x2-x1)/2, y1+(y2-y1)/2, p.abs (x2-x1), p.abs (y2-y1), undefined,
        0, 0, 0, 0, 0, '#000000', false, '#ffffff', false, undefined, undefined, undefined, undefined, undefined, p.abs (x2-x1) + 5,
        p.abs (y2-y1) + 5]));
      }
      if(clickEvent == 'Draw_Line') {
        if(items.length && items[items.length - 1].name === 'Line drawing') items.pop();
        addObject(new Item([true, items.length, 'Line drawing', x1+(x2-x1)/2, y1+(y2-y1)/2, 2, undefined,
        Number(p.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2))).toFixed(2), p.atan((y2-y1)/(x2-x1)), undefined, undefined, undefined,undefined, undefined,
        undefined, undefined, undefined, '#000000', undefined, undefined, undefined, undefined,
        p.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2)) + 5, 7]));
      }
      p.redraw();
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
      rotateObject(tmpItem.angle - activeItem.angle, index);
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
        resizeObject(tmpItem.x - activeItem.x, tmpItem.y - activeItem.y, tmpItem.w - activeItem.w,
          tmpItem.h - activeItem.h, index);
      else if(activeItem.name.startsWith('Line'))
        resizeObject(tmpItem.x - activeItem.x, tmpItem.y - activeItem.y, tmpItem.l - activeItem.l, 0, index);
    }
    tmpItem = {};
  }
  else if(p.mouseX > 0 && p.mouseX < canvasWidth && p.mouseY> 0 && p.mouseY< canvasHeight) {
    if(x1 && y1 && x2 && y2 && (clickEvent == 'Draw_Rect' || clickEvent == 'Draw_Line')) {
      if(clickEvent == 'Draw_Rect') {
        items.pop();
        addObject(new Item([true, items.length, 'Rectangle ' + id, x1+(x2-x1)/2, y1+(y2-y1)/2, p.abs (x2-x1), p.abs (y2-y1), undefined,
        0, 0, 0, 0, 0, '#000000', false, '#ffffff', false, undefined, undefined, undefined, undefined, undefined, p.abs (x2-x1) + 5,
        p.abs (y2-y1) + 5]));
      }
      else if(clickEvent == 'Draw_Line') {
        items.pop();
        addObject(new Item([true, items.length, 'Line ' + id, x1+(x2-x1)/2, y1+(y2-y1)/2, 2, undefined,
        p.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2)), p.atan((y2-y1)/(x2-x1)), undefined, undefined, undefined,undefined,
        undefined, undefined, undefined, undefined, '#000000', undefined, undefined, undefined, undefined,
        p.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2)) + 5, 7]));
      }
      refresh();
      x1 = 0, y1 = 0, x2 = 0, y2 = 0;
    }
    else if(clickEvent == 'Table') {
      addObject(new Item([true, items.length, 'Table ' + id, mouseXR, mouseYR, undefined, undefined, undefined,
      0, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, 2, 'chair', undefined,
      undefined, 75, 75]));
      refresh();
    }
    else if(['Door', 'Toilet', 'sink'].includes(clickEvent)){
      addObject(new Item([true, items.length, clickEvent + ' ' + id, mouseXR, mouseYR, undefined, undefined, undefined,
      0, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined,
      undefined, 75, 75]));
      refresh();
    }
    else if(['Window', 'TV'].includes(clickEvent)){
      addObject(new Item([true, items.length, clickEvent + ' ' + id, mouseXR, mouseYR, undefined, undefined, undefined,
      0, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined,
      undefined, 155, 25]));
      refresh();
    }
    else if(clickEvent == 'Text') {
      addObject(new Item([true, items.length, 'Text ' + id, mouseXR, mouseYR, undefined, undefined, undefined,
      0, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, '#000000', undefined, undefined,
      'Your text', 14, 125, 65]));
      refresh();
    }
    else if(diffPositionX && diffPositionY && items.length && clickEvent == 'Move') {
      items.splice(activeItem.index, 1);
      const index = items.indexOf(activeItem);
      activeItem.visibility = true;
      if(tmpItem.x != activeItem.x) dragObject(tmpItem.x - activeItem.x, tmpItem.y - activeItem.y, index);
      tmpItem = {};
      diffPositionX = 0;
      diffPositionY = 0;
      p.cursor(p.ARROW);
    }
  }
}

function addObject(_object) {
  Object.keys(_object).forEach(key => {
    if (_object[key] === undefined) {
      delete _object[key];
    }
  });
  if(_object.name && !_object.name.endsWith('drawing')) {
    id ++;
    undoManager.add({
      undo: function() {
        removeObject(_object);
      },
      redo: function() {
        addObject(_object);
      }
    });
  }
  items.splice(_object.index, 0, _object);
  activeItem = _object;
}

function removeObject(_object) {
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
        addObject(_object);
      },
      redo: function() {
        removeObject(_object);
      }
    });
  }
}

function moveUpObject(_name) {
  const index = items.findIndex(_object => _object.name === _name);
  activeItem = items[index];
  const len = items.length;
  if(index < len - 1) {
    [items[index].index, items[index + 1].index] = [items[index + 1].index, items[index].index];
    [items[index], items[index + 1]] = [items[index + 1], items[index]];
    undoManager.add({
      undo: function() {
        moveDownObject(_name);
      },
      redo: function() {
        moveUpObject(_name);
      }
    });
  }
}

function moveDownObject(_name) {
  const index = items.findIndex(_object => _object.name === _name);
  activeItem = items[index];
  if(index > 0) {
    [items[index].index, items[index - 1].index] = [items[index - 1].index, items[index].index];
    [items[index], items[index - 1]] = [items[index - 1], items[index]];
    undoManager.add({
      undo: function() {
        moveUpObject(_name);
      },
      redo: function() {
        moveDownObject(_name);
      }
    });
  }
}

function dragObject(_dx, _dy, _index) {
  items[_index].x += _dx;
  items[_index].y += _dy;
  activeItem = items[_index];
  undoManager.add({
    undo: function() {
      dragObject(-_dx, -_dy, _index);
    },
    redo: function() {
      dragObject(_dx, _dy, _index);
    }
  });
  refresh();
}

function selectedObject(_mouseX, _mouseY){
  let sObj = [];
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
      sObj.push(_object);
    }
  });
  const maxI =  Math.max(...sObj.map(_object => _object.index));
  const index = sObj.findIndex(_object => _object.index === maxI);
  return sObj[index];
}

function resizeCorner(_mouseX, _mouseY){
  let corner;
  let xPrime = (_mouseX - activeItem.x) * p.cos(activeItem.angle) + (_mouseY-activeItem.y) * p.sin(activeItem.angle) + activeItem.x;
  let yPrime = (_mouseY- activeItem.y) * p.cos(activeItem.angle) - (_mouseX-activeItem.x) * p.sin(activeItem.angle) + activeItem.y;
  if(activeItem.name.startsWith('Rectangle') || activeItem.name.startsWith('Line')){
    if(xPrime < activeItem.x + 5 && xPrime > activeItem.x - 5 && yPrime < activeItem.y - activeItem.sheight / 2 + 10
      && yPrime > activeItem.y - activeItem.sheight / 2 - 10){
      corner = 'T';
    }
    else if(xPrime < activeItem.x + 5 && xPrime > activeItem.x - 5 && yPrime < activeItem.y + activeItem.sheight / 2 + 10
      && yPrime > activeItem.y + activeItem.sheight / 2 - 10){
      corner = 'B';
    }
    else if(xPrime < activeItem.x - activeItem.swidth / 2 + 10 && xPrime > activeItem.x - activeItem.swidth / 2 - 10 
      && yPrime < activeItem.y + 5 && yPrime > activeItem.y - 5){
      corner = 'L';
    }
    else if(xPrime < activeItem.x + activeItem.swidth / 2 + 10 && xPrime > activeItem.x + activeItem.swidth / 2 - 10 
      && yPrime < activeItem.y + 5 && yPrime > activeItem.y - 5){
      corner = 'R';
    }
  }
  return corner;
}

function rotateCorner(_mouseX, _mouseY){
  let xPrime = (_mouseX - activeItem.x) * p.cos(activeItem.angle) + (_mouseY-activeItem.y) * p.sin(activeItem.angle) + activeItem.x;
  let yPrime = (_mouseY- activeItem.y) * p.cos(activeItem.angle) - (_mouseX-activeItem.x) * p.sin(activeItem.angle) + activeItem.y;
  if(activeItem.name.startsWith('Line') && 
    ((xPrime < activeItem.x + activeItem.swidth / 2 + 20 && xPrime > activeItem.x + activeItem.swidth / 2 + 10
      && yPrime < activeItem.y + 5 && yPrime > activeItem.y - 5)
    || (xPrime < activeItem.x - activeItem.swidth / 2 - 10 && xPrime > activeItem.x - activeItem.swidth / 2 - 20
      && yPrime < activeItem.y + 5 && yPrime > activeItem.y - 5))){
    return true;
  }
  else if((xPrime < activeItem.x + activeItem.swidth / 2 + 10 && xPrime > activeItem.x + activeItem.swidth / 2
            && yPrime < activeItem.y - activeItem.sheight / 2 && yPrime > activeItem.y - activeItem.sheight / 2 - 10)
        || (xPrime < activeItem.x + activeItem.swidth / 2 + 10 && xPrime > activeItem.x + activeItem.swidth / 2
            && yPrime < activeItem.y + activeItem.sheight / 2 + 10 && yPrime > activeItem.y + activeItem.sheight / 2)
        || (xPrime < activeItem.x - activeItem.swidth / 2 && xPrime > activeItem.x - activeItem.swidth / 2 - 10
            && yPrime < activeItem.y + activeItem.sheight / 2 + 10 && yPrime > activeItem.y + activeItem.sheight / 2)
        || (xPrime < activeItem.x - activeItem.swidth / 2 && xPrime > activeItem.x - activeItem.swidth / 2 - 10
            && yPrime < activeItem.y + activeItem.sheight / 2 && yPrime > activeItem.y - activeItem.sheight / 2 - 10)){
    return true;
  }
  return false;
}

function resizeObject(_dx, _dy, _dw, _dh, _index){
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
      resizeObject(-_dx, -_dy, -_dw, -_dh, _index);
    },
    redo: function() {
      resizeObject(_dx, _dy, _dw, _dh, _index);
    }
  });
  refresh();
}

function rotateObject(_da, _index){
  items[_index].angle += _da;
  activeItem = items[_index];
  undoManager.add({
    undo: function() {
      rotateObject(-_da, _index);
    },
    redo: function() {
      rotateObject(_da, _index);
    }
  });
  refresh();
}
}

new p5(sketch);

export { mySketch, items, activeItem, panel, layers, clickEvent, buttons };