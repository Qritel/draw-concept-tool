import { mySketch as p, buttons, clickEvent } from "../app";
import buttonPressed from "./buttonPressed";

export default function createBtnTool(_name, _x, _y, _clickEvent) {
  buttons.push({ pointer: p.createButton(_name), clickEvent: _clickEvent });
  const l = buttons.length;
  buttons[l - 1]['pointer'].position(_x, _y);
  if (clickEvent == _clickEvent) buttons[l - 1]['pointer'].class('button_pressed');
  else buttons[l - 1]['pointer'].class('button');
  buttons[l - 1]['pointer'].attribute('title', _clickEvent);
  buttons[l - 1]['pointer'].mousePressed(function () { buttonPressed(_clickEvent) });
}