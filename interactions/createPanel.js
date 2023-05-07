import QuickSettings from 'quicksettings';
import { mySketch, panel } from '../sketch';

export default function createPanel(_item) {

  if(panel) {
    panel.destroy();
  }

  panel=QuickSettings.create(mySketch.windowWidth - 190, mySketch.windowHeight - mySketch.windowHeight * 0.4 - 2, 'Properties');
  panel.setSize(188, mySketch.windowHeight * 0.4);
  panel.setDraggable(false);
  panel.setCollapsible(false);
  panel.setGlobalChangeHandler(function() {mySketch.redraw()});

  panel.bindNumber('x', 0, mySketch.windowWidth, Number(_item.x).toFixed(2), 1, _item);
  panel.bindNumber('y', 0, mySketch.windowHeight, Number(_item.y).toFixed(2), 1, _item);
  panel.bindNumber('w', 0, mySketch.windowWidth, Number(_item.w).toFixed(2), 1, _item);
  panel.bindNumber('h', 0, mySketch.windowHeight, Number(_item.h).toFixed(2), 1, _item);
  panel.bindNumber('l', 0, mySketch.windowHeight, Number(_item.l).toFixed(2), 1, _item);
  panel.bindRange('angle', -180, 180, _item.angle, 1, _item);
  panel.bindRange('topLeftRadius', 0, Math.min(_item.w,_item.h) / 2, _item.topLeftRadius, 1, _item);
  panel.bindRange('topRightRadius', 0, Math.min(_item.w,_item.h) / 2, _item.topRightRadius, 1, _item);
  panel.bindRange('bottomRightRadius', 0, Math.min(_item.w,_item.h) / 2, _item.bottomRightRadius, 1, _item);
  panel.bindRange('bottomLeftRadius', 0, Math.min(_item.w,_item.h) / 2, _item.bottomLeftRadius, 1, _item);
  panel.bindColor('strokeColor', _item.strokeColor, _item);
  panel.bindBoolean('noStroke', _item.noStroke, _item);
  panel.bindColor('fillColor', _item.fillColor, _item);
  panel.bindBoolean('noFill', _item.noFill, _item);
  panel.bindColor('color', _item.color, _item);
  panel.bindRange('numPlace', 1, 10, _item.numPlace, 1, _item);
  panel.bindDropDown('typeChair',  ['chair','sofa'],  _item);
  panel.bindTextArea('inputText', _item.inputText, _item);
  panel.bindRange('size', 0, 100, _item.size, 1, _item);

  for(let control in panel._controls) {
    if(!Object.keys(_item).includes(control)) {
      panel.hideControl(control);
    }
  }
  
}