import { activeItem, tmpItem, items, id, diffPositionX, diffPositionY, clickEvent, tmpClickEvent, zoomR, mySketch as p } from "../sketch";
import { mouseIsDragged, x1, y1, x2, y2 } from "../sketch";
import Item from "../Item/item";
import refresh from "../utilities/refresh";

export default function handleMouseReleased() {
    mouseIsDragged = false;
    let mouseXR = p.mouseX * zoomR;
    let mouseYR = p.mouseY* zoomR;
    if(clickEvent == 'Rotate') {
        items.splice(activeItem.index, 1);
        const index = items.indexOf(activeItem);
        activeItem.visibility = true;
        clickEvent = tmpClickEvent;
        if(tmpItem.angle != activeItem.angle) {
            Item.rotateItem(tmpItem.angle - activeItem.angle, index);
        }
        tmpItem = {};
    }
    else if(clickEvent == 'Resize') {
        items.splice(activeItem.index, 1);
        const index = items.indexOf(activeItem);
        activeItem.visibility = true;
        clickEvent = tmpClickEvent;
        if(tmpItem.x != activeItem.x || tmpItem.y != activeItem.y) {
            if(activeItem.name.startsWith('Rectangle'))
            Item.resizeItem(tmpItem.x - activeItem.x, tmpItem.y - activeItem.y, tmpItem.w - activeItem.w,
                tmpItem.h - activeItem.h, index);
            else if(activeItem.name.startsWith('Line'))
            Item.resizeItem(tmpItem.x - activeItem.x, tmpItem.y - activeItem.y, tmpItem.l - activeItem.l, 0, index);
        }
        tmpItem = {};
    }
    else if(x1 && y1 && x2 && y2 && (clickEvent == 'Draw_Rect' || clickEvent == 'Draw_Line')) {
        if(clickEvent == 'Draw_Rect') {
            items.pop();
            Item.addItem(new Item([true, true, items.length, 'Rectangle ' + id, x1+(x2-x1)/2, y1+(y2-y1)/2, p.abs (x2-x1), p.abs (y2-y1), undefined,
            0, 0, 0, 0, 0, '#000000', false, '#ffffff', false, undefined, undefined, undefined, undefined, undefined, p.abs (x2-x1),
            p.abs (y2-y1)]));
        }
        else if(clickEvent == 'Draw_Line') {
            items.pop();
            Item.addItem(new Item([true, true, items.length, 'Line ' + id, x1+(x2-x1)/2, y1+(y2-y1)/2, 2, undefined,
            p.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2)), p.atan((y2-y1)/(x2-x1)), undefined, undefined, undefined,undefined,
            undefined, undefined, undefined, undefined, '#000000', undefined, undefined, undefined, undefined,
            p.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2)), 7]));
        }
        x1 = 0, y1 = 0, x2 = 0, y2 = 0;
    }
    else if(clickEvent == 'Table') {
        Item.addItem(new Item([true, true, items.length, 'Table ' + id, mouseXR, mouseYR, undefined, undefined, undefined,
        0, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, 2, 'chair', undefined,
        undefined, 75, 75]));
    }
    else if(['Door', 'Toilet', 'sink'].includes(clickEvent)){
        Item.addItem(new Item([true, true, items.length, clickEvent + ' ' + id, mouseXR, mouseYR, undefined, undefined, undefined,
        0, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined,
        undefined, 75, 75]));
    }
    else if(['Window', 'TV'].includes(clickEvent)){
        Item.addItem(new Item([true, true, items.length, clickEvent + ' ' + id, mouseXR, mouseYR, undefined, undefined, undefined,
        0, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined,
        undefined, 155, 25]));
    }
    else if(clickEvent == 'Text') {
        Item.addItem(new Item([true, true, items.length, 'Text ' + id, mouseXR, mouseYR, undefined, undefined, undefined,
        0, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, '#000000', undefined, undefined,
        'Your text', 14, 125, 65]));
    }
    else if(diffPositionX && diffPositionY && items.length && clickEvent == 'Move') {
        items.splice(activeItem.index, 1);
        const index = items.indexOf(activeItem);
        activeItem.visibility = true;
        if(tmpItem.x != activeItem.x)
        {
            Item.dragItem(tmpItem.x - activeItem.x, tmpItem.y - activeItem.y, index);
        }
        p.cursor(p.ARROW);
    }
    tmpItem = {};
    diffPositionX = 0;
    diffPositionY = 0;
    refresh();
}