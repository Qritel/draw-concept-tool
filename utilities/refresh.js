import createPanel from "../interactions/createPanel";
import refreshLayers from "./refreshLayers";
import { mySketch, activeItem } from "../sketch";

export default function refresh() {
  refreshLayers();
  createPanel(activeItem);
  mySketch.redraw();
}