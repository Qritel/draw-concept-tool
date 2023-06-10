import { activeItem, tmpItem, itemList, diffPositionX, diffPositionY, clickEvent, tmpClickEvent, panel, zoomR, mySketch as p } from "../app";
import { mouseIsDragged, corner, x1, y1 } from "../app";
import getResizingCorner from '../math/getResizingCorner';
import isRotatingCorner from '../math/isRotatingCorner';
import getSelectedItem from '../math/getSelectedItem';
import createPanel from "./createPanel";
import refreshLayers from "./refreshLayers";

export default function handleMousePressed() {
    mouseIsDragged = true;
    let mouseXR = p.mouseX * zoomR;
    let mouseYR = p.mouseY * zoomR;
    let selectedItem = getSelectedItem(mouseXR, mouseYR);
    if (isRotatingCorner(activeItem, mouseXR, mouseYR)) {
        tmpClickEvent = clickEvent;
        clickEvent = 'Rotate';
        diffPositionX = mouseXR;
        diffPositionY = mouseYR;
        tmpItem = { ...activeItem }; //make a copy of 'activeItem', and store it in the new variable 'tmpItem'.
        createPanel(tmpItem);
        activeItem.visibility = false;
        itemList.splice(activeItem.index, 0, tmpItem); //insert 'tmpItem' into the 'itemList' array at the position 'activeItem.index'.
    }
    else if (getResizingCorner(activeItem, mouseXR, mouseYR)) {
        corner = getResizingCorner(activeItem, mouseXR, mouseYR);
        tmpClickEvent = clickEvent;
        clickEvent = 'Resize';
        diffPositionX = (mouseXR - activeItem.x) * p.cos(activeItem.angle)
            + (mouseYR - activeItem.y) * p.sin(activeItem.angle) + activeItem.x - panel.getValue('x');
        diffPositionY = (mouseYR - activeItem.y) * p.cos(activeItem.angle)
            - (mouseXR - activeItem.x) * p.sin(activeItem.angle) + activeItem.y - panel.getValue('y');
        tmpItem = { ...activeItem };
        createPanel(tmpItem);
        activeItem.visibility = false;
        itemList.splice(activeItem.index, 0, tmpItem);
    }
    else if (clickEvent == 'Draw_Rect' || clickEvent == 'Draw_Line') {
        x1 = mouseXR;
        y1 = mouseYR;
    }
    else if (selectedItem && clickEvent == 'Select') {
        if (activeItem) activeItem.selected = false;
        activeItem = selectedItem;
        activeItem.selected = true;
        refreshLayers();
        tmpItem = { ...activeItem };
        createPanel(tmpItem);
        activeItem.visibility = false;
        itemList.splice(activeItem.index, 0, tmpItem);
        diffPositionX = mouseXR - panel.getValue('x') + 0.01;
        diffPositionY = mouseYR - panel.getValue('y') + 0.01;
        p.cursor(p.MOVE);
    }
    else if (!selectedItem) {
        activeItem.selected = false;
        p.draw();
    }
}