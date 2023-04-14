import createPanel from "./createPanel";
import refreshLayers from "./refreshLayers";
import { activeObject } from "../sketch";

export default function refresh(p) {
  refreshLayers(p);
  createPanel(p, activeObject);
  p.redraw();
}