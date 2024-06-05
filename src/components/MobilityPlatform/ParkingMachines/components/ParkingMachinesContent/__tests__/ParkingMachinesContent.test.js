// Link.react.test.js
import React from 'react';
import ParkingMachinesContent from '../index';
import { initialState } from '../../../../../../redux/reducers/user';
import finnishTranslations from '../../../../../../i18n/fi';
import { getRenderWithProviders } from '../../../../../../../jestUtils';

const mockProps = {
  item: {
    address_fi: 'osoite',
    address_en: 'address',
    address_sv: 'addres',
    extra: {
      taksa: '0,5 €/h',
      maksutapa_en: 'Coin, card, contactless',
      maksutapa_fi: 'Kolikko, kortti, lähimaksu',
      maksutapa_sv: 'Mynt, kort, kontaktlös',
      muu_tieto_en: 'Tariff 0,5 €/h first 8h, 0,2 €/h time over 8h',
      muu_tieto_fi: 'Taksa 0,5€/h ensimmäiset 8h, 0,2€/h aika yli 8h',
      muu_tieto_sv: 'Taxa 0,5 €/t första 8t, 0,2 €/t efter 8t',
    },
  },
};

const renderWithProviders = getRenderWithProviders({
  user: initialState,
});

describe('<ParkingMachinesContent />', () => {
  it('should match snapshot', () => {
    const { container } = renderWithProviders(<ParkingMachinesContent {...mockProps} />);
    expect(container).toMatchSnapshot();
  });

  it('does show text correctly', () => {
    const { container } = renderWithProviders(<ParkingMachinesContent {...mockProps} />);

    const h3 = container.querySelectorAll('h3');
    const p = container.querySelectorAll('p');
    expect(h3[0].textContent).toContain(finnishTranslations['mobilityPlatform.content.parkingMachine.title']);
    expect(p[0].textContent).toContain(`Osoite: ${mockProps.item.address_fi}`);
    expect(p[1].textContent).toContain('Maksu: 0,5 €/h');
    expect(p[2].textContent).toContain(`Maksutavat: ${mockProps.item.extra.maksutapa_fi}`);
    expect(p[3].textContent).toContain(`Lisätietoja: ${mockProps.item.extra.muu_tieto_fi}`);
  });
});
