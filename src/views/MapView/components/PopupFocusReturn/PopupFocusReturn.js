import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import { getPopupSource } from '../../../../utils/mapPopup';

const POPUP_SELECTOR = '.leaflet-popup';

const PopupFocusReturn = () => {
  const map = useMap();

  useEffect(() => {
    const mapContainer = map.getContainer();
    const getPopupElementContaining = element => (
      element instanceof Element && mapContainer.contains(element)
        ? element.closest(POPUP_SELECTOR)
        : null
    );
    let lastFocusedPopupElement = getPopupElementContaining(document.activeElement);

    const rememberFocusedPopup = e => {
      lastFocusedPopupElement = getPopupElementContaining(e.target);
    };
    const forgetPopupOnClickOutside = e => {
      if (!getPopupElementContaining(e.target)) {
        lastFocusedPopupElement = null;
      }
    };

    const returnFocusFromClosedPopup = e => {
      const popupElement = e.popup.getElement();
      if (!popupElement) {
        return;
      }
      const { activeElement } = document;
      const isFocusInPopup = popupElement.contains(activeElement);
      const wasFocusLostWithPopup = activeElement === document.body
        && popupElement === lastFocusedPopupElement;
      if (!isFocusInPopup && !wasFocusLostWithPopup) {
        return;
      }
      lastFocusedPopupElement = null;

      const marker = getPopupSource(e.popup);
      const markerElement = marker?.getElement?.();
      const wasMarkerRemoved = marker && !markerElement?.isConnected;
      if (wasMarkerRemoved) {
        return;
      }

      const isMarkerFocusable = markerElement?.hasAttribute('tabindex');
      (isMarkerFocusable ? markerElement : mapContainer).focus({ preventScroll: true });
    };

    document.addEventListener('focusin', rememberFocusedPopup);
    document.addEventListener('pointerdown', forgetPopupOnClickOutside);
    map.on('popupclose', returnFocusFromClosedPopup);
    return () => {
      document.removeEventListener('focusin', rememberFocusedPopup);
      document.removeEventListener('pointerdown', forgetPopupOnClickOutside);
      map.off('popupclose', returnFocusFromClosedPopup);
    };
  }, [map]);

  return null;
};

export default PopupFocusReturn;
