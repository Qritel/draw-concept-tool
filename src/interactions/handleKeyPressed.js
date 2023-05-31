import { mySketch as p, activeItem, undoManager, slider } from "../app";
import Item from '../Item/item';
import refresh from "../utils/refresh";
import downloadDataAsJson from "../Data/downloadDataAsJson";

export default function handleKeyPressed() {
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
    else if (p.keyIsDown(p.DELETE)) {
        Item.removeItem(activeItem);
        refresh();
    }
    else if (p.keyIsDown(p.UP_ARROW) || p.keyIsDown(p.DOWN_ARROW) || p.keyIsDown(p.LEFT_ARROW) || p.keyIsDown(p.RIGHT_ARROW)) {
        p.loop();
    }
}