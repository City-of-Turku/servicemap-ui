import React from 'react';
import { fireEvent, screen, within } from '@testing-library/react';
import { getRenderWithProviders } from '../../../../../jestUtils';
import LineChart from '../index';

// Fake Chart.js instance that the mocked chart exposes through its ref
const mockChart = {
  getDatasetMeta: jest.fn(datasetIndex => ({
    data: [{ x: 10 + datasetIndex, y: 20 }, { x: 30 + datasetIndex, y: 40 }],
  })),
  setActiveElements: jest.fn(),
  tooltip: { setActiveElements: jest.fn() },
  update: jest.fn(),
};

// jsdom has no canvas, so the chart is replaced with a mock that exposes the
// dataset visibility it was given.
jest.mock('react-chartjs-2', () => {
  // eslint-disable-next-line global-require
  const MockReact = require('react');
  return {
    Line: MockReact.forwardRef(({ data, options, ...canvasProps }, ref) => {
      MockReact.useImperativeHandle(ref, () => mockChart);
      return (
        <ul data-testid="mock-chart" {...canvasProps}>
          {data.datasets.map(ds => (
            <li
              key={ds.key}
              data-hidden={String(ds.hidden)}
              data-point-style={ds.pointStyle}
              data-border-dash={ds.borderDash.join(',')}
            >
              {ds.label}
            </li>
          ))}
        </ul>
      );
    }),
  };
});

const renderWithProviders = getRenderWithProviders({});

const defaultProps = {
  labels: ['00:00', '01:00'],
  labelChannel1: 'Keskustaan',
  labelChannel2: 'Keskustasta',
  labelChannelTotal: 'Yhteensä',
  channel1Data: [1, 2],
  channel2Data: [3, 4],
  channelTotalsData: [4, 6],
  description: 'Testiasema, Pyöräily, tunneittain 02.03.2025',
};

const getChartDataset = label => [...screen.getByTestId('mock-chart').querySelectorAll('li')]
  .find(li => li.textContent === label);

