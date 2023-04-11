/**
 * Returns boolean based on if visibilityValue is truthy and data is not null or empty.
 * @param {boolean} visibilityValue
 * @param {array} data
 * @returns {*|boolean}
 */
const isDataValid = (visibilityValue, data) => visibilityValue && data && data.length > 0;

/**
 * Returns boolean based on if visibilityValue is truthy and obj is not null and contains entries.
 * @param {boolean} visibilityValue
 * @param {object} obj
 * @returns {*|boolean}
 */
const isObjValid = (visibilityValue, obj) => visibilityValue && obj && Object.entries(obj).length > 0;

const createIcon = icon => ({
  iconUrl: icon,
  iconSize: [45, 45],
});

const whiteOptionsBase = (attrs = {}) => ({ color: 'rgba(255, 255, 255, 255)', ...attrs });
const blackOptionsBase = (attrs = {}) => ({ color: 'rgba(0, 0, 0, 255)', ...attrs });
const blueOptionsBase = (attrs = {}) => ({ color: 'rgba(7, 44, 115, 255)', ...attrs });
const redOptionsBase = (attrs = {}) => ({ color: 'rgba(251, 5, 21, 255)', ...attrs });

/**
 * Return arrays of coordinates that fit markers inside map bounds
 * @param {boolean} renderData
 * @param {Array} data
 * @param {object} map
 * @returns {*Array}
 */
const fitToMapBounds = (renderData, data, map) => {
  if (renderData) {
    const bounds = [];
    data.forEach((item) => {
      bounds.push([item.geometry_coords.lat, item.geometry_coords.lon]);
    });
    map.fitBounds(bounds);
  }
};

/**
 * Return arrays of coordinates that fit polygons inside map bounds
 * @param {boolean} renderData
 * @param {Array} data
 * @param {object} map
 * @returns {*Array}
 */
const fitPolygonsToBounds = (renderData, data, map) => {
  if (renderData) {
    const bounds = [];
    data.forEach((item) => {
      bounds.push(item.geometry_coords);
    });
    map.fitBounds(bounds);
  }
};

/** Set render boolean value based on embed status.
   * Embedder tool needs specific value to be in url to create embedded view with selected content.
   * Utilize default values when not in embedder tool and if in it, then check if url contains required value.
   * @param {boolean} paramValue
   * @param {boolean} embeded
   * @param {boolean} showData
   * @param {array} data
   * @param {function} isDataValid
   * @returns boolean value through function
   */
const setRender = (paramValue, embeded, showData, data, isDataValid) => {
  if (embeded) {
    return isDataValid(paramValue, data);
  }
  return isDataValid(showData, data);
};

/**
 * In embedder tool maptype is url parameter
 * useContrast selector always equals false in embedder tool
 * @param {*boolean} embeded
 * @param {*boolean} useContrast
 * @param {*string} url
 * @returns boolean
 */
const checkMapType = (embeded, useContrast, url) => {
  if (embeded && !useContrast) {
    return url.searchParams.get('map') === 'accessible_map';
  }
  return useContrast;
};

export {
  isDataValid,
  isObjValid,
  createIcon,
  whiteOptionsBase,
  blackOptionsBase,
  blueOptionsBase,
  redOptionsBase,
  fitToMapBounds,
  fitPolygonsToBounds,
  setRender,
  checkMapType,
};
