import React from 'react';
import { act } from '@testing-library/react';
import L from 'leaflet';
import { MAP_CENTER, openMarkerPopup, renderMap } from '../../../../../../jestMapUtils';
import PopupAfterMarker from '../PopupAfterMarker';

describe('<PopupAfterMarker />', () => {
  it('places the opened popup directly after its marker', async () => {
    const { map } = renderMap(<PopupAfterMarker />);
    await openMarkerPopup(map);
    const marker = await openMarkerPopup(map, { popupOptions: { autoClose: false } });

    expect(marker.getElement().nextElementSibling).toBe(marker.getPopup().getElement());
  });

  it('places the popup after its marker again when it is reopened', async () => {
    const { map } = renderMap(<PopupAfterMarker />);
    const marker = await openMarkerPopup(map);
    act(() => { marker.closePopup(); });

    act(() => { marker.openPopup(); });

    expect(marker.getElement().nextElementSibling).toBe(marker.getPopup().getElement());
  });

  it('places popups of markers that are not focusable too', async () => {
    const { map } = renderMap(<PopupAfterMarker />);

    const marker = await openMarkerPopup(map, { markerOptions: { keyboard: false } });

    expect(marker.getElement().nextElementSibling).toBe(marker.getPopup().getElement());
  });

  it('leaves a popup opened on the map in the popup pane', () => {
    const { map } = renderMap(<PopupAfterMarker />);
    const popup = L.popup().setLatLng(MAP_CENTER).setContent('Osoite');

    act(() => { popup.openOn(map); });

    expect(popup.getElement().parentElement).toBe(map.getPane('popupPane'));
  });
});
