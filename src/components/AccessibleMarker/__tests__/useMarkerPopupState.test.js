import React from 'react';
import { act } from '@testing-library/react';
import L from 'leaflet';
import * as rL from 'react-leaflet';
import AccessibleMarker from '../AccessibleMarker';
import { getRenderWithProviders } from '../../../../jestUtils';

global.L = L;
global.rL = rL;

const CENTER = [60.45, 22.26];
const renderWithProviders = getRenderWithProviders({ user: { locale: 'fi' } });

const mapWithMarker = ({ withPopup = true, keyboard = true } = {}) => (
  <rL.MapContainer center={CENTER} zoom={12}>
    <AccessibleMarker typeId="unit.entrances.main" name="Kirjasto" position={CENTER} keyboard={keyboard}>
      {withPopup ? <rL.Popup><h3>Kirjasto</h3></rL.Popup> : null}
    </AccessibleMarker>
  </rL.MapContainer>
);

const getMarkerElement = container => container.querySelector('.leaflet-marker-icon');
const getPopupElement = container => container.querySelector('.leaflet-popup');

describe('useMarkerPopupState', () => {
  it('marks a closed popup with aria-expanded="false" and no aria-controls', () => {
    const { container } = renderWithProviders(mapWithMarker());
    const marker = getMarkerElement(container);

    expect(marker).toHaveAttribute('role', 'button');
    expect(marker).toHaveAttribute('aria-expanded', 'false');
    expect(marker).not.toHaveAttribute('aria-controls');
  });

  it('sets aria-expanded="true" and aria-controls to the popup id while it is open', () => {
    const { container } = renderWithProviders(mapWithMarker());
    const marker = getMarkerElement(container);

    act(() => { marker.click(); });

    const popup = getPopupElement(container);
    expect(marker).toHaveAttribute('aria-expanded', 'true');
    expect(popup.id).toMatch(/^map-popup-\d+$/);
    expect(marker).toHaveAttribute('aria-controls', popup.id);
  });

  it('resets the state when the popup closes', () => {
    const { container } = renderWithProviders(mapWithMarker());
    const marker = getMarkerElement(container);
    act(() => { marker.click(); });

    act(() => { getPopupElement(container).querySelector('.leaflet-popup-close-button').click(); });

    expect(marker).toHaveAttribute('aria-expanded', 'false');
    expect(marker).not.toHaveAttribute('aria-controls');
  });

  it('keeps the same popup id when the popup is opened again', () => {
    const { container } = renderWithProviders(mapWithMarker());
    const marker = getMarkerElement(container);
    act(() => { marker.click(); });
    const firstId = getPopupElement(container).id;
    act(() => { getPopupElement(container).querySelector('.leaflet-popup-close-button').click(); });

    act(() => { marker.click(); });

    expect(marker).toHaveAttribute('aria-controls', firstId);
  });

  it('sets the state when the popup is added after the marker', () => {
    const { container, rerender } = renderWithProviders(mapWithMarker({ withPopup: false }));
    expect(getMarkerElement(container)).not.toHaveAttribute('aria-expanded');

    rerender(mapWithMarker());

    expect(getMarkerElement(container)).toHaveAttribute('aria-expanded', 'false');
  });

  it('does not add popup state to markers that are not buttons', () => {
    const { container } = renderWithProviders(mapWithMarker({ keyboard: false }));
    const marker = getMarkerElement(container);

    expect(marker).not.toHaveAttribute('aria-expanded');
    expect(marker).not.toHaveAttribute('aria-controls');
  });
});
