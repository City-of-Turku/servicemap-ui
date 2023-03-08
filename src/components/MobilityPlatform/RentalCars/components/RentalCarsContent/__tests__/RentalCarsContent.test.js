/* eslint-disable max-len */
// Link.react.test.js
import React from 'react';
import { getRenderWithProviders } from '../../../../../../../jestUtils';
import { initialState } from '../../../../../../redux/reducers/user';
import finnishTranslations from '../../../../../../i18n/fi';
import RentalCarsContent from '../index';

const mockProps = {
  car: {
    homeLocationData: {
      fullAddress: 'Testiosoite',
    },
    vehicleModelData: {
      name: 'Testiauto',
      manufacturer: 'Testimerkki',
    },
    availabilityData: {
      available: true,
    },
    link: 'https://www.24rent.fi',
  },
};

const renderWithProviders = getRenderWithProviders({
  user: initialState,
});

describe('<RentalCarsContent />', () => {
  it('should work', () => {
    const { container } = renderWithProviders(<RentalCarsContent {...mockProps} />);
    expect(container).toMatchSnapshot();
  });

  it('does show text correctly', () => {
    const { container } = renderWithProviders(<RentalCarsContent {...mockProps} />);

    const p = container.querySelectorAll('p');
    expect(p[0]).toBeInTheDocument();
    expect(p[1].textContent).toEqual(mockProps.car.link);
    expect(p[2].textContent).toContain('Auton tiedot: Testimerkki Testiauto');
    expect(p[3].textContent).toContain(finnishTranslations['mobilityPlatform.content.rentalCars.available']);
    expect(p[4].textContent).toContain('Sijainti: Testiosoite');
  });

  it('does show link correctly', () => {
    const { container } = renderWithProviders(<RentalCarsContent {...mockProps} />);

    const link = container.querySelector('a');
    expect(link).toBeInTheDocument();
  });

  it('does show image correctly', () => {
    const { container } = renderWithProviders(<RentalCarsContent {...mockProps} />);

    const image = container.querySelector('img');
    expect(image).toBeInTheDocument();
  });
});
