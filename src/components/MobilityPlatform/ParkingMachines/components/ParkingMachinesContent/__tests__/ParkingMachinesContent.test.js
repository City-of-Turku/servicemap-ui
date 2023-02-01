// Link.react.test.js
import React from 'react';
import ParkingMachinesContent from '../index';
import { initialState } from '../../../../../../redux/reducers/user';
import finnishTranslations from '../../../../../../i18n/fi';
import { getRenderWithProviders } from '../../../../../../../jestUtils';

const mockProps = {
  item: {
    address_fi: 'Testikatu',
    extra: {
      Sijainti: 'Katuosa',
      'Taksa/h': '1.8',
      Maksutapa: 'Kortti, käteinen',
      Muuta: 'Testiteksti',
    },
  },
};

const renderWithProviders = getRenderWithProviders({
  user: initialState,
});

describe('<ParkingMachinesContent />', () => {
  it('should match snapshot', () => {
    const { container } = renderWithProviders(<ParkingMachinesContent {...mockProps} />);
    expect(container).toMatchSnapshot();
  });

  it('does show text correctly', () => {
    const { container } = renderWithProviders(<ParkingMachinesContent {...mockProps} />);

    const h6 = container.querySelectorAll('h6');
    const p = container.querySelectorAll('p');
    expect(h6[0].textContent).toContain(finnishTranslations['mobilityPlatform.content.parkingMachine.title']);
    expect(p[0].textContent).toContain(`Osoite: ${mockProps.item.address_fi}`);
    expect(p[1].textContent).toContain(`Sijainti: ${mockProps.item.extra.Sijainti}`);
    expect(p[2].textContent).toContain(`Maksu: ${mockProps.item.extra['Taksa/h']}`);
    expect(p[3].textContent).toContain(`Maksutavat: ${mockProps.item.extra.Maksutapa}`);
    expect(p[4].textContent).toContain(`Muuta: ${mockProps.item.extra.Muuta}`);
  });
});
