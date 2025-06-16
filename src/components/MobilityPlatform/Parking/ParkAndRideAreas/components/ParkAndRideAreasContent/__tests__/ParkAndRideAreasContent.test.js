// Link.react.test.js
import React from 'react';
import ParkAndRideAreasContent from '../index';
import { getRenderWithProviders } from '../../../../../../../../jestUtils';
import finnishTranslations from '../../../../../../../i18n/fi';

const mockProps = {
  parkAndRideArea: {
    id: '123abc',
    properties: {
      capacity_estimate: 4,
      bus_stop_numbers: [
        50,
        60,
      ],
    },
  },
  parkingStatistics: [
    {
      id: '123abc',
      current_parking_count: 0,
    },
  ],
};

const renderWithProviders = getRenderWithProviders({});

describe('<ParkAndRideAreasContent />', () => {
  it('should work', () => {
    const { container } = renderWithProviders(<ParkAndRideAreasContent {...mockProps} />);
    expect(container).toMatchSnapshot();
  });

  it('does show text correctly', () => {
    const { container } = renderWithProviders(<ParkAndRideAreasContent {...mockProps} />);

    const h3 = container.querySelectorAll('h3');
    const p = container.querySelectorAll('p');
    expect(h3[0].textContent).toContain(finnishTranslations['mobilityPlatform.content.parkAndRide.title']);
    expect(p[0].textContent).toContain(
      `${finnishTranslations['mobilityPlatform.content.parkingSpaces.capacity']}: ${mockProps.parkAndRideArea.properties.capacity_estimate}`,
    );
    expect(p[1].textContent).toContain(`Vapaana olevat parkkipaikat: 4 / ${mockProps.parkAndRideArea.properties.capacity_estimate}`);
    expect(p[2].textContent).toContain(finnishTranslations['mobilityPlatform.content.parkAndRide.busNumbers']);
    expect(p[3].textContent).toContain(`${finnishTranslations['mobilityPlatform.content.parkAndRide.bus'].replace(
      '{value}',
      `${mockProps.parkAndRideArea.properties.bus_stop_numbers[0]}`,
    )}`);
    expect(p[4].textContent).toContain(`${finnishTranslations['mobilityPlatform.content.parkAndRide.bus'].replace(
      '{value}',
      `${mockProps.parkAndRideArea.properties.bus_stop_numbers[1]}`,
    )}`);
  });
});
