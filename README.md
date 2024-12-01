# DOMphonic
Turn your DOM into a symphony of sound! 🎵
DOMphonic is a fun and creative Chrome extension that analyzes the structure of a webpage (DOM) and transforms it into a unique retro-inspired musical experience. Whether you're a developer or just love music, DOMphonic brings code to life in the form of melodies, rhythms, and beats.

## Features

- 🎹 DOM-Based Music: Convert the structure of any webpage into harmonious tunes.
- 🎮 Retro Aesthetic: Enjoy a classic Tetris or Mario-style soundscape.
- 🎵 Customizable Sounds: Includes piano, bass, and drums with real-time waveform visualization.
- 🌈 Interactive Visualization: Displays the music as a dynamic waveform in the extension popup.
- 🚀 Lightweight and Fast: Runs efficiently without affecting browser performance.

## Installation

### From Source

1. Clone the repository:
```bash
git clone https://github.com/elshadaghazade/domphonic.git
cd domphonic
```

2. Install dependencies:
```bash
npm install
```

3. Build the project:
```bash
npm run build
```

4. Load the extension:
- Open Chrome and go to chrome://extensions/.
- Enable Developer Mode.
- Click Load unpacked and select the dist folder in the project directory.

### From Chrome Web Store
Once published on the Chrome Web Store:
- Install DOMphonic directly from [Google Chrome Web Store](https://google.com)

## Usage
1. Open any webpage you want to transform into music.
2. Click on the DOMphonic extension icon in the browser toolbar.
3. Press the **Play** button to start the symphony.
4. Watch the live waveform visualization in the popup.
5. Press **Pause** to stop the music.

## Development Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

## Technologies Used
- [Tone.js](https://tonejs.github.io/): For synthesizing and playing music.
- [Chrome](https://developer.chrome.com/docs/extensions/reference/api) Extensions API: For browser extension functionality.
- [Webpack](https://webpack.js.org/): For bundling and compiling the code.
- [TypeScript](https://www.typescriptlang.org/): Ensures type safety and better developer experience.

## Folder Structure

```bash
domphonic/
├── src/
│   ├── content.ts          # Core logic for DOM traversal and music generation
│   ├── popup.ts            # Popup UI and waveform visualization
│   ├── background.ts       # Handles communication between popup and content scripts
│   ├── styles/             # CSS styles for the popup
├── dist/                   # Compiled and production-ready files
├── icons/                  # Extension icons
├── manifest.json           # Chrome extension configuration
├── webpack.config.js       # Webpack configuration
└── README.md               # Project documentation
```

## Contributing
Contributions are welcome! 🎉
If you'd like to contribute:

1. Fork the repository.
2. Create a new branch:
```bash
git checkout -b feature-name
```
3. Commit your changes:
```bash
git commit -m "Add feature name"
```
4. Push to the branch:
```bash
git push origin feature-name
```
5. Open a pull request.

## License
This project is licensed under the [MIT License](LICENSE).

## Acknowledgments
- Inspired by retro gaming soundtracks and creative coding projects.
- Thanks to the open-source community for tools like Tone.js and Webpack.