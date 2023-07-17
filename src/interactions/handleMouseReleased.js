import { activeItem, tmpItem, itemList, id, diffPositionX, diffPositionY, clickEvent, tmpClickEvent, zoomR, mySketch as p } from "../app";
import { mouseIsDragged, x1, y1, x2, y2 } from "../app";
import Item from "../Item/item";
import getSelectedItem from '../math/getSelectedItem';
import refresh from "../utils/refresh";

export default function handleMouseReleased() {
    mouseIsDragged = false;
    let mouseXR = p.mouseX * zoomR;
    let mouseYR = p.mouseY * zoomR;
    if (clickEvent == 'Rotate') {
        itemList.splice(activeItem.index, 1);
        activeItem.visibility = true;
        clickEvent = tmpClickEvent;
        if (tmpItem.angle != activeItem.angle) {
            Item.rotateItem(tmpItem.angle - activeItem.angle, activeItem);
        }
        tmpItem = {};
    }
    else if (clickEvent == 'Resize') {
        itemList.splice(activeItem.index, 1);
        activeItem.visibility = true;
        clickEvent = tmpClickEvent;
        if (tmpItem.x != activeItem.x || tmpItem.y != activeItem.y) {
            if (activeItem.name.startsWith('Rectangle') || activeItem.name.startsWith('Ellipse'))
                Item.resizeItem(tmpItem.x - activeItem.x, tmpItem.y - activeItem.y, tmpItem.w - activeItem.w,
                    tmpItem.h - activeItem.h, activeItem);
            else if (activeItem.name.startsWith('Line'))
                Item.resizeItem(tmpItem.x - activeItem.x, tmpItem.y - activeItem.y, tmpItem.l - activeItem.l, 0, activeItem);
            else if (activeItem.name.startsWith('Text'))
                Item.resizeItem(tmpItem.x - activeItem.x, tmpItem.y - activeItem.y, tmpItem.swidth - activeItem.swidth,
                    tmpItem.sheight - activeItem.sheight, activeItem);
        }
        tmpItem = {};
    }
    else if (x1 && y1 && x2 && y2 && (clickEvent == 'Draw_Rect' || clickEvent == 'Draw_Ellipse' || clickEvent == 'Draw_Line')) {
        if (clickEvent == 'Draw_Rect') {
            itemList.pop();
            Item.addItem(new Item([true, true, itemList.length, 'Rectangle ' + id, x1 + (x2 - x1) / 2, y1 + (y2 - y1) / 2, p.abs(x2 - x1), p.abs(y2 - y1), undefined,
                0, 0, 0, 0, 0, '#000000', false, '#ffffff', false, undefined, undefined, undefined, undefined, undefined, p.abs(x2 - x1),
                p.abs(y2 - y1)]));
        }
        else if (clickEvent == 'Draw_Ellipse') {
            itemList.pop();
            Item.addItem(new Item([true, true, itemList.length, 'Ellipse ' + id, x1 + (x2 - x1) / 2, y1 + (y2 - y1) / 2, p.abs(x2 - x1), p.abs(y2 - y1), undefined,
                0, undefined, undefined, undefined, undefined, '#000000', false, '#ffffff', false, undefined, undefined, undefined, undefined, undefined, p.abs(x2 - x1),
                p.abs(y2 - y1)]));
        }
        else if (clickEvent == 'Draw_Line') {
            itemList.pop();
            Item.addItem(new Item([true, true, itemList.length, 'Line ' + id, x1 + (x2 - x1) / 2, y1 + (y2 - y1) / 2, 2, undefined,
                p.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2)), p.atan((y2 - y1) / (x2 - x1)), undefined, undefined, undefined, undefined,
                undefined, undefined, undefined, undefined, '#000000', undefined, undefined, undefined, undefined,
                p.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2)), 7]));
        }
        x1 = 0, y1 = 0, x2 = 0, y2 = 0;
    }
    else if (clickEvent == 'Table') {
        Item.addItem(new Item([true, true, itemList.length, 'Table ' + id, mouseXR, mouseYR, undefined, undefined, undefined,
            0, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, 2, 'chair', undefined,
            undefined, 75, 75]));
    }
    else if (['Door', 'Toilet', 'Sink'].includes(clickEvent)) {
        Item.addItem(new Item([true, true, itemList.length, clickEvent + ' ' + id, mouseXR, mouseYR, undefined, undefined, undefined,
            0, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined,
            undefined, 75, 75]));
    }
    else if (['Window', 'TV'].includes(clickEvent)) {
        Item.addItem(new Item([true, true, itemList.length, clickEvent + ' ' + id, mouseXR, mouseYR, undefined, undefined, undefined,
            0, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined,
            undefined, 155, 25]));
    }
    else if (clickEvent == 'Text') {
        let selectedItem = getSelectedItem(mouseXR, mouseYR);
        if (selectedItem && selectedItem.name.startsWith('Text')) {
            if (activeItem) activeItem.selected = false;
            activeItem = getSelectedItem(mouseXR, mouseYR);
            activeItem.selected = true;
            refresh();
        }
        else {
            Item.addItem(new Item([true, true, itemList.length, 'Text ' + id, mouseXR, mouseYR, undefined, undefined, undefined,
                0, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, '#000000', undefined, undefined,
                '', 14, 125, 65]));
        }
    }
    else if (diffPositionX && diffPositionY && itemList.length && clickEvent == 'Select') {
        itemList.splice(activeItem.index, 1);
        activeItem.visibility = true;
        if (tmpItem.x != activeItem.x) {
            Item.dragItem(tmpItem.x - activeItem.x, tmpItem.y - activeItem.y, activeItem);
        }
        p.cursor(p.ARROW);
    }
    tmpItem = {};
    diffPositionX = 0;
    diffPositionY = 0;
    refresh();
}