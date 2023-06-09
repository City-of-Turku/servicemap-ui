/* eslint-disable max-len */
// Link.react.test.js
import React from 'react';
import ParkingChargeZoneContent from '../index';
import { getRenderWithProviders } from '../../../../../../../jestUtils';
import finnishTranslations from '../../../../../../i18n/fi';

const mockProps = {
  parkingChargeZone: {
    extra: {
      maksuvyohyke: '1',
      maksullisuus_arki: '9 - 18',
      maksullisuus_lauantai: '9 - 15',
      maksullisuus_sunnuntai: 'Maksuton',
      maksuvyohykehinta: '3 €/h',
    },
  },
};

const renderWithProviders = getRenderWithProviders({});

describe('<ParkingChargeZoneContent />', () => {
  it('should work', () => {
    const { container } = renderWithProviders(<ParkingChargeZoneContent {...mockProps} />);
    expect(container).toMatchSnapshot();
  });

  it('does show text correctly', () => {
    const { container } = renderWithProviders(<ParkingChargeZoneContent {...mockProps} />);

    const p = container.querySelectorAll('p');
    const h3 = container.querySelector('h3');
    expect(h3.textContent).toContain(
      `${finnishTranslations['mobilityPlatform.content.parkingChargeZones.zone']}: ${mockProps.parkingChargeZone.extra.maksuvyohyke}`,
    );
    expect(p[0].textContent).toContain(
      `${finnishTranslations['mobilityPlatform.content.parkingChargeZones.price.weekDays']}: ${mockProps.parkingChargeZone.extra.maksullisuus_arki}`,
    );
    expect(p[1].textContent).toContain(
      `${finnishTranslations['mobilityPlatform.content.parkingChargeZones.price.saturday']}: ${mockProps.parkingChargeZone.extra.maksullisuus_lauantai}`,
    );
    expect(p[2].textContent).toContain(
      `${finnishTranslations['mobilityPlatform.content.parkingChargeZones.price.sunday']}: ${mockProps.parkingChargeZone.extra.maksullisuus_sunnuntai}`,
    );
    expect(p[3].textContent).toContain(
      `${finnishTranslations['mobilityPlatform.content.parkingChargeZones.price']}: ${mockProps.parkingChargeZone.extra.maksuvyohykehinta}`,
    );
  });
});
