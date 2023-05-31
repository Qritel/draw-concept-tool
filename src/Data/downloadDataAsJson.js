import { mySketch as p ,items } from "../app";

export default function downloadDataAsJson() {
    // Writes the contents of items to DrawData.json file.
    p.saveJSON(items, 'DrawData.json');
}