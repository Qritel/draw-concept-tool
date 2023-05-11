import Item from "../Item/item";
import { activeItem, clickEvent } from "../sketch";

export default function loadData() {
    // Retrieve the saved data from local storage
    var savedDataString = localStorage.getItem('savedData');

    // Check if there is any saved data
    if (savedDataString) {
        // Convert the JSON string back to an object
        var savedData = JSON.parse(savedDataString);

        Item.loadItems(savedData);
        activeItem = savedData[savedData.length-1];
        clickEvent = 'Move';
    }
}