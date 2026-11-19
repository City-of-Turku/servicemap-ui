import React from 'react';
import { act, fireEvent } from '@testing-library/react';
import * as rL from 'react-leaflet';
import { MAP_CENTER } from '../../../../jestMapUtils';
import { getRenderWithProviders } from '../../../../jestUtils';
import AccessibleMarker from '../AccessibleMarker';

global.rL = rL;

const renderWithProviders = getRenderWithProviders({ user: { locale: 'fi' } });

describe('<AccessibleMarker />', () => {
  it('opens its popup with Enter', () => {
    const { container } = renderWithProviders(
      <rL.MapContainer center={MAP_CENTER} zoom={12}>
        <AccessibleMarker typeId="unit.entrances.main" name="Kirjasto" position={MAP_CENTER}>
          <rL.Popup><h3>Kirjasto</h3></rL.Popup>
        </AccessibleMarker>
      </rL.MapContainer>,
    );
    const marker = container.querySelector('.leaflet-marker-icon');

    act(() => { fireEvent.keyDown(marker, { key: 'Enter' }); });

    expect(marker).toHaveAttribute('aria-expanded', 'true');
    expect(container.querySelector('.leaflet-popup')).not.toBeNull();
  });
});
