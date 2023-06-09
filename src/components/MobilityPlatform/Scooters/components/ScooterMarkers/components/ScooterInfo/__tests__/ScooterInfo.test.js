// Link.react.test.js
import React from 'react';
import { getRenderWithProviders } from '../../../../../../../../../jestUtils';
import finnishTranslations from '../../../../../../../../i18n/fi';
import ScooterInfo from '../index';

const mockProps = {
  item: {
    bike_id: 'abc123test',
    is_reserved: false,
    current_range_meters: 20200,
    rental_uris: {
      android: 'https://www.testilinkki.fi',
      ios: 'https://www.testilinkki.fi',
    },
  },
};

const renderWithProviders = getRenderWithProviders({});

describe('<ScooterInfo />', () => {
  it('should work', () => {
    const { container } = renderWithProviders(<ScooterInfo {...mockProps} />);
    expect(container).toMatchSnapshot();
  });

  it('does show text correctly', () => {
    const { container } = renderWithProviders(<ScooterInfo {...mockProps} />);

    const p = container.querySelectorAll('p');
    const h3 = container.querySelector('h3');
    expect(h3.textContent).toContain(finnishTranslations['mobilityPlatform.content.scooter.title']);
    expect(p[0].textContent).toContain('Palveluntarjoaja: Ryde');
    expect(p[1].textContent).toContain(finnishTranslations['mobilityPlatform.content.scooter.notReserved']);
    expect(p[2].textContent).toContain('Jäljellä oleva kantama: 20.20 km');
    expect(p[3].textContent).toContain(finnishTranslations['mobilityPlatform.content.general.rentalUris']);
  });

  it('does render links correctly', () => {
    const { container } = renderWithProviders(<ScooterInfo {...mockProps} />);

    const link = container.querySelectorAll('a');
    expect(link[0].textContent).toEqual('Android');
    expect(link[1].textContent).toEqual('iOS');
  });
});
