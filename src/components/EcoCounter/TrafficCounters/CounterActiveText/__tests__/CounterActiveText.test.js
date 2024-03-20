/* eslint-disable react/jsx-props-no-spreading */
// Link.react.test.js
import React from 'react';
import CounterActiveText from '../index';
import { getRenderWithProviders } from '../../../../../../jestUtils';

const mockProps = {
  dataFrom: '2020-01-01',
  dataUntil: '2023-10-10',
};

const renderWithProviders = getRenderWithProviders({});

describe('<CounterActiveText />', () => {
  it('should work', () => {
    const { container } = renderWithProviders(<CounterActiveText {...mockProps} />);
    expect(container).toMatchSnapshot();
  });

  it('does show text correctly', () => {
    const { container } = renderWithProviders(<CounterActiveText {...mockProps} />);

    const p = container.querySelectorAll('p');
    expect(p[0].textContent).toEqual('Laskentatiedot ovat väliltä 01.01.2020 - 10.10.2023');
  });
});
