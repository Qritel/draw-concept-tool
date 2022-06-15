/*
This code uses 2 libraries :
  QuickSettings : http://bit101.github.io/quicksettings/doc/module-QuickSettings.html
  P5 : https://p5js.org/reference/
*/

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
let buttons = [];
let btnUndo;
let btnRedo;
let btnUp;
let btnDown;
let btnDelete;

//An array will contain all the objects on the map -canvas-
let objects = [];
let tmpObject = {};
let activeObject = {};

//A panel lists the names of the created objects
let layers;

//A panel lists the properties of selected object
let panel;

let undoManager = new UndoManager();

//p5 function: used to handle asynchronous loading of external files
function preload() {
  tableimg = loadImage('images/table.png');
  chairimg = loadImage('images/chair.png');
  sofaimg = loadImage('images/sofa.png');
  doorimg = loadImage('images/door.png');
  windowimg = loadImage('images/window.png');
  sinkimg = loadImage('images/sink.png');
  toiletimg = loadImage('images/toilet.png');
  tvimg = loadImage('images/TV.png');
}

//p5 function: called once when the program starts
function setup() {

  QuickSettings.useExtStyleSheet();

  createPanel(activeObject);
  refreshLayers();

  //p5: Creates a canvas element in the document, and sets the dimensions of it in pixels
  canvasX = 100;
  canvasY = 35;
  canvasWidth = windowWidth - 191 - canvasX;
  canvasHeight = windowHeight - 2 - canvasY;
  let canv = createCanvas(canvasWidth, canvasHeight);
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
  createBtnTool('Sink', 0, 380, 'Sink');
  createBtnTool('Text', 0, 420, 'Text');

  //zoom slider
  slider = createSlider(0, 250, 100, 5);
  slider.position(1, canvasHeight + canvasY - 20);
  slider.style('width', '94px');
  slider.input(redraw);

  btnUndo = createButton('⟲');
  btnUndo.position(10, 20);
  btnUndo.mousePressed(function() {
    undoManager.undo();
    refresh();
  });

  btnRedo = createButton('⟳');
  btnRedo.position(61, 20);
  btnRedo.mousePressed(function() {
    undoManager.redo();
    refresh();
  });

  btnUp = createButton('🡡');
  btnUp.position(canvasWidth, 5);
  btnDown = createButton('🡣');
  btnDown.position(canvasWidth + 30, 5);
  btnDelete = createButton('🗑️');
  btnDelete.position(canvasWidth + 60, 5);

  noLoop();
}

