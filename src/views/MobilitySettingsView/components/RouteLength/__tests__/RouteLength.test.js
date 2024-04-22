// Link.react.test.js
import React from 'react';
import RouteLength from '../index';
import { getRenderWithProviders } from '../../../../../../jestUtils';
import finnishTranslations from '../../../../../i18n/fi';

const mockProps = {
  route: {
    name_fi: 'EuroVelo',
    length: 100000,
  },
};

const renderWithProviders = getRenderWithProviders({});

describe('<RouteLength />', () => {
  it('should work', () => {
    const { container } = renderWithProviders(<RouteLength {...mockProps} />);
    expect(container).toMatchSnapshot();
  });

  it('does show text correctly', () => {
    const { container } = renderWithProviders(<RouteLength {...mockProps} />);

    const p = container.querySelectorAll('p');
    expect(p[0].textContent).toContain(`${finnishTranslations['mobilityPlatform.menu.bicycleRoutes.length'].replace('{value}', '100')}`);
    expect(p[1]).toBeInTheDocument();
  });
});
