const isDataValid = (visibilityValue, data) => visibilityValue && data && data.length > 0;

const isObjValid = (visibilityValue, obj) => visibilityValue && obj && Object.entries(obj).length > 0;

const createIcon = icon => ({
  iconUrl: icon,
  iconSize: [45, 45],
});

export {
  isDataValid,
  isObjValid,
  createIcon,
};
