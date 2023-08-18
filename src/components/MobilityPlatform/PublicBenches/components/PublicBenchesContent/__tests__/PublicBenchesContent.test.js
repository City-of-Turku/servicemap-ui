// Link.react.test.js
import React from 'react';
import PublicBenchesContent from '../index';
import finnishTranslations from '../../../../../../i18n/fi';
import { getRenderWithProviders } from '../../../../../../../jestUtils';

const mockProps = {
  item: {
    extra: {
      Malli: 'Testipenkki',
      Kunto: 'Hyvä',
    },
  },
};

const renderWithProviders = getRenderWithProviders();

describe('<PublicBenchesContent />', () => {
  it('should match snapshot', () => {
    const { container } = renderWithProviders(<PublicBenchesContent {...mockProps} />);
    expect(container).toMatchSnapshot();
  });

  it('does show text correctly', () => {
    const { container } = renderWithProviders(<PublicBenchesContent {...mockProps} />);
    const p = container.querySelectorAll('p');
    const h3 = container.querySelectorAll('h3');
    expect(h3[0].textContent).toContain(finnishTranslations['mobilityPlatform.content.publicBench.title']);
    expect(p[0].textContent).toContain(`Penkin kunto: ${mockProps.item.extra.Kunto}`);
    expect(p[1].textContent).toContain(`Penkin malli: ${mockProps.item.extra.Malli}`);
  });
});
