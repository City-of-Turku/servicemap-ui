/* eslint-disable react/jsx-props-no-spreading */
// Link.react.test.js
import React from 'react';
import { getRenderWithProviders } from '../../../../../../../../jestUtils';
import { initialState } from '../../../../../../../redux/reducers/user';
import ParkAndRideCarsContent from '../index';
import finnishTranslations from '../../../../../../../i18n/fi';

const mockProps = {
  item: {
    name_fi: 'Testinimi',
    name_en: 'Test name',
    name_sv: 'Test namn',
    address_fi: 'Testiosoite',
    address_en: 'Test address',
    address_sv: 'Test adress',
    address_zip: '20200',
    municipality: 'turku',
  },
};

const renderWithProviders = getRenderWithProviders({
  user: initialState,
});

describe('<ParkAndRideCarsContent />', () => {
  it('should work', () => {
    const { container } = renderWithProviders(<ParkAndRideCarsContent {...mockProps} />);
    expect(container).toMatchSnapshot();
  });

  it('does show text correctly', () => {
    const { container } = renderWithProviders(<ParkAndRideCarsContent {...mockProps} />);

    const p = container.querySelectorAll('p');
    expect(p[0].textContent).toEqual('Testinimi');
    expect(p[1].textContent).toContain(finnishTranslations['mobilityPlatform.parkAndRide.content.cars.subtitle']);
    expect(p[2].textContent).toEqual('Osoite: Testiosoite, 20200 Turku');
  });
});
