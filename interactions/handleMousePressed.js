import { activeItem, tmpItem, items, diffPositionX, diffPositionY, clickEvent, tmpClickEvent, panel, zoomR, mySketch as p } from "../sketch";
import { mouseIsDragged, corner, x1, y1 } from "../sketch";
import getResizingCorner from '../math/getResizingCorner';
import isRotatingCorner from '../math/isRotatingCorner';
import getSelectedItem from '../math/getSelectedItem';
import refresh from "../utilities/refresh";

export default function handleMousePressed() {
    mouseIsDragged = true;
    let mouseXR = p.mouseX * zoomR;
    let mouseYR = p.mouseY* zoomR;
    if(isRotatingCorner(activeItem, mouseXR, mouseYR)){
        tmpClickEvent = clickEvent;
        clickEvent = 'Rotate';
        diffPositionX = mouseXR;
        diffPositionY = mouseYR;
        tmpItem = { ...activeItem }; //make a copy of 'activeItem', and store it in the new variable 'tmpItem'.
        activeItem.visibility = false;
        items.splice(activeItem.index, 0, tmpItem); //insert 'tmpItem' into the 'items' array at the position 'activeItem.index'.
    }
    else if(getResizingCorner(activeItem, mouseXR, mouseYR)){
        corner = getResizingCorner(activeItem, mouseXR, mouseYR);
        tmpClickEvent = clickEvent;
        clickEvent = 'Resize';
        diffPositionX = (mouseXR - activeItem.x) * p.cos(activeItem.angle) 
                    + (mouseYR - activeItem.y) * p.sin(activeItem.angle) + activeItem.x - panel.getValue('x');
        diffPositionY = (mouseYR - activeItem.y) * p.cos(activeItem.angle)
                    - (mouseXR - activeItem.x) * p.sin(activeItem.angle) + activeItem.y - panel.getValue('y');
        tmpItem = { ...activeItem };
        activeItem.visibility = false;
        items.splice(activeItem.index, 0, tmpItem);
    }
    else if(clickEvent == 'Draw_Rect' || clickEvent == 'Draw_Line') {
        x1 = mouseXR;
        y1 = mouseYR;
    }
    else if(getSelectedItem(mouseXR, mouseYR) && clickEvent == 'Move'){
        activeItem = getSelectedItem(mouseXR, mouseYR);
        refresh();
        diffPositionX = mouseXR - panel.getValue('x') + 0.01;
        diffPositionY = mouseYR - panel.getValue('y') + 0.01;
        tmpItem = { ...activeItem };
        activeItem.visibility = false;
        items.splice(activeItem.index, 0, tmpItem);
    }
}