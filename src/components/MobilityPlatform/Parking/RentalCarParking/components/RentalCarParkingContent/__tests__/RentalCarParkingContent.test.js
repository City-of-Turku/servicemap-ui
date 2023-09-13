/* eslint-disable max-len */
// Link.react.test.js
import React from 'react';
import { getRenderWithProviders } from '../../../../../../../../jestUtils';
import finnishTranslations from '../../../../../../../i18n/fi';
import { initialState } from '../../../../../../../redux/reducers/user';
import RentalCarParkingContent from '../index';

const mockProps = {
  item: {
    name_fi: 'Parkkipaikka',
    address_fi: 'Testikatu 1',
    extra: {
      Paikkoja_y: 5,
      Max_aika_h: 1,
      Rajoit_lis: {
        fi: 'Lisäkilpi',
      },
      Saavutetta: 'Vapaa pääsy',
    },
  },
};

const renderWithProviders = getRenderWithProviders({
  user: initialState,
});

describe('<RentalCarParkingContent />', () => {
  it('does match snapshot', () => {
    const { container } = renderWithProviders(<RentalCarParkingContent {...mockProps} />);
    expect(container).toMatchSnapshot();
  });

  it('does show text correctly', () => {
    const { container } = renderWithProviders(<RentalCarParkingContent {...mockProps} />);

    const p = container.querySelectorAll('p');
    expect(p[0].textContent).toContain(mockProps.item.name_fi);
    expect(p[1].textContent).toContain(`Osoite: ${mockProps.item.address_fi}`);
    expect(p[2].textContent).toContain(`Parkkipaikkojen määrä: ${mockProps.item.extra.Paikkoja_y}`);
    expect(p[3].textContent).toContain(`Pysäköinnin enimmäisaika: ${mockProps.item.extra.Max_aika_h}`);
    expect(p[4].textContent).toContain(mockProps.item.extra.Rajoit_lis.fi);
    expect(p[5].textContent).toContain(finnishTranslations['mobilityPlatform.content.publicParking.access']);
  });
});
