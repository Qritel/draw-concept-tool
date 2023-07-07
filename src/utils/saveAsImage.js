import { mySketch as p, canv, SavingImage } from "../app";

export default function saveAsImage() {
    SavingImage = true;
    p.redraw();
    p.save(canv, 'Drawing.jpeg');
    SavingImage = false;
    p.redraw();
}