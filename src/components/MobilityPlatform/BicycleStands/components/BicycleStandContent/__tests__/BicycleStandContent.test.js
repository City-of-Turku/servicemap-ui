// Link.react.test.js
import React from 'react';
import BicycleStandContent from '../index';
import finnishTranslations from '../../../../../../i18n/fi';
import { getRenderWithProviders } from '../../../../../../../jestUtils';

const mockProps = {
  bicycleStand: {
    name: 'Testinimi',
    extra: {
      model: 'Testimalli',
      number_of_places: 10,
      number_of_stands: 5,
      covered: true,
      hull_lockable: true,
      maintained_by_turku: true,
    },
  },
};

const renderWithProviders = getRenderWithProviders({});

describe('<BicycleStandContent />', () => {
  it('should work', () => {
    const { container } = renderWithProviders(<BicycleStandContent {...mockProps} />);
    expect(container).toMatchSnapshot();
  });

  it('does show text correctly', () => {
    const { container } = renderWithProviders(<BicycleStandContent {...mockProps} />);

    const h3 = container.querySelector('h3');
    const p = container.querySelectorAll('p');
    expect(h3.textContent).toContain(mockProps.bicycleStand.name);
    expect(p[0].textContent).toContain('Malli: Testimalli');
    expect(p[1].textContent).toContain('Pyöräpaikkojen määrä: 10');
    expect(p[2].textContent).toContain('Pyörätelineiden määrä: 5');
    expect(p[3].textContent).toContain(finnishTranslations['mobilityPlatform.content.bicycleStands.covered']);
    expect(p[4].textContent).toContain(finnishTranslations['mobilityPlatform.content.bicycleStands.hullLockable']);
    expect(p[5].textContent).toContain(finnishTranslations['mobilityPlatform.content.bicycleStands.maintainedByTku']);
  });
});
