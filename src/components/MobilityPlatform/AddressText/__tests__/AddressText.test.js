// Link.react.test.js
import React from 'react';
import AddressText from '../index';
import { initialState } from '../../../../redux/reducers/user';
import { getRenderWithProviders } from '../../../../../jestUtils';

const mockProps = {
  addressObj: {
    address_fi: 'Testikatu',
    address_en: 'Test street',
    address_sv: 'Test gata',
  },
};

const renderWithProviders = getRenderWithProviders({
  user: initialState,
});

describe('<AddressText />', () => {
  it('should match snapshot', () => {
    const { container } = renderWithProviders(<AddressText {...mockProps} />);
    expect(container).toMatchSnapshot();
  });

  it('does show text correctly', () => {
    const { container } = renderWithProviders(<AddressText {...mockProps} />);

    const p = container.querySelectorAll('p');
    expect(p[0].textContent).toContain(`Osoite: ${mockProps.addressObj.address_fi}`);
  });
});
