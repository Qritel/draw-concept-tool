/*
This code uses 2 libraries :
  QuickSettings : http://bit101.github.io/quicksettings/doc/module-QuickSettings.html
  P5 : https://p5js.org/reference/
*/

var x1 = 0, y1 = 0, x2 = 0, y2 = 0;
var init = 0;
var clickEvent = '';
var nbObjects = 0;
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
  master = QuickSettings.create(windowWidth-300, 0, 'Master');
  master.setSize(300, windowHeight-300);
  resetObject();
  createPanel(object);

  //p5: Creates a canvas element in the document, and sets the dimensions of it in pixels
  var canv = createCanvas(windowWidth-320, windowHeight-50);
  //p5: Set its postion
  canv.position(10, 40);

  button = createButton('Rect');
  button.position(canv.x, canv.y-25);
  button.mousePressed(function() { clickEvent='Draw_Rect'; init=0;});

  button = createButton('Line');
  button.position(canv.x+43, canv.y-25);
  button.mousePressed(function() { clickEvent='Draw_Line'; init=0;});

  button = createButton('Table');
  button.position(canv.x+83, canv.y-25);
  button.mousePressed(function() {

    resetObject();
    object.numPlace = 2;
    object.typeChair = 'chair';
    object.x = 70;
    object.y = 70;
    object.name = 'table';
  
    objects.push(object);
    nbObjects ++;
    createPanel(object);
    addToMaster(object);
    redraw();

  });

  button = createButton('Door');
  button.position(canv.x+130.3, canv.y-25);
  button.mousePressed(function() {

    resetObject();
    object.x = 70;
    object.y = 70;
    object.angle = 0.01;
    object.name = 'door';
  
    objects.push(object);
    nbObjects ++;
    createPanel(object);
    addToMaster(object);
    redraw();

  });

  button = createButton('Window');
  button.position(canv.x+175, canv.y-25);
  button.mousePressed(function() {

    resetObject();
    object.x = 70;
    object.y = 70;
    object.angle = 0.01;
    object.name = 'window';
  
    objects.push(object);
    nbObjects ++;
    createPanel(object);
    addToMaster(object);
    redraw();

  });

  button = createButton('TV');
  button.position(canv.x+238, canv.y-25);
  button.mousePressed(function() {

    resetObject();
    object.x = 70;
    object.y = 70;
    object.angle = 0.01;
    object.name = 'tv';
  
    objects.push(object);
    nbObjects ++;
    createPanel(object);
    addToMaster(object);
    redraw();

  });

  button = createButton('Toilet');
  button.position(canv.x+270, canv.y-25);
  button.mousePressed(function() {

    resetObject();
    object.x = 70;
    object.y = 70;
    object.angle = 0.01;
    object.name = 'toilet';
  
    objects.push(object);
    nbObjects ++;
    createPanel(object);
    addToMaster(object);
    redraw();

  });

  button = createButton('Sink');
  button.position(canv.x+316, canv.y-25);
  button.mousePressed(function() {

    resetObject();
    object.x = 70;
    object.y = 70;
    object.angle = 0.01;
    object.name = 'sink';
  
    objects.push(object);
    nbObjects ++;
    createPanel(object);
    addToMaster(object);
    redraw();

  });

  button = createButton('Text');
  button.position(canv.x+357.5, canv.y-25);
  button.mousePressed(function() {

    resetObject();
    object.x = 90;
    object.y = 70;
    object.angle = 0.01;
    object.inputText = 'Your text';
    object.color = 'black';
    object.size = 32;
    object.name = 'text';
  

    objects.push(object);
    nbObjects ++;
    createPanel(object);
    addToMaster(object);
    redraw();

  });

  noLoop();
}

