// Link.react.test.js
import React from 'react';
import { getRenderWithProviders } from '../../../../../../../jestUtils';
import finnishTranslations from '../../../../../../i18n/fi';
import RailwayStationsContent from '../index';

const mockProps = {
  item: {
    stationName: 'Kupittaa',
    stationShortCode: 'KUT',
  },
  stationsData: [
    {
      stationName: 'Kupittaa',
      stationShortCode: 'KUT',
    },
    {
      stationName: 'Turku asema',
      stationShortCode: 'TKU',
    },
    {
      stationName: 'Turku Satama',
      stationShortCode: 'TUS',
    },
    {
      stationName: 'Helsinki asema',
      stationShortCode: 'HKI',
    },
    {
      stationName: 'Tampere asema',
      stationShortCode: 'TRE',
    },
  ],
};

const renderWithProviders = getRenderWithProviders({});

describe('<RailwayStationsContent />', () => {
  it('should match snapshot', () => {
    const { container } = renderWithProviders(<RailwayStationsContent {...mockProps} />);
    expect(container).toMatchSnapshot();
  });

  it('does show text', () => {
    const { container } = renderWithProviders(<RailwayStationsContent {...mockProps} />);
    const p = container.querySelectorAll('p');
    const h4 = container.querySelector('h4');
    const h5 = container.querySelectorAll('h5');
    expect(h4.textContent).toContain(mockProps.item.stationName);
    expect(h5[0].textContent).toContain(finnishTranslations['mobilityPlatform.content.departingTrains.title']);
    expect(h5[1].textContent).toContain(finnishTranslations['mobilityPlatform.content.arrivingTrains.title']);
    expect(p[0]).toBeInTheDocument();
    expect(p[1]).toBeInTheDocument();
  });
});
