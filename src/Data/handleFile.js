import Item from "../Item/item";
import { activeItem, itemList, clickEvent, undoManager, id, uploadedImage, imageMap, canvasHeight, canvasWidth, mySketch as p } from "../app";
import refresh from "../utils/refresh";
import UndoManager from 'undo-manager';
import buttonPressed from "../interactions/buttonPressed";

export default function handleFile(file) {
    if (file.type === 'image') {
        let reader = new FileReader();
        // Define a callback function to be executed when reading is complete
        reader.onloadend = function () {
            uploadedImage = new Image();

            uploadedImage.onload = function () {
                uploadedImage.width;
                uploadedImage.height;
            };
            uploadedImage.src = reader.result;
        }

        // Read the content of the selected file and trigger the callback
        reader.readAsDataURL(file.file);

        let loadImagePromise = new Promise(resolve => {
            p.loadImage(file.data, img => {
                imageMap[uploadedImage.src] = img;
                resolve();
            });
        });
        loadImagePromise.then(() => {
            const MAX_RATIO = Math.max(uploadedImage.width / canvasWidth, uploadedImage.height / canvasHeight);

            let imgWidth, imgHeight;

            if (MAX_RATIO > 1 && uploadedImage.width > canvasWidth) {
                imgWidth = canvasWidth;
                imgHeight = uploadedImage.height * (canvasWidth / uploadedImage.width);
            } else if (MAX_RATIO > 1 && uploadedImage.height > canvasHeight) {
                imgWidth = uploadedImage.width * (canvasHeight / uploadedImage.height);
                imgHeight = canvasHeight;
            } else {
                imgWidth = uploadedImage.width;
                imgHeight = uploadedImage.height;
            }

            Item.addItem(new Item([true, true, itemList.length, 'Img ' + id, canvasWidth / 2, canvasHeight / 2,
                imgWidth, imgHeight, undefined, undefined, 0, undefined, undefined, undefined, undefined,
                undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined,
                undefined, imgWidth, imgHeight, undefined, uploadedImage.src]));
            buttonPressed('Select');
            refresh();
        });
    }
    else if (clickEvent == 'Img') {
        buttonPressed('Select');
    }
    else if (file.file.type === 'application/json' && clickEvent != 'Img') {
        let uploadedItemsString = JSON.stringify(file.data);

        if (uploadedItemsString) {
            // Convert the JSON string back to an object
            let uploadedItems = JSON.parse(uploadedItemsString);

            Item.loadItems(uploadedItems);
            uploadedItems.forEach(UItem => UItem.selected = false);

            // Create an array to store the loadImage promises
            let loadImagePromises = [];
            uploadedItems.forEach(UItem => {
                if (UItem.name.startsWith('Img')) {
                    let loadImagePromise = new Promise(resolve => {
                        p.loadImage(UItem.img64, img => {
                            imageMap[UItem.img64] = img;
                            resolve(); // Resolve the promise after the image is loaded
                        });
                    });
                    loadImagePromises.push(loadImagePromise);
                }
            });
            // Wait for all loadImage promises to resolve
            Promise.all(loadImagePromises).then(() => {
                activeItem = uploadedItems[uploadedItems.length - 1];
                clickEvent = 'Select';
                undoManager = new UndoManager();
                refresh();
            });
        }
    }
}