import { buttons, symbolsVisible, symbolsContainer } from "../app";

export default function toggleSymbols() {
    symbolsVisible = !symbolsVisible;
    const index = buttons.findIndex(_button => _button.clickEvent === 'Floor Plan symbols');
    if (symbolsVisible) {
        buttons[index]['pointer'].html('Floor Plan symbols ⮝');
        symbolsContainer.show();
    }
    else {
        buttons[index]['pointer'].html('Floor Plan symbols ⮟');
        symbolsContainer.hide();
    }
}