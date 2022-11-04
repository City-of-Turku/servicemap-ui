// Link.react.test.js
import React from 'react';
import TrailInfo from '../index';
import { getRenderWithProviders } from '../../../../../../jestUtils';

const mockProps = {
  item: {
    extra: {
      reitin_pituus: 5100,
    },
  },
};

const renderWithProviders = getRenderWithProviders({});

describe('<TrailInfo />', () => {
  it('should match snapshot', () => {
    const { container } = renderWithProviders(<TrailInfo {...mockProps} />);
    expect(container).toMatchSnapshot();
  });

  it('does show text correctly', () => {
    const { container } = renderWithProviders(<TrailInfo {...mockProps} />);

    const p = container.querySelectorAll('p');
    expect(p[0].textContent).toEqual('Reitin pituus: 5,1 km');
  });

  it('does contain aria-label attribute', () => {
    const { container } = renderWithProviders(<TrailInfo {...mockProps} />);

    const p = container.querySelectorAll('p');
    expect(p[0].getAttribute('aria-label')).toEqual('Reitin pituus: 5,1 km');
  });
});
