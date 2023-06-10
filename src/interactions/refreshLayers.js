import QuickSettings from 'quicksettings';
import refresh from '../utils/refresh';
import { mySketch as p, layers, itemList, activeItem } from "../app";

export default function refreshLayers() {

  if (layers) {
    layers.destroy();
  }

  layers = QuickSettings.create(p.windowWidth - 190, 0, 'Layers');
  layers.setSize(188, p.windowHeight - p.windowHeight * 0.4 - 2);
  layers.setDraggable(false);
  layers.setCollapsible(false);
  layers.setGlobalChangeHandler(refresh);

  itemList.slice().reverse().forEach(function (_item) {
    layers.addButton(_item.name, function () {
      if (activeItem) activeItem.selected = false;
      activeItem = _item;
      activeItem.selected = true;
    });
    if (activeItem == _item) {
      layers.overrideStyle(_item.name, 'font-weight', 'BOLD');
      layers.overrideStyle(_item.name, 'background-color', '#2e7bb6');
      layers.overrideStyle(_item.name, 'color', '#ffffff');
    }
  });
}