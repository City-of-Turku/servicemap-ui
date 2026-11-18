import React from 'react';
import { act, render } from '@testing-library/react';
import L from 'leaflet';
import { MapContainer } from 'react-leaflet';

global.L = L;
L.Marker.mergeOptions({ alt: '' });

export const MAP_CENTER = [60.45, 22.26];

export const renderMap = (mapChildren = null) => {
  let map;
  const ui = children => (
    <>
      <MapContainer center={MAP_CENTER} zoom={12} whenCreated={created => { map = created; }}>
        {children}
      </MapContainer>
      <input data-testid="outside-map" />
    </>
  );
  const result = render(ui(mapChildren));
  return { ...result, map, rerenderMap: children => result.rerender(ui(children)) };
};

export const openMarkerPopup = async (map, {
  content = '<a href="#">Link</a>', markerOptions = {}, popupOptions = {},
} = {}) => {
  const marker = L.marker(MAP_CENTER, markerOptions).bindPopup(content, popupOptions).addTo(map);
  await act(async () => { marker.openPopup(); });
  return marker;
};

export const getPopupLink = marker => marker.getPopup().getElement().querySelector('.leaflet-popup-content a');
