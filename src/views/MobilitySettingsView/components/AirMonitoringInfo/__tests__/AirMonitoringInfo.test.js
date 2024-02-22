// Link.react.test.js
import React from 'react';
import AirMonitoringInfo from '../index';
import { initialState } from '../../../../../redux/reducers/user';
import { getRenderWithProviders } from '../../../../../../jestUtils';
import finnishTranslations from '../../../../../i18n/fi';

const mockProps = {
  infoTexts: {
    paragraph1: 'mobilityPlatform.info.airMonitoring.paragraph.1',
    paragraph2: 'mobilityPlatform.info.airMonitoring.paragraph.2',
    paragraph3: 'mobilityPlatform.info.airMonitoring.paragraph.3',
    link: 'mobilityPlatform.info.airMonitoring.link',
    url: {
      fi: 'https://www.ilmatieteenlaitos.fi/ilmanlaatu',
      en: 'https://en.ilmatieteenlaitos.fi/air-quality',
      sv: 'https://sv.ilmatieteenlaitos.fi/luftkvalitet',
    },
  },
};

const renderWithProviders = getRenderWithProviders({
  user: initialState,
});

describe('<AirMonitoringInfo />', () => {
  it('should match snapshot', () => {
    const { container } = renderWithProviders(<AirMonitoringInfo {...mockProps} />);
    expect(container).toMatchSnapshot();
  });

  it('does show text correctly', () => {
    const { container } = renderWithProviders(<AirMonitoringInfo {...mockProps} />);

    const p = container.querySelectorAll('p');
    const link = container.querySelector('a');
    expect(p[0].textContent).toContain(finnishTranslations['mobilityPlatform.info.airMonitoring.paragraph.1']);
    expect(p[1].textContent).toContain(finnishTranslations['mobilityPlatform.info.airMonitoring.paragraph.2']);
    expect(p[2].textContent).toContain(finnishTranslations['mobilityPlatform.info.airMonitoring.paragraph.3']);
    expect(link.textContent).toContain(finnishTranslations['mobilityPlatform.info.airMonitoring.link']);
  });
});