//p5 function: continuously executes the lines of code contained inside its block until the program is stopped or noLoop() is called(as our case)
//draw() will be executed one time, when an object is added or its properties is changed.
function draw() {
  //set the color for the background of the canvas
  background('#ffffff')
  noFill();
  stroke('#d8d8d8');
  rect(0, 0, canvasWidth - 1, canvasHeight - 1);

  zoom = slider.value();
  stroke('#2e7bb6');
  text(zoom + '%', 5, canvasHeight - 6);
  push();
  scale(zoom / 100);
  
  if(!undoManager.hasUndo()) btnUndo.hide();
  else btnUndo.show();
  
  if(!undoManager.hasRedo()) btnRedo.hide();
  else btnRedo.show();

  //browse all objects
  objects.forEach(function(_object) {
    if(_object.visibility){
      if(_object.name.startsWith('Rectangle')) {
        push();
        strokeWeight(3);
        stroke(_object.strokeColor);
        fill(_object.fillColor);
        if(_object.noFill) noFill();
        if(_object.noStroke) noStroke();
        rectMode(CENTER); 
        translate(_object.x, _object.y);
        angleMode(DEGREES);
        rotate(_object.angle);
        rect(0, 0, _object.w, _object.h,
          _object.topLeftRadius, _object.topRightRadius, _object.bottomRightRadius, _object.bottomLeftRadius);
        pop();
      }
      else if(_object.name.startsWith('Line')) {
        push();
        strokeWeight(_object.w);
        stroke(_object.color);
        rectMode(CENTER); 
        translate(_object.x, _object.y);
        angleMode(DEGREES);
        rotate(_object.angle);
        rect(0,0,_object.l,1);
        pop();
      }
      else if(_object.name.startsWith('Table')) {
        push();
        imageMode(CENTER);
        image(tableimg, _object.x, _object.y, 100, 73);
        pop();
        // draw chairs arranged in a circle
        for(let i = 0; i < _object.numPlace; i++) {

          let angle = TWO_PI / _object.numPlace * i;
          let x = _object.x + cos(angle) * 55;
          let y = _object.y + sin(angle) * 55;

          switch(_object.typeChair) {

            case 'chair':
            //p5: The push() function saves the current drawing style settings and transformations, while pop() restores these settings
              push();
              imageMode(CENTER);
              translate(x, y);
              angleMode(RADIANS);
              rotate(angle+PI/2);
              image(chairimg,0, 0, 200, 130);
              pop();
              break;

            case 'sofa':
              push();
              imageMode(CENTER);
              translate(x, y);
              angleMode(RADIANS);
              rotate(angle+PI/2);
              image(sofaimg,0, 0, 200, 130);
              pop();
              break;
          }
        }
      }
      else if(_object.name.startsWith('Door')) {
        push();
        imageMode(CENTER);
        translate(_object.x, _object.y);
        angleMode(DEGREES);
        rotate(_object.angle);
        image(doorimg, 0, 0, 200, 75);
        pop();
      }
      else if(_object.name.startsWith('Window')) {
        push();
        imageMode(CENTER);
        translate(_object.x, _object.y);
        angleMode(DEGREES);
        rotate(_object.angle);
        image(windowimg, 0, 0, 200, 150);
        pop();
      }
      else if(_object.name.startsWith('TV')) {
        push();
        imageMode(CENTER);
        translate(_object.x, _object.y);
        angleMode(DEGREES);
        rotate(_object.angle);
        image(tvimg, 0, 0, 120, 75);
        pop();
      }
      else if(_object.name.startsWith('Toilet')) {
        push();
        imageMode(CENTER);
        translate(_object.x, _object.y);
        angleMode(DEGREES);
        rotate(_object.angle);
        image(toiletimg, 0, 0, 55, 70);
        pop();
      }
      else if(_object.name.startsWith('Sink')) {
        push();
        imageMode(CENTER);
        translate(_object.x, _object.y);
        angleMode(DEGREES);
        rotate(_object.angle);
        image(sinkimg, 0, 0, 70, 85);
        pop();
      }
      else if(_object.name.startsWith('Text')) {
        push();
        noStroke();
        textSize(_object.size);
        fill(_object.color);
        translate(_object.x, _object.y);
        angleMode(DEGREES);
        rotate(_object.angle);
        text(_object.inputText, -60, -30, _object.swidth, _object.sheight);
        pop();
      }
    }
  });
  if(activeObject.visibility){
    push();
    rectMode(CENTER);
    translate( activeObject.x, activeObject.y);
    stroke('#2e7bf6');
    noFill();
    strokeWeight(1);
    drawingContext.setLineDash([5, 5]);
    rotate(activeObject.angle);
    rect(0, 0, activeObject.swidth, activeObject.sheight,
      activeObject.topLeftRadius, activeObject.topRightRadius, activeObject.bottomRightRadius, activeObject.bottomLeftRadius);
    if(activeObject.name.startsWith('Rectangle') || activeObject.name.startsWith('Line')){
      stroke('#999999');
      drawingContext.setLineDash([]);
      fill('#000000');
      textSize(20);
      textStyle(BOLD);
      textAlign(CENTER, CENTER);
      text('⬌', activeObject.swidth / 2, 1);
      text('⬌', -activeObject.swidth / 2 + 1, 1);
      if(activeObject.name.startsWith('Rectangle')){
        text('⬍', 0, -activeObject.sheight / 2 + 4);
        text('⬍', 0, activeObject.sheight /2);
      }
      pop();
    }
    if(activeObject.name != 'Rectangle drawing'){
      btnUp.mousePressed(function() { moveUpObject(activeObject.name); refresh(); });
      btnDown.mousePressed(function() { moveDownObject(activeObject.name); refresh(); });
      btnDelete.mousePressed(function() { removeObject(activeObject); refresh(); });
    }
  }
  if(objects.length){
    btnUp.show();
    btnDown.show();
    btnDelete.show();
  }
  else{
    btnUp.hide();
    btnDown.hide();
    btnDelete.hide();
  }
  pop();
}

