/* eslint-disable max-len */
// Link.react.test.js
import React from 'react';
import { getRenderWithProviders } from '../../../../../../../../jestUtils';
import finnishTranslations from '../../../../../../../i18n/fi';
import { initialState } from '../../../../../../../redux/reducers/user';
import PublicParkingContent from '../index';

const mockProps = {
  item: {
    name_fi: 'Parkkipaikka',
    address_fi: 'Testikatu 1',
    extra: {
      paikkoja_y: 25,
      max_aika_h: 3.0,
      rajoitustyyppi: {
        fi: 'Erityisalue',
      },
      rajoit_lisat: {
        fi: 'Kiekkopysäköinti',
      },
      saavutettavuus: {
        fi: 'vapaa paasy',
      },
    },
  },
};

const renderWithProviders = getRenderWithProviders({
  user: initialState,
});

describe('<PublicParkingContent />', () => {
  it('does match snapshot', () => {
    const { container } = renderWithProviders(<PublicParkingContent {...mockProps} />);
    expect(container).toMatchSnapshot();
  });

  it('does show text correctly', () => {
    const { container } = renderWithProviders(<PublicParkingContent {...mockProps} />);

    const p = container.querySelectorAll('p');
    expect(p[0].textContent).toContain(mockProps.item.name_fi);
    expect(p[1].textContent).toContain(`Osoite: ${mockProps.item.address_fi}`);
    expect(p[2].textContent).toContain(`Parkkipaikkojen määrä: ${mockProps.item.extra.paikkoja_y}`);
    expect(p[3].textContent).toContain(`Pysäköinnin enimmäisaika: ${mockProps.item.extra.max_aika_h}`);
    expect(p[4].textContent).toContain(mockProps.item.extra.rajoitustyyppi.fi);
    expect(p[5].textContent).toContain(mockProps.item.extra.rajoit_lisat.fi);
    expect(p[6].textContent).toContain(finnishTranslations['mobilityPlatform.content.publicParking.access']);
  });
});
