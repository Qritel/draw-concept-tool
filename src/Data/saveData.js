import { items } from "../app";


export default function saveData() {
    // Convert the drawing Items to a JSON string
    let itemsString = JSON.stringify(items);

    // Save the Items to local storage
    localStorage.setItem('savedItems', itemsString);
}