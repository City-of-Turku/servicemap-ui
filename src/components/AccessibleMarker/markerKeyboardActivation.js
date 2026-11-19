const isActivatableMarkerElement = element => element?.getAttribute('role') === 'button'
  && element.classList.contains('leaflet-interactive');

const bindMarkerKeyboardActivation = marker => {
  let isSpaceDown = false;
  const activate = originalEvent => marker.fire('click', { originalEvent, latlng: marker.getLatLng() });

  const onKeyDown = ({ originalEvent }) => {
    if (!isActivatableMarkerElement(marker.getElement())) {
      return;
    }
    if (originalEvent.key === 'Enter') {
      originalEvent.preventDefault();
      activate(originalEvent);
    } else if (originalEvent.key === ' ') {
      originalEvent.preventDefault();
      isSpaceDown = true;
    }
  };
  const onKeyUp = ({ originalEvent }) => {
    if (originalEvent.key !== ' ') {
      return;
    }
    const wasSpaceDownOnMarker = isSpaceDown;
    isSpaceDown = false;
    if (wasSpaceDownOnMarker) {
      originalEvent.preventDefault();
      activate(originalEvent);
    }
  };

  const handlers = { keydown: onKeyDown, keyup: onKeyUp };
  marker.on(handlers);
  return () => marker.off(handlers);
};

export default bindMarkerKeyboardActivation;
