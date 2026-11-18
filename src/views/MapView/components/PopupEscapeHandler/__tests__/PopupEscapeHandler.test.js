import React from 'react';
import { openMarkerPopup, getPopupLink, renderMap } from '../../../../../../jestMapUtils';
import PopupEscapeHandler from '../PopupEscapeHandler';
import PopupFocusReturn from '../../PopupFocusReturn';

const pressEscape = () => {
  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
};
const stayOpen = { popupOptions: { autoClose: false } };

describe('<PopupEscapeHandler />', () => {
  it('closes the popup with Esc when focus is on the marker', async () => {
    const { map } = renderMap(<PopupEscapeHandler />);
    const marker = await openMarkerPopup(map);
    marker.getElement().focus();

    pressEscape();

    expect(marker.isPopupOpen()).toBe(false);
  });

  it('closes several open popups one at a time, newest first', async () => {
    const { map } = renderMap(<PopupEscapeHandler />);
    const first = await openMarkerPopup(map, stayOpen);
    const second = await openMarkerPopup(map, stayOpen);
    map.getContainer().focus();

    pressEscape();
    expect(second.isPopupOpen()).toBe(false);
    expect(first.isPopupOpen()).toBe(true);

    pressEscape();
    expect(first.isPopupOpen()).toBe(false);
  });

  it('closes the popup that contains focus rather than the newest one', async () => {
    const { map } = renderMap(<PopupEscapeHandler />);
    const first = await openMarkerPopup(map, stayOpen);
    const second = await openMarkerPopup(map, stayOpen);
    getPopupLink(first).focus();

    pressEscape();

    expect(first.isPopupOpen()).toBe(false);
    expect(second.isPopupOpen()).toBe(true);
  });

  it('closes a popup that was opened before the handler mounted', async () => {
    const { map, rerenderMap } = renderMap();
    const marker = await openMarkerPopup(map);
    rerenderMap(<PopupEscapeHandler />);
    marker.getElement().focus();

    pressEscape();

    expect(marker.isPopupOpen()).toBe(false);
  });

  it('keeps popups that opt out with closeOnEscapeKey: false', async () => {
    const { map } = renderMap(<PopupEscapeHandler />);
    const marker = await openMarkerPopup(map, { popupOptions: { closeOnEscapeKey: false } });
    marker.getElement().focus();

    pressEscape();

    expect(marker.isPopupOpen()).toBe(true);
  });

  it('does not close the popup when focus is outside the map', async () => {
    const { map, getByTestId } = renderMap(<PopupEscapeHandler />);
    const marker = await openMarkerPopup(map);
    getByTestId('outside-map').focus();

    pressEscape();
    expect(marker.isPopupOpen()).toBe(true);

    document.activeElement.blur();
    pressEscape();
    expect(marker.isPopupOpen()).toBe(true);
  });

  it('returns focus to the marker together with PopupFocusReturn', async () => {
    const { map } = renderMap(
      <>
        <PopupEscapeHandler />
        <PopupFocusReturn />
      </>,
    );
    const marker = await openMarkerPopup(map);
    getPopupLink(marker).focus();

    pressEscape();

    expect(marker.isPopupOpen()).toBe(false);
    expect(document.activeElement).toBe(marker.getElement());
  });
});
