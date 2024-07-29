// Link.react.test.js
import React from 'react';
import LinkBasic from '../index';
import { getRenderWithProviders } from '../../../../../../jestUtils';
import finnishTranslations from '../../../../../i18n/fi';

const mockProps = {
  linkUrl: 'https://www.turku.fi/feedback',
  translationId: 'info.view.feedback.link',
};

const renderWithProviders = getRenderWithProviders({});

describe('<LinkBasic />', () => {
  it('should work', () => {
    const { container } = renderWithProviders(<LinkBasic {...mockProps} />);
    expect(container).toMatchSnapshot();
  });

  it('does show text correctly', () => {
    const { container } = renderWithProviders(<LinkBasic {...mockProps} />);

    const p = container.querySelectorAll('p');
    expect(p[0].textContent).toContain(finnishTranslations['info.view.feedback.link']);
  });
});
