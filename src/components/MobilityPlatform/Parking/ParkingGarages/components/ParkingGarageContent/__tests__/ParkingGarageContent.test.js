// Link.react.test.js
import React from 'react';
import { getRenderWithProviders } from '../../../../../../../../jestUtils';
import finnishTranslations from '../../../../../../../i18n/fi';
import { initialState } from '../../../../../../../redux/reducers/user';
import ParkingGarageContent from '../index';

const mockProps = {
  item: {
    name_fi: 'Pysäköintihalli',
    address_fi: 'Testikatu 1',
    extra: {
      parking_spaces: 620,
      disabled_spaces: 2,
      charging_stations: '1 x Type 2 22 kW',
      services: {
        fi: 'Sähköauton latauspiste, kameravalvonta',
      },
    },
  },
};

const renderWithProviders = getRenderWithProviders({
  user: initialState,
});

describe('<ParkingGarageContent />', () => {
  it('does match snapshot', () => {
    const { container } = renderWithProviders(<ParkingGarageContent {...mockProps} />);
    expect(container).toMatchSnapshot();
  });

  it('does show text correctly', () => {
    const { container } = renderWithProviders(<ParkingGarageContent {...mockProps} />);

    const p = container.querySelectorAll('p');
    expect(p[0].textContent).toContain(mockProps.item.name_fi);
    expect(p[1].textContent).toContain(
      `${finnishTranslations['mobilityPlatform.content.address'].replace(
        '{value}',
        `${mockProps.item.address_fi}`,
      )}`,
    );
    expect(p[2].textContent).toContain(`${finnishTranslations['mobilityPlatform.content.parking.capacity'].replace(
      '{value}',
      `${mockProps.item.extra.parking_spaces}`,
    )}`);
    expect(p[3].textContent).toContain(`${finnishTranslations['mobilityPlatform.content.parking.disabled.capacity'].replace(
      '{value}',
      `${mockProps.item.extra.disabled_spaces}`,
    )}`);
    expect(p[4].textContent).toContain(`${finnishTranslations['mobilityPlatform.content.parking.chargers.capacity'].replace(
      '{value}',
      `${mockProps.item.extra.charging_stations}`,
    )}`);
    expect(p[5].textContent).toContain(mockProps.item.extra.services.fi);
  });
});
