import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

const CLOSE_BUTTON_SELECTOR = '.leaflet-popup-close-button';

const isCloseButton = target => target instanceof Element && target.matches(CLOSE_BUTTON_SELECTOR);

const PopupCloseButton = ({ label }) => {
  const map = useMap();

  useEffect(() => {
    const labelCloseButtonsIn = element => {
      element
        ?.querySelectorAll(CLOSE_BUTTON_SELECTOR)
        .forEach(closeButton => {
          closeButton.setAttribute('aria-label', label);
        });
    };
    const labelOpenedPopup = e => labelCloseButtonsIn(e.popup.getElement());

    labelCloseButtonsIn(map.getContainer());
    map.on('popupopen', labelOpenedPopup);
    return () => map.off('popupopen', labelOpenedPopup);
  }, [map, label]);

  useEffect(() => {
    const container = map.getContainer();
    let closeButtonWithSpaceDown = null;

    const onKeyDown = e => {
      if (e.key !== ' ') {
        return;
      }
      closeButtonWithSpaceDown = isCloseButton(e.target) ? e.target : null;
      if (closeButtonWithSpaceDown) {
        e.preventDefault();
      }
    };
    const onKeyUp = e => {
      if (e.key !== ' ') {
        return;
      }
      const isSpaceReleasedOnSameButton = closeButtonWithSpaceDown === e.target;
      closeButtonWithSpaceDown = null;
      if (!isSpaceReleasedOnSameButton) {
        return;
      }
      e.preventDefault();
      e.target.click();
    };

    container.addEventListener('keydown', onKeyDown);
    container.addEventListener('keyup', onKeyUp);
    return () => {
      container.removeEventListener('keydown', onKeyDown);
      container.removeEventListener('keyup', onKeyUp);
    };
  }, [map]);

  return null;
};

PopupCloseButton.propTypes = {
  label: PropTypes.string.isRequired,
};

export default PopupCloseButton;
