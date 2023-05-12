import Item from "../Item/item";
import { mySketch as p ,activeItem, clickEvent } from "../sketch";
import refresh from "./refresh";

export default function handleJsonFile(file) {
    
    let uploadedItemsString = JSON.stringify(file.data);

    if (uploadedItemsString) {
        // Convert the JSON string back to an object
        let uploadedItems = JSON.parse(uploadedItemsString);

        Item.loadItems(uploadedItems);
        activeItem = uploadedItems[uploadedItems.length-1];
        clickEvent = 'Move';
        refresh();
    }
}