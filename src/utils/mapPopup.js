export const getOpenPopups = map => {
  const popups = [];
  map.eachLayer(layer => {
    if (layer instanceof global.L.Popup) {
      popups.push(layer);
    }
  });
  return popups;
};

// eslint-disable-next-line no-underscore-dangle
export const getPopupSource = popup => popup._source || null;

export const getPopupSourceElement = popup => getPopupSource(popup)?.getElement?.() || null;

export const ensurePopupId = popup => {
  const element = popup.getElement();
  if (!element) {
    return null;
  }
  if (!element.id) {
    element.id = `map-popup-${global.L.stamp(popup)}`;
  }
  return element.id;
};

export const setOrRemoveAttributes = (element, attributes) => Object.entries(attributes)
  .forEach(([name, value]) => (value == null
    ? element.removeAttribute(name)
    : element.setAttribute(name, value)));

export const moveElementBefore = (parent, element, referenceElement) => {
  if ('moveBefore' in Element.prototype) {
    parent.moveBefore(element, referenceElement);
  } else {
    parent.insertBefore(element, referenceElement);
  }
};
