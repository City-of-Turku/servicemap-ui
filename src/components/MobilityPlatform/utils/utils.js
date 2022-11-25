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

export {
  isDataValid,
  isObjValid,
  createIcon,
  whiteOptionsBase,
  blackOptionsBase,
  blueOptionsBase,
};
