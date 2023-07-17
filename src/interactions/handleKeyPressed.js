import { mySketch as p, activeItem, copiedItem, zoomR, id, panel, undoManager, slider, itemList } from "../app";
import Item from '../Item/item';
import refresh from "../utils/refresh";
import downloadDataAsJson from "../Data/downloadDataAsJson";

export default function handleKeyPressed() {
    // Check if the QuickSettings panel or any of its controls do not have focus
    if (document.activeElement.tagName.toLowerCase() == 'body' || document.activeElement.tagName.toLowerCase() == 'button') {
        if (p.keyIsDown(p.CONTROL) && (p.key == 'z' || p.key == 'Z')) {
            undoManager.undo();
            refresh();
        }
        else if (p.keyIsDown(p.CONTROL) && (p.key == 'y' || p.key == 'Y')) {
            undoManager.redo();
            refresh();
        }
        else if (p.keyIsDown(p.CONTROL) && (p.key == 's' || p.key == 'S')) {
            downloadDataAsJson();
        }
        else if (p.keyIsDown(p.CONTROL) && p.key == '+') {
            slider.value(slider.value() + 10);
            p.redraw();
        }
        else if (p.keyIsDown(p.CONTROL) && p.key == '-') {
            slider.value(slider.value() - 10);
            p.redraw();
        }
        else if (p.keyIsDown(p.CONTROL) && (p.key == 'c' || p.key == 'C')) {
            copiedItem = { ...activeItem }; //make a copy of 'activeItem', and store it in the new variable.
        }
        else if (p.keyIsDown(p.CONTROL) && (p.key == 'v' || p.key == 'V')) {
            if (copiedItem) {
                activeItem.selected = false;
                copiedItem.index = itemList.length;
                copiedItem.name = copiedItem.name.replace(/\d+$/, id);
                copiedItem.x = p.mouseX * zoomR;
                copiedItem.y = p.mouseY * zoomR;
                Item.addItem({ ...copiedItem });
                refresh();
            }

        }
        else if (p.keyIsDown(p.CONTROL) && (p.key == 'x' || p.key == 'X')) {
            copiedItem = { ...activeItem };
            Item.removeItem(activeItem);
            refresh();
        }
        else if (p.keyIsDown(p.DELETE)) {
            Item.removeItem(activeItem);
            refresh();
        }
        else if (p.keyIsDown(p.UP_ARROW) || p.keyIsDown(p.DOWN_ARROW) || p.keyIsDown(p.LEFT_ARROW) || p.keyIsDown(p.RIGHT_ARROW)) {
            p.loop();
        }
        //update the 'Text' value.
        else if (activeItem.selected == true && activeItem.name.startsWith('Text')) {
            if (p.keyCode === 13) { // Enter key
                panel.setValue('inputText', activeItem.inputText + '\n');
            } else if (p.keyCode === 8) { // Backspace key
                panel.setValue('inputText', activeItem.inputText.slice(0, -1));
            } else if (p.keyCode === 32) { // Space key
                panel.setValue('inputText', activeItem.inputText + ' ');
            }
            else if (p.keyCode > 32 && p.keyCode < 126) {
                panel.setValue('inputText', activeItem.inputText + p.key);
            }
        }

        // prevent any default behavior.
        return false;
    }
}