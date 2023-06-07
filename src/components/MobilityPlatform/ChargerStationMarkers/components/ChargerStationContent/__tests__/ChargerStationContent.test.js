/* eslint-disable max-len */
// Link.react.test.js
import React from 'react';
import ChargerStationContent from '../index';
import { initialState } from '../../../../../../redux/reducers/user';
import finnishTranslations from '../../../../../../i18n/fi';
import { getRenderWithProviders } from '../../../../../../../jestUtils';

const mockProps = {
  station: {
    name: 'Testinimi',
    name_en: 'Testname',
    name_sv: 'Testnamn',
    address: 'testiosoite',
    address_fi: 'osoite',
    address_en: 'address',
    address_sv: 'addres',
    extra: {
      payment: 'maksullinen',
      administrator: {
        fi: 'Testiylläpitäjä',
        en: 'Testadmin',
        sv: 'Testadmin',
      },
      chargers: [
        {
          plug: 'CCS',
          number: 4,
          power: 50,
        },
      ],
    },
  },
};

const renderWithProviders = getRenderWithProviders({
  user: initialState,
});

describe('<ChargerStationContent />', () => {
  it('should match snapshot', () => {
    const { container } = renderWithProviders(<ChargerStationContent {...mockProps} />);
    expect(container).toMatchSnapshot();
  });

  it('does show text correctly', () => {
    const { container } = renderWithProviders(<ChargerStationContent {...mockProps} />);

    const h3 = container.querySelectorAll('h3');
    const p = container.querySelectorAll('p');
    expect(p[0].textContent).toEqual(mockProps.station.name);
    expect(h3[0].textContent).toEqual(`${finnishTranslations['mobilityPlatform.content.chargersTitle']}:`);
    expect(p[1].textContent).toEqual(`Osoite: ${mockProps.station.address_fi}`);
    expect(p[2].textContent).toEqual(`Ylläpitäjä: ${mockProps.station.extra.administrator.fi}`);
    expect(p[3].textContent).toEqual(`${finnishTranslations['mobilityPlatform.chargerStations.content.charge']}`);
    expect(p[4].textContent).toEqual(`Sähkölatausaseman tyyppi: ${mockProps.station.extra.chargers[0].plug}`);
    expect(p[5].textContent).toEqual(`Määrä: ${mockProps.station.extra.chargers[0].number}`);
    expect(p[6].textContent).toEqual('Teho: 50 kW');
  });
});
