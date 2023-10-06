import React from 'react';
import { fireEvent } from '@testing-library/react';
import { getRenderWithProviders } from '../../../../../jestUtils';
import InputDate from '../index';

const mockProps = {
  value: 'Test value',
};

const renderWithProviders = getRenderWithProviders({});

describe('<InputDate />', () => {
  it('renders without crashing', () => {
    const { container } = renderWithProviders(<InputDate onClick={() => {}} onChange={() => {}} />);
    expect(container).toBeTruthy();
  });

  it('should match snapshot', () => {
    const { container } = renderWithProviders(<InputDate onClick={() => {}} onChange={() => {}} />);
    expect(container).toMatchSnapshot();
  });

  it('displays the provided value', () => {
    const { getByDisplayValue } = renderWithProviders(<InputDate value={mockProps.value} onClick={() => {}} onChange={() => {}} />);
    expect(getByDisplayValue(mockProps.value)).toBeInTheDocument();
  });

  it('calls the onClick function when clicked', () => {
    const onClickMock = jest.fn();
    const { getByRole } = renderWithProviders(<InputDate onClick={onClickMock} onChange={() => {}} />);
    fireEvent.click(getByRole('button'));
    expect(onClickMock).toHaveBeenCalled();
  });
});
