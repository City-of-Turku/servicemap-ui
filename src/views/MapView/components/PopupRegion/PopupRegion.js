import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import {
  ensurePopupId,
  getOpenPopups,
  getPopupSourceElement,
  setOrRemoveAttributes,
} from '../../../../utils/mapPopup';

const POPUP_HEADING_SELECTOR = '.leaflet-popup-content :is(h1, h2, h3, h4, h5, h6)';

const getMarkerLabel = popup => {
  const markerElement = getPopupSourceElement(popup);
  return (
    markerElement?.getAttribute('aria-label')
    || markerElement?.getAttribute('alt')
    || null
  );
};

const labelPopupRegion = popup => {
  const element = popup.getElement();
  if (!element) {
    return;
  }
  const heading = element.querySelector(POPUP_HEADING_SELECTOR);
  if (heading && !heading.id) {
    heading.id = `${ensurePopupId(popup)}-title`;
  }
  const markerLabel = heading ? null : getMarkerLabel(popup);
  const hasName = !!heading || !!markerLabel;

  setOrRemoveAttributes(element, {
    role: hasName ? 'region' : null,
    'aria-labelledby': heading?.id ?? null,
    'aria-label': markerLabel,
  });
};

const PopupRegion = () => {
  const map = useMap();

  useEffect(() => {
    const labelOpenPopups = () => getOpenPopups(map).forEach(labelPopupRegion);
    labelOpenPopups();
    const markerAndPopupPanes = map.getPane('mapPane');
    const observer = new MutationObserver(labelOpenPopups);
    observer.observe(markerAndPopupPanes, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [map]);

  return null;
};

export default PopupRegion;
