// Link.react.test.js
import React from 'react';
import AccessibilityAreasContent from '../index';
import { getRenderWithProviders } from '../../../../../../../jestUtils';
import finnishTranslations from '../../../../../../i18n/fi';

const mockProps = {
  item: {
    extra: {
      kulkumuoto: 'Kävely',
      minuutit: 10,
    },
  },
};

const renderWithProviders = getRenderWithProviders({});

describe('<AccessibilityAreasContent />', () => {
  it('should work', () => {
    const { container } = renderWithProviders(<AccessibilityAreasContent {...mockProps} />);
    expect(container).toMatchSnapshot();
  });

  it('does show text correctly', () => {
    const { container } = renderWithProviders(<AccessibilityAreasContent {...mockProps} />);

    const p = container.querySelectorAll('p');
    expect(p[0].textContent).toContain(`${finnishTranslations['unit.accessibilityAreas.content.subtitle']}`);
    expect(p[1].textContent).toContain(
      `${finnishTranslations['unit.accessibilityAreas.content.transport'].replace(
        '{value}',
        `${mockProps.item.extra.kulkumuoto}`,
      )}`,
    );
    expect(p[2].textContent).toContain(
      `${finnishTranslations['unit.accessibilityAreas.content.duration'].replace(
        '{value}',
        `${mockProps.item.extra.minuutit}`,
      )}`,
    );
  });
});
