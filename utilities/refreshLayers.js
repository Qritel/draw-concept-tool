import QuickSettings from 'quicksettings';
import refresh from './refresh';
import { layers, objects, activeObject } from "../sketch";

export default function refreshLayers(p) {

  if(layers) {
    layers.destroy();
  }

  layers = QuickSettings.create(p.windowWidth - 190, 0, 'Layers');
  layers.setSize(188, p.windowHeight - p.windowHeight * 0.4 - 2);
  layers.setDraggable(false);
  layers.setCollapsible(false);
  layers.setGlobalChangeHandler(refresh);

  objects.slice().reverse().forEach(function(_object) {
    layers.addButton(_object.name, function() {
      activeObject = _object;
    });
    if(activeObject == _object) {
      layers.overrideStyle(_object.name, 'font-weight', 'p.BOLD');
      layers.overrideStyle(_object.name, 'background-color', '#2e7bb6');
      layers.overrideStyle(_object.name, 'color', '#ffffff');
    }
  });
}