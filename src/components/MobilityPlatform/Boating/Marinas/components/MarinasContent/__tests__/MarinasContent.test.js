// Link.react.test.js
import React from 'react';
import MarinasContent from '../index';
import { getRenderWithProviders } from '../../../../../../../../jestUtils';
import finnishTranslations from '../../../../../../../i18n/fi';

const mockProps = {
  name: 'Satama: Marina',
  berths: [{
    Varattavissa: 'Kylla - julkisesti',
    Varaustyyppi: 'Venepaikat',
    HintaAlv0: 100,
    Kohdetyyppi: 'Aisapaikka',
  }],
};

const renderWithProviders = getRenderWithProviders({});

describe('<MarinasContent />', () => {
  it('should work', () => {
    const { container } = renderWithProviders(<MarinasContent {...mockProps} />);
    expect(container).toMatchSnapshot();
  });

  it('does show text correctly', () => {
    const { container } = renderWithProviders(<MarinasContent {...mockProps} />);

    const h6 = container.querySelectorAll('h6');
    const p = container.querySelectorAll('p');
    expect(h6[0].textContent).toContain(mockProps.name);
    expect(p[0].textContent).toContain(`${finnishTranslations['mobilityPlatform.content.marinas.berthsCount']}: 1`);
    expect(p[1].textContent).toContain(finnishTranslations['mobilityPlatform.content.marinas.typeTitle']);
    expect(p[2].textContent).toContain(`${finnishTranslations['mobilityPlatform.content.marinas.type']}: ${mockProps.berths[0].Kohdetyyppi}`);
    expect(p[3].textContent).toContain(`${finnishTranslations['mobilityPlatform.content.marinas.price']}: 124 €`);
    expect(p[4].textContent).toContain(finnishTranslations['mobilityPlatform.content.marinas.reservationInfo']);
    expect(p[5].textContent).toContain(finnishTranslations['mobilityPlatform.info.marinas.link']);
    expect(p[6].textContent).toContain(finnishTranslations['mobilityPlatform.content.marinas.infoLink']);
  });

  it('does show links correctly', () => {
    const { container } = renderWithProviders(<MarinasContent {...mockProps} />);

    const link = container.querySelectorAll('a');
    expect(link[0]).toBeInTheDocument();
    expect(link[1]).toBeInTheDocument();
  });
});
