import { act } from '@testing-library/react';
import L from 'leaflet';
import { MAP_CENTER, renderMap } from '../../../../jestMapUtils';
import { bindMarkerPopupState } from '../useMarkerPopupState';

const createMarkerWithPopup = markerOptions => {
  const marker = L.marker(MAP_CENTER, markerOptions).bindPopup('<h3>Kirjasto</h3>');
  bindMarkerPopupState(marker);
  return marker;
};

describe('bindMarkerPopupState', () => {
  it('applies the popup state when the marker is added to the map later', () => {
    const { map } = renderMap();
    const marker = createMarkerWithPopup();

    act(() => { marker.addTo(map); });

    expect(marker.getElement()).toHaveAttribute('aria-expanded', 'false');
  });

  it('follows the popup opening and closing', () => {
    const { map } = renderMap();
    const marker = createMarkerWithPopup().addTo(map);

    act(() => { marker.openPopup(); });
    expect(marker.getElement()).toHaveAttribute('aria-expanded', 'true');
    expect(marker.getElement()).toHaveAttribute('aria-controls', marker.getPopup().getElement().id);

    act(() => { marker.closePopup(); });
    expect(marker.getElement()).toHaveAttribute('aria-expanded', 'false');
    expect(marker.getElement()).not.toHaveAttribute('aria-controls');
  });

  it('leaves markers that are not focusable without popup state', () => {
    const { map } = renderMap();

    const marker = createMarkerWithPopup({ keyboard: false }).addTo(map);

    expect(marker.getElement()).not.toHaveAttribute('aria-expanded');
  });
});
