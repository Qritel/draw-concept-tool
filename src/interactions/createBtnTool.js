import { mySketch as p, clickEvent, buttons } from "../app";

export default function createBtnTool(_name, _x, _y, _clickEvent){
  buttons.push({pointer : p.createButton(_name), clickEvent : _clickEvent});
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
    if(clickEvent == 'Select') {
      p.cursor(p.ARROW);
    }
    else if(clickEvent == 'Text') {
      p.cursor(p.TEXT);
    }
    else {
      p.cursor(p.CROSS);
    }
  });
}