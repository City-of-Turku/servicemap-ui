const isDataValid = (visibilityValue, data) => visibilityValue && data && data.length > 0;

const createIcon = icon => ({
  iconUrl: icon,
  iconSize: [45, 45],
});

const fitToMapBounds = (renderData, data, map) => {
  if (renderData) {
    const bounds = [];
    data.forEach((item) => {
      bounds.push([item.geometry_coords.lat, item.geometry_coords.lon]);
    });
    map.fitBounds(bounds);
  }
};

const fitPolygonsToBounds = (renderData, data, map) => {
  if (renderData) {
    const bounds = [];
    data.forEach((item) => {
      bounds.push(item.geometry_coords);
    });
    map.fitBounds(bounds);
  }
};

export {
  isDataValid, createIcon, fitToMapBounds, fitPolygonsToBounds,
};
