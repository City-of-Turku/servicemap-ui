import React from 'react';
import RouteListItem from '../index';
import { getRenderWithProviders } from '../../../../../../jestUtils';
import { initialState } from '../../../../../redux/reducers/user';

const mockProps = {
  item: {
    id: '123test',
    name_fi: 'reitti',
    name_en: 'route',
    name_sv: 'rutt',
  },
  routeAttr: '123test',
  type: 'CultureRoute',
  setRouteState: jest.fn,
};

const renderWithProviders = getRenderWithProviders({
  user: initialState,
});

describe('<RouteListItem />', () => {
  it('should match snapshot', () => {
    const { container } = renderWithProviders(<RouteListItem {...mockProps} />);
    expect(container).toMatchSnapshot();
  });

  it('does show text correctly', () => {
    const { container } = renderWithProviders(<RouteListItem {...mockProps} />);

    const p = container.querySelectorAll('p');
    expect(p[0].textContent).toContain(mockProps.item.name_fi);
  });

  it('does contain aria-label attribute', () => {
    const { container } = renderWithProviders(<RouteListItem {...mockProps} />);

    const p = container.querySelectorAll('p');
    expect(p[0].getAttribute('aria-label')).toContain(mockProps.item.name_fi);
  });
});
