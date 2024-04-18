/* eslint-disable max-len */
// Link.react.test.js
import React from 'react';
import EmptyRouteList from '../index';
import { getRenderWithProviders } from '../../../../../../jestUtils';
import finnishTranslations from '../../../../../i18n/fi';

const mockProps = {
  route: [],
};

const renderWithProviders = getRenderWithProviders({});

describe('<CityBikeInfo />', () => {
  it('should work', () => {
    const { container } = renderWithProviders(<EmptyRouteList {...mockProps} />);
    expect(container).toMatchSnapshot();
  });

  it('does show text correctly', () => {
    const { container } = renderWithProviders(<EmptyRouteList {...mockProps} />);

    const p = container.querySelectorAll('p');
    expect(p[0].textContent).toContain(finnishTranslations['mobilityPlatform.menu.routes.emptyList']);
  });
});
