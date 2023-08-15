import { activeItem, tmpItem, itemList, selectedItems, diffPositionX, diffPositionY, clickEvent, panel, zoomR, mySketch as p } from "../app";
import { mouseIsDragged, corner, x1, y1, x2, y2 } from "../app";
import Item from "../Item/item";

export default function handleMouseDragged() {
    if (mouseIsDragged) {
        let mouseXR = p.mouseX * zoomR;
        let mouseYR = p.mouseY * zoomR;
        if (clickEvent == 'Rotate') {
            p.angleMode(p.DEGREES);
            panel.setValue('angle', activeItem.angle + p.atan2(mouseYR - activeItem.y, mouseXR - activeItem.x) -
                p.atan2(diffPositionY - activeItem.y, diffPositionX - activeItem.x));
        }
        else if (clickEvent == 'Resize') {
            let dragX = diffPositionX + activeItem.x - ((mouseXR - activeItem.x) * p.cos(activeItem.angle)
                + (mouseYR - activeItem.y) * p.sin(activeItem.angle) + activeItem.x);
            let dragY = diffPositionY + activeItem.y - ((mouseYR - activeItem.y) * p.cos(activeItem.angle)
                - (mouseXR - activeItem.x) * p.sin(activeItem.angle) + activeItem.y);
            // For Top and Bottom resize corner.
            if (corner == 'T' && activeItem.sheight + dragY > 0 || corner == 'B' && activeItem.sheight - dragY > 0) {
                panel.setValue('y', Number(activeItem.y - dragY / 2 * p.cos(activeItem.angle)).toFixed(2));
                panel.setValue('x', Number(activeItem.x + dragY / 2 * p.sin(activeItem.angle)).toFixed(2));
                if (corner == 'T') {
                    panel.setValue('h', Number(activeItem.h + dragY).toFixed(2));
                }
                else if (corner == 'B') {
                    panel.setValue('h', Number(activeItem.h - dragY).toFixed(2));
                }
            }
            // For Left and Right resize corner.
            else if (corner == 'L' && activeItem.swidth + dragX > 0 || corner == 'R' && activeItem.swidth - dragX > 0) {
                panel.setValue('y', Number(activeItem.y - dragX / 2 * p.sin(activeItem.angle)).toFixed(2));
                panel.setValue('x', Number(activeItem.x - dragX / 2 * p.cos(activeItem.angle)).toFixed(2));
                if (corner == 'L') {
                    if (activeItem.name.startsWith('Rectangle') || activeItem.name.startsWith('Ellipse')
                        || activeItem.name.startsWith('Text') || activeItem.name.startsWith('Img')) {
                        panel.setValue('w', Number(activeItem.w + dragX).toFixed(2));
                    }
                    else if (activeItem.name.startsWith('Line')) {
                        panel.setValue('l', Number(activeItem.l + dragX).toFixed(2));
                    }
                }
                else {
                    if (activeItem.name.startsWith('Rectangle') || activeItem.name.startsWith('Ellipse')
                        || activeItem.name.startsWith('Text') || activeItem.name.startsWith('Img')) {
                        panel.setValue('w', Number(activeItem.w - dragX).toFixed(2));
                    }
                    else if (activeItem.name.startsWith('Line')) {
                        panel.setValue('l', Number(activeItem.l - dragX).toFixed(2));
                    }
                }
            }
            // For Top Right (TR) resize corner.
            if (corner == 'TR' && activeItem.h - dragX > 0 && activeItem.w - dragX > 0) {
                panel.setValue('y', Number(activeItem.y - dragX / 2 * p.sin(activeItem.angle) + dragX / 2 * p.cos(activeItem.angle)).toFixed(2));
                panel.setValue('x', Number(activeItem.x - dragX / 2 * p.cos(activeItem.angle) - dragX / 2 * p.sin(activeItem.angle)).toFixed(2));
                panel.setValue('h', Number(activeItem.h - dragX).toFixed(2));
                panel.setValue('w', Number(activeItem.w - dragX).toFixed(2));
            }
            // For Bottom Right (BR) resize corner.
            else if (corner == 'BR' && activeItem.h - dragX > 0 && activeItem.w - dragX > 0) {
                panel.setValue('y', Number(activeItem.y - dragX / 2 * p.cos(activeItem.angle) - dragX / 2 * p.sin(activeItem.angle)).toFixed(2));
                panel.setValue('x', Number(activeItem.x + dragX / 2 * p.sin(activeItem.angle) - dragX / 2 * p.cos(activeItem.angle)).toFixed(2));
                panel.setValue('h', Number(activeItem.h - dragX).toFixed(2));
                panel.setValue('w', Number(activeItem.w - dragX).toFixed(2));
            }
            // For Top Left (TL) resize corner.
            else if (corner == 'TL' && activeItem.h + dragX > 0 && activeItem.w + dragX > 0) {
                panel.setValue('y', Number(activeItem.y - dragX / 2 * p.cos(activeItem.angle) - dragX / 2 * p.sin(activeItem.angle)).toFixed(2));
                panel.setValue('x', Number(activeItem.x + dragX / 2 * p.sin(activeItem.angle) - dragX / 2 * p.cos(activeItem.angle)).toFixed(2));
                panel.setValue('h', Number(activeItem.h + dragX).toFixed(2));
                panel.setValue('w', Number(activeItem.w + dragX).toFixed(2));
            }
            // For Bottom Left (BL) resize corner.
            else if (corner == 'BL' && activeItem.h + dragX > 0 && activeItem.w + dragX > 0) {
                panel.setValue('y', Number(activeItem.y - dragX / 2 * p.sin(activeItem.angle) + dragX / 2 * p.cos(activeItem.angle)).toFixed(2));
                panel.setValue('x', Number(activeItem.x - dragX / 2 * p.cos(activeItem.angle) - dragX / 2 * p.sin(activeItem.angle)).toFixed(2));
                panel.setValue('h', Number(activeItem.h + dragX).toFixed(2));
                panel.setValue('w', Number(activeItem.w + dragX).toFixed(2));
            }
        }
        else if (x1 && y1 && (clickEvent == 'Draw_Rect' || clickEvent == 'Draw_Ellipse' || clickEvent == 'Draw_Line'
            || clickEvent == 'Select')) {
            x2 = p.mouseX * zoomR;
            y2 = p.mouseY * zoomR;
            if (clickEvent == 'Draw_Rect') {
                if (itemList.length && itemList[itemList.length - 1].name === 'Rectangle drawing') itemList.pop();
                Item.addItem(new Item([true, true, itemList.length, 'Rectangle drawing', x1 + (x2 - x1) / 2, y1 + (y2 - y1) / 2, p.abs(x2 - x1), p.abs(y2 - y1), 3, undefined,
                    0, 0, 0, 0, 0, '#000000', false, '#ffffff', 100, false, undefined, undefined, undefined, undefined, undefined, undefined, undefined, p.abs(x2 - x1),
                    p.abs(y2 - y1), 0, undefined]));
            }
            else if (clickEvent == 'Draw_Ellipse') {
                if (itemList.length && itemList[itemList.length - 1].name === 'Ellipse drawing') itemList.pop();
                Item.addItem(new Item([true, true, itemList.length, 'Ellipse drawing', x1 + (x2 - x1) / 2, y1 + (y2 - y1) / 2, p.abs(x2 - x1), p.abs(y2 - y1), 3, undefined,
                    0, undefined, undefined, undefined, undefined, '#000000', false, '#ffffff', 100, false, undefined, undefined, undefined, undefined, undefined, undefined,
                    undefined, p.abs(x2 - x1), p.abs(y2 - y1), 0, undefined]));
            }
            else if (clickEvent == 'Draw_Line') {
                if (itemList.length && itemList[itemList.length - 1].name === 'Line drawing') itemList.pop();
                Item.addItem(new Item([true, true, itemList.length, 'Line drawing', x1 + (x2 - x1) / 2, y1 + (y2 - y1) / 2, undefined, undefined, 2,
                    Number(p.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2))).toFixed(2), p.atan((y2 - y1) / (x2 - x1)), undefined, undefined, undefined, undefined, undefined,
                    undefined, undefined, undefined, undefined, '#000000', undefined, undefined, undefined, undefined, undefined, "Line",
                    p.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2)), 7, 0, undefined]));
            }
            else if (clickEvent == 'Select') {
                if (itemList.length && itemList[itemList.length - 1].name === 'Rectangle Select') itemList.pop();
                Item.addItem(new Item([true, false, itemList.length, 'Rectangle Select', x1 + (x2 - x1) / 2, y1 + (y2 - y1) / 2, p.abs(x2 - x1), p.abs(y2 - y1), 1, undefined,
                    0, 0, 0, 0, 0, '#000000', false, '#ffffff', 255, true, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined,
                    undefined, 5, undefined]));
            }
            p.draw();
        }
        else if (diffPositionX && diffPositionY && clickEvent == 'Select') {
            if (selectedItems.length > 0) {
                for (let i = 1; i < selectedItems.length; i++) {
                    selectedItems[i].x = tmpItem[i].x + selectedItems[0].x - tmpItem[0].x;
                    selectedItems[i].y = tmpItem[i].y + selectedItems[0].y - tmpItem[0].y;
                }
                panel.setValue('x', Number(p.mouseX * zoomR - diffPositionX).toFixed(2));
                panel.setValue('y', Number(p.mouseY * zoomR - diffPositionY).toFixed(2));
            }
            else {
                panel.setValue('x', Number(p.mouseX * zoomR - diffPositionX).toFixed(2));
                panel.setValue('y', Number(p.mouseY * zoomR - diffPositionY).toFixed(2));
            }
        }
    }
}