import { activeItem, tmpItem, selectedItems, itemList, id, diffPositionX, diffPositionY, clickEvent, tmpClickEvent, zoomR, mySketch as p } from "../app";
import { mouseIsDragged, x1, y1, x2, y2 } from "../app";
import Item from "../Item/item";
import getItemsInSelectionRect from "../math/getItemsInSelectionRect";
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
            if (activeItem.name.startsWith('Rectangle') || activeItem.name.startsWith('Ellipse') || activeItem.name.startsWith('Text')
                || activeItem.name.startsWith('Img'))
                Item.resizeItem(tmpItem.x - activeItem.x, tmpItem.y - activeItem.y, tmpItem.w - activeItem.w,
                    tmpItem.h - activeItem.h, activeItem);
            else if (activeItem.name.startsWith('Line'))
                Item.resizeItem(tmpItem.x - activeItem.x, tmpItem.y - activeItem.y, tmpItem.l - activeItem.l, 0, activeItem);
        }
        tmpItem = {};
    }
    else if (x1 && y1 && x2 && y2 && (clickEvent == 'Draw_Rect' || clickEvent == 'Draw_Ellipse' || clickEvent == 'Draw_Line'
        || clickEvent == 'Select')) {
        if (clickEvent == 'Draw_Rect') {
            itemList.pop();
            Item.addItem(new Item([true, true, itemList.length, 'Rectangle ' + id, x1 + (x2 - x1) / 2, y1 + (y2 - y1) / 2, p.abs(x2 - x1), p.abs(y2 - y1), 3, undefined,
                0, 0, 0, 0, 0, '#000000', false, '#ffffff', 100, false, undefined, undefined, undefined, undefined, undefined, undefined, undefined, p.abs(x2 - x1),
                p.abs(y2 - y1), 0, undefined]));
        }
        else if (clickEvent == 'Draw_Ellipse') {
            itemList.pop();
            Item.addItem(new Item([true, true, itemList.length, 'Ellipse ' + id, x1 + (x2 - x1) / 2, y1 + (y2 - y1) / 2, p.abs(x2 - x1), p.abs(y2 - y1), 3, undefined,
                0, undefined, undefined, undefined, undefined, '#000000', false, '#ffffff', 100, false, undefined, undefined, undefined, undefined, undefined, undefined,
                undefined, p.abs(x2 - x1), p.abs(y2 - y1), 0, undefined]));
        }
        else if (clickEvent == 'Draw_Line') {
            itemList.pop();
            Item.addItem(new Item([true, true, itemList.length, 'Line ' + id, x1 + (x2 - x1) / 2, y1 + (y2 - y1) / 2, undefined, undefined, 2,
                p.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2)), p.atan((y2 - y1) / (x2 - x1)), undefined, undefined, undefined, undefined, undefined,
                undefined, undefined, undefined, undefined, '#000000', undefined, undefined, undefined, undefined, undefined, "Line",
                p.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2)), 7, 0, undefined]));
        }
        else if (clickEvent == 'Select') {
            itemList.pop();
            selectedItems = getItemsInSelectionRect(x1, y1, x2, y2);
            if (activeItem) activeItem.selected = false;
            if (selectedItems.length > 0) activeItem = selectedItems[0];
            if (selectedItems.length == 1) {
                activeItem.selected = true;
                selectedItems = [];
            }
            else {
                selectedItems.forEach(function (_item) {
                    _item.selected = true;
                });
            }
        }
    }
    else if (clickEvent == 'Table') {
        Item.addItem(new Item([true, true, itemList.length, 'Table ' + id, mouseXR, mouseYR, undefined, undefined, undefined, undefined,
            0, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, 2, 'chair', undefined,
            undefined, undefined, undefined, 75, 75, undefined, undefined]));
    }
    else if (['Door', 'Toilet', 'Sink'].includes(clickEvent)) {
        Item.addItem(new Item([true, true, itemList.length, clickEvent + ' ' + id, mouseXR, mouseYR, undefined, undefined, undefined, undefined,
            0, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined,
            undefined, undefined, undefined, 75, 75, undefined, undefined]));
    }
    else if (['Window', 'TV'].includes(clickEvent)) {
        Item.addItem(new Item([true, true, itemList.length, clickEvent + ' ' + id, mouseXR, mouseYR, undefined, undefined, undefined, undefined,
            0, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined,
            undefined, undefined, undefined, 155, 25, undefined, undefined]));
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
            Item.addItem(new Item([true, true, itemList.length, 'Text ' + id, mouseXR + 82, mouseYR, 165, 35, undefined, undefined,
                0, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, '#000000', undefined, undefined,
                '', 'NORMAL', 18, undefined, 165, 40, undefined, undefined]));
        }
    }
    else if (diffPositionX && diffPositionY && itemList.length && clickEvent == 'Select') {
        if (selectedItems.length > 0) {
            let dragX = selectedItems[0].x - tmpItem[0].x;
            let dragY = selectedItems[0].y - tmpItem[0].y;
            selectedItems.forEach(_item => {
                _item.x -= dragX;
                _item.y -= dragY;
            });
            if (dragX != 0 || dragY != 0) {
                Item.dragItems(dragX, dragY, selectedItems);
                selectedItems.forEach(_item => _item.selected = false);
                selectedItems = [];
            }
        }
        else {
            itemList.splice(activeItem.index, 1);
            activeItem.visibility = true;
            if (tmpItem.x != activeItem.x || tmpItem.y != activeItem.y) {
                Item.dragItem(tmpItem.x - activeItem.x, tmpItem.y - activeItem.y, activeItem);
            }
        }
        p.cursor(p.ARROW);
    }
    tmpItem = {};
    x1 = 0, y1 = 0, x2 = 0, y2 = 0;
    diffPositionX = 0;
    diffPositionY = 0;
    refresh();
}