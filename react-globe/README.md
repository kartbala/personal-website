# React Globe Integration

This folder demonstrates how to integrate the [`react-globe.gl`](https://github.com/vasturiano/react-globe.gl) library in a React application. The example renders a 3D globe with sample city labels and a subtle blue glow.

## Installation

Run the following commands in your React project directory:

```bash
npm install react-globe.gl three
# or using yarn
# yarn add react-globe.gl three
```

## Globe Component

`GlobeComponent.js` defines a React functional component that wraps the `Globe` component provided by `react-globe.gl`.

```javascript
import React from 'react';
import Globe from 'react-globe.gl';

// Sample label data (major cities)
const labels = [
  { lat: 51.5074, lng: -0.1278, text: 'London', color: 'lightblue', size: 0.7 },
  { lat: 40.7128, lng: -74.0060, text: 'New York', color: 'orange', size: 0.7 },
  { lat: 35.6895, lng: 139.6917, text: 'Tokyo', color: 'green', size: 0.7 }
];

const GlobeComponent = () => (
  <Globe
    globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
    backgroundColor="#000000"
    showAtmosphere
    atmosphereColor="#88c0ff"
    labelsData={labels}
    labelLat={d => d.lat}
    labelLng={d => d.lng}
    labelText={d => d.text}
    labelColor={d => d.color}
    labelSize={d => d.size}
    enableGlobeGlow
    globeGlowColor="#3366ff"
    globeGlowCoefficient={0.2}
    globeGlowPower={3}
    globeGlowRadiusScale={1.02}
  />
);

export default GlobeComponent;
```

### Key Props Explained

- **`globeImageUrl`**: Texture image for the globe surface.
- **`backgroundColor`**: Color of the surrounding space/background.
- **`showAtmosphere` / `atmosphereColor`**: Toggles and colors the faint atmospheric layer around the globe.
- **Label Props** (`labelsData`, `labelLat`, `labelLng`, `labelText`, `labelColor`, `labelSize`):
  - `labelsData` is an array of objects containing latitude, longitude, label text, color, and size.
  - `labelLat` and `labelLng` functions return the coordinates of each label.
  - `labelText` determines the text content.
  - `labelColor` sets the text color for each label.
  - `labelSize` controls how large the text appears on the globe.
- **Glow Props** (`enableGlobeGlow`, `globeGlowColor`, `globeGlowCoefficient`, `globeGlowPower`, `globeGlowRadiusScale`): control the subtle glow around the globe.

## Usage

Import and render `GlobeComponent` in your main app. For a typical `create-react-app` structure:

```javascript
// App.js
import React from 'react';
import GlobeComponent from './GlobeComponent';
import './styles.css';

const App = () => (
  <div className="App">
    <GlobeComponent />
  </div>
);

export default App;
```

Make sure your entry point (usually `index.js`) renders `<App />` inside an element with id `root`.

## CSS

Use the following CSS to allow the globe to fill the viewport without scrollbars:

```css
/* styles.css */
html, body, #root {
  margin: 0;
  height: 100%;
}

.App {
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #000;
}
```

This setup ensures the globe stays centered and fills the available space.
