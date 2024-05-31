// Link.react.test.js
import React from 'react';
import BarbecuePlacesContent from '../index';
import { getRenderWithProviders } from '../../../../../../../jestUtils';
import finnishTranslations from '../../../../../../i18n/fi';

const mockProps = {
  item: {
    extra: {
      valmistaja: 'Testi',
      malli: 'Testigrilli',
    },
  },
};

const renderWithProviders = getRenderWithProviders({});

describe('<BarbecuePlacesContent />', () => {
  it('should work', () => {
    const { container } = renderWithProviders(<BarbecuePlacesContent {...mockProps} />);
    expect(container).toMatchSnapshot();
  });

  it('does show text correctly', () => {
    const { container } = renderWithProviders(<BarbecuePlacesContent {...mockProps} />);

    const p = container.querySelectorAll('p');
    expect(p[0].textContent).toContain(`${finnishTranslations['mobilityPlatform.content.barbecuePlace.title']}`);
    expect(p[1].textContent).toContain(
      `${finnishTranslations['mobilityPlatform.content.barbecuePlace.manufacturer'].replace(
        '{value}',
        `${mockProps.item.extra.valmistaja}`,
      )}`,
    );
    expect(p[2].textContent).toContain(
      `${finnishTranslations['mobilityPlatform.content.barbecuePlace.model'].replace(
        '{value}',
        `${mockProps.item.extra.malli}`,
      )}`,
    );
  });
});