describe('<LineChart />', () => {
  it('renders the series as a named group of checkboxes', () => {
    renderWithProviders(<LineChart {...defaultProps} />);
    expect(screen.getByRole('group', { name: 'Valitse graafissa näytettävät laskentatiedot' })).toBeInTheDocument();
    expect(screen.getAllByRole('checkbox')).toHaveLength(3);
  });

  it('shows only the total series by default', () => {
    renderWithProviders(<LineChart {...defaultProps} />);
    expect(screen.getByRole('checkbox', { name: 'Keskustaan' })).not.toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'Keskustasta' })).not.toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'Yhteensä' })).toBeChecked();
    expect(getChartDataset('Yhteensä')).toHaveAttribute('data-hidden', 'false');
    expect(getChartDataset('Keskustaan')).toHaveAttribute('data-hidden', 'true');
  });

  it('gives each series its own marker shape and line style', () => {
    renderWithProviders(<LineChart {...defaultProps} />);
    const datasets = ['Keskustaan', 'Keskustasta', 'Yhteensä'].map(getChartDataset);
    const pointStyles = datasets.map(ds => ds.getAttribute('data-point-style'));
    const borderDashes = datasets.map(ds => ds.getAttribute('data-border-dash'));
    expect(new Set(pointStyles).size).toBe(3);
    expect(new Set(borderDashes).size).toBe(3);
  });

  it('toggles series visibility in both the checkbox and the chart', () => {
    renderWithProviders(<LineChart {...defaultProps} />);
    const toCheckbox = screen.getByRole('checkbox', { name: 'Keskustaan' });

    fireEvent.click(toCheckbox);
    expect(toCheckbox).toBeChecked();
    expect(getChartDataset('Keskustaan')).toHaveAttribute('data-hidden', 'false');

    fireEvent.click(toCheckbox);
    expect(toCheckbox).not.toBeChecked();
    expect(getChartDataset('Keskustaan')).toHaveAttribute('data-hidden', 'true');
  });

  it('gives the chart canvas an accessible name that refers to the table', () => {
    renderWithProviders(<LineChart {...defaultProps} />);
    expect(screen.getByTestId('mock-chart')).toHaveAttribute(
      'aria-label',
      'Kuvaaja: Testiasema, Pyöräily, tunneittain 02.03.2025. Tarkemmat tiedot saavutettavassa muodossa taulukossa kuvaajan jälkeen.',
    );
  });

  describe('accessible data table', () => {
    it('has a caption, column headers for the x-axis labels and row headers for the visible series', () => {
      renderWithProviders(<LineChart {...defaultProps} />);
      const table = screen.getByRole('table', { name: 'Laskentatiedot: Testiasema, Pyöräily, tunneittain 02.03.2025' });

      const columnHeaders = within(table).getAllByRole('columnheader');
      expect(columnHeaders.map(th => th.textContent)).toEqual(['Suunta', '00:00', '01:00']);
      columnHeaders.forEach(th => expect(th).toHaveAttribute('scope', 'col'));

      const rowHeaders = within(table).getAllByRole('rowheader');
      expect(rowHeaders.map(th => th.textContent)).toEqual(['Yhteensä']);
      expect(rowHeaders[0]).toHaveAttribute('scope', 'row');

      expect(within(table).getAllByRole('cell').map(td => td.textContent)).toEqual(['4', '6']);
    });

    it('adds and removes rows when series are toggled', () => {
      renderWithProviders(<LineChart {...defaultProps} />);
      fireEvent.click(screen.getByRole('checkbox', { name: 'Keskustaan' }));
      const rowHeaders = () => within(screen.getByRole('table')).getAllByRole('rowheader').map(th => th.textContent);
      expect(rowHeaders()).toEqual(['Keskustaan', 'Yhteensä']);

      fireEvent.click(screen.getByRole('checkbox', { name: 'Yhteensä' }));
      expect(rowHeaders()).toEqual(['Keskustaan']);
    });

    it('formats numbers with the current locale', () => {
      renderWithProviders(<LineChart {...defaultProps} channelTotalsData={[12345, 6]} />);
      const cells = within(screen.getByRole('table')).getAllByRole('cell');
      expect(cells[0].textContent).toBe(new Intl.NumberFormat('fi').format(12345));
    });

    it('makes every value cell keyboard focusable', () => {
      renderWithProviders(<LineChart {...defaultProps} />);
      within(screen.getByRole('table')).getAllByRole('cell').forEach(td => {
        expect(td).toHaveAttribute('tabindex', '0');
      });
    });

    it('highlights the matching chart point and opens its tooltip when a cell is focused', () => {
      jest.clearAllMocks();
      renderWithProviders(<LineChart {...defaultProps} />);
      // Show 'Keskustaan' as well, so the visible rows and the chart's dataset indexes differ
      fireEvent.click(screen.getByRole('checkbox', { name: 'Keskustaan' }));
      const rows = within(screen.getByRole('table')).getAllByRole('row');
      // rows[0] is the header row, rows[2] is 'Yhteensä' which is the 3rd chart dataset (index 2)
      const secondTotalCell = within(rows[2]).getAllByRole('cell')[1];

      fireEvent.focus(secondTotalCell);
      expect(mockChart.setActiveElements).toHaveBeenLastCalledWith([{ datasetIndex: 2, index: 1 }]);
      expect(mockChart.tooltip.setActiveElements).toHaveBeenLastCalledWith(
        [{ datasetIndex: 2, index: 1 }],
        { x: 32, y: 40 },
      );
      expect(mockChart.update).toHaveBeenCalled();

      fireEvent.blur(secondTotalCell);
      expect(mockChart.setActiveElements).toHaveBeenLastCalledWith([]);
      expect(mockChart.tooltip.setActiveElements).toHaveBeenLastCalledWith([], { x: 0, y: 0 });
    });

    it('keeps the chart point active while focus moves between cells', () => {
      jest.clearAllMocks();
      renderWithProviders(<LineChart {...defaultProps} />);
      const [firstCell, secondCell] = within(screen.getByRole('table')).getAllByRole('cell');

      fireEvent.focus(firstCell);
      fireEvent.blur(firstCell, { relatedTarget: secondCell });
      expect(mockChart.setActiveElements).not.toHaveBeenCalledWith([]);
    });

    it('renders a column for every label, even when labels repeat', () => {
      renderWithProviders(<LineChart {...defaultProps} labels={['2025', '2025']} />);
      expect(within(screen.getByRole('table')).getAllByRole('cell')).toHaveLength(2);
    });

    it('is not rendered, nor mentioned in the chart name, when no series is visible', () => {
      renderWithProviders(<LineChart {...defaultProps} />);
      fireEvent.click(screen.getByRole('checkbox', { name: 'Yhteensä' }));
      expect(screen.queryByRole('table')).not.toBeInTheDocument();
      expect(screen.getByTestId('mock-chart')).toHaveAttribute(
        'aria-label',
        'Kuvaaja: Testiasema, Pyöräily, tunneittain 02.03.2025.',
      );
    });

    it('is not rendered while there is no data', () => {
      renderWithProviders(<LineChart {...defaultProps} channelTotalsData={[]} />);
      expect(screen.queryByRole('table')).not.toBeInTheDocument();
    });
  });

  it('keeps all series checkboxes while data is loading', () => {
    renderWithProviders(<LineChart {...defaultProps} channel1Data={[]} channel2Data={[]} channelTotalsData={[]} />);
    expect(screen.getAllByRole('checkbox')).toHaveLength(3);
  });
});
