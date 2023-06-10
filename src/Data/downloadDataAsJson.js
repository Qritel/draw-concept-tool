import { mySketch as p, itemList } from "../app";

export default function downloadDataAsJson() {
    // Writes the contents of itemList to DrawData.json file.
    p.saveJSON(itemList, 'DrawData.json');
}