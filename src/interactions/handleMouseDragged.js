import { activeItem, tmpItem, items, diffPositionX, diffPositionY, clickEvent, panel, zoomR, mySketch as p } from "../sketch";
import { mouseIsDragged, corner, x1, y1, x2, y2 } from "../sketch";
import Item from "../Item/item";

export default function handleMouseDragged() {
    if(mouseIsDragged){
        let mouseXR = p.mouseX * zoomR;
        let mouseYR = p.mouseY* zoomR;
        if(clickEvent == 'Rotate'){
            p.angleMode(p.DEGREES);
            panel.setValue('angle', activeItem.angle + p.atan2(mouseYR - activeItem.y, mouseXR - activeItem.x) - 
            p.atan2(diffPositionY - activeItem.y, diffPositionX - activeItem.x));
        }
        else if(clickEvent == 'Resize') {
            let dragX = diffPositionX + activeItem.x - ((mouseXR - activeItem.x) * p.cos(activeItem.angle) 
                        + (mouseYR - activeItem.y) * p.sin(activeItem.angle) + activeItem.x);
            let dragY = diffPositionY + activeItem.y - ((mouseYR - activeItem.y) * p.cos(activeItem.angle) 
                        - (mouseXR - activeItem.x) * p.sin(activeItem.angle) + activeItem.y);
            if((corner == 'T' && activeItem.h + dragY > 0 || corner == 'B'  && activeItem.h - dragY > 0) 
                && activeItem.name.startsWith('Rectangle')){
                panel.setValue('y',Number(activeItem.y - dragY / 2 * p.cos(activeItem.angle)).toFixed(2));
                panel.setValue('x',Number(activeItem.x + dragY / 2 * p.sin(activeItem.angle)).toFixed(2));
                if(corner == 'T'){
                panel.setValue('h',Number(activeItem.h + dragY).toFixed(2));
                tmpItem.sheight = activeItem.sheight + dragY;
                }
                else if(corner == 'B'){
                panel.setValue('h',Number(activeItem.h - dragY).toFixed(2));
                tmpItem.sheight = activeItem.sheight - dragY;
                }
            }
            else if(corner == 'L' && activeItem.w + dragX > 0 || corner == 'R' && activeItem.w - dragX > 0
                || (corner == 'L' || corner == 'R') && activeItem.name.startsWith('Line')){
                panel.setValue('y',Number(activeItem.y - dragX / 2 * p.sin(activeItem.angle)).toFixed(2));
                panel.setValue('x',Number(activeItem.x - dragX / 2 * p.cos(activeItem.angle)).toFixed(2));
                if(corner == 'L'){
                    if(activeItem.name.startsWith('Rectangle')){
                        panel.setValue('w',Number(activeItem.w + dragX).toFixed(2));
                        tmpItem.swidth = activeItem.swidth + dragX;
                    }
                    else if(activeItem.name.startsWith('Line')){
                        panel.setValue('l',Number(activeItem.l + dragX).toFixed(2));
                        tmpItem.swidth = activeItem.swidth + dragX;
                    }
                }
                else{
                    if(activeItem.name.startsWith('Rectangle')){
                        panel.setValue('w',Number(activeItem.w - dragX).toFixed(2));
                        tmpItem.swidth = activeItem.swidth - dragX;
                    }
                    else if(activeItem.name.startsWith('Line')){
                        panel.setValue('l',Number(activeItem.l - dragX).toFixed(2));
                        tmpItem.swidth = activeItem.swidth - dragX;
                    }
                }
            }
        }
        else if((clickEvent == 'Draw_Rect' || clickEvent == 'Draw_Line')) {
            x2 = p.mouseX * zoomR;
            y2 = p.mouseY* zoomR;
            if(clickEvent == 'Draw_Rect') {
                if(items.length && items[items.length - 1].name === 'Rectangle drawing') items.pop();
                Item.addItem(new Item([true, true, items.length, 'Rectangle drawing', x1+(x2-x1)/2, y1+(y2-y1)/2, p.abs (x2-x1), p.abs (y2-y1), undefined,
                0, 0, 0, 0, 0, '#000000', false, '#ffffff', false, undefined, undefined, undefined, undefined, undefined, p.abs (x2-x1),
                p.abs (y2-y1)]));
            }
            if(clickEvent == 'Draw_Line') {
                if(items.length && items[items.length - 1].name === 'Line drawing') items.pop();
                Item.addItem(new Item([true, true, items.length, 'Line drawing', x1+(x2-x1)/2, y1+(y2-y1)/2, 2, undefined,
                Number(p.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2))).toFixed(2), p.atan((y2-y1)/(x2-x1)), undefined, undefined, undefined,undefined, undefined,
                undefined, undefined, undefined, '#000000', undefined, undefined, undefined, undefined,
                p.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2)), 7]));
            }
            p.draw();
        }
        else if(diffPositionX && diffPositionY && clickEvent == 'Move') {
            p.cursor(p.MOVE);
            panel.setValue('x',Number(p.mouseX * zoomR - diffPositionX).toFixed(2));
            panel.setValue('y',Number(p.mouseY* zoomR - diffPositionY).toFixed(2));
        }
    }
}