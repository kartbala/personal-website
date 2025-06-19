import React from 'react';
import Globe from 'react-globe.gl';

// Sample label data for major cities
const labels = [
  {
    lat: 51.5074, // London latitude
    lng: -0.1278, // London longitude
    text: 'London',
    color: 'lightblue',
    size: 0.7
  },
  {
    lat: 40.7128, // New York latitude
    lng: -74.0060, // New York longitude
    text: 'New York',
    color: 'orange',
    size: 0.7
  },
  {
    lat: 35.6895, // Tokyo latitude
    lng: 139.6917, // Tokyo longitude
    text: 'Tokyo',
    color: 'green',
    size: 0.7
  }
];

const favoriteCountries = [
  'Japan',
  'Netherlands',
  'Singapore',
  'Chile',
  'Australia',
  'Tanzania'
];

const GlobeComponent = () => {
  const [countries, setCountries] = React.useState({ features: [] });

  React.useEffect(() => {
    fetch('./world.geojson')
      .then(res => res.json())
      .then(setCountries);
  }, []);

  return (
    <Globe
      globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg" // Earth texture
      backgroundColor="#000000" // Space background
      showAtmosphere // Enable atmosphere around the globe
      atmosphereColor="#88c0ff" // Light blue atmosphere
      labelsData={labels} // Array of label objects
      labelLat={d => d.lat} // Latitude accessor
      labelLng={d => d.lng} // Longitude accessor
      labelText={d => d.text} // Text accessor
      labelColor={d => d.color} // Text color accessor
      labelSize={d => d.size} // Label size
      polygonsData={countries.features}
      polygonAltitude={d =>
        favoriteCountries.includes(d.properties.name) ? 0.06 : 0.01
      }
      polygonCapColor={d =>
        favoriteCountries.includes(d.properties.name)
          ? 'rgba(0, 200, 255, 0.7)'
          : 'rgba(255, 255, 255, 0.07)'
      }
      polygonSideColor={d =>
        favoriteCountries.includes(d.properties.name)
          ? 'rgba(0, 150, 200, 0.6)'
          : 'rgba(0, 0, 0, 0.05)'
      }
      polygonStrokeColor={d =>
        favoriteCountries.includes(d.properties.name) ? '#ffffff' : '#111'
      }
      polygonsTransitionDuration={300}
      enableGlobeGlow // Turn on glow effect around the globe
      globeGlowColor="#3366ff" // Glow color
      globeGlowCoefficient={0.2} // Strength of glow
      globeGlowPower={3} // Spread of glow
      globeGlowRadiusScale={1.02} // Radius of glow relative to globe size
      autoRotate
      autoRotateSpeed={0.3}
    />
  );
};

export default GlobeComponent;
