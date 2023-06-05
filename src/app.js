/*
This code uses 3 libraries :
  QuickSettings : http://bit101.github.io/quicksettings/doc/module-QuickSettings.html
  P5 : https://p5js.org/reference/
  UndoManager : https://github.com/ArthurClemens/Javascript-Undo-Manager
*/

import p5 from 'p5';
import UndoManager from 'undo-manager';
import QuickSettings from 'quicksettings';

import Item from './Item/item';
import drawStrokeItem from './Item/drawStrokeItem';
import drawResizingCorner from './Item/drawResizingCorner';
import drawRotatingCorner from './Item/drawRotatingCorner';
import refresh from './utils/refresh';
import createBtnTool from './interactions/createBtnTool';

import '../styles/quicksettings.css';
import handleMousePressed from './interactions/handleMousePressed';
import handleMouseDragged from './interactions/handleMouseDragged';
import handleMouseReleased from './interactions/handleMouseReleased';
import saveData from './Data/saveData';
import loadData from './Data/loadData';
import downloadDataAsJson from './Data/downloadDataAsJson';
import handleJsonFile from './Data/handleJsonFile';
import drawRuler from './utils/drawRuler';
import handleKeyPressed from './interactions/handleKeyPressed';
import drawBackground from './utils/drawBackground';

let x1 = 0, y1 = 0, x2 = 0, y2 = 0;
let diffPositionX;
let diffPositionY;
let clickEvent = '';
let tmpClickEvent = '';
let corner ='';
let id = 1;
let canvasWidth;
let canvasHeight;
let canvasX;
let canvasY;
let mouseIsDragged = false;
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
let btnSave;
let btnDownload;
let btnUpload;
let fileInput;
let btnClear;

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

  loadData();
  QuickSettings.useExtStyleSheet();
  refresh();

  //p5: Creates a canvas element in the document, sets the dimensions of it, and its position
  canvasX = 100;
  canvasY = 35;
  canvasWidth = p.windowWidth - 191 - canvasX;
  canvasHeight = p.windowHeight - 2 - canvasY;
  let canv = p.createCanvas(canvasWidth, canvasHeight);
  canv.position(canvasX, canvasY);
  canv.mousePressed(handleMousePressed);
  canv.mouseMoved(handleMouseDragged);
  canv.mouseReleased(handleMouseReleased);
  canv.drop(handleJsonFile);

  createBtnTool('⇱', 0, 60, 'Select');
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
  slider = p.createSlider(5, 250, 100, 5);
  slider.position(1, canvasHeight + canvasY - 20);
  slider.style('width', '94px');
  slider.attribute('title', 'zoom');
  slider.input(p.draw);

  btnUndo = p.createButton('⟲');
  btnUndo.position(10, 20);
  btnUndo.attribute('title', 'Undo');
  btnUndo.mousePressed(function() {
    undoManager.undo();
    refresh();
  });

  btnRedo = p.createButton('⟳');
  btnRedo.position(61, 20);
  btnRedo.attribute('title', 'Redo');
  btnRedo.mousePressed(function() {
    undoManager.redo();
    refresh();
  });

  btnSave = p.createButton('✔️');
  btnSave.position(canvasX, 5);
  btnSave.mousePressed(saveData);
  btnSave.class('topButton');

  btnDownload = p.createButton('Download json');
  btnDownload.position(canvasX + 35, 5);
  btnDownload.mousePressed(downloadDataAsJson);
  btnDownload.class('topButton');

  // Create the file input
  fileInput = p.createFileInput(handleJsonFile);
  fileInput.hide(); // Hide the file input
  btnUpload = p.createButton('Upload json');
  btnUpload.position(canvasX + 140, 5);
  // Trigger click on the file input 
  btnUpload.mousePressed(function() { fileInput.elt.click(); });
  btnUpload.class('topButton');

  btnClear = p.createButton('Clear');
  btnClear.position(canvasX + 227, 5);
  btnClear.mousePressed(function() { p.clearStorage(); items = []; activeItem = {}; undoManager = new UndoManager(); refresh(); });
  btnClear.class('topButton');

  btnUp = p.createButton('🡡');
  btnUp.position(canvasWidth, 5);
  btnUp.mousePressed(function() { Item.moveUpItem(activeItem); refresh(); });
  btnUp.class('topButton');
  btnUp.attribute('title', 'Bring Forward');
  btnDown = p.createButton('🡣');
  btnDown.position(canvasWidth + 30, 5);
  btnDown.mousePressed(function() { Item.moveDownItem(activeItem); refresh(); });
  btnDown.class('topButton');
  btnDown.attribute('title', 'Send Backward');
  btnDelete = p.createButton('🗑️');
  btnDelete.position(canvasWidth + 60, 5);
  btnDelete.mousePressed(function() { Item.removeItem(activeItem); refresh(); });
  btnDelete.class('topButton');
  btnDelete.attribute('title', 'Delete');

  // stops the automatic execution of the draw() and update the canvas only when needed
  // resulting in improved performance and reduced CPU usage.
  p.noLoop();
}

