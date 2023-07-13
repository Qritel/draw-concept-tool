import { mySketch as p, buttons, symbolsContainer, symbols } from "../app";
import buttonPressed from "./buttonPressed";

export default function addBtnSymbol() {
    symbols.forEach(function (_name) {
        buttons.push({ pointer: p.createButton(_name), clickEvent: _name });
        const l = buttons.length;
        buttons[l - 1]['pointer'].parent(symbolsContainer);
        buttons[l - 1]['pointer'].class('symbols_button');
        buttons[l - 1]['pointer'].mousePressed(function () { buttonPressed(_name) });
    });
}