// Link.react.test.js
import React from 'react';
import MobilityProfilesContent from '../index';
import { initialState } from '../../../../../../redux/reducers/user';
import finnishTranslations from '../../../../../../i18n/fi';
import { getRenderWithProviders } from '../../../../../../../jestUtils';

const mockProps = {
  postcodeArea: {
    name: {
      en: '20210',
      fi: '20210',
      sv: '20210',
    },
  },
  mobilityProfiles: [
    {
      postal_code_string: '20210',
      postal_code_type_string: 'Home',
      result: 3,
      result_topics: {
        fi: 'Joustava Jänis',
        sv: 'Hinderfri Hare',
        en: 'Hassle-free Hare',
      },
      count: 10,
    },
  ],
};

const renderWithProviders = getRenderWithProviders({
  user: initialState,
});

describe('<MobilityProfilesContent />', () => {
  it('should match snapshot', () => {
    const { container } = renderWithProviders(<MobilityProfilesContent {...mockProps} />);
    expect(container).toMatchSnapshot();
  });

  it('does show text correctly', () => {
    const { container } = renderWithProviders(<MobilityProfilesContent {...mockProps} />);

    const p = container.querySelectorAll('p');
    expect(p[0].textContent).toContain(`${finnishTranslations['area.mobilityResults.postCodeArea'].replace(
      '{value}',
      mockProps.postcodeArea.name.fi,
    )}`);
    expect(p[1].textContent).toContain(mockProps.mobilityProfiles[0].result_topics.fi);
    expect(p[2].textContent).toContain(mockProps.mobilityProfiles[0].count);
  });
});