p.windowResized = function () {
  canvasWidth = p.windowWidth - 191 - canvasX;
  canvasHeight = p.windowHeight - 2 - canvasY;
  p.resizeCanvas(canvasWidth, canvasHeight);
  slider.position(1, canvasHeight + canvasY - 20);
  btnUp.position(canvasWidth, 5);
  btnDown.position(canvasWidth + 30, 5);
  btnDelete.position(canvasWidth + 60, 5);
  refresh();
}

//draw() will be executed one time, when an item is added or its properties is changed.
p.draw = function () {
  zoom = slider.value();
  zoomR = 100 / zoom;

  drawBackground();
  
  p.push();
  p.stroke('#2e7bb6');
  p.text(zoom + '%', 5, canvasHeight - 6);
  p.pop();

  p.push();
  p.scale(zoom / 100);

  drawRuler();
  
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
  if(activeItem.selected && (!mouseIsDragged || activeItem.name.startsWith('Text'))) {
    let whichObject;
    if(tmpItem.visibility)
      whichObject = tmpItem;
    else
      whichObject = activeItem;
    drawStrokeItem(whichObject);
    drawResizingCorner(whichObject);
    drawRotatingCorner(whichObject);
  }
  if(items.length){
    // Re-enable
    btnSave.removeAttribute('disabled');
    btnDownload.removeAttribute('disabled');
    btnUp.removeAttribute('disabled');
    btnDown.removeAttribute('disabled');
    btnDelete.removeAttribute('disabled');
    btnClear.removeAttribute('disabled');
  }
  else{
    // Disable
    btnSave.attribute('disabled', '');
    btnDownload.attribute('disabled', '');
    btnUp.attribute('disabled', '');
    btnDown.attribute('disabled', '');
    btnDelete.attribute('disabled', '');
    btnClear.attribute('disabled', '');
  }

  if (p.keyIsDown(p.UP_ARROW)) {
    panel.setValue('y', panel.getValue('y') - 0.5);
  }
  else if (p.keyIsDown(p.DOWN_ARROW)) {
    panel.setValue('y', panel.getValue('y') + 0.5);
  }
  else if (p.keyIsDown(p.LEFT_ARROW)) {
    panel.setValue('x', panel.getValue('x') - 0.5);
  }
  else if (p.keyIsDown(p.RIGHT_ARROW)) {
    panel.setValue('x', panel.getValue('x') + 0.5);
  }

  p.pop();
}

p.mouseReleased = function() {
  mouseIsDragged = false;
}

p.keyPressed = function() {
  return handleKeyPressed();
}

p.keyReleased = function() {
  p.noLoop();
}

}

new p5(sketch);

export { mySketch, slider, zoomR, items, activeItem, tmpItem, id, panel, layers, clickEvent, tmpClickEvent, buttons, undoManager };
export { mouseIsDragged, corner, x1, y1, x2, y2, diffPositionX, diffPositionY };
export { tableimg, chairimg, sofaimg, doorimg, windowimg, sinkimg, toiletimg, tvimg };
export { canvasWidth, canvasHeight };