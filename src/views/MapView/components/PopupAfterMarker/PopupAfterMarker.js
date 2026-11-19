import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import { getPopupSource, moveElementBefore } from '../../../../utils/mapPopup';

const placePopupAfterMarker = popup => {
  const marker = getPopupSource(popup);
  const markerElement = marker instanceof global.L.Marker ? marker.getElement() : null;
  const popupElement = popup.getElement();
  const isAlreadyAfterMarker = markerElement?.nextElementSibling === popupElement;
  if (!markerElement?.isConnected || !popupElement || isAlreadyAfterMarker) {
    return;
  }
  moveElementBefore(markerElement.parentNode, popupElement, markerElement.nextSibling);
};

const PopupAfterMarker = () => {
  const map = useMap();

  useEffect(() => {
    const placeOpenedPopup = e => placePopupAfterMarker(e.popup);
    map.on('popupopen', placeOpenedPopup);
    return () => map.off('popupopen', placeOpenedPopup);
  }, [map]);

  return null;
};

export default PopupAfterMarker;
