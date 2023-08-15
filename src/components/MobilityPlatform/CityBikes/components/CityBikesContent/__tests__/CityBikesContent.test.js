// Link.react.test.js
import React from 'react';
import { getRenderWithProviders } from '../../../../../../../jestUtils';
import finnishTranslations from '../../../../../../i18n/fi';
import CityBikesContent from '../index';

const mockProps = {
  bikeStation: {
    station_id: 'abc123test',
    name: 'Testiasema',
    capacity: 20,
    is_virtual_station: true,
    rental_uris: {
      android: 'https://www.testilinkki.fi',
      ios: 'https://www.testilinkki.fi',
    },
  },
  cityBikeStatistics: [
    {
      station_id: 'abc123test',
      num_bikes_available: 10,
      num_docks_available: 20,
    },
    {
      station_id: 'abc456test',
      num_bikes_available: 5,
      num_docks_available: 30,
    },
  ],
};

const renderWithProviders = getRenderWithProviders({});

describe('<CityBikesContent />', () => {
  it('should work', () => {
    const { container } = renderWithProviders(<CityBikesContent {...mockProps} />);
    expect(container).toMatchSnapshot();
  });

  it('does show text correctly', () => {
    const { container } = renderWithProviders(<CityBikesContent {...mockProps} />);

    const p = container.querySelectorAll('p');
    const h3 = container.querySelector('h3');
    const link = container.querySelectorAll('a');
    expect(h3.textContent).toContain(finnishTranslations['mobilityPlatform.content.cityBikes.title']);
    expect(p[0].textContent).toContain(`Asema: ${mockProps.bikeStation.name}`);
    expect(p[1].textContent).toContain(finnishTranslations['mobilityPlatform.content.cityBikes.virtualStation']);
    expect(p[2].textContent).toContain(`Kapasiteetti: ${mockProps.bikeStation.capacity}`);
    expect(p[3].textContent).toContain('Pyöriä vapaana: 10');
    expect(p[4].textContent).toContain('Telineitä vapaana: 20');
    expect(p[5].textContent).toContain(finnishTranslations['mobilityPlatform.content.general.rentalUris']);
    expect(link[0].textContent).toEqual('Android');
    expect(link[1].textContent).toEqual('iOS');
  });
});
