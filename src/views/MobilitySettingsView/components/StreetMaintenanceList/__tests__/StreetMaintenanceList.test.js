import React from 'react';
import StreetMaintenanceList from '../index';
import { getRenderWithProviders } from '../../../../../../jestUtils';
import finnishTranslations from '../../../../../i18n/fi';

const renderWithProviders = getRenderWithProviders({});

const baseProps = {
  openStreetMaintenanceList: true,
  streetMaintenancePeriod: '1hour',
  streetMaintenanceSelections: [],
};

describe('<StreetMaintenanceList />', () => {
  it('shows no-activity message only when not loading and inactive', () => {
    const { container } = renderWithProviders(
      <StreetMaintenanceList
        {...baseProps}
        isLoading={false}
        isActive={false}
      />,
    );

    expect(container.textContent).toContain(
      finnishTranslations['mobilityPlatform.info.streetMaintenance.noActivity'],
    );
  });

  it('does not show no-activity message while loading', () => {
    const { container } = renderWithProviders(
      <StreetMaintenanceList
        {...baseProps}
        isLoading
        isActive={false}
      />,
    );

    expect(container.textContent).not.toContain(
      finnishTranslations['mobilityPlatform.info.streetMaintenance.noActivity'],
    );
  });

  it('does not show no-activity message when active', () => {
    const { container } = renderWithProviders(
      <StreetMaintenanceList
        {...baseProps}
        isLoading={false}
        isActive
      />,
    );

    expect(container.textContent).not.toContain(
      finnishTranslations['mobilityPlatform.info.streetMaintenance.noActivity'],
    );
  });
});