//p5 function: called once after every time a mouse button is pressed.
function mousePressed() {
  if(mouseX > 0 && mouseX < canvasWidth && mouseY > 0 && mouseY < canvasHeight) {
    if(objectCorner(mouseX,mouseY) && (activeObject.name.startsWith('Rectangle') || activeObject.name.startsWith('Line'))){
      corner = objectCorner(mouseX, mouseY);
      tmpClickEvent = clickEvent;
      clickEvent = 'Resize';
      let mouseXp = (mouseX - activeObject.x) * cos(activeObject.angle) + (mouseY-activeObject.y) * sin(activeObject.angle) + activeObject.x;
      let mouseYp = (mouseY - activeObject.y) * cos(activeObject.angle) - (mouseX-activeObject.x) * sin(activeObject.angle) + activeObject.y;
      diffPositionX = mouseXp * 100 / zoom - panel.getValue('x') + 0.01;
      diffPositionY = mouseYp * 100 / zoom - panel.getValue('y') + 0.01;
      tmpObject = { ...activeObject };
      activeObject.visibility = false;
      objects.push(tmpObject);
    }
    else if(clickEvent == 'Draw_Rect' || clickEvent == 'Draw_Line') {
      x1 = mouseX * 100 / zoom;
      y1 = mouseY * 100 / zoom;
    }
    else if(selectedObject(mouseX, mouseY) && clickEvent == 'Move'){
      activeObject = selectedObject(mouseX, mouseY);
      refresh();
      diffPositionX = mouseX * 100 / zoom - panel.getValue('x') + 0.01;
      diffPositionY = mouseY * 100 / zoom - panel.getValue('y') + 0.01;
      tmpObject = { ...activeObject };
      activeObject.visibility = false;
      objects.push(tmpObject);
    }
  }
}

//p5 function: called once every time the mouse moves and a mouse button is pressed.
function mouseDragged() {
  if(mouseX > 0 && mouseX < canvasWidth && mouseY > 0 && mouseY < canvasHeight) {
    if(diffPositionX && diffPositionY && clickEvent == 'Resize') {
      let mouseXp = (mouseX - activeObject.x) * cos(activeObject.angle) + (mouseY-activeObject.y) * sin(activeObject.angle) + activeObject.x;
      let mouseYp = (mouseY - activeObject.y) * cos(activeObject.angle) - (mouseX-activeObject.x) * sin(activeObject.angle) + activeObject.y;
      let dragX = - mouseXp * 100 / zoom + diffPositionX + activeObject.x;
      let dragY = - mouseYp * 100 / zoom + diffPositionY + activeObject.y;
      createPanel(tmpObject);
      panel.setValue('y',parseInt(activeObject.y - dragY / 2 * cos(activeObject.angle) - dragX / 2 * sin(activeObject.angle)));
      panel.setValue('x',parseInt(activeObject.x + dragY / 2 * sin(activeObject.angle) - dragX / 2 * cos(activeObject.angle)));
      if(corner == 'U' && activeObject.name.startsWith('Rectangle')){
        panel.setValue('h',parseInt(activeObject.h + dragY));
      }
      else if(corner == 'D' && activeObject.name.startsWith('Rectangle')){
        panel.setValue('h',parseInt(activeObject.h - dragY));
      }
      else if(corner == 'L'){
        if(activeObject.name.startsWith('Rectangle'))
          panel.setValue('w',parseInt(activeObject.w + dragX));
        else if(activeObject.name.startsWith('Line'))
          panel.setValue('l',parseInt(activeObject.l + dragX));
      }
      else if(corner == 'R'){
        if(activeObject.name.startsWith('Rectangle'))
          panel.setValue('w',parseInt(activeObject.w - dragX));
        else if(activeObject.name.startsWith('Line'))
          panel.setValue('l',parseInt(activeObject.l - dragX));
      }
    }
    else if(x1 && y1 && clickEvent == 'Draw_Rect' || clickEvent == 'Draw_Line') {
      x2 = mouseX * 100 / zoom;
      y2 = mouseY * 100 / zoom;
      if(clickEvent == 'Draw_Rect') {
        if(objects.length && objects[objects.length - 1].name === 'Rectangle drawing') objects.pop();
        addObject(arrayToObject([true, objects.length, 'Rectangle drawing', x1+(x2-x1)/2, y1+(y2-y1)/2, abs(x2-x1), abs(y2-y1), undefined,
        0, 0, 0, 0, 0, '#000000', false, '#ffffff', false, undefined, undefined, undefined, undefined, undefined, undefined, undefined]));
      }
      if(clickEvent == 'Draw_Line') {
        if(objects.length && objects[objects.length - 1].name === 'Line drawing') objects.pop();
        addObject(arrayToObject([true, objects.length, 'Line drawing', x1+(x2-x1)/2, y1+(y2-y1)/2, 2, undefined,
        parseInt(sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2))), atan((y2-y1)/(x2-x1)), undefined, undefined, undefined,undefined, undefined,
        undefined, undefined, undefined, '#000000', undefined, undefined, undefined, undefined, undefined, undefined]));
      }
      redraw();
    }
    else if(diffPositionX && diffPositionY && clickEvent == 'Move') {
      cursor(MOVE);
      createPanel(tmpObject);
      panel.setValue('x',parseInt(mouseX * 100 / zoom - diffPositionX));
      panel.setValue('y',parseInt(mouseY * 100 / zoom - diffPositionY));
    }
  }
}

