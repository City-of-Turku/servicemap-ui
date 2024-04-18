/* eslint-disable max-len */
// Link.react.test.js
import React from 'react';
import ExtendedInfo from '../index';
import { getRenderWithProviders } from '../../../../../../jestUtils';
import finnishTranslations from '../../../../../i18n/fi';

const mockProps = {
  translations: {
    message1: 'mobilityPlatform.info.parkingChargeZones.paragraph.1',
    message2: 'mobilityPlatform.info.parkingChargeZones.paragraph.2',
    message3: 'mobilityPlatform.info.parkingChargeZones.paragraph.3',
    zones: [
      'mobilityPlatform.info.parkingChargeZones.zone.1',
      'mobilityPlatform.info.parkingChargeZones.zone.2',
      'mobilityPlatform.info.parkingChargeZones.zone.3',
    ],
  },
};

const renderWithProviders = getRenderWithProviders({});

describe('<ExtendedInfo />', () => {
  it('should work', () => {
    const { container } = renderWithProviders(<ExtendedInfo {...mockProps} />);
    expect(container).toMatchSnapshot();
  });

  it('does show text correctly', () => {
    const { container } = renderWithProviders(<ExtendedInfo {...mockProps} />);

    const p = container.querySelectorAll('p');
    const list = container.querySelectorAll('li');
    expect(p[0].textContent).toContain(finnishTranslations['mobilityPlatform.info.parkingChargeZones.paragraph.1']);
    expect(p[4].textContent).toContain(finnishTranslations['mobilityPlatform.info.parkingChargeZones.paragraph.2']);
    expect(p[5].textContent).toContain(finnishTranslations['mobilityPlatform.info.parkingChargeZones.paragraph.3']);
    expect(list[0].textContent).toContain(finnishTranslations['mobilityPlatform.info.parkingChargeZones.zone.1']);
    expect(list[1].textContent).toContain(finnishTranslations['mobilityPlatform.info.parkingChargeZones.zone.2']);
    expect(list[2].textContent).toContain(finnishTranslations['mobilityPlatform.info.parkingChargeZones.zone.3']);
  });
});
