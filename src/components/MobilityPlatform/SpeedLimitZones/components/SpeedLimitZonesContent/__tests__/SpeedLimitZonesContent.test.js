// Link.react.test.js
import React from 'react';
import { getRenderWithProviders } from '../../../../../../../jestUtils';
import finnishTranslations from '../../../../../../i18n/fi';
import SpeedLimitZonesContent from '../index';

const mockProps = {
  item: {
    extra: {
      speed_limit: 40,
    },
  },
};

const renderWithProviders = getRenderWithProviders({});

describe('<SpeedLimitZonesContent />', () => {
  it('should match snapshot', () => {
    const { container } = renderWithProviders(<SpeedLimitZonesContent {...mockProps} />);
    expect(container).toMatchSnapshot();
  });

  it('does show text correctly', () => {
    const { container } = renderWithProviders(<SpeedLimitZonesContent {...mockProps} />);

    const p = container.querySelectorAll('p');
    const h6 = container.querySelector('h6');
    expect(h6.textContent).toContain(finnishTranslations['mobilityPlatform.content.speedLimitZones.area']);
    expect(p[0].textContent).toContain('Nopeusrajoitus: 40 km/t');
  });
});
