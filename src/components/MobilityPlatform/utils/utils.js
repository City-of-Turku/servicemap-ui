const isDataValid = (visibilityValue, data) => visibilityValue && data && data.length > 0;

const createIcon = icon => ({
  iconUrl: icon,
  iconSize: [45, 45],
});

export {
  isDataValid,
  createIcon,
};
