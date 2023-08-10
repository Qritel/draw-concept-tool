import Item from "../Item/item";
import { activeItem, id, clickEvent } from "../app";

export default function loadData() {
    // Retrieve the saved itemList from local storage
    let savedItemsString = localStorage.getItem('savedItems');

    // Check if there is any saved itemList
    if (savedItemsString) {
        // Convert the JSON string back to an object
        let savedItems = JSON.parse(savedItemsString);

        Item.loadItems(savedItems);
        savedItems.forEach(SItem => {
            SItem.selected = false;
            id = Math.max(id,SItem.name.split(' ')[1]);
        });
        id++;
        activeItem = savedItems[savedItems.length - 1];
        clickEvent = 'Select';
    }
}