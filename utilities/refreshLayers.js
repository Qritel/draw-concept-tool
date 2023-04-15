import QuickSettings from 'quicksettings';
import refresh from './refresh';
import { mySketch, layers, items, activeItem } from "../sketch";

export default function refreshLayers() {

  if(layers) {
    layers.destroy();
  }

  layers = QuickSettings.create(mySketch.windowWidth - 190, 0, 'Layers');
  layers.setSize(188, mySketch.windowHeight - mySketch.windowHeight * 0.4 - 2);
  layers.setDraggable(false);
  layers.setCollapsible(false);
  layers.setGlobalChangeHandler(refresh);

  items.slice().reverse().forEach(function(_object) {
    layers.addButton(_object.name, function() {
      activeItem = _object;
    });
    if(activeItem == _object) {
      layers.overrideStyle(_object.name, 'font-weight', 'mySketch.BOLD');
      layers.overrideStyle(_object.name, 'background-color', '#2e7bb6');
      layers.overrideStyle(_object.name, 'color', '#ffffff');
    }
  });
}