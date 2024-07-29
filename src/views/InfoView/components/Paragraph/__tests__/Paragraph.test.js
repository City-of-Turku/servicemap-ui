// Link.react.test.js
import React from 'react';
import Paragraph from '../index';
import { getRenderWithProviders } from '../../../../../../jestUtils';
import finnishTranslations from '../../../../../i18n/fi';

const mockProps = {
  isTitle: false,
  translationId: 'info.view.serviceInfo',
};

const renderWithProviders = getRenderWithProviders({});

describe('<Paragraph />', () => {
  it('should work', () => {
    const { container } = renderWithProviders(<Paragraph {...mockProps} />);
    expect(container).toMatchSnapshot();
  });

  it('does show text correctly', () => {
    const { container } = renderWithProviders(<Paragraph {...mockProps} />);

    const p = container.querySelectorAll('p');
    expect(p[0].textContent).toContain(finnishTranslations['info.view.serviceInfo']);
  });
});
