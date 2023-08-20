# Draw Concept Tool

[The Draw Concept Tool](https://qritel.github.io/draw-concept-tool/) is a minimalist web-based application for creating, editing, and exploring graphical concepts on a canvas. Powered by p5.js and Quicksettings libraries.

## Features

- **Canvas Interaction:** Draw, resize, rotate, and move various graphical elements (e.g., rectangle, ellipse, images, symbols, etc.) on the canvas.
- **User Interface:** Easy-to-use interface with essential buttons, panels, and toolbars that provide quick access to necessary functionalities and tools.
- **Copy-Paste:** Copy and paste elements using keyboard shortcuts (Ctrl + C, Ctrl + V).
- **Undo & Redo:** Maintain control over your edits with the undo and redo functionality to revert or reapply changes.
- **Keyboard Shortcuts:** Accelerate your workflow with customizable keyboard shortcuts for various actions, more details in 'Help' button.
- **Multiple Selection:** Select multiple elements by holding Ctrl and clicking, or by using the 'Select' tool to draw a rectangle around items.
- **Save & Load:** Save and load your creations, using JSON format + '✔️' save button to restore work even after refreshing the page using browser storage.
- **Layers:** Organize graphical elements into layers with convenient options for reordering.
- **Ruler and Grid:** Achieve precise positioning and alignment of graphical elements with built-in rulers and grid support.
- **Exporting:** Share your concept drawings by exporting them as image file or JSON data for use in various contexts.
- **Interactive Settings:** Adjust parameters and properties of graphical elements in real-time using the interactive Quicksettings library.

## Demo

Check out the live demo [here](https://qritel.github.io/draw-concept-tool/).

**Floor Plan Creation:**
![Floor Plan Demo GIF](/demos/floor_plan.gif)
- [Download JSON](/demos/floor_plan.json).

- **Image Annotation:**
![Image Annotation Demo GIF](/demos/image_annotation.gif)
- [Download JSON](/demos/image_annotation.json).

- **Concept Mapping:**
![Concept Map Demo GIF](/demos/concept_map.gif)
- [Download JSON](/demos/concept_map.json).

## Getting Started
1. Clone the repository.

2. install Nodejs & NPM

3. Run the development server :
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Contributions

Contributions to the Draw Concept Tool project are highly encouraged. If you encounter any issues or have ideas for enhancements, please feel free to open an issue or submit a pull request.

## License

The Draw Concept Tool is an open-source software released under the [MIT License](LICENSE).

## Acknowledgments

We extend our gratitude to :
- [p5.js](https://github.com/processing/p5.js) : JavaScript library for interactive graphics and animations.
- [quicksettings](https://github.com/bit101/quicksettings) : JavaScript library for making a quick settings panel to control code.
- [Undo Manager](https://github.com/ArthurClemens/Javascript-Undo-Manager) : Simple JavaScript library for undo and redo.

##

Embrace the simplicity and creative freedom of the Draw Concept Tool to bring your graphical concepts to life!
