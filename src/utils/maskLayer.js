import L from 'leaflet';

export const createMaskLayer = (map, geojsonData) => {
  console.log("creating mask");
  
  // Create a mask layer covering the entire world
  const worldBounds = L.latLngBounds([[-90, -180], [90, 180]]);
  const maskLayer = L.polygon([worldBounds], {
    fillColor: 'black',
    fillOpacity: 0.5,
    weight: 0,
  });

  // Create a layer for Sweden using the GeoJSON data
  const swedenLayer = L.geoJSON(geojsonData, {
    fillColor: 'transparent',
    weight: 0,
  });

  // Use Leaflet's `layerGroup` to combine the mask and Sweden layers
  const maskGroup = L.layerGroup([maskLayer, swedenLayer]).addTo(map);
  console.log('Mask Layer:', maskLayer);
  console.log('Sweden Layer:', swedenLayer);
  return maskGroup;
};