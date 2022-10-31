/* eslint-disable max-len */
// Link.react.test.js
import React from 'react';
import CityBikeInfo from '../index';
import { initialState } from '../../../../../redux/reducers/user';
import { getRenderWithProviders } from '../../../../../../jestUtils';
import finnishTranslations from '../../../../../i18n/fi';

const mockProps = {
  bikeInfo: {
    paragraph1: 'mobilityPlatform.info.cityBikes.paragraph.1',
    paragraph2: 'mobilityPlatform.info.cityBikes.paragraph.2',
    subtitle: 'mobilityPlatform.info.cityBikes.subtitle',
    link: 'mobilityPlatform.info.cityBikes.link',
    apiInfo: 'mobilityPlatform.info.cityBikes.apiInfo',
    isWinterSeason: true,
    seasonInfo: 'mobilityPlatform.info.cityBikes.winterSeason',
    url: {
      fi: 'https://foli.fi/föllärit',
      en: 'https://www.foli.fi/en/f%C3%B6li-bikes',
      sv: 'https://www.foli.fi/sv/fölicyklar',
    },
  },
};

const renderWithProviders = getRenderWithProviders({
  user: initialState,
});

describe('<CityBikeInfo />', () => {
  it('should work', () => {
    const { container } = renderWithProviders(<CityBikeInfo {...mockProps} />);
    expect(container).toMatchSnapshot();
  });

  it('does show text correctly', () => {
    const { container } = renderWithProviders(<CityBikeInfo {...mockProps} />);

    const p = container.querySelectorAll('p');
    const link = container.querySelector('a');
    expect(p[0].textContent).toContain(finnishTranslations['mobilityPlatform.info.cityBikes.winterSeason']);
    expect(p[1].textContent).toContain(finnishTranslations['mobilityPlatform.info.cityBikes.paragraph.1']);
    expect(p[2].textContent).toContain(finnishTranslations['mobilityPlatform.info.cityBikes.paragraph.2']);
    expect(p[3].textContent).toContain(finnishTranslations['mobilityPlatform.info.cityBikes.subtitle']);
    expect(link.textContent).toContain(finnishTranslations['mobilityPlatform.info.cityBikes.link']);
    expect(p[5].textContent).toContain(finnishTranslations['mobilityPlatform.info.cityBikes.apiInfo']);
  });

  it('does contain aria-label attributes', () => {
    const { container } = renderWithProviders(<CityBikeInfo {...mockProps} />);

    const p = container.querySelectorAll('p');
    expect(p[0].getAttribute('aria-label')).toContain(finnishTranslations['mobilityPlatform.info.cityBikes.winterSeason']);
    expect(p[1].getAttribute('aria-label')).toContain(finnishTranslations['mobilityPlatform.info.cityBikes.paragraph.1']);
    expect(p[2].getAttribute('aria-label')).toContain(finnishTranslations['mobilityPlatform.info.cityBikes.paragraph.2']);
    expect(p[3].getAttribute('aria-label')).toContain(finnishTranslations['mobilityPlatform.info.cityBikes.subtitle']);
    expect(p[4].getAttribute('aria-label')).toContain(finnishTranslations['mobilityPlatform.info.cityBikes.link']);
    expect(p[5].getAttribute('aria-label')).toContain(finnishTranslations['mobilityPlatform.info.cityBikes.apiInfo']);
  });
});
