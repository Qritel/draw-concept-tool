import { mySketch, clickEvent, buttons } from "../sketch";

export default function createBtnTool(_name, _x, _y, _clickEvent){
  buttons.push({pointer : mySketch.createButton(_name), clickEvent : _clickEvent});
  const l = buttons.length
  buttons[l - 1]['pointer'].position(_x, _y);
  buttons[l - 1]['pointer'].class('button');
  buttons[l - 1]['pointer'].attribute('title', _clickEvent);
  buttons[l - 1]['pointer'].mousePressed(function() {
    if(clickEvent) {
      const index = buttons.findIndex(_button => _button.clickEvent === clickEvent);
      buttons[index]['pointer'].class('button');
    }
    clickEvent = _clickEvent;
    buttons[l - 1]['pointer'].class('button_pressed');
    if(clickEvent == 'Move') {
      mySketch.cursor(mySketch.ARROW);
    }
    else {
      mySketch.cursor(mySketch.CROSS);
    }
  });
}