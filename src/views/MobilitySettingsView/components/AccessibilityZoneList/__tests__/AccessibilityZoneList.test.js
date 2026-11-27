import React from 'react';
import { fireEvent } from '@testing-library/react';
import AccessibilityZoneList from '../index';
import { getRenderWithProviders } from '../../../../../../jestUtils';

const items = [
  {
    id: 'busStopsWalking-Kauppatori',
    name: 'Kauppatori',
    category: 'busStopsWalking',
    transport: 'walking',
    minutes: [5, 10, 15],
  },
  {
    id: 'busStopsWalking-Kohmo',
    name: 'Kohmo',
    category: 'busStopsWalking',
    transport: 'walking',
    minutes: [5, 10, 15],
  },
  {
    id: 'busStopsWalking-Skanssi',
    name: 'Skanssi',
    category: 'busStopsWalking',
    transport: 'walking',
    minutes: [5, 10, 15],
  },
];

const mockProps = {
  openList: true,
  items,
  itemsPerPage: 2,
  selections: [items[0]],
  setState: jest.fn(),
};

const renderWithProviders = getRenderWithProviders({
  settings: { mapType: 'servicemap' },
});

describe('<AccessibilityZoneList />', () => {
  it('should work', () => {
    const { container } = renderWithProviders(<AccessibilityZoneList {...mockProps} />);
    expect(container).toMatchSnapshot();
  });

  it('renders paginated items and minutes of the selected item', () => {
    const { container, getByText, queryByText } = renderWithProviders(<AccessibilityZoneList {...mockProps} />);

    const checkboxes = container.querySelectorAll('input[type="checkbox"]');
    expect(checkboxes).toHaveLength(2);
    expect(checkboxes[0].checked).toBe(true);
    expect(checkboxes[1].checked).toBe(false);
    expect(getByText('Kauppatori')).toBeInTheDocument();
    expect(getByText('Kohmo')).toBeInTheDocument();
    expect(queryByText('Skanssi')).not.toBeInTheDocument();
    expect(getByText('Aikavyöhykkeet')).toBeInTheDocument();
    expect(getByText('5 min')).toBeInTheDocument();
    expect(getByText('10 min')).toBeInTheDocument();
    expect(getByText('15 min')).toBeInTheDocument();
  });

  it('renders legend lines with the colors and dash pattern of the map', () => {
    const { container } = renderWithProviders(<AccessibilityZoneList {...mockProps} />);

    const lines = container.querySelectorAll('li svg line');
    expect(lines).toHaveLength(3);
    expect(lines[0].getAttribute('stroke')).toBe('rgba(15, 115, 6, 255)');
    expect(lines[2].getAttribute('stroke')).toBe('rgba(163, 79, 0, 255)');
    expect(lines[0].getAttribute('stroke-dasharray')).toBe('12 6 3');
  });

  it('draws legend lines with the text color on the contrast map', () => {
    const renderContrast = getRenderWithProviders({ settings: { mapType: 'accessible_map' } });
    const { container } = renderContrast(<AccessibilityZoneList {...mockProps} />);

    const lines = container.querySelectorAll('li svg line');
    expect(lines[0].getAttribute('stroke')).toBe('currentColor');
    expect(lines[0].getAttribute('stroke-width')).toBe('5');
    expect(lines[2].getAttribute('stroke-width')).toBe('3');
  });

  it('calls setState with the clicked item', () => {
    const setState = jest.fn();
    const { container } = renderWithProviders(<AccessibilityZoneList {...mockProps} setState={setState} />);

    fireEvent.click(container.querySelectorAll('input[type="checkbox"]')[1]);
    expect(setState).toHaveBeenCalledWith(items[1]);
  });

  it('filters the items by name, also from the other pages', () => {
    const {
      container, getByLabelText, getByText, queryByText,
    } = renderWithProviders(
      <AccessibilityZoneList {...mockProps} />,
    );
    fireEvent.change(getByLabelText('Hae nimellä'), { target: { value: 'skan' } });
    expect(getByText('Skanssi')).toBeInTheDocument();
    expect(queryByText('Kauppatori')).not.toBeInTheDocument();
    expect(container.querySelectorAll('input[type="checkbox"]')).toHaveLength(1);

    fireEvent.change(getByLabelText('Hae nimellä'), { target: { value: 'xyz' } });
    expect(getByText('Ei hakua vastaavia kohteita.')).toBeInTheDocument();
    expect(container.querySelectorAll('input[type="checkbox"]')).toHaveLength(0);
  });

  it('renders nothing when the list is closed', () => {
    const { container } = renderWithProviders(<AccessibilityZoneList {...mockProps} openList={false} />);
    expect(container.querySelectorAll('input[type="checkbox"]')).toHaveLength(0);
    expect(container.querySelectorAll('input[type="search"]')).toHaveLength(0);
    expect(container.querySelectorAll('button')).toHaveLength(0);
  });
});
