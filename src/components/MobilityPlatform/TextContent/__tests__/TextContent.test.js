// Link.react.test.js
import React from 'react';
import { getRenderWithProviders } from '../../../../../jestUtils';
import finnishTranslations from '../../../../i18n/fi';
import TextContent from '../index';

const mockProps = {
  titleId: 'mobilityPlatform.content.scooters.noParkingAreas.title',
  translationId: 'mobilityPlatform.info.scooters.noParking',
};

const renderWithProviders = getRenderWithProviders({});

describe('<TextContent />', () => {
  it('should work', () => {
    const { container } = renderWithProviders(<TextContent {...mockProps} />);
    expect(container).toMatchSnapshot();
  });

  it('does show text correctly', () => {
    const { container } = renderWithProviders(<TextContent {...mockProps} />);

    const p = container.querySelectorAll('p');
    const h3 = container.querySelector('h3');
    expect(h3.textContent).toContain(finnishTranslations['mobilityPlatform.content.scooters.noParkingAreas.title']);
    expect(p[0].textContent).toContain(finnishTranslations['mobilityPlatform.info.scooters.noParking']);
  });
});
