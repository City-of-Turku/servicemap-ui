// Space between the popup tip and the marker icon. Marker focus indicators extend 8px
// beyond the icon, and the Leaflet popup tip already ends a few pixels above the anchor
// point, so this keeps the tip clear of both the icon and its focus indicator.
const POPUP_TIP_GAP = 6;

/**
 * Returns a Leaflet popupAnchor that places the popup tip just above the marker icon
 * instead of on top of it.
 * @param {number[]} iconSize - [width, height] of the icon
 * @param {number[]} [iconAnchor] - Icon anchor, defaults to the icon center like in Leaflet
 * @returns {number[]} popupAnchor relative to the icon anchor
 */
const getPopupAnchor = (iconSize, iconAnchor) => {
  const anchorY = iconAnchor ? iconAnchor[1] : Math.round(iconSize[1] / 2);
  return [0, -(anchorY + POPUP_TIP_GAP)];
};

export default getPopupAnchor;
