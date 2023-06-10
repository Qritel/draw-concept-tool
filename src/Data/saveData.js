import { itemList, btnSave } from "../app";


export default function saveData() {
    // Convert the drawing itemList to a JSON string
    let itemsString = JSON.stringify(itemList);

    // Save the itemList to local storage
    localStorage.setItem('savedItems', itemsString);

    // Disable
    btnSave.attribute('disabled', '');
}