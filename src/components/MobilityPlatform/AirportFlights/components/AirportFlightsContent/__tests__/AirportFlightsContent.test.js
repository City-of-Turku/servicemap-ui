// Link.react.test.js
import React from 'react';
import { getRenderWithProviders } from '../../../../../../../jestUtils';
import finnishTranslations from '../../../../../../i18n/fi';
import AirportFlightsContent from '../index';

const mockProps = {
  departees: [
    {
      sdt: '2024-04-26T11:00:00Z',
      fltnr: 'TST1',
      route_n_1: 'Stockholm',
    },
    {
      sdt: '2024-04-26T12:00:00Z',
      fltnr: 'TST2',
      route_n_1: 'Riga',
    },
    {
      sdt: '2024-04-26T17:00:00Z',
      fltnr: 'TST3',
      route_n_1: 'Rome',
    },
  ],
  arrvals: [
    {
      sdt: '2024-04-26T10:00:00Z',
      fltnr: 'TST1',
      route_n_1: 'Turku',
    },
    {
      sdt: '2024-04-26T15:00:00Z',
      fltnr: 'TST2',
      route_n_1: 'Turku',
    },
    {
      sdt: '2024-04-26T20:00:00Z',
      fltnr: 'TST3',
      route_n_1: 'Turku',
    },
  ],
};

const renderWithProviders = getRenderWithProviders({});

describe('<AirportFlightsContent />', () => {
  it('should match snapshot', () => {
    const { container } = renderWithProviders(<AirportFlightsContent {...mockProps} />);
    expect(container).toMatchSnapshot();
  });

  it('does show text', () => {
    const { container } = renderWithProviders(<AirportFlightsContent {...mockProps} />);
    const p = container.querySelectorAll('p');
    const h4 = container.querySelector('h4');
    expect(h4.textContent).toContain(finnishTranslations['mobilityPlatform.content.airport.title']);
    expect(p[0].textContent).toContain(finnishTranslations['mobilityPlatform.content.airport.departees']);
    expect(p[1]).toBeInTheDocument();
  });
});
