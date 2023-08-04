import QuickSettings from 'quicksettings';
import { mySketch, panel } from '../app';

export default function createPanel(_item) {

  if (!_item) {
    _item = {};
  }

  if (panel) {
    panel.destroy();
  }

  panel = QuickSettings.create(mySketch.windowWidth - 190, mySketch.windowHeight - mySketch.windowHeight * 0.4 - 2, 'Properties');
  panel.setSize(188, mySketch.windowHeight * 0.4);
  panel.setDraggable(false);
  panel.setCollapsible(false);
  panel.setGlobalChangeHandler(function () { mySketch.redraw() });

  panel.bindNumber('x', 0, mySketch.windowWidth, Number(_item.x).toFixed(2), 1, _item);
  panel.bindNumber('y', 0, mySketch.windowHeight, Number(_item.y).toFixed(2), 1, _item);
  panel.addNumber('w', 0, mySketch.windowWidth, Number(_item.w).toFixed(2), 1, function (value) { _item.swidth = value; _item.w = value; });
  panel.addNumber('h', 0, mySketch.windowHeight, Number(_item.h).toFixed(2), 1, function (value) { _item.sheight = value; _item.h = value; });
  panel.addNumber('strokeWeight', 0, 30, _item.strokeWeight, 1, function (value) { _item.strokeWeight = value; });
  panel.addNumber('l', 0, mySketch.windowHeight, Number(_item.l).toFixed(2), 1, function (value) { _item.swidth = value; _item.l = value; });
  panel.bindRange('angle', -180, 180, _item.angle, 1, _item);
  panel.bindRange('dash', 0, 100, _item.dash, 1, _item);
  panel.bindRange('topLeftRadius', 0, Math.min(_item.w, _item.h) / 2, _item.topLeftRadius, 1, _item);
  panel.bindRange('topRightRadius', 0, Math.min(_item.w, _item.h) / 2, _item.topRightRadius, 1, _item);
  panel.bindRange('bottomRightRadius', 0, Math.min(_item.w, _item.h) / 2, _item.bottomRightRadius, 1, _item);
  panel.bindRange('bottomLeftRadius', 0, Math.min(_item.w, _item.h) / 2, _item.bottomLeftRadius, 1, _item);
  panel.bindColor('strokeColor', _item.strokeColor, _item);
  panel.bindBoolean('noStroke', _item.noStroke, _item);
  panel.bindColor('fillColor', _item.fillColor, _item);
  panel.bindBoolean('noFill', _item.noFill, _item);
  panel.bindColor('color', _item.color, _item);
  panel.bindRange('numPlace', 1, 10, _item.numPlace, 1, _item);
  panel.bindDropDown('typeChair', ['chair', 'sofa'], _item);
  panel.bindTextArea('inputText', _item.inputText, _item);
  panel.bindRange('size', 0, 100, _item.size, 1, _item);
  panel.bindDropDown('textStyle', ['normal', 'italic', 'bold', 'bold & italic'], _item);
  panel.bindDropDown('type', ['line', 'leftwards arrow', 'rightwards arrow', 'left right arrow'], _item);;

  for (let control in panel._controls) {
    if (!Object.keys(_item).includes(control)) {
      panel.hideControl(control);
    }
  }

}