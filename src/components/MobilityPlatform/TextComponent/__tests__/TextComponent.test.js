// Link.react.test.js
import React from 'react';
import TextComponent from '../index';
import { initialState } from '../../../../redux/reducers/user';
import { getRenderWithProviders } from '../../../../../jestUtils';

const mockProps = {
  textObj: {
    desc_fi: 'Testiteksti',
    desc_en: 'Test text',
    desc_sv: 'Test skrivning',
  },
};

const renderWithProviders = getRenderWithProviders({
  user: initialState,
});

describe('<TextComponent />', () => {
  it('should match snapshot', () => {
    const { container } = renderWithProviders(<TextComponent {...mockProps} />);
    expect(container).toMatchSnapshot();
  });

  it('does show text correctly', () => {
    const { container } = renderWithProviders(<TextComponent {...mockProps} />);

    const p = container.querySelectorAll('p');
    expect(p[0].textContent).toContain(mockProps.textObj.desc_fi);
  });
});