function mouseReleased() {
  if(clickEvent == 'Resize') {
    objects.pop();
    const index = objects.indexOf(activeObject);
    activeObject.visibility = true;
    clickEvent = tmpClickEvent;
    if(tmpObject.x != activeObject.x || tmpObject.y != activeObject.y) {
      if(activeObject.name.startsWith('Rectangle'))
        resizeObject(tmpObject.x - activeObject.x, tmpObject.y - activeObject.y, tmpObject.w - activeObject.w,
          tmpObject.h - activeObject.h, index);
      else if(activeObject.name.startsWith('Line'))
        resizeObject(tmpObject.x - activeObject.x, tmpObject.y - activeObject.y, tmpObject.l - activeObject.l, 0, index);   
    }
    diffPositionX = 0;
    diffPositionY = 0;
  }
  else if(mouseX > 0 && mouseX < canvasWidth && mouseY > 0 && mouseY < canvasHeight) {
    if(x1 && y1 && x2 && y2 && clickEvent == 'Draw_Rect' || clickEvent == 'Draw_Line') {
      if(clickEvent == 'Draw_Rect') {
        objects.pop();
        addObject(arrayToObject([true, objects.length, 'Rectangle ' + id, x1+(x2-x1)/2, y1+(y2-y1)/2, abs(x2-x1), abs(y2-y1), undefined,
        0, 0, 0, 0, 0, '#000000', false, '#ffffff', false, undefined, undefined, undefined, undefined, undefined, abs(x2-x1) + 5,
        abs(y2-y1) + 5]));
      }
      else if(clickEvent == 'Draw_Line') {
        objects.pop();
        addObject(arrayToObject([true, objects.length, 'Line ' + id, x1+(x2-x1)/2, y1+(y2-y1)/2, 2, undefined,
        parseInt(sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2))), atan((y2-y1)/(x2-x1)), undefined, undefined, undefined,undefined,
        undefined, undefined, undefined, undefined, '#000000', undefined, undefined, undefined, undefined,
        parseInt(sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2))) + 5, 7]));
      }
      refresh();
      x1 = 0, y1 = 0, x2 = 0, y2 = 0;
    }
    else if(clickEvent == 'Table') {
      addObject(arrayToObject([true, objects.length, 'Table ' + id, mouseX * 100 / zoom, mouseY * 100 / zoom, undefined, undefined, undefined,
      undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, 2, 'chair', undefined,
      undefined, 75, 75]));
      refresh();
    }
    else if(['Door', 'Toilet', 'Sink'].includes(clickEvent)){
      addObject(arrayToObject([true, objects.length, clickEvent + ' ' + id, mouseX * 100 / zoom, mouseY * 100 / zoom, undefined, undefined, undefined,
      0, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined,
      undefined, 75, 75]));
      refresh();
    }
    else if(['Window', 'TV'].includes(clickEvent)){
      addObject(arrayToObject([true, objects.length, clickEvent + ' ' + id, mouseX * 100 / zoom, mouseY * 100 / zoom, undefined, undefined, undefined,
      0, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined,
      undefined, 155, 25]));
      refresh();
    }
    else if(clickEvent == 'Text') {
      addObject(arrayToObject([true, objects.length, 'Text ' + id, mouseX * 100 / zoom, mouseY * 100 / zoom, undefined, undefined, undefined,
      0, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, '#000000', undefined, undefined,
      'Your text', 14, 125, 65]));
      refresh();
    }
    else if(diffPositionX && diffPositionY && objects.length && clickEvent == 'Move') {
      objects.pop();
      const index = objects.indexOf(activeObject);
      activeObject.visibility = true;
      if(tmpObject.x != activeObject.x) dragObject(tmpObject.x - activeObject.x, tmpObject.y - activeObject.y, index);
      diffPositionX = 0;
      diffPositionY = 0;
      cursor(ARROW);
    }
  }
}

