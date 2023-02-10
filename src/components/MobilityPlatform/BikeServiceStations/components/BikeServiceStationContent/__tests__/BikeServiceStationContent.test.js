// Link.react.test.js
import React from 'react';
import BikeServiceStationContent from '../index';
import { initialState } from '../../../../../../redux/reducers/user';
import { getRenderWithProviders } from '../../../../../../../jestUtils';

const mockProps = {
  station: {
    name: 'Testi',
    name_en: 'Test',
    name_sv: 'Test',
    description: 'testikuvaus',
    description_en: 'test description',
    description_sv: 'test beskrivning',
    address: 'testiosoite',
    address_fi: 'osoite',
    address_en: 'address',
    address_sv: 'addres',
  },
};

const renderWithProviders = getRenderWithProviders({
  user: initialState,
});

describe('<BikeServiceStationContent />', () => {
  it('should match snapshot', () => {
    const { container } = renderWithProviders(<BikeServiceStationContent {...mockProps} />);
    expect(container).toMatchSnapshot();
  });

  it('does show text correctly', () => {
    const { container } = renderWithProviders(<BikeServiceStationContent {...mockProps} />);

    const p = container.querySelectorAll('p');
    expect(p[0].textContent).toEqual(mockProps.station.name);
    expect(p[1].textContent).toEqual(`Osoite: ${mockProps.station.address_fi}`);
    expect(p[2].textContent).toEqual(mockProps.station.description);
  });
});
