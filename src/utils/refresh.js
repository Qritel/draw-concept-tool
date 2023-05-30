import createPanel from "../interactions/createPanel";
import refreshLayers from "../interactions/refreshLayers";
import { mySketch, activeItem } from "../sketch";

export default function refresh() {
  refreshLayers();
  createPanel(activeItem);
  mySketch.redraw();
}