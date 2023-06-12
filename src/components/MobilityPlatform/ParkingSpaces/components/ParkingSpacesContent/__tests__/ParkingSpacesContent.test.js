// Link.react.test.js
import React from 'react';
import ParkingSpacesContent from '../index';
import { getRenderWithProviders } from '../../../../../../../jestUtils';
import finnishTranslations from '../../../../../../i18n/fi';

const mockProps = {
  parkingSpace: {
    id: '123abc',
    properties: {
      capacity_estimate: 10,
    },
  },
  parkingStatistics: [
    {
      id: '123abc',
      current_parking_count: 5,
    },
  ],
};

const renderWithProviders = getRenderWithProviders({});

describe('<ParkingSpacesContent />', () => {
  it('should work', () => {
    const { container } = renderWithProviders(<ParkingSpacesContent {...mockProps} />);
    expect(container).toMatchSnapshot();
  });

  it('does show text correctly', () => {
    const { container } = renderWithProviders(<ParkingSpacesContent {...mockProps} />);

    const h3 = container.querySelectorAll('h3');
    const p = container.querySelectorAll('p');
    expect(h3[0].textContent).toContain(finnishTranslations['mobilityPlatform.content.parkingSpaces.title']);
    expect(p[0].textContent).toContain(
      `${finnishTranslations['mobilityPlatform.content.parkingSpaces.type']}: ${finnishTranslations['mobilityPlatform.content.parkingSpaces.paid']}`,
    );
    expect(p[1].textContent).toContain(
      `${finnishTranslations['mobilityPlatform.content.parkingSpaces.capacity']}: ${mockProps.parkingSpace.properties.capacity_estimate}`,
    );
    expect(p[2].textContent).toContain(`Vapaana olevat parkkipaikat: 5 / ${mockProps.parkingSpace.properties.capacity_estimate}`);
  });
});
