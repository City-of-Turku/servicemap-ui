// Link.react.test.js
import React from 'react';
import LoadingPlacesContent from '../index';
import { initialState } from '../../../../../../redux/reducers/user';
import { getRenderWithProviders } from '../../../../../../../jestUtils';

const mockProps = {
  item: {
    name_fi: 'Testi',
    name_en: 'Test',
    name_sv: 'Test',
    address_fi: 'Testikatu',
    address_en: 'Test street',
    address_sv: 'Test gata',
    extra: {
      lastauspiste: {
        fi: 'Testi',
        en: 'Test',
        sv: 'Test',
      },
      rajoitustyyppi: {
        fi: 'Testitieto',
        en: 'Test info',
        sv: 'Test info',
      },
      Saavutettavuus: {
        fi: 'Testitieto',
        en: 'Test info',
        sv: 'Test info',
      },
    },
  },
};

const renderWithProviders = getRenderWithProviders({
  user: initialState,
});

describe('<LoadingPlacesContent />', () => {
  it('should match snapshot', () => {
    const { container } = renderWithProviders(<LoadingPlacesContent {...mockProps} />);
    expect(container).toMatchSnapshot();
  });

  it('does show text correctly', () => {
    const { container } = renderWithProviders(<LoadingPlacesContent {...mockProps} />);

    const p = container.querySelectorAll('p');
    expect(p[0].textContent).toContain(mockProps.item.name_fi);
    expect(p[1].textContent).toContain(`Osoite: ${mockProps.item.address_fi}`);
    expect(p[2].textContent).toContain(mockProps.item.extra.lastauspiste.fi);
    expect(p[3].textContent).toContain(mockProps.item.extra.Saavutettavuus.fi);
    expect(p[4].textContent).toContain(mockProps.item.extra.rajoitustyyppi.fi);
  });
});
