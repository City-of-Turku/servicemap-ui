// Link.react.test.js
import React from 'react';
import GasFillingStationContent from '../index';
import { getRenderWithProviders } from '../../../../../../../jestUtils';

const mockProps = {
  station: {
    name: 'Testinimi',
    address: 'Osoite',
    extra: {
      lng_cng: 'LNG',
      operator: 'Operaattori',
    },
  },
};

const renderWithProviders = getRenderWithProviders({});

describe('<GasFillingStationContent />', () => {
  it('should match snapshot', () => {
    const { container } = renderWithProviders(<GasFillingStationContent {...mockProps} />);
    expect(container).toMatchSnapshot();
  });

  it('does show text correctly', () => {
    const { container } = renderWithProviders(<GasFillingStationContent {...mockProps} />);

    const p = container.querySelectorAll('p');
    const h3 = container.querySelector('h3');
    expect(h3.textContent).toContain(mockProps.station.name);
    expect(p[0].textContent).toContain(`Osoite: ${mockProps.station.address}`);
    expect(p[1].textContent).toContain(`Kaasuaseman tyyppi: ${mockProps.station.extra.lng_cng}`);
    expect(p[2].textContent).toContain(`Operaattori: ${mockProps.station.extra.operator}`);
  });
});
