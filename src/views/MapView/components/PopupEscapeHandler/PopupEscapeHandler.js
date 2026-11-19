import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import {
  getOpenPopups,
  getPopupSourceElement,
} from '../../../../utils/mapPopup';

const PopupEscapeHandler = () => {
  const map = useMap();

  useEffect(() => {
    const openOrder = new WeakMap();
    let openCount = 0;
    const recordOpenOrder = e => {
      openCount += 1;
      openOrder.set(e.popup, openCount);
    };

    const onKeyDown = e => {
      if (e.key !== 'Escape' || e.defaultPrevented) {
        return;
      }
      const { activeElement } = document;
      const isFocusInMap = map.getContainer().contains(activeElement);
      if (!isFocusInMap) {
        return;
      }

      const popups = getOpenPopups(map).filter(
        popup => popup.options.closeOnEscapeKey !== false,
      );
      if (!popups.length) {
        return;
      }

      const popupWithFocus = popups.find(popup => popup.getElement()?.contains(activeElement));
      const popupOfFocusedMarker = popups.find(
        popup => getPopupSourceElement(popup) === activeElement,
      );
      const byOpenOrder = (a, b) => (openOrder.get(a) || 0) - (openOrder.get(b) || 0);
      const newestPopup = popups.sort(byOpenOrder)[popups.length - 1];

      map.closePopup(popupWithFocus || popupOfFocusedMarker || newestPopup);
    };

    map.on('popupopen', recordOpenOrder);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      map.off('popupopen', recordOpenOrder);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [map]);

  return null;
};

export default PopupEscapeHandler;
