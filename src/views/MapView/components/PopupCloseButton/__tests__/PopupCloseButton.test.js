import React from 'react';
import { act, fireEvent } from '@testing-library/react';
import { openMarkerPopup, getPopupLink, renderMap } from '../../../../../../jestMapUtils';
import PopupCloseButton from '../PopupCloseButton';

const setup = async () => {
  const { map } = renderMap(<PopupCloseButton label="Sulje" />);
  const marker = await openMarkerPopup(map);
  const closeButton = marker.getPopup().getElement().querySelector('.leaflet-popup-close-button');
  return { marker, closeButton, link: getPopupLink(marker) };
};

describe('<PopupCloseButton />', () => {
  it('replaces Leaflet\'s English label', async () => {
    const { closeButton } = await setup();

    expect(closeButton).toHaveAttribute('aria-label', 'Sulje');
  });

  it('moves the close button to the start of the popup', async () => {
    const { marker, closeButton } = await setup();

    expect(marker.getPopup().getElement().firstElementChild).toBe(closeButton);
  });

  it('closes the popup when Space is released on the close button', async () => {
    const { marker, closeButton } = await setup();

    const spaceScrollsPage = fireEvent.keyDown(closeButton, { key: ' ' });
    expect(spaceScrollsPage).toBe(false);
    expect(marker.isPopupOpen()).toBe(true);

    act(() => { fireEvent.keyUp(closeButton, { key: ' ' }); });

    expect(marker.isPopupOpen()).toBe(false);
  });

  it('does not handle Space on other elements in the popup', async () => {
    const { marker, link } = await setup();

    const spaceScrollsPage = fireEvent.keyDown(link, { key: ' ' });
    fireEvent.keyUp(link, { key: ' ' });

    expect(spaceScrollsPage).toBe(true);
    expect(marker.isPopupOpen()).toBe(true);
  });

  it('does not close the popup on other keys', async () => {
    const { marker, closeButton } = await setup();

    fireEvent.keyUp(closeButton, { key: 'a' });

    expect(marker.isPopupOpen()).toBe(true);
  });

  it('does not close the popup when Space was pressed down on another element', async () => {
    const { marker, closeButton, link } = await setup();

    fireEvent.keyDown(link, { key: ' ' });
    closeButton.focus();
    fireEvent.keyUp(closeButton, { key: ' ' });

    expect(marker.isPopupOpen()).toBe(true);
  });
});
