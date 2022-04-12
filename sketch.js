/*
This code uses 2 libraries :
  QuickSettings : http://bit101.github.io/quicksettings/doc/module-QuickSettings.html
  P5 : https://p5js.org/reference/
*/

var x1 = 0, y1 = 0, x2 = 0, y2 = 0;
var clickEvent = '';
var nbObjects = 0;
var canvasWidth;
var canvasHeight;
var canvasX;
var canvasY;
var diffPositionX;
var diffPositionY;
var tableimg;
var chairimg;
var sofaimg;
var doorimg;
var windowimg;
var sinkimg;
var toiletimg;
var tvimg;

//An array will contain all the objects on the map -canvas-
var objects = [];
var object = {};

//A panel lists the names of the created objects
var master;

//A panel lists the properties of selected object
var panel;

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
  master = QuickSettings.create(windowWidth - 190, 0, 'Master');
  master.setSize(188, windowHeight - windowHeight * 0.4 - 2);
  master.setDraggable(false);
  master.setCollapsible(false);

  createPanel(object);

  //p5: Creates a canvas element in the document, and sets the dimensions of it in pixels
  canvasX = 100;
  canvasY = 1;
  canvasWidth = windowWidth - 191 - canvasX;
  canvasHeight = windowHeight - 2 - canvasY;
  var canv = createCanvas(canvasWidth, canvasHeight);
  //p5: Set its postion
  canv.position(canvasX, canvasY);

  button = createButton('⬛');
  button.position(0, 120);
  button.class('button');
  button.mousePressed(function() { clickEvent='Draw_Rect'; });

  button = createButton('	▬▬');
  button.position(0, 160);
  button.class('button');
  button.mousePressed(function() { clickEvent='Draw_Line'; });

  button = createButton('Table');
  button.position(0, 200);
  button.class('button');
  button.mousePressed(function() {
    addObject('Table ' + (nbObjects + 1), 70, 70, undefined, undefined, undefined, undefined, undefined, undefined, undefined,
    undefined, undefined, undefined, undefined, 2, 'chair', undefined, undefined);
    createPanel(object);
    addToMaster(object);
    redraw();
  });

  button = createButton('Door');
  button.position(0, 240);
  button.class('button');
  button.mousePressed(function() {
    addObject('Door ' + (nbObjects + 1), 70, 70, undefined, undefined, undefined, 0, undefined, undefined, undefined,
    undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined);
    createPanel(object);
    addToMaster(object);
    redraw();
  });

  button = createButton('Window');
  button.position(0, 280);
  button.class('button');
  button.mousePressed(function() {
    addObject('Window ' + (nbObjects + 1), 70, 70, undefined, undefined, undefined, 0, undefined, undefined, undefined,
    undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined);
    createPanel(object);
    addToMaster(object);
    redraw();
  });

  button = createButton('TV');
  button.position(0, 320);
  button.class('button');
  button.mousePressed(function() {
    addObject('TV ' + (nbObjects + 1), 70, 70, undefined, undefined, undefined, 0, undefined, undefined, undefined,
    undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined);
    createPanel(object);
    addToMaster(object);
    redraw();
  });

  button = createButton('Toilet');
  button.position(0, 360);
  button.class('button');
  button.mousePressed(function() {
    addObject('Toilet ' + (nbObjects + 1), 70, 70, undefined, undefined, undefined, 0, undefined, undefined, undefined,
    undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined);
    createPanel(object);
    addToMaster(object);
    redraw();
  });

  button = createButton('Sink');
  button.position(0, 400);
  button.class('button');
  button.mousePressed(function() {
    addObject('Sink ' + (nbObjects + 1), 70, 70, undefined, undefined, undefined, 0, undefined, undefined, undefined,
    undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined);
    createPanel(object);
    addToMaster(object);
    redraw();
  });

  button = createButton('Text');
  button.position(0, 440);
  button.class('button');
  button.mousePressed(function() {
    addObject('Text ' + (nbObjects + 1), 90, 70, undefined, undefined, undefined, 0, undefined, undefined, undefined,
    undefined, undefined, undefined, '#000000', undefined, undefined, 'Your text', 32);
    createPanel(object);
    addToMaster(object);
    redraw();
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
  rect(0,0,canvasWidth-1,canvasHeight-1);
  
  if(nbObjects) {
    //browse all objects
    objects.forEach(function(_object) {
      if(_object.name.startsWith('Rectangle')) {
        push();
        strokeWeight(3);
        stroke(_object.strokeColor);
        fill(_object.fillColor);
        rectMode(CENTER); 
        translate(_object.x, _object.y);
        rotate(_object.angle*PI/180);
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
        rotate(_object.angle*PI/180);
        rect(0,0,_object.l,1);
        pop();
      }
      else if(_object.name.startsWith('Table')) {
        image(tableimg,_object.x,_object.y,100,73);

        // draw chairs arranged in a circle
        for(var i = 0; i < _object.numPlace; i++) {

          var angle = TWO_PI / _object.numPlace * i;
          var x = _object.x + cos(angle) * 60 -51;
          var y = _object.y + sin(angle) * 60 -30;

          switch(_object.typeChair) {

            case 'chair':
            //p5: The push() function saves the current drawing style settings and transformations, while pop() restores these settings
              push();
              imageMode(CENTER);
              translate(x+100, y+65);
              rotate(angle+PI/2);
              image(chairimg,0, 0, 200, 130);
              pop();
              break;

            case 'sofa':
              push();
              imageMode(CENTER);
              translate(x+100, y+65);
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
        rotate((_object.angle/45)*PI/2);
        image(doorimg, 0, 0, 200, 75);
        pop();
      }
      else if(_object.name.startsWith('Window')) {
        push();
        imageMode(CENTER);
        translate(_object.x, _object.y);
        rotate((_object.angle/45)*PI/2);
        image(windowimg, 0, 0, 200, 150);
        pop();
      }
      else if(_object.name.startsWith('TV')) {
        push();
        imageMode(CENTER);
        translate(_object.x, _object.y);
        rotate((_object.angle/45)*PI/2);
        image(tvimg, 0, 0, 120, 75);
        pop();
      }
      else if(_object.name.startsWith('Toilet')) {
        push();
        imageMode(CENTER);
        translate(_object.x, _object.y);
        rotate((_object.angle/45)*PI/2);
        image(toiletimg, 0, 0, 55, 70);
        pop();
      }
      else if(_object.name.startsWith('Sink')) {
        push();
        imageMode(CENTER);
        translate(_object.x, _object.y);
        rotate((_object.angle/45)*PI/2);
        image(sinkimg, 0, 0, 70, 85);
        pop();
      }
      else if(_object.name.startsWith('Text')) {
        push();
        noStroke();
        textSize(_object.size);
        fill(_object.color);
        translate(_object.x, _object.y);
        rotate((_object.angle/45)*PI/2);
        text(_object.inputText, 0, 0);
        pop();
      }
    });
  }
}

//p5 function: called once after every time a mouse button is pressed.
function mousePressed() {
  if(mouseX > 0 && mouseX < canvasWidth && mouseY > 0 && mouseY < canvasHeight) {
    if(clickEvent == 'Draw_Rect' || clickEvent == 'Draw_Line') {
      x1 = mouseX;
      y1 = mouseY;
    }
    else {
      diffPositionX = mouseX - panel.getValue('x');
      diffPositionY = mouseY - panel.getValue('y');
    }
  }
}

//p5 function: called once every time the mouse moves and a mouse button is pressed.
function mouseDragged() {
  if(mouseX > 0 && mouseX < canvasWidth && mouseY > 0 && mouseY < canvasHeight) {
    if(clickEvent == 'Draw_Rect' || clickEvent == 'Draw_Line') {
      x2 = mouseX;
      y2 = mouseY;
      if(clickEvent == 'Draw_Rect') {
        removeObject('Rectangle drawing');
        addObject('Rectangle drawing', x1+(x2-x1)/2, y1+(y2-y1)/2, abs(x2-x1), abs(y2-y1), undefined, 0, 0, 0, 0,
        0, '#000000', '#ffffff', undefined, undefined, undefined, undefined, undefined);
      }
      if(clickEvent == 'Draw_Line') {
        removeObject('Line drawing');
        addObject('Line drawing', x1+(x2-x1)/2, y1+(y2-y1)/2, 2, undefined, parseInt(sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2)))
          , atan((y2-y1)/(x2-x1))*180/PI, undefined, undefined, undefined,undefined, undefined, undefined, '#000000', 
          undefined, undefined, undefined, undefined);
      }
      redraw();
    }
    else {
      panel.setValue('x', parseInt(mouseX - diffPositionX));
      panel.setValue('y', parseInt(mouseY - diffPositionY));
    }
  }
}

function mouseReleased() {
  if(mouseX > 0 && mouseX < canvasWidth && mouseY > 0 && mouseY < canvasHeight) {
    if(clickEvent == 'Draw_Rect' || clickEvent == 'Draw_Line') {
      if(clickEvent == 'Draw_Rect') {
        removeObject('Rectangle drawing');
        addObject('Rectangle ' + (nbObjects + 1), x1+(x2-x1)/2, y1+(y2-y1)/2, abs(x2-x1), abs(y2-y1), undefined, 0, 0, 0, 0,
        0, '#000000', '#ffffff', undefined, undefined, undefined, undefined, undefined);
      }
      else if(clickEvent == 'Draw_Line') {
        removeObject('Line drawing');
        addObject('Line ' + (nbObjects + 1), x1+(x2-x1)/2, y1+(y2-y1)/2, 2, undefined, parseInt(sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2)))
        , atan((y2-y1)/(x2-x1))*180/PI, undefined, undefined, undefined,undefined, undefined, undefined, '#000000', 
        undefined, undefined, undefined, undefined);
      }
      createPanel(object);
      addToMaster(object);
      redraw();
      x1 = 0, y1 = 0, x2 = 0, y2 = 0;
      clickEvent = '';
    }
  }
}

