import { act, fireEvent } from '@testing-library/react';
import L from 'leaflet';
import { MAP_CENTER, renderMap } from '../../../../jestMapUtils';
import bindMarkerKeyboardActivation from '../markerKeyboardActivation';

const addMarker = (map, markerOptions = {}) => {
  const onClick = jest.fn();
  const marker = L.marker(MAP_CENTER, markerOptions).on('click', onClick).addTo(map);
  bindMarkerKeyboardActivation(marker);
  return { marker, element: marker.getElement(), onClick };
};

describe('bindMarkerKeyboardActivation', () => {
  it('activates the marker on Enter and prevents Leaflet\'s own Enter handling', () => {
    const { map } = renderMap();
    const { element, onClick } = addMarker(map);

    const isEnterDefaultKept = fireEvent.keyDown(element, { key: 'Enter' });

    expect(isEnterDefaultKept).toBe(false);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('activates the marker when Space is released, without scrolling the page', () => {
    const { map } = renderMap();
    const { element, onClick } = addMarker(map);

    const spaceScrollsPage = fireEvent.keyDown(element, { key: ' ' });
    expect(spaceScrollsPage).toBe(false);
    expect(onClick).not.toHaveBeenCalled();

    fireEvent.keyUp(element, { key: ' ' });

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('does not activate when Space was pressed down on another marker', () => {
    const { map } = renderMap();
    const first = addMarker(map);
    const second = addMarker(map);

    fireEvent.keyDown(first.element, { key: ' ' });
    fireEvent.keyUp(second.element, { key: ' ' });

    expect(second.onClick).not.toHaveBeenCalled();
  });

  it('activates the marker after the map has been dragged with a pointer', () => {
    const { map } = renderMap();
    const { element, onClick } = addMarker(map);
    // eslint-disable-next-line no-underscore-dangle
    map.dragging._draggable._moved = true;

    fireEvent.keyDown(element, { key: 'Enter' });

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('opens the marker popup', () => {
    const { map } = renderMap();
    const { marker, element } = addMarker(map);
    marker.bindPopup('Kirjasto');

    act(() => { fireEvent.keyDown(element, { key: 'Enter' }); });

    expect(marker.isPopupOpen()).toBe(true);
  });

  it('ignores markers that are not focusable buttons', () => {
    const { map } = renderMap();
    const { element, onClick } = addMarker(map, { keyboard: false });

    fireEvent.keyDown(element, { key: 'Enter' });

    expect(onClick).not.toHaveBeenCalled();
  });

  it('ignores markers whose interaction is turned off', () => {
    const { map } = renderMap();
    const { element, onClick } = addMarker(map);
    element.classList.remove('leaflet-interactive');

    fireEvent.keyDown(element, { key: 'Enter' });

    expect(onClick).not.toHaveBeenCalled();
  });
});
