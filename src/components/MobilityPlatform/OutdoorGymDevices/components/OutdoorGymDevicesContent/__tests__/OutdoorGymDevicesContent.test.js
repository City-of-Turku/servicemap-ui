// Link.react.test.js
import React from 'react';
import OutdoorGymDevicesContent from '../index';
import { initialState } from '../../../../../../redux/reducers/user';
import { getRenderWithProviders } from '../../../../../../../jestUtils';

const mockProps = {
  item: {
    name_fi: 'Testi',
    name_en: 'Test',
    name_sv: 'Test',
    address_fi: 'Testikatu',
    address_en: 'Test street',
    address_sv: 'Test gata',
    description_fi: 'Testikuvaus',
    description_en: 'Test description',
    description_sv: 'Test skrivning',
  },
};

const renderWithProviders = getRenderWithProviders({
  user: initialState,
});

describe('<OutdoorGymDevicesContent />', () => {
  it('should match snapshot', () => {
    const { container } = renderWithProviders(<OutdoorGymDevicesContent {...mockProps} />);
    expect(container).toMatchSnapshot();
  });

  it('does show text correctly', () => {
    const { container } = renderWithProviders(<OutdoorGymDevicesContent {...mockProps} />);
    const p = container.querySelectorAll('p');
    expect(p[0].textContent).toContain(mockProps.item.name_fi);
    expect(p[1].textContent).toContain(`Osoite: ${mockProps.item.address_fi}`);
    expect(p[2].textContent).toContain(mockProps.item.description_fi);
  });
});
