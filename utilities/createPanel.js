import QuickSettings from 'quicksettings';
import { panel } from '../sketch';

export default function createPanel(p, object) {

  if(panel) {
    panel.destroy();
  }

  panel=QuickSettings.create(p.windowWidth - 190, p.windowHeight - p.windowHeight * 0.4 - 2, 'Properties');
  panel.setSize(188, p.windowHeight * 0.4);
  panel.setDraggable(false);
  panel.setCollapsible(false);
  panel.setGlobalChangeHandler(function() {p.redraw()});

  panel.bindNumber('x', 0, p.windowWidth, Number(object.x).toFixed(2), 1, object);
  panel.bindNumber('y', 0, p.windowHeight, Number(object.y).toFixed(2), 1, object);
  panel.bindNumber('w', 0, p.windowWidth, Number(object.w).toFixed(2), 1, object);
  panel.bindNumber('h', 0, p.windowHeight, Number(object.h).toFixed(2), 1, object);
  panel.bindNumber('l', 0, p.windowHeight, Number(object.l).toFixed(2), 1, object);
  panel.bindRange('angle', -180, 180, object.angle, 1, object);
  panel.bindRange('topLeftRadius', 0, Math.min(object.w,object.h) / 2, object.topLeftRadius, 1, object);
  panel.bindRange('topRightRadius', 0, Math.min(object.w,object.h) / 2, object.topRightRadius, 1, object);
  panel.bindRange('bottomRightRadius', 0, Math.min(object.w,object.h) / 2, object.bottomRightRadius, 1, object);
  panel.bindRange('bottomLeftRadius', 0, Math.min(object.w,object.h) / 2, object.bottomLeftRadius, 1, object);
  panel.bindColor('strokeColor', object.strokeColor, object);
  panel.bindBoolean('noStroke', object.noStroke, object);
  panel.bindColor('fillColor', object.fillColor, object);
  panel.bindBoolean('noFill', object.noFill, object);
  panel.bindColor('color', object.color, object);
  panel.bindRange('numPlace', 1, 10, object.numPlace, 1, object);
  panel.bindDropDown('typeChair',  ['chair','sofa'],  object);
  panel.bindTextArea('inputText', object.inputText, object);
  panel.bindRange('size', 0, 100, object.size, 1, object);

  for(let control in panel._controls) {
    if(!Object.keys(object).includes(control)) {
      panel.hideControl(control);
    }
  }
  
}