function arrayToObject(array) {
  let object = {
    visibility : array[0],
    index : array[1],
    name : array[2],
    x : array[3],
    y : array[4],
    w : array[5],
    h : array[6],
    l : array[7],
    angle : array[8],
    topLeftRadius : array[9],
    topRightRadius : array[10],
    bottomRightRadius : array[11],
    bottomLeftRadius : array[12],
    strokeColor : array[13],
    noStroke : array[14],
    fillColor : array[15],
    noFill : array[16],
    color : array[17], // color for text and line
    numPlace : array[18],
    typeChair : array[19],
    inputText : array[20],
    size : array[21],
    swidth : array[22],
    sheight : array[23]
  }
  return object;
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
  objects.splice(_object.index, 0, _object);
  activeObject = _object;
}

function removeObject(_object) {
  const index = objects.indexOf(_object);
  if (index > -1) {
    objects.splice(index, 1);
  }
  if(activeObject === _object) {
    if(objects.length == 0) activeObject = {};
    else if(index == 0) activeObject = objects[index];
    else activeObject = objects[index-1];
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

function createPanel(_object) {

  if(panel) {
    panel.destroy();
  }

  panel=QuickSettings.create(windowWidth - 190, windowHeight - windowHeight * 0.4 - 2, 'Properties');
  panel.setSize(188, windowHeight * 0.4);
  panel.setDraggable(false);
  panel.setCollapsible(false);
  panel.setGlobalChangeHandler(function() {redraw()});

  panel.bindNumber('x', 0, windowWidth, parseInt(_object.x), 1, _object);
  panel.bindNumber('y', 0, windowHeight, parseInt(_object.y), 1, _object);
  panel.bindNumber('w', 0, windowWidth, parseInt(_object.w), 1, _object);
  panel.bindNumber('h', 0, windowHeight, parseInt(_object.h), 1, _object);
  panel.bindNumber('l', 0, windowHeight, parseInt(_object.l), 1, _object);
  panel.bindRange('angle', -180, 180, _object.angle, 1, _object);
  panel.bindNumber('topLeftRadius', 0, 200, _object.topLeftRadius, 1, _object);
  panel.bindNumber('topRightRadius', 0, 200, _object.topRightRadius, 1, _object);
  panel.bindNumber('bottomRightRadius', 0, 200, _object.bottomRightRadius, 1, _object);
  panel.bindNumber('bottomLeftRadius', 0, 200, _object.bottomLeftRadius, 1, _object);
  panel.bindColor('strokeColor', _object.strokeColor, _object);
  panel.bindBoolean('noStroke', _object.noStroke, _object);
  panel.bindColor('fillColor', _object.fillColor, _object);
  panel.bindBoolean('noFill', _object.noFill, _object);
  panel.bindColor('color', _object.color, _object);
  panel.bindRange('numPlace', 1, 10, _object.numPlace, 1, _object);
  panel.bindDropDown('typeChair',  ['chair','sofa'],  _object);
  panel.bindTextArea('inputText', _object.inputText, _object);
  panel.bindRange('size', 0, 100, _object.size, 1, _object);

  for(control in panel._controls) {
    if(!Object.keys(_object).includes(control)) {
      panel.hideControl(control);
    }
  }
}

function refreshLayers() {

  if(layers) {
    layers.destroy();
  }

  layers = QuickSettings.create(windowWidth - 190, 0, 'Layers');
  layers.setSize(188, windowHeight - windowHeight * 0.4 - 2);
  layers.setDraggable(false);
  layers.setCollapsible(false);
  layers.setGlobalChangeHandler(refresh);

  objects.slice().reverse().forEach(function(_object) {
    layers.addButton(_object.name, function() {
      activeObject = _object;
    });
    if(activeObject == _object) {
      layers.overrideStyle(_object.name, 'font-weight', 'bold');
      layers.overrideStyle(_object.name, 'background-color', '#2e7bb6');
      layers.overrideStyle(_object.name, 'color', '#ffffff');
    }
  });
}

function moveUpObject(_name) {
  const index = objects.findIndex(_object => _object.name === _name);
  activeObject = objects[index];
  const len = objects.length;
  if(index < len - 1) {
    [objects[index], objects[index + 1]] = [objects[index + 1], objects[index]];
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
  const index = objects.findIndex(_object => _object.name === _name);
  activeObject = objects[index];
  if(index > 0) {
    [objects[index], objects[index - 1]] = [objects[index - 1], objects[index]];
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
  objects[_index].x += _dx;
  objects[_index].y += _dy;
  activeObject = objects[_index];
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

function refresh() {
  refreshLayers();
  createPanel(activeObject);
  redraw();
}

function createBtnTool(_name, _x, _y, _clickEvent){
  buttons.push({pointer : createButton(_name), clickEvent : _clickEvent});
  const l = buttons.length
  buttons[l - 1]['pointer'].position(_x, _y);
  buttons[l - 1]['pointer'].class('button');
  buttons[l - 1]['pointer'].mousePressed(function() {
    if(clickEvent) {
      const index = buttons.findIndex(_button => _button.clickEvent === clickEvent);
      buttons[index]['pointer'].class('button');
    }
    clickEvent = _clickEvent;
    buttons[l - 1]['pointer'].class('button_pressed');
    if(clickEvent == 'Move') {
      cursor(ARROW);
    }
    else {
      cursor(CROSS);
    }
  });
}

function selectedObject(_mouseX, _mouseY){
  let sObj = [];
  let xPrime;
  let yPrime;
  objects.forEach(function(_object) {
    if(_object.angle){
      xPrime = (_mouseX - _object.x) * cos(_object.angle) + (_mouseY-_object.y) * sin(_object.angle) + _object.x;
      yPrime = (_mouseY - _object.y) * cos(_object.angle) - (_mouseX-_object.x) * sin(_object.angle) + _object.y;
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

function objectCorner(_mouseX, _mouseY){
  let corner;
  let xPrime = (_mouseX - activeObject.x) * cos(activeObject.angle) + (_mouseY-activeObject.y) * sin(activeObject.angle) + activeObject.x;
  let yPrime = (_mouseY - activeObject.y) * cos(activeObject.angle) - (_mouseX-activeObject.x) * sin(activeObject.angle) + activeObject.y;
  if(xPrime < activeObject.x + 5 && xPrime > activeObject.x - 5 && yPrime < activeObject.y - activeObject.sheight / 2 + 10
    && yPrime > activeObject.y - activeObject.sheight / 2 - 10){
    corner = 'U';
  }
  else if(xPrime < activeObject.x + 5 && xPrime > activeObject.x - 5 && yPrime < activeObject.y + activeObject.sheight / 2 + 10
    && yPrime > activeObject.y + activeObject.sheight / 2 - 10){
    corner = 'D';
  }
  else if(xPrime < activeObject.x - activeObject.swidth / 2 + 10 && xPrime > activeObject.x - activeObject.swidth / 2 - 10 
    && yPrime < activeObject.y + 5 && yPrime > activeObject.y - 5){
    corner = 'L';
  }
  else if(xPrime < activeObject.x + activeObject.swidth / 2 + 10 && xPrime > activeObject.x + activeObject.swidth / 2 - 10 
    && yPrime < activeObject.y + 5 && yPrime > activeObject.y - 5){
    corner = 'R';
  }
  return corner;
}

function resizeObject(_dx, _dy, _dw, _dh, _index){
  objects[_index].x += _dx;
  objects[_index].y += _dy;
  if(objects[_index].name.startsWith('Rectangle')){
    objects[_index].h += _dh;
    objects[_index].w += _dw;
  }
  else if(objects[_index].name.startsWith('Line')){
    objects[_index].l += _dw;
  }
  objects[_index].swidth += _dw;
  objects[_index].sheight += _dh;
  activeObject = objects[_index];
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