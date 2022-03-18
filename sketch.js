/*
This code uses 2 libraries :
  QuickSettings : http://bit101.github.io/quicksettings/doc/module-QuickSettings.html
  P5 : https://p5js.org/reference/
*/

//Begin variable listing
var x1=0, y1=0, x2=0, y2=0;
var init=0;
var shape='';

var tableimg;
var chairimg;
var sofaimg;
var doorimg;
var windowimg;
var sinkimg;
var toiletimg;
var tvimg;
var inc=0;

//An array will contain all the objects on the map -canvas-
var tables = [];

//A panel lists the names of the created objects
var master;

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
  master = QuickSettings.create(0, 0, "Master");

  //p5: Creates a canvas element in the document, and sets the dimensions of it in pixels
  var canv=createCanvas(windowWidth-210, windowHeight-50);
  //p5: Set its postion
  canv.position(210,50);

  button = createButton('Rect');
  button.position(canv.x,canv.y-25);
  button.mousePressed(function() { shape="rect"; init=0;});

  button = createButton('Line');
  button.position(canv.x+43,canv.y-25);
  button.mousePressed(function() { shape="line"; init=0;});

  button = createButton('Table');
  button.position(canv.x+83,canv.y-25);
  button.mousePressed(function() {

    //To differentiate between names in -master-'s list
    //i'll use "shape name"+inc as a title of objects (table1 line2 door3 ....)
    inc++;

    //Our object
    var tablee = {};
    tablee["numPlace"]=2;
    tablee["type"]='chair';
    tablee["positionx"]=70;
    tablee["positiony"]=70;
    tablee["shape"]="table";
    tablee["title"]="table "+inc;
    //Add it to -master- array
    tables.push(tablee);
    //The current object is a table
    shape="table";
    var l=tables.length;
    //QuickSettings: panel to configure our object's properties
    var panel=QuickSettings.create(windowWidth-210, 0, tables[l-1]["title"])
    .addRange("numPlace", 0, 10, 2, 1, function(value) { tables[l-1]["numPlace"] = value; redraw();})
    .addRange("positionx", 0, windowWidth, 70, 1, function(value) { tables[l-1]["positionx"] = value; redraw();})
    .addRange("positiony", 0, windowHeight, 70, 1, function(value) { tables[l-1]["positiony"] = value; redraw();})
    .addDropDown("type", ['chair','sofa'], function(value) { tables[l-1]["type"] = value.value; redraw();})
    //Add button to destroy the object's panel and remove it from the -master-'s pannel.
    //tables[l-1]["shape"]="" : to not draw it in the map - go to "function draw()"
    .addButton("Remove", function(value) { master.removeControl(tables[l-1]["title"]); tables[l-1]["shape"]=""; panel.destroy(); redraw();});



    //Adds a checkbox to -master-'s pannel to show/hide the object's panel
    master.addBoolean("table "+inc, true, function(value) {
      if(value) {
        panel.show();
      }
      else {
        panel.hide();
      }
    });

    redraw();
  });

  button = createButton('Door');
  button.position(canv.x+131,canv.y-25);
  button.mousePressed(function() {

    inc++;
    var door = {};
    door["positionx"]=70;
    door["positiony"]=70;
    door["rotation"]=0;
    door["shape"]="door";
    door["title"]="door "+inc;
    tables.push(door);
    shape="door";
    var l=tables.length;
    var panel=QuickSettings.create(windowWidth-210, 0, tables[l-1]["title"])
    .addRange("positionx", 0, windowWidth, 70, 1, function(value) { tables[l-1]["positionx"] = value; redraw();})
    .addRange("positiony", 0, windowHeight, 70, 1, function(value) { tables[l-1]["positiony"] = value; redraw();})
    .addRange("rotation", 0,  180, 0, 5, function(value) { tables[l-1]["rotation"] = value; redraw();})
    .addButton("Remove", function(value) { master.removeControl(tables[l-1]["title"]); tables[l-1]["shape"]=""; panel.destroy(); redraw();});


    master.addBoolean("door "+inc, true, function(value) {
      if(value) {
        panel.show();
      }
      else {
        panel.hide();
      }
    });

    redraw();
  });

  button = createButton('Window');
  button.position(canv.x+175,canv.y-25);
  button.mousePressed(function() {

    inc++;
    var door = {};
    door["positionx"]=90;
    door["positiony"]=70;
    door["rotation"]=0;
    door["shape"]="window";
    door["title"]="window "+inc;
    tables.push(door);
    shape="window";
    var l=tables.length;
    var panel=QuickSettings.create(windowWidth-210, 0, tables[l-1]["title"])
    .addRange("positionx", 0, windowWidth, 70, 1, function(value) { tables[l-1]["positionx"] = value; redraw();})
    .addRange("positiony", 0, windowHeight, 70, 1, function(value) { tables[l-1]["positiony"] = value; redraw();})
    .addRange("rotation",  0,  180, 0, 5, function(value) { tables[l-1]["rotation"] = value; redraw();})
    .addButton("Remove", function(value) { master.removeControl(tables[l-1]["title"]); tables[l-1]["shape"]=""; panel.destroy(); redraw();})


    master.addBoolean("window "+inc, true, function(value) {
      if(value) {
        panel.show();
      }
      else {
        panel.hide();
      }
    });

    redraw();
  });

  button = createButton('TV');
  button.position(canv.x+238,canv.y-25);
  button.mousePressed(function() {

    inc++;
    var tv = {};
    tv["positionx"]=90;
    tv["positiony"]=70;
    tv["rotation"]=0;
    tv["shape"]="tv";
    tv["title"]="tv "+inc;
    tables.push(tv);
    shape="tv";
    var l=tables.length;
    var panel=QuickSettings.create(windowWidth-210, 0, tables[l-1]["title"])
    .addRange("positionx", 0, windowWidth, 70, 1, function(value) { tables[l-1]["positionx"] = value; redraw();})
    .addRange("positiony", 0, windowHeight, 70, 1, function(value) { tables[l-1]["positiony"] = value; redraw();})
    .addRange("rotation",  0,  180, 0, 5, function(value) { tables[l-1]["rotation"] = value; redraw();})
    .addButton("Remove", function(value) { master.removeControl(tables[l-1]["title"]); tables[l-1]["shape"]=""; panel.destroy(); redraw();})


    master.addBoolean("tv "+inc, true, function(value) {
      if(value) {
        panel.show();
      }
      else {
        panel.hide();
      }
    });

    redraw();
  });

  button = createButton('Toilet');
  button.position(canv.x+270,canv.y-25);
  button.mousePressed(function() {

    inc++;
    var toilet = {};
    toilet["positionx"]=90;
    toilet["positiony"]=70;
    toilet["rotation"]=0;
    toilet["shape"]="toilet";
    toilet["title"]="toilet "+inc;
    tables.push(toilet);
    shape="toilet";
    var l=tables.length;
    var panel=QuickSettings.create(windowWidth-210, 0, tables[l-1]["title"])
    .addRange("positionx", 0, windowWidth, 70, 1, function(value) { tables[l-1]["positionx"] = value; redraw();})
    .addRange("positiony", 0, windowHeight, 70, 1, function(value) { tables[l-1]["positiony"] = value; redraw();})
    .addRange("rotation", 0, 180, 0, 5, function(value) { tables[l-1]["rotation"] = value; redraw();})
    .addButton("Remove", function(value) { master.removeControl(tables[l-1]["title"]); tables[l-1]["shape"]=""; panel.destroy(); redraw();})


    master.addBoolean("toilet "+inc, true, function(value) {
      if(value) {
        panel.show();
      }
      else {
        panel.hide();
      }
    });

    redraw();
  });

  button = createButton('Sink');
  button.position(canv.x+318,canv.y-25);
  button.mousePressed(function() {

    inc++;
    var sink = {};
    sink["positionx"]=90;
    sink["positiony"]=70;
    sink["rotation"]=0;
    sink["shape"]="sink";
    sink["title"]="sink "+inc;
    tables.push(sink);
    shape="sink";
    var l=tables.length;
    var panel=QuickSettings.create(windowWidth-210, 0, tables[l-1]["title"])
    .addRange("positionx", 0, windowWidth, 70, 1, function(value) { tables[l-1]["positionx"] = value; redraw();})
    .addRange("positiony", 0, windowHeight, 70, 1, function(value) { tables[l-1]["positiony"] = value; redraw();})
    .addRange("rotation",  0,  180, 0, 5, function(value) { tables[l-1]["rotation"] = value; redraw();})
    .addButton("Remove", function(value) { master.removeControl(tables[l-1]["title"]); tables[l-1]["shape"]=""; panel.destroy(); redraw();})


    master.addBoolean("sink "+inc, true, function(value) {
      if(value) {
        panel.show();
      }
      else {
        panel.hide();
      }
    });

    redraw();
  });

  button = createButton('Text');
  button.position(canv.x+359,canv.y-25);
  button.mousePressed(function() {

    inc++;
    var text = {};
    text["positionx"]=90;
    text["positiony"]=70;
    text["shape"]="text";
    text["text"]="Your text";
    text["color"]='black';
    text["size"]=32;
    text["title"]="text "+inc;
    tables.push(text);
    shape="text";
    var l=tables.length;
    var panel=QuickSettings.create(windowWidth-210, 0, tables[l-1]["title"])
    .addText("text","Your text", function(value) { tables[l-1]["text"] = value; redraw();})
    .addColor("color", 'black',function(value) { tables[l-1]["color"] = value; redraw();})
    .addRange("size", 0, 100, 32, 1, function(value) { tables[l-1]["size"] = value; redraw();})
    .addRange("positionx", 0, windowWidth, 70, 1, function(value) { tables[l-1]["positionx"] = value; redraw();})
    .addRange("positiony", 0, windowHeight, 70, 1, function(value) { tables[l-1]["positiony"] = value; redraw();})
    .addButton("Remove", function(value) { master.removeControl(tables[l-1]["title"]); tables[l-1]["shape"]=""; panel.destroy(); redraw();})


    master.addBoolean("text "+inc, true, function(value) {
      if(value) {
        panel.show();
      }
      else {
        panel.hide();
      }
    });

    redraw();
  });

  noLoop();
}

