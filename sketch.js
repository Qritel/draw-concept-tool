/*
This code uses 2 libraries :
  QuickSettings : http://bit101.github.io/quicksettings/doc/module-QuickSettings.html
  P5 : https://p5js.org/reference/
*/

let x1 = 0, y1 = 0, x2 = 0, y2 = 0;
let clickEvent = '';
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

//An array will contain all the objects on the map -canvas-
let objects = [];
let object = {};
let activeObject;

//A panel lists the names of the created objects
let layers;
let layerUp;
let layerDown;
let layerDelete;

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

  createPanel(object);
  refreshLayers();

  //p5: Creates a canvas element in the document, and sets the dimensions of it in pixels
  canvasX = 100;
  canvasY = 1;
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
  slider.position(1, canvasHeight - 20);
  slider.style('width', '94px');
  slider.input(redraw);

  btnUndo = createButton('⟲');
  btnUndo.position(10,20);
  btnUndo.mousePressed(function() {
    undoManager.undo();
    refresh();
  });

  btnRedo = createButton('⟳');
  btnRedo.position(61,20);
  btnRedo.mousePressed(function() {
    undoManager.redo();
    refresh();
  });

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
        image(tableimg,_object.x,_object.y,100,73);

        // draw chairs arranged in a circle
        for(let i = 0; i < _object.numPlace; i++) {

          let angle = TWO_PI / _object.numPlace * i;
          let x = _object.x + cos(angle) * 60 -51;
          let y = _object.y + sin(angle) * 60 -30;

          switch(_object.typeChair) {

            case 'chair':
            //p5: The push() function saves the current drawing style settings and transformations, while pop() restores these settings
              push();
              imageMode(CENTER);
              translate(x+100, y+65);
              angleMode(RADIANS);
              rotate(angle+PI/2);
              image(chairimg,0, 0, 200, 130);
              pop();
              break;

            case 'sofa':
              push();
              imageMode(CENTER);
              translate(x+100, y+65);
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
        text(_object.inputText, 0, 0);
        pop();
      }
    }
  });
  pop();
}

//p5 function: called once after every time a mouse button is pressed.
function mousePressed() {
  if(mouseX > 0 && mouseX < canvasWidth && mouseY > 0 && mouseY < canvasHeight) {
    if(clickEvent == 'Draw_Rect' || clickEvent == 'Draw_Line') {
      x1 = mouseX * 100 / zoom;
      y1 = mouseY * 100 / zoom;
    }
    else if(objects.length && clickEvent == 'Move'){
      diffPositionX = mouseX * 100 / zoom - panel.getValue('x');
      diffPositionY = mouseY * 100 / zoom - panel.getValue('y');
      object = { ...activeObject };
      activeObject.visibility = false;
      objects.push(object);
    }
  }
}

//p5 function: called once every time the mouse moves and a mouse button is pressed.
function mouseDragged() {
  if(mouseX > 0 && mouseX < canvasWidth && mouseY > 0 && mouseY < canvasHeight) {
    if(clickEvent == 'Draw_Rect' || clickEvent == 'Draw_Line') {
      x2 = mouseX * 100 / zoom;
      y2 = mouseY * 100 / zoom;
      if(clickEvent == 'Draw_Rect') {
        removeObject('Rectangle drawing');
        addObject(true, objects.length, 'Rectangle drawing', x1+(x2-x1)/2, y1+(y2-y1)/2, abs(x2-x1), abs(y2-y1), undefined, 0, 0, 0, 0,
        0, '#000000', false, '#ffffff', false, undefined, undefined, undefined, undefined, undefined);
      }
      if(clickEvent == 'Draw_Line') {
        removeObject('Line drawing');
        addObject(true, objects.length, 'Line drawing', x1+(x2-x1)/2, y1+(y2-y1)/2, 2, undefined, parseInt(sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2)))
          , atan((y2-y1)/(x2-x1)), undefined, undefined, undefined,undefined, undefined, undefined, undefined, 
          undefined, '#000000', undefined, undefined, undefined, undefined);
      }
      redraw();
    }
    else if(diffPositionX && diffPositionY) {
      cursor(MOVE);
      createPanel(object);
      panel.setValue('x',parseInt(mouseX * 100 / zoom - diffPositionX));
      panel.setValue('y',parseInt(mouseY * 100 / zoom - diffPositionY));
    }
  }
}

function mouseReleased() {
  if(mouseX > 0 && mouseX < canvasWidth && mouseY > 0 && mouseY < canvasHeight) {
    if(clickEvent == 'Draw_Rect' || clickEvent == 'Draw_Line') {
      if(clickEvent == 'Draw_Rect') {
        removeObject('Rectangle drawing');
        addObject(true, objects.length,'Rectangle ' + id, x1+(x2-x1)/2, y1+(y2-y1)/2, abs(x2-x1), abs(y2-y1), undefined, 0, 0, 0, 0,
        0, '#000000', false, '#ffffff', false, undefined, undefined, undefined, undefined, undefined);
      }
      else if(clickEvent == 'Draw_Line') {
        removeObject('Line drawing');
        addObject(true, objects.length, 'Line ' + id, x1+(x2-x1)/2, y1+(y2-y1)/2, 2, undefined, parseInt(sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2)))
        , atan((y2-y1)/(x2-x1)), undefined, undefined, undefined,undefined, undefined, undefined, undefined, 
        undefined, '#000000', undefined, undefined, undefined, undefined);
      }
      refresh();
      x1 = 0, y1 = 0, x2 = 0, y2 = 0;
    }
    else if(clickEvent == 'Table') {
      addObject(true, objects.length, 'Table ' + id, mouseX - 50, mouseY - 32, undefined, undefined, undefined, undefined, undefined,
      undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, 2, 'chair', undefined, undefined);
      refresh();
    }
    else if(['Door', 'Window', 'TV', 'Toilet', 'Sink'].includes(clickEvent)){
      addObject(true, objects.length, clickEvent + ' ' + id, mouseX, mouseY, undefined, undefined, undefined, 0, undefined, undefined,
      undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined);
      refresh();
    }
    else if(clickEvent == 'Text') {
      addObject(true, objects.length, 'Text ' + id, mouseX - 70, mouseY + 10, undefined, undefined, undefined, 0, undefined, undefined,
      undefined, undefined, undefined, undefined, undefined, undefined, '#000000', undefined, undefined, 'Your text', 32);
      refresh();
    }
    else if(objects.length && clickEvent == 'Move') {
      objects.pop();
      const index = objects.indexOf(activeObject);
      activeObject.visibility = true;
      if(object.x != activeObject.x) dragObject(object.x - activeObject.x, object.y - activeObject.y, index);
      diffPositionX = 0;
      diffPositionY = 0;
      cursor(ARROW);
    }
  }
}

