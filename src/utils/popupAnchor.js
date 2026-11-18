const GAP_BETWEEN_POPUP_TIP_AND_ICON = 6;

const withPopupAboveIcon = iconOptions => {
  const { iconSize, iconAnchor } = iconOptions;
  const leafletDefaultIconAnchor = iconSize.map(size => Math.round(size / 2));
  const [, iconAnchorY] = iconAnchor ?? leafletDefaultIconAnchor;
  return { ...iconOptions, popupAnchor: [0, -(iconAnchorY + GAP_BETWEEN_POPUP_TIP_AND_ICON)] };
};

export default withPopupAboveIcon;
