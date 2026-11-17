import React from 'react';
import { render, act } from '@testing-library/react';
import L from 'leaflet';
import { MapContainer } from 'react-leaflet';
import PopupEscapeHandler from '../PopupEscapeHandler';

global.L = L;

const CENTER = [60.45, 22.26];

const pressEscape = () => {
  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
};

const renderMap = (withHandler = true) => {
  let map;
  const result = render(
    <>
      <MapContainer center={CENTER} zoom={12} whenCreated={(created) => { map = created; }}>
        {withHandler ? <PopupEscapeHandler /> : null}
      </MapContainer>
      <input data-testid="outside" />
    </>,
  );
  return { ...result, map };
};

const addMarker = (map, markerOptions = {}, popupOptions = {}) => {
  const marker = L.marker(CENTER, markerOptions)
    .bindPopup('<a href="#">Link</a>', popupOptions)
    .addTo(map);
  act(() => { marker.openPopup(); });
  return marker;
};

const focusPopupLink = marker => marker.getPopup().getElement().querySelector('a').focus();

describe('<PopupEscapeHandler />', () => {
  it('closes the popup with Esc when focus is on the marker', () => {
    const { map } = renderMap();
    const marker = addMarker(map);
    marker.getElement().focus();

    pressEscape();

    expect(marker.isPopupOpen()).toBe(false);
  });

  it('returns focus to the marker when focus was inside the popup', () => {
    const { map } = renderMap();
    const marker = addMarker(map);
    focusPopupLink(marker);

    pressEscape();

    expect(marker.isPopupOpen()).toBe(false);
    expect(document.activeElement).toBe(marker.getElement());
  });

  it('moves focus to the map when the marker is not focusable', () => {
    const { map } = renderMap();
    const marker = addMarker(map, { keyboard: false });
    focusPopupLink(marker);

    pressEscape();

    expect(marker.isPopupOpen()).toBe(false);
    expect(document.activeElement).toBe(map.getContainer());
  });

  it('closes several open popups one at a time, newest first', () => {
    const { map } = renderMap();
    const first = addMarker(map, {}, { autoClose: false });
    const second = addMarker(map, {}, { autoClose: false });
    map.getContainer().focus();

    pressEscape();
    expect(second.isPopupOpen()).toBe(false);
    expect(first.isPopupOpen()).toBe(true);

    pressEscape();
    expect(first.isPopupOpen()).toBe(false);
  });

  it('closes the popup that contains focus rather than the newest one', () => {
    const { map } = renderMap();
    const first = addMarker(map, {}, { autoClose: false });
    const second = addMarker(map, {}, { autoClose: false });
    focusPopupLink(first);

    pressEscape();

    expect(first.isPopupOpen()).toBe(false);
    expect(second.isPopupOpen()).toBe(true);
  });

  it('closes a popup that was opened before the handler mounted', () => {
    const { map, rerender } = renderMap(false);
    const marker = addMarker(map);
    rerender(
      <MapContainer center={CENTER} zoom={12}>
        <PopupEscapeHandler />
      </MapContainer>,
    );
    marker.getElement().focus();

    pressEscape();

    expect(marker.isPopupOpen()).toBe(false);
  });

  it('keeps popups that opt out with closeOnEscapeKey: false', () => {
    const { map } = renderMap();
    const marker = addMarker(map, {}, { closeOnEscapeKey: false });
    marker.getElement().focus();

    pressEscape();

    expect(marker.isPopupOpen()).toBe(true);
  });

  it('does not close the popup when focus is outside the map', () => {
    const { map, getByTestId } = renderMap();
    const marker = addMarker(map);
    getByTestId('outside').focus();

    pressEscape();
    expect(marker.isPopupOpen()).toBe(true);

    document.activeElement.blur();
    pressEscape();
    expect(marker.isPopupOpen()).toBe(true);
  });
});
