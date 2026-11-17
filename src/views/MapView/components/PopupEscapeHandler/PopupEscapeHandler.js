import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

// Leaflet has no public getter for the layer that opened a popup
// eslint-disable-next-line no-underscore-dangle
const getSourceElement = popup => popup._source?.getElement?.();

// Open popups are layers on the map. Reading them on keydown also finds popups that were
// opened before this component started listening, and handles several open popups
// (unit popups use autoClose: false).
const getClosablePopups = (map) => {
  const popups = [];
  map.eachLayer((layer) => {
    if (layer instanceof global.L.Popup && layer.options.closeOnEscapeKey !== false) {
      popups.push(layer);
    }
  });
  return popups;
};

// Leaflet closes popups with Esc only after the map container itself has been focused,
// so Esc does nothing while focus is on a marker or inside the popup. Handle Esc whenever
// focus is in the map, and keep focus in the map when the focused popup is removed.
const PopupEscapeHandler = () => {
  const map = useMap();

  useEffect(() => {
    const openedAt = new WeakMap();
    let openCount = 0;
    const onPopupOpen = (e) => {
      openCount += 1;
      openedAt.set(e.popup, openCount);
    };

    const onKeyDown = (e) => {
      if (e.key !== 'Escape' || e.defaultPrevented) return;
      const { activeElement } = document;
      const container = map.getContainer();
      // Leave Esc to other UI, e.g. the sidebar, when focus is outside the map
      if (!container.contains(activeElement)) return;

      const popups = getClosablePopups(map);
      if (!popups.length) return;

      // Close the popup the user is in or came from, otherwise the most recently opened one
      const popup = popups.find(item => item.getElement()?.contains(activeElement))
        || popups.find(item => getSourceElement(item) === activeElement)
        || popups.reduce((latest, item) => (
          (openedAt.get(item) || 0) >= (openedAt.get(latest) || 0) ? item : latest
        ));

      const focusWasInPopup = !!popup.getElement()?.contains(activeElement);
      const sourceElement = getSourceElement(popup);

      map.closePopup(popup);

      // The focused element was removed with the popup. Return focus to the marker, or to
      // the map when the marker is not focusable (e.g. unit markers use keyboard: false).
      if (focusWasInPopup) {
        (sourceElement?.hasAttribute('tabindex') ? sourceElement : container).focus();
      }
    };

    map.on('popupopen', onPopupOpen);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      map.off('popupopen', onPopupOpen);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [map]);

  return null;
};

export default PopupEscapeHandler;