function resetObject() {
  object = {}
}

function addObject(_visibility, _index, _name, _x, _y, _w, _h, _l, _angle, _topLeftRadius, _topRightRadius, _bottomRightRadius,
_bottomLeftRadius, _strokeColor, _noStroke, _fillColor, _noFill, _color, _numPlace, _typeChair, _inputText, _size) {

  resetObject();
  
  object = {
    visibility : _visibility,
    index : _index,
    name : _name,
    x : _x,
    y : _y,
    w : _w,
    h : _h,
    l : _l,
    angle : _angle,
    topLeftRadius : _topLeftRadius,
    topRightRadius : _topRightRadius,
    bottomRightRadius : _bottomRightRadius,
    bottomLeftRadius : _bottomLeftRadius,
    strokeColor : _strokeColor,
    noStroke : _noStroke,
    fillColor : _fillColor,
    noFill : _noFill,
    color : _color, // color for text and line
    numPlace : _numPlace,
    typeChair : _typeChair,
    inputText : _inputText,
    size : _size
  }

  Object.keys(object).forEach(key => {
    if (object[key] === undefined) {
      delete object[key];
    }
  });

  if(!_name.endsWith('drawing')) {
    id ++;
    undoManager.add({
      undo: function() {
        removeObject(_name);
      },
      redo: function() {
        addObject(_visibility, _index, _name, _x, _y, _w, _h, _l, _angle, _topLeftRadius, _topRightRadius, _bottomRightRadius,
          _bottomLeftRadius, _strokeColor, _noStroke, _fillColor, _noFill, _color, _numPlace, _typeChair, _inputText, _size);
      }
    });
  }

  objects.splice(_index, 0, object);
  activeObject = objects[_index];
}

function removeObject(_name) {

  const index = objects.findIndex(_object => _object.name === _name);
  _object = objects[index];

  objects = objects.filter(function( _object ) {
    return _object.name !== _name;
  });

  if(activeObject === _object) {
    if(objects.length == 0) activeObject = {};
    else if(index == 0) activeObject = objects[index];
    else activeObject = objects[index-1];
  }

  if(!_name.endsWith('drawing')) {
    undoManager.add({
      undo: function() {
        addObject(_object.visibility, _object.index, _object.name, _object.x, _object.y, _object.w, _object.h, _object.l, 
          _object.angle, _object.topLeftRadius, _object.topRightRadius, _object.bottomRightRadius, 
          _object.bottomLeftRadius, _object.strokeColor, _object.noStroke, _object.fillColor, 
          _object.noFill, _object.color, _object.numPlace, _object.typeChair, _object.inputText, 
          _object.size);
      },
      redo: function() {
        removeObject(_name);
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
  layers.setSize(108, windowHeight - windowHeight * 0.4 - 2);
  layers.setDraggable(false);
  layers.setCollapsible(false);
  layers.setGlobalChangeHandler(refresh);

  layerUp = QuickSettings.create(windowWidth - 82, 0, ' ');
  layerUp.setSize(26, windowHeight - windowHeight * 0.4 - 2);
  layerUp.setDraggable(false);
  layerUp.setCollapsible(false);
  layerUp.setGlobalChangeHandler(refresh);

  layerDown = QuickSettings.create(windowWidth - 56, 0, ' ');
  layerDown.setSize(26, windowHeight - windowHeight * 0.4 - 2);
  layerDown.setDraggable(false);
  layerDown.setCollapsible(false);
  layerDown.setGlobalChangeHandler(refresh);

  layerDelete = QuickSettings.create(windowWidth - 30, 0, ' ');
  layerDelete.setSize(28, windowHeight - windowHeight * 0.4 - 2);
  layerDelete.setDraggable(false);
  layerDelete.setCollapsible(false);
  layerDelete.setGlobalChangeHandler(refresh);

  objects.slice().reverse().forEach(function(_object) {

    layers.addButton(_object.name, function() {
      activeObject = _object;
    });

    layerUp.addButton('🡡', function() {
      moveUpObject(_object.name);
    });

    layerDown.addButton('🡣', function() {
      moveDownObject(_object.name);
    });
    
    layerDelete.addButton('🗑️', function() {
      removeObject(_object.name);
    });

    if(activeObject == _object) {
      layers.overrideStyle(_object.name, 'font-weight', 'bold');
      layerUp.overrideStyle('🡡', 'font-weight', 'bold');
      layerDown.overrideStyle('🡣', 'font-weight', 'bold');
    }
    else {
      layers.overrideStyle(_object.name, 'color', '#000000');
      layerUp.overrideStyle('🡡', 'color', '#000000');
      layerDown.overrideStyle('🡣', 'color', '#000000');
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