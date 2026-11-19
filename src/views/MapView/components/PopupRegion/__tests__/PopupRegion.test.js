import React, { useEffect, useState } from 'react';
import { act, waitFor } from '@testing-library/react';
import { Marker, Popup } from 'react-leaflet';
import { MAP_CENTER, openMarkerPopup, renderMap } from '../../../../../../jestMapUtils';
import PopupRegion from '../PopupRegion';

const openPopup = async (map, content, markerOptions) => {
  const marker = await openMarkerPopup(map, { content, markerOptions });
  return marker.getPopup().getElement();
};

describe('<PopupRegion />', () => {
  it('names the popup region by its heading', async () => {
    const { map } = renderMap(<PopupRegion />);

    const popup = await openPopup(map, '<h3>Kirjasto</h3><p>Avoinna</p>');

    const heading = popup.querySelector('h3');
    expect(popup).toHaveAttribute('role', 'region');
    expect(heading.id).toBe(`${popup.id}-title`);
    expect(popup).toHaveAttribute('aria-labelledby', heading.id);
    expect(popup).not.toHaveAttribute('aria-label');
  });

  it('keeps an existing heading id', async () => {
    const { map } = renderMap(<PopupRegion />);

    const popup = await openPopup(map, '<h3 id="own-id">Kirjasto</h3>');

    expect(popup).toHaveAttribute('aria-labelledby', 'own-id');
  });

  it('falls back to the marker label when the popup has no heading', async () => {
    const { map } = renderMap(<PopupRegion />);

    const popup = await openPopup(map, '<p>Avoinna</p>', { alt: 'Pääsisäänkäynti, Kirjasto' });

    expect(popup).toHaveAttribute('role', 'region');
    expect(popup).toHaveAttribute('aria-label', 'Pääsisäänkäynti, Kirjasto');
    expect(popup).not.toHaveAttribute('aria-labelledby');
  });

  it('leaves a popup without a heading or a marker label unmarked', async () => {
    const { map } = renderMap(<PopupRegion />);

    const popup = await openPopup(map, '<p>Avoinna</p>');

    expect(popup).not.toHaveAttribute('role');
    expect(popup).not.toHaveAttribute('aria-label');
  });

  it('labels a popup that was opened before it mounted', async () => {
    const { map, rerenderMap } = renderMap();
    const popup = await openPopup(map, '<h3>Kirjasto</h3>');

    rerenderMap(<PopupRegion />);

    expect(popup).toHaveAttribute('role', 'region');
    expect(popup).toHaveAttribute('aria-labelledby', popup.querySelector('h3').id);
  });

  it('labels React popup content that renders after the popup opens', async () => {
    const DelayedHeading = () => {
      const [loaded, setLoaded] = useState(false);
      useEffect(() => {
        const timeout = setTimeout(() => setLoaded(true), 10);
        return () => clearTimeout(timeout);
      }, []);
      return loaded ? <h3>Pysäkki</h3> : <p>Ladataan</p>;
    };
    const { container } = renderMap(
      <>
        <PopupRegion />
        <Marker position={MAP_CENTER}>
          <Popup><DelayedHeading /></Popup>
        </Marker>
      </>,
    );

    act(() => { container.querySelector('.leaflet-marker-icon').click(); });

    const popup = container.querySelector('.leaflet-popup');
    await waitFor(() => expect(popup).toHaveAttribute('role', 'region'));
    expect(popup).toHaveAttribute('aria-labelledby', popup.querySelector('h3').id);
  });
});
