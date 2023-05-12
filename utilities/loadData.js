import Item from "../Item/item";
import { activeItem, clickEvent } from "../sketch";

export default function loadData() {
    // Retrieve the saved items from local storage
    let savedItemsString = localStorage.getItem('savedItems');

    // Check if there is any saved items
    if (savedItemsString) {
        // Convert the JSON string back to an object
        let savedItems = JSON.parse(savedItemsString);

        Item.loadItems(savedItems);
        activeItem = savedItems[savedItems.length-1];
        clickEvent = 'Move';
    }
}