//p5 function: continuously executes the lines of code contained inside its block until the program is stopped or noLoop() is called(as our case)
//draw() will be executed one time, when an object is added or its properties is changed.
function draw() {
  //p5 function: sets the color used for the background of the canvas
  background(220);

  if(nbObjects) {
    //browse all objects
    objects.forEach(function(_object){
      if(_object.name === 'rect'){
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
      else if(_object.name === 'line'){
        push();
        strokeWeight(_object.w);
        stroke(_object.color);
        rectMode(CENTER); 
        translate(_object.x, _object.y);
        rotate(_object.angle*PI/180);
        rect(0,0,_object.l,1);
        pop();
      }
      else if(_object.name === 'table'){
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
      else if(_object.name === 'door'){
        push();
        imageMode(CENTER);
        translate(_object.x, _object.y);
        rotate((_object.angle/45)*PI/2);
        image(doorimg, 0, 0, 200, 75);
        pop();
      }
      else if(_object.name === 'window'){
        push();
        imageMode(CENTER);
        translate(_object.x, _object.y);
        rotate((_object.angle/45)*PI/2);
        image(windowimg, 0, 0, 200, 150);
        pop();
      }
      else if(_object.name === 'tv'){
        push();
        imageMode(CENTER);
        translate(_object.x, _object.y);
        rotate((_object.angle/45)*PI/2);
        image(tvimg, 0, 0, 120, 75);
        pop();
      }
      else if(_object.name === 'toilet'){
        push();
        imageMode(CENTER);
        translate(_object.x, _object.y);
        rotate((_object.angle/45)*PI/2);
        image(toiletimg, 0, 0, 55, 70);
        pop();
      }
      else if(_object.name === 'sink'){
        push();
        imageMode(CENTER);
        translate(_object.x, _object.y);
        rotate((_object.angle/45)*PI/2);
        image(sinkimg, 0, 0, 70, 85);
        pop();
      }
      else if(_object.name === 'text'){
        push();
        noStroke();
        textSize(_object.size);
        fill(_object.color);
        translate(_object.x, _object.y);
        rotate((_object.angle/45)*PI/2);
        text(_object.inputText, 0, 0);
        pop();
      }
      else if(_object.name === 'ellipse'){
        //Two points before rect/line drawn - go to 'function mouseClicked()'
        ellipse(_object.x, _object.y,2);
      }
    });
  }

}

//p5 function: called once after a mouse button has been pressed and then released.
function mouseClicked(){
  if(clickEvent == 'Draw_Rect' || clickEvent == 'Draw_Line'){
    //when you click on the button rect / li, this click is counted
    if(init == 0 ){
      init = 1;
    }
    //first point
    else if(x1 == 0 && y1 == 0){
      x1 = mouseX;
      y1 = mouseY;
      resetObject();
      object.x = x1;
      object.y = y1;
      object.name = 'ellipse';
      objects.push(object);
      nbObjects++;
      redraw();
    }
    //second point
    else if(x2 == 0 && y2 == 0){
      objects.pop();
      nbObjects--;
      x2 = mouseX;
      y2 = mouseY;
      if(clickEvent == 'Draw_Rect'){

        resetObject();
        object.x = x1+(x2-x1)/2;
        object.y = y1+(y2-y1)/2;
        object.w = abs(x2-x1);
        object.h = abs(y2-y1);
        object.angle = 0.01;
        object.topLeftRadius = 1;
        object.topRightRadius = 1;
        object.bottomRightRadius = 1;
        object.bottomLeftRadius = 1;
        object.strokeColor = 'black';
        object.fillColor = 'white';
        object.name = 'rect';
      
        objects.push(object);
        nbObjects ++;
        createPanel(object);
        addToMaster(object);
        redraw();

      }
      if(clickEvent == 'Draw_Line'){

        resetObject();
        object.x = x1+(x2-x1)/2;
        object.y = y1+(y2-y1)/2;
        object.l = parseInt(sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2)));
        object.angle = atan((y2-y1)/(x2-x1))*180/PI;
        object.w = 2;
        object.color = 'black';
        object.name = 'line';
      
        objects.push(object);
        nbObjects ++;
        createPanel(object);
        addToMaster(object);
        redraw();

      }

      x1 = 0, y1 = 0, x2 = 0, y2 = 0;
      clickEvent = '';
      
    }
  }
}

function createPanel(_object){

  if(nbObjects>0){
    panel.destroy();
  }

  panel=QuickSettings.create(windowWidth-300, windowHeight-300, 'Properties');
  panel.setSize(300, 300);
  panel.setGlobalChangeHandler(function(){redraw()});
  panel.bindNumber('x', 0, windowWidth, _object.x, 1, _object);
  panel.bindNumber('y', 0, windowHeight, _object.y, 1, _object);
  panel.bindNumber('w', 0, windowWidth, _object.w, 1, _object);
  panel.bindNumber('h', 0, windowHeight, _object.h, 1, _object);
  panel.bindNumber('l', 0, windowHeight, _object.l, 1, _object);
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

  for(key in _object){
    if(!_object[key]){
      panel.hideControl(String(key));
    } 
  }

}
 
function resetObject(){
  object = {
    name : '',
    x : 0,
    y : 0,
    w : 0,
    h : 0,
    l : 0,
    angle : 0,
    topLeftRadius : 0,
    topRightRadius : 0,
    bottomRightRadius : 0,
    bottomLeftRadius : 0,
    strokeColor : '',
    fillColor : '',
    color : '', // color for text and line
    numPlace : 0,
    typeChair : '',
    inputText : '',
    size : 0,
  }
}

function addToMaster(_object){
  master.addButton(_object.name, function(){
    createPanel(_object);
  });
}