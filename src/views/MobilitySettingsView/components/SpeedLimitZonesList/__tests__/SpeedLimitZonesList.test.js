// Link.react.test.js
import React from 'react';
import SpeedLimitZonesList from '../index';
import { getRenderWithProviders } from '../../../../../../jestUtils';
import finnishTranslations from '../../../../../i18n/fi';

const mockProps = {
  openSpeedLimitList: true,
  speedLimitListAsc: [30, 40, 50],
  speedLimitSelections: [30],
  setState: jest.fn,
};

const renderWithProviders = getRenderWithProviders({});

describe('<SpeedLimitZonesList />', () => {
  it('should work', () => {
    const { container } = renderWithProviders(<SpeedLimitZonesList {...mockProps} />);
    expect(container).toMatchSnapshot();
  });

  it('does show text correctly', () => {
    const { container } = renderWithProviders(<SpeedLimitZonesList {...mockProps} />);

    const p = container.querySelectorAll('p');
    expect(p[0].textContent).toContain(finnishTranslations['mobilityPlatform.menu.speedLimitZones.select']);
    expect(p[1].textContent).toContain(`${mockProps.speedLimitListAsc[0]} km/t`);
    expect(p[2].textContent).toContain(`${mockProps.speedLimitListAsc[1]} km/t`);
    expect(p[3].textContent).toContain(`${mockProps.speedLimitListAsc[2]} km/t`);
  });

  it('does contain aria-label attribute', () => {
    const { container } = renderWithProviders(<SpeedLimitZonesList {...mockProps} />);

    const p = container.querySelectorAll('p');
    expect(p[0].getAttribute('aria-label')).toContain(finnishTranslations['mobilityPlatform.menu.speedLimitZones.select']);
    expect(p[1].getAttribute('aria-label')).toContain(`${mockProps.speedLimitListAsc[0]} km/t`);
    expect(p[2].getAttribute('aria-label')).toContain(`${mockProps.speedLimitListAsc[1]} km/t`);
    expect(p[3].getAttribute('aria-label')).toContain(`${mockProps.speedLimitListAsc[2]} km/t`);
  });
});
