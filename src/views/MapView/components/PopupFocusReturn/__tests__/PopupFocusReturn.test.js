import React from 'react';
import { act, fireEvent } from '@testing-library/react';
import { openMarkerPopup, getPopupLink, renderMap } from '../../../../../../jestMapUtils';
import PopupFocusReturn from '../PopupFocusReturn';

const closePopup = map => act(() => { map.closePopup(); });

describe('<PopupFocusReturn />', () => {
  it('returns focus to the marker when the popup closes with focus inside it', async () => {
    const { map } = renderMap(<PopupFocusReturn />);
    const marker = await openMarkerPopup(map);
    getPopupLink(marker).focus();

    closePopup(map);

    expect(document.activeElement).toBe(marker.getElement());
  });

  it('returns focus to the marker when the popup is closed with its close button', async () => {
    const { map } = renderMap(<PopupFocusReturn />);
    const marker = await openMarkerPopup(map);
    const closeButton = marker.getPopup().getElement().querySelector('.leaflet-popup-close-button');
    closeButton.focus();

    act(() => { closeButton.click(); });

    expect(marker.isPopupOpen()).toBe(false);
    expect(document.activeElement).toBe(marker.getElement());
  });

  it('moves focus to the map when the marker is not focusable', async () => {
    const { map } = renderMap(<PopupFocusReturn />);
    const marker = await openMarkerPopup(map, { markerOptions: { keyboard: false } });
    getPopupLink(marker).focus();

    closePopup(map);

    expect(document.activeElement).toBe(map.getContainer());
  });

  it('leaves focus alone when it is not in the popup', async () => {
    const { map, getByTestId } = renderMap(<PopupFocusReturn />);
    await openMarkerPopup(map);
    const outside = getByTestId('outside-map');
    outside.focus();

    closePopup(map);

    expect(document.activeElement).toBe(outside);
  });

  it('leaves focus alone when it moved out of the popup before it closed', async () => {
    const { map, getByTestId } = renderMap(<PopupFocusReturn />);
    const marker = await openMarkerPopup(map);
    getPopupLink(marker).focus();
    const outside = getByTestId('outside-map');
    outside.focus();

    closePopup(map);

    expect(document.activeElement).toBe(outside);
  });

  it('does not scroll the map container when it moves focus', async () => {
    const { map } = renderMap(<PopupFocusReturn />);
    const marker = await openMarkerPopup(map);
    const focus = jest.spyOn(marker.getElement(), 'focus');
    getPopupLink(marker).focus();

    closePopup(map);

    expect(focus).toHaveBeenCalledWith({ preventScroll: true });
  });

  it('returns focus when it entered the popup before the component mounted', async () => {
    const { map, rerenderMap } = renderMap();
    const marker = await openMarkerPopup(map);
    getPopupLink(marker).focus();
    rerenderMap(<PopupFocusReturn />);

    closePopup(map);

    expect(document.activeElement).toBe(marker.getElement());
  });

  it('forgets the popup when the user clicks non-focusable content outside it', async () => {
    const { map } = renderMap(<PopupFocusReturn />);
    const marker = await openMarkerPopup(map);
    getPopupLink(marker).focus();
    fireEvent.pointerDown(document.body);
    document.activeElement.blur();

    closePopup(map);

    expect(document.activeElement).toBe(document.body);
  });

  it('leaves focus alone when the marker is removed with its popup', async () => {
    const { map } = renderMap(<PopupFocusReturn />);
    const marker = await openMarkerPopup(map);
    getPopupLink(marker).focus();

    act(() => { marker.remove(); });

    expect(marker.isPopupOpen()).toBe(false);
    expect(document.activeElement).not.toBe(map.getContainer());
  });
});
