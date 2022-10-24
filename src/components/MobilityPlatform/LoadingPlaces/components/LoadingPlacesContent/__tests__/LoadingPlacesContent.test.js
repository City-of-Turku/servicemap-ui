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
      Lastaus: {
        fi: 'Testi',
        en: 'Test',
        sv: 'Test',
      },
      Lisatieto: {
        fi: 'Testitieto',
        en: 'Test info',
        sv: 'Test info',
      },
      Muutanimi: {
        fi: 'Testiteksti',
        en: 'Test text',
        sv: 'Test text',
      },
      Saavutetta: {
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

    const h6 = container.querySelectorAll('h6');
    const p = container.querySelectorAll('p');
    expect(h6[0].textContent).toContain(mockProps.item.name_fi);
    expect(p[0].textContent).toContain(`Osoite: ${mockProps.item.address_fi}`);
    expect(p[1].textContent).toContain(mockProps.item.extra.Lastaus.fi);
    expect(p[2].textContent).toContain(mockProps.item.extra.Lisatieto.fi);
    expect(p[3].textContent).toContain(mockProps.item.extra.Muutanimi.fi);
    expect(p[4].textContent).toContain(mockProps.item.extra.Saavutetta.fi);
  });
});
