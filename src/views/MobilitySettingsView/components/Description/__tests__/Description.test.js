// Link.react.test.js
import React from 'react';
import Description from '../index';
import { getRenderWithProviders } from '../../../../../../jestUtils';
import { initialState } from '../../../../../redux/reducers/user';

const mockProps = {
  route: {
    description: 'testikuvaus',
    description_en: 'test description',
    description_sv: 'test beskrivning',
  },
};

const renderWithProviders = getRenderWithProviders({
  user: initialState,
});

describe('<Description />', () => {
  it('should work', () => {
    const { container } = renderWithProviders(<Description {...mockProps} />);
    expect(container).toMatchSnapshot();
  });

  it('does show text correctly', () => {
    const { container } = renderWithProviders(<Description {...mockProps} />);

    const p = container.querySelectorAll('p');
    expect(p[0].textContent).toEqual(mockProps.route.description);
  });
});