function resetObject() {
  object = {}
}

function addObject(_name, _x, _y, _w, _h, _l, _angle, _topLeftRadius, _topRightRadius, _bottomRightRadius,
_bottomLeftRadius, _strokeColor, _fillColor, _color, _numPlace, _typeChair, _inputText, _size) {

  resetObject();
  
  object = {
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
    fillColor : _fillColor,
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
  
  nbObjects ++;
  objects.push(object);
}

function removeObject(_name) {
  if(nbObjects) {
    objects= objects.filter(function( _object ) {
      return _object.name !== _name;
    });
    nbObjects --;
  }
}

function createPanel(_object) {

  if(nbObjects>0) {
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
  panel.bindColor('fillColor', _object.fillColor, _object);
  panel.bindColor('color', _object.color, _object);
  panel.bindRange('numPlace', 1, 10, _object.numPlace, 1, _object);
  panel.bindDropDown('typeChair',  ['chair','sofa'],  _object);
  panel.bindTextArea('inputText', _object.inputText, _object);
  panel.bindRange('size', 0, 100, _object.size, 1, _object);

  for(control in panel._controls) {
    if(!Object.keys(object).includes(control)) {
      panel.hideControl(control);
    }
  }
}

function addToMaster(_object) {
  master.addButton(_object.name, function() {
    createPanel(_object);
  });
}