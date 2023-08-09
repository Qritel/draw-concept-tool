import { mySketch as p, clickEvent, buttons, symbols, symbolsVisible, selectedSymbol, fileInput } from "../app";
import toggleSymbols from "../utils/toggleSymbols";


export default function buttonPressed(_id) {
    const prevBtnIndex = buttons.findIndex(_button => _button.clickEvent === clickEvent);
    const currBtnIndex = buttons.findIndex(_button => _button.clickEvent === _id);
    const BtnSymbolIndex = buttons.findIndex(_button => _button.clickEvent === 'Floor Plan symbols');

    if (symbols.includes(clickEvent)) {
        buttons[prevBtnIndex]['pointer'].class('symbols_button');
        if (!symbols.includes(_id))
            buttons[BtnSymbolIndex]['pointer'].class('button');
    }
    else {
        buttons[prevBtnIndex]['pointer'].class('button');
    }

    if (symbols.includes(_id)) {
        buttons[currBtnIndex]['pointer'].class('symbols_button_pressed');
        buttons[BtnSymbolIndex]['pointer'].class('button_pressed');
        selectedSymbol = _id;
    }
    else {
        buttons[currBtnIndex]['pointer'].class('button_pressed');
    }

    clickEvent = _id;

    if (_id == 'Floor Plan symbols') {
        toggleSymbols();
        if (symbolsVisible) {
            buttonPressed(selectedSymbol);
        }
    }

    if (_id == 'Img') {
        fileInput.elt.click();
    }

    if (clickEvent == 'Select') {
        p.cursor(p.ARROW);
    }
    else if (clickEvent == 'Text') {
        p.cursor(p.TEXT);
    }
    else {
        p.cursor(p.CROSS);
    }
}