//p5 function: continuously executes the lines of code contained inside its block until the program is stopped or noLoop() is called(as our case)
//draw() will be executed one time, when an object is added or its properties is changed.
function draw() {
  //p5 function: sets the color used for the background of the canvas
  background(255);

  if(tables.length) {
    //browse all objects
    for(var j = 0; j < tables.length; j++) {
      if(tables[j]["shape"]==="table"){
        image(tableimg,tables[j]["positionx"],tables[j]["positiony"],100,73);

        // draw chairs arranged in a circle
        for(var i = 0; i < tables[j]["numPlace"]; i++) {

          var angle = TWO_PI / tables[j]["numPlace"] * i;
          var x = tables[j]["positionx"] + cos(angle) * 60 -51;
          var y = tables[j]["positiony"] + sin(angle) * 60 -30;

          switch(tables[j]["type"]) {

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
      else if(tables[j]["shape"]==="door"){
        push();
        imageMode(CENTER);
        translate(tables[j]["positionx"], tables[j]["positiony"]);
        rotate((tables[j]["rotation"]/45)*PI/2);
        image(doorimg,0,0,200,75);
        pop();
      }
      else if(tables[j]["shape"]==="window"){
        push();
        imageMode(CENTER);
        translate(tables[j]["positionx"], tables[j]["positiony"]);
        rotate((tables[j]["rotation"]/45)*PI/2);
        image(windowimg,0,0,200,150);
        pop();
      }
      else if(tables[j]["shape"]==="tv"){
        push();
        imageMode(CENTER);
        translate(tables[j]["positionx"], tables[j]["positiony"]);
        rotate((tables[j]["rotation"]/45)*PI/2);
        image(tvimg,0,0,120,75);
        pop();
      }
      else if(tables[j]["shape"]==="toilet"){
        push();
        imageMode(CENTER);
        translate(tables[j]["positionx"], tables[j]["positiony"]);
        rotate((tables[j]["rotation"]/45)*PI/2);
        image(toiletimg,0,0,55,70);
        pop();
      }
      else if(tables[j]["shape"]==="sink"){
        push();
        imageMode(CENTER);
        translate(tables[j]["positionx"], tables[j]["positiony"]);
        rotate((tables[j]["rotation"]/45)*PI/2);
        image(sinkimg,0,0,70,85);
        pop();
      }
      else if(tables[j]["shape"]==="rect"){
        push();
        strokeWeight(4);
        stroke(tables[j]["stroke color"]);
        if(tables[j]["fill color"]=="white" || tables[j]["fill color"]=="#FFFFFF" || tables[j]["fill color"]=="#ffffff")
          noFill();
        else
          fill(tables[j]["fill color"]);
        
        rectMode(CENTER); 
        translate(tables[j]["x"],tables[j]["y"]);
        rotate(tables[j]["angle"]*PI/180);
        rect(0,0,tables[j]["w"],tables[j]["h"],
              tables[j]["topLeftRadius"],tables[j]["topRightRadius"],tables[j]["bottomRightRadius"],tables[j]["bottomLeftRadius"]);
        pop();
      }
      else if(tables[j]["shape"]==="line"){
        push();
        strokeWeight(tables[j]["width"]);
        stroke(tables[j]["color"]);

        rectMode(CENTER); 
        translate(tables[j]["x"],tables[j]["y"]);
        rotate(tables[j]["angle"]*PI/180);
        rect(0,0,tables[j]["l"],1);
        pop();
      }
      else if(tables[j]["shape"]==="ellipse"){
        //Two points before rect/line drawn - go to "function mouseClicked()"
        ellipse(tables[j]["x"],tables[j]["y"],2,2);
      }
      else if(tables[j]["shape"]==="text"){
        push();
        noStroke();
        textSize(tables[j]["size"]);
        fill(tables[j]["color"]);
        text(tables[j]["text"], tables[j]["positionx"], tables[j]["positiony"]);
        pop();
      }
    }
  }

}

//p5 function: called once after a mouse button has been pressed and then released.
function mouseClicked(){
  if(shape=='rect' || shape=='line'){
    //when you click on the button rect / li, this click is counted
    if(init==0 ){
      init=1;
    }
    //first point
    else if(x1==0 && y1==0){
      x1=mouseX;
      y1=mouseY;
      var ellipse = {};
      ellipse["x"]=x1;
      ellipse["y"]=y1;
      ellipse["shape"]="ellipse";
      tables.push(ellipse);
      redraw();
    }
    //second point
    else if(x2==0 && y2==0){
      x2=mouseX;
      y2=mouseY;
        if(shape=='rect'){
          inc++;
          var Rectangle = {};
          Rectangle["x"]=x1+(x2-x1)/2;
          Rectangle["y"]=y1+(y2-y1)/2;
          Rectangle["w"]=abs(x2-x1);
          Rectangle["h"]=abs(y2-y1);
          Rectangle["angle"]=0;
          Rectangle["topLeftRadius"]=0;
          Rectangle["topRightRadius"]=0;
          Rectangle["bottomRightRadius"]=0;
          Rectangle["bottomLeftRadius"]=0;
          Rectangle["stroke color"]="brown";
          Rectangle["fill color"]="white";
          Rectangle["shape"]="rect";
          Rectangle["title"]="rect "+inc;
          tables.push(Rectangle);
    
          var l=tables.length;
          var panel = QuickSettings.create(windowWidth-210, 0, tables[l-1]["title"])
          .addRange("X", 0, windowWidth , x1+(x2-x1)/2, 1, function(value) { tables[l-1]["x"] = value; redraw();})
          .addRange("Y", 0, windowHeight , y1+(y2-y1)/2, 1, function(value) { tables[l-1]["y"] = value; redraw();})
          .addRange("W", 0, windowHeight , x2-x1, 1, function(value) { tables[l-1]["w"] = value; redraw();})
          .addRange("H", 0, windowWidth , y2-y1, 1, function(value) { tables[l-1]["h"] = value; redraw();})
          .addRange("Angle", -180, 180 , 0, 1, function(value) { tables[l-1]["angle"] = value; redraw();})
          .addRange("TopLeftRadius", 0, 200 , 0, 1, function(value) { tables[l-1]["topLeftRadius"] = value; redraw();})
          .addRange("TopRightRadius", 0, 200 , 0, 1, function(value) { tables[l-1]["topRightRadius"] = value; redraw();})
          .addRange("BottomRightRadius", 0, 200 , 0, 1, function(value) { tables[l-1]["bottomRightRadius"] = value; redraw();})
          .addRange("BottomLeftRadius", 0, 200 , 0, 1, function(value) { tables[l-1]["bottomLeftRadius"] = value; redraw();})
          .addColor("Stroke color", "brown",function(color) { tables[l-1]["stroke color"] = color; redraw();})
          .addColor("Fill color","white",function(color) { tables[l-1]["fill color"] = color; redraw();})
          .addButton("Remove", function(value) { master.removeControl(tables[l-1]["title"]); tables[l-1]["shape"]=""; panel.destroy(); redraw();})
    
    
          master.addBoolean("rect "+inc, true, function(value) {
            if(value) {
              panel.show();
            }
            else {
              panel.hide();
            }
          });
    
          redraw();
        }
        if(shape=='line'){
          inc++;
          var linee = {};
          linee["x"]=x1+(x2-x1)/2;
          linee["y"]=y1+(y2-y1)/2;
          linee["l"]=sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2));
          linee["angle"]=atan((y2-y1)/(x2-x1))*180/PI;
          linee["width"]=3;
          linee["color"]="brown";
          linee["shape"]="line";
          linee["title"]="line "+inc;
          tables.push(linee);
    
          var l=tables.length;
          var panel = QuickSettings.create(windowWidth-210, 0, tables[l-1]["title"])
          .addRange("X", 0, windowWidth , x1+(x2-x1)/2, 1, function(value) { tables[l-1]["x"] = value; redraw();})
          .addRange("Y", 0, windowHeight , y1+(y2-y1)/2, 1, function(value) { tables[l-1]["y"] = value; redraw();})
          .addRange("L", 0, windowWidth+windowHeight , sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2)), 1, function(value) { tables[l-1]["l"] = value; redraw();})
          .addRange("Angle", -180, 180 , atan((y2-y1)/(x2-x1))*180/PI, 1, function(value) { tables[l-1]["angle"] = value; redraw();})
          .addRange("width", 1, 100, 3, 1, function(value) { tables[l-1]["width"] = value; redraw();})
          .addColor("color", "brown",function(color) { tables[l-1]["color"] = color; redraw();})
          .addButton("Remove", function(value) { master.removeControl(tables[l-1]["title"]); tables[l-1]["shape"]=""; panel.destroy(); redraw();})
    
    
          master.addBoolean("line "+inc, true, function(value) {
            if(value) {
              panel.show();
            }
            else {
              panel.hide();
            }
          });
    
          redraw();
        }

        x1=0,y1=0,x2=0,y2=0;
        shape='';
      
    }
  }
}