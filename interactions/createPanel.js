import QuickSettings from 'quicksettings';
import { mySketch, panel } from '../sketch';

export default function createPanel(_object) {

  if(panel) {
    panel.destroy();
  }

  panel=QuickSettings.create(mySketch.windowWidth - 190, mySketch.windowHeight - mySketch.windowHeight * 0.4 - 2, 'Properties');
  panel.setSize(188, mySketch.windowHeight * 0.4);
  panel.setDraggable(false);
  panel.setCollapsible(false);
  panel.setGlobalChangeHandler(function() {mySketch.redraw()});

  panel.bindNumber('x', 0, mySketch.windowWidth, Number(_object.x).toFixed(2), 1, _object);
  panel.bindNumber('y', 0, mySketch.windowHeight, Number(_object.y).toFixed(2), 1, _object);
  panel.bindNumber('w', 0, mySketch.windowWidth, Number(_object.w).toFixed(2), 1, _object);
  panel.bindNumber('h', 0, mySketch.windowHeight, Number(_object.h).toFixed(2), 1, _object);
  panel.bindNumber('l', 0, mySketch.windowHeight, Number(_object.l).toFixed(2), 1, _object);
  panel.bindRange('angle', -180, 180, _object.angle, 1, _object);
  panel.bindRange('topLeftRadius', 0, Math.min(_object.w,_object.h) / 2, _object.topLeftRadius, 1, _object);
  panel.bindRange('topRightRadius', 0, Math.min(_object.w,_object.h) / 2, _object.topRightRadius, 1, _object);
  panel.bindRange('bottomRightRadius', 0, Math.min(_object.w,_object.h) / 2, _object.bottomRightRadius, 1, _object);
  panel.bindRange('bottomLeftRadius', 0, Math.min(_object.w,_object.h) / 2, _object.bottomLeftRadius, 1, _object);
  panel.bindColor('strokeColor', _object.strokeColor, _object);
  panel.bindBoolean('noStroke', _object.noStroke, _object);
  panel.bindColor('fillColor', _object.fillColor, _object);
  panel.bindBoolean('noFill', _object.noFill, _object);
  panel.bindColor('color', _object.color, _object);
  panel.bindRange('numPlace', 1, 10, _object.numPlace, 1, _object);
  panel.bindDropDown('typeChair',  ['chair','sofa'],  _object);
  panel.bindTextArea('inputText', _object.inputText, _object);
  panel.bindRange('size', 0, 100, _object.size, 1, _object);

  for(let control in panel._controls) {
    if(!Object.keys(_object).includes(control)) {
      panel.hideControl(control);
    }
  }
  
}