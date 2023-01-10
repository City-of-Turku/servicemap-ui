// Link.react.test.js
import React from 'react';
import { fireEvent } from '@testing-library/react';
import SliceList from '../index';
import { getRenderWithProviders } from '../../../../../../jestUtils';
import finnishTranslations from '../../../../../i18n/fi';

const mockProps = {
  openList: true,
  itemsToShow: 4,
  routes: [
    {
      name: 'reitti 1',
    },
    {
      name: 'reitti 2',
    },
    {
      name: 'reitti 3',
    },
    {
      name: 'reitti 4',
    },
    {
      name: 'reitti 5',
    },
  ],
  setItemsToShow: jest.fn,
};

const renderWithProviders = getRenderWithProviders({});

describe('<SliceList />', () => {
  it('should match snapshot', () => {
    const { container } = renderWithProviders(<SliceList {...mockProps} />);
    expect(container).toMatchSnapshot();
  });

  it('does show text correctly', () => {
    const { container } = renderWithProviders(<SliceList {...mockProps} />);

    const p = container.querySelectorAll('p');
    expect(p[0].textContent).toEqual(finnishTranslations['mobilityPlatform.menu.list.showMore']);
  });

  it('does contain aria-label attribute', () => {
    const { container } = renderWithProviders(<SliceList {...mockProps} />);

    const p = container.querySelectorAll('p');
    expect(p[0].getAttribute('aria-label')).toEqual(finnishTranslations['mobilityPlatform.menu.list.showMore']);
  });

  it('simulates click event', () => {
    const mockCallBack = jest.fn();
    const { container } = renderWithProviders(
      <SliceList {...mockProps} setItemsToShow={mockCallBack} />,
    );
    fireEvent.click(container.querySelector('button'));
    expect(mockCallBack.mock.calls.length).toEqual(1);
  });
});
