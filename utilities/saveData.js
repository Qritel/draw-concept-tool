import { items } from "../sketch";


export default function saveData() {
    // Convert the drawing data to a JSON string
    var dataString = JSON.stringify(items);

    // Save the data to local storage
    localStorage.setItem('savedData', dataString);
}