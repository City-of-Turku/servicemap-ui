import { useEffect } from 'react';
import { ensurePopupId, setOrRemoveAttributes } from '../../utils/mapPopup';
import { getIconKey } from './useMarkerLabel';

// Leaflet's events
const MARKER_ELEMENT_OR_POPUP_EVENTS = 'add popupopen popupclose';

const applyPopupState = (marker, isOpen) => {
  const element = marker.getElement();
  if (!element) {
    return;
  }
  const popup = marker.getPopup();
  const isExpandableButton = !!popup && element.getAttribute('role') === 'button';

  setOrRemoveAttributes(element, {
    'aria-expanded': isExpandableButton ? String(isOpen) : null,
    'aria-controls': isExpandableButton && isOpen ? ensurePopupId(popup) : null,
  });
};

export const bindMarkerPopupState = marker => {
  const sync = event => {
    const isClosing = event?.type === 'popupclose';
    applyPopupState(marker, !isClosing && marker.isPopupOpen());
  };
  sync();
  marker.on(MARKER_ELEMENT_OR_POPUP_EVENTS, sync);
  return () => marker.off(MARKER_ELEMENT_OR_POPUP_EVENTS, sync);
};

const useMarkerPopupState = (markerRef, icon, hasPopupContent) => {
  const iconKey = getIconKey(icon);

  useEffect(() => {
    const marker = markerRef.current;
    if (!marker) {
      return undefined;
    }
    return bindMarkerPopupState(marker);
  }, [markerRef, iconKey, hasPopupContent]);
};

export default useMarkerPopupState;
