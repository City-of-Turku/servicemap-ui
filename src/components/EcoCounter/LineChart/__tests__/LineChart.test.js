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
      const table = screen.getByRole('grid', { name: 'Liikennemäärät: Testiasema, Pyöräily, tunneittain 02.03.2025' });

      const columnHeaders = within(table).getAllByRole('columnheader');
      expect(columnHeaders.map(th => th.textContent)).toEqual(['Suunta', '00:00', '01:00']);
      columnHeaders.forEach(th => expect(th).toHaveAttribute('scope', 'col'));

      const rowHeaders = within(table).getAllByRole('rowheader');
      expect(rowHeaders.map(th => th.textContent)).toEqual(['Yhteensä']);
      expect(rowHeaders[0]).toHaveAttribute('scope', 'row');

      expect(within(table).getAllByRole('gridcell').map(td => td.textContent)).toEqual(['4', '6']);
    });

    it('describes the hour and week columns in the column headers', () => {
      const columnHeaders = () => within(screen.getByRole('grid')).getAllByRole('columnheader')
        .slice(1)
        .map(th => th.textContent);

      const { rerender } = renderWithProviders(<LineChart {...defaultProps} timeStep="hour" />);
      expect(columnHeaders()).toEqual(['klo 00:00', 'klo 01:00']);

      rerender(<LineChart {...defaultProps} labels={['03.03', '10.03']} timeStep="week" />);
      expect(columnHeaders()).toEqual(['Viikko alkaen 03.03', 'Viikko alkaen 10.03']);

      rerender(<LineChart {...defaultProps} labels={['03.03', '04.03']} timeStep="day" />);
      expect(columnHeaders()).toEqual(['03.03', '04.03']);
    });

    it('adds and removes rows when series are toggled', () => {
      renderWithProviders(<LineChart {...defaultProps} />);
      fireEvent.click(screen.getByRole('checkbox', { name: 'Keskustaan' }));
      const rowHeaders = () => within(screen.getByRole('grid')).getAllByRole('rowheader').map(th => th.textContent);
      expect(rowHeaders()).toEqual(['Keskustaan', 'Yhteensä']);

      fireEvent.click(screen.getByRole('checkbox', { name: 'Yhteensä' }));
      expect(rowHeaders()).toEqual(['Keskustaan']);
    });

    it('formats numbers with the current locale', () => {
      renderWithProviders(<LineChart {...defaultProps} channelTotalsData={[12345, 6]} />);
      const cells = within(screen.getByRole('grid')).getAllByRole('gridcell');
      expect(cells[0].textContent).toBe(new Intl.NumberFormat('fi').format(12345));
    });

    it('is a single tab stop on the first value cell', () => {
      renderWithProviders(<LineChart {...defaultProps} />);
      const [firstCell, secondCell] = within(screen.getByRole('grid')).getAllByRole('gridcell');
      expect(firstCell).toHaveAttribute('tabindex', '0');
      expect(secondCell).toHaveAttribute('tabindex', '-1');
    });

    it('keeps cells without a value unfocusable', () => {
      jest.clearAllMocks();
      renderWithProviders(
        <LineChart {...defaultProps} labels={['00:00', '01:00', '02:00']} channelTotalsData={[null, 6]} />,
      );
      const [missingCell, valueCell, beyondDataCell] = within(screen.getByRole('grid')).getAllByRole('gridcell');

      expect(valueCell).toHaveAttribute('tabindex', '0');
      [missingCell, beyondDataCell].forEach(td => {
        expect(td).not.toHaveAttribute('tabindex');
        expect(td.textContent).toBe('');
        fireEvent.focus(td);
      });
      expect(mockChart.setActiveElements).not.toHaveBeenCalled();
    });

    it('moves focus between value cells with the arrow, Home and End keys', () => {
      renderWithProviders(
        <LineChart
          {...defaultProps}
          labels={['00:00', '01:00', '02:00', '03:00']}
          channel1Data={[1, 2, null, 4]}
          channelTotalsData={[5, null, 7, 8]}
        />,
      );
      fireEvent.click(screen.getByRole('checkbox', { name: 'Keskustaan' }));
      const rows = within(screen.getByRole('grid')).getAllByRole('row');
      const toCells = within(rows[1]).getAllByRole('gridcell');
      const totalCells = within(rows[2]).getAllByRole('gridcell');

      toCells[0].focus();
      fireEvent.keyDown(toCells[0], { key: 'ArrowRight' });
      expect(toCells[1]).toHaveFocus();
      // Skips the cell without a value
      fireEvent.keyDown(toCells[1], { key: 'ArrowRight' });
      expect(toCells[3]).toHaveFocus();
      fireEvent.keyDown(toCells[3], { key: 'ArrowRight' });
      expect(toCells[3]).toHaveFocus();
      fireEvent.keyDown(toCells[3], { key: 'ArrowDown' });
      expect(totalCells[3]).toHaveFocus();
      fireEvent.keyDown(totalCells[3], { key: 'Home' });
      expect(totalCells[0]).toHaveFocus();
      fireEvent.keyDown(totalCells[0], { key: 'End' });
      expect(totalCells[3]).toHaveFocus();
      fireEvent.keyDown(totalCells[3], { key: 'ArrowLeft' });
      expect(totalCells[2]).toHaveFocus();
      // No value above, focus stays
      fireEvent.keyDown(totalCells[2], { key: 'ArrowUp' });
      expect(totalCells[2]).toHaveFocus();
    });

    it('keeps the last focused cell as the tab stop', () => {
      renderWithProviders(<LineChart {...defaultProps} />);
      const [firstCell, secondCell] = within(screen.getByRole('grid')).getAllByRole('gridcell');

      firstCell.focus();
      fireEvent.keyDown(firstCell, { key: 'ArrowRight' });
      expect(firstCell).toHaveAttribute('tabindex', '-1');
      expect(secondCell).toHaveAttribute('tabindex', '0');
    });

    it('moves the tab stop to the first value cell when the focused series is hidden', () => {
      renderWithProviders(<LineChart {...defaultProps} />);
      fireEvent.click(screen.getByRole('checkbox', { name: 'Keskustaan' }));
      const rows = within(screen.getByRole('grid')).getAllByRole('row');
      const lastTotalCell = within(rows[2]).getAllByRole('gridcell')[1];
      lastTotalCell.focus();

      fireEvent.click(screen.getByRole('checkbox', { name: 'Yhteensä' }));
      const cells = within(screen.getByRole('grid')).getAllByRole('gridcell');
      expect(cells.map(td => td.getAttribute('tabindex'))).toEqual(['0', '-1']);
    });

    it('highlights the matching chart point and opens its tooltip when a cell is focused', () => {
      jest.clearAllMocks();
      renderWithProviders(<LineChart {...defaultProps} />);
      // Show 'Keskustaan' as well, so the visible rows and the chart's dataset indexes differ
      fireEvent.click(screen.getByRole('checkbox', { name: 'Keskustaan' }));
      const rows = within(screen.getByRole('grid')).getAllByRole('row');
      // rows[0] is the header row, rows[2] is 'Yhteensä' which is the 3rd chart dataset (index 2)
      const secondTotalCell = within(rows[2]).getAllByRole('gridcell')[1];

      secondTotalCell.focus();
      expect(mockChart.setActiveElements).toHaveBeenLastCalledWith([{ datasetIndex: 2, index: 1 }]);
      expect(mockChart.tooltip.setActiveElements).toHaveBeenLastCalledWith(
        [{ datasetIndex: 2, index: 1 }],
        { x: 32, y: 40 },
      );
      expect(mockChart.update).toHaveBeenCalled();

      secondTotalCell.blur();
      expect(mockChart.setActiveElements).toHaveBeenLastCalledWith([]);
      expect(mockChart.tooltip.setActiveElements).toHaveBeenLastCalledWith([], { x: 0, y: 0 });
    });

    it('keeps the chart point active while focus moves between cells', () => {
      jest.clearAllMocks();
      renderWithProviders(<LineChart {...defaultProps} />);
      const [firstCell, secondCell] = within(screen.getByRole('grid')).getAllByRole('gridcell');

      firstCell.focus();
      // jsdom leaves relatedTarget unset when focus moves, browsers set it to the cell gaining focus
      fireEvent.blur(firstCell, { relatedTarget: secondCell });
      expect(mockChart.setActiveElements).not.toHaveBeenCalledWith([]);
    });

    it('renders a column for every label, even when labels repeat', () => {
      renderWithProviders(<LineChart {...defaultProps} labels={['2025', '2025']} />);
      expect(within(screen.getByRole('grid')).getAllByRole('gridcell')).toHaveLength(2);
    });

    it('is not rendered, nor mentioned in the chart name, when no series is visible', () => {
      renderWithProviders(<LineChart {...defaultProps} />);
      fireEvent.click(screen.getByRole('checkbox', { name: 'Yhteensä' }));
      expect(screen.queryByRole('grid')).not.toBeInTheDocument();
      expect(screen.getByTestId('mock-chart')).toHaveAttribute(
        'aria-label',
        'Kuvaaja: Testiasema, Pyöräily, tunneittain 02.03.2025.',
      );
    });

    it('is not rendered, nor mentioned in the chart name, when the visible series have no values', () => {
      renderWithProviders(<LineChart {...defaultProps} channelTotalsData={[null, null]} />);
      expect(screen.queryByRole('grid')).not.toBeInTheDocument();
      expect(screen.getByTestId('mock-chart')).toHaveAttribute(
        'aria-label',
        'Kuvaaja: Testiasema, Pyöräily, tunneittain 02.03.2025.',
      );
    });

    it('leaves out the rows of series without any values', () => {
      renderWithProviders(<LineChart {...defaultProps} channel1Data={[null, null]} />);
      fireEvent.click(screen.getByRole('checkbox', { name: 'Keskustaan' }));
      const rowHeaders = within(screen.getByRole('grid')).getAllByRole('rowheader').map(th => th.textContent);
      expect(rowHeaders).toEqual(['Yhteensä']);
    });

    it('clears the chart point when the series of the focused cell is hidden', () => {
      jest.clearAllMocks();
      renderWithProviders(<LineChart {...defaultProps} />);
      fireEvent.click(screen.getByRole('checkbox', { name: 'Keskustaan' }));
      const rows = within(screen.getByRole('grid')).getAllByRole('row');
      within(rows[1]).getAllByRole('gridcell')[0].focus();
      expect(mockChart.setActiveElements).toHaveBeenLastCalledWith([{ datasetIndex: 0, index: 0 }]);

      fireEvent.click(screen.getByRole('checkbox', { name: 'Keskustaan' }));
      expect(mockChart.setActiveElements).toHaveBeenLastCalledWith([]);
    });

    it('clears the chart point when the table is removed while a cell has focus', () => {
      jest.clearAllMocks();
      renderWithProviders(<LineChart {...defaultProps} />);
      within(screen.getByRole('grid')).getAllByRole('gridcell')[0].focus();
      expect(mockChart.setActiveElements).toHaveBeenLastCalledWith([{ datasetIndex: 2, index: 0 }]);

      fireEvent.click(screen.getByRole('checkbox', { name: 'Yhteensä' }));
      expect(screen.queryByRole('grid')).not.toBeInTheDocument();
      expect(mockChart.setActiveElements).toHaveBeenLastCalledWith([]);
    });

    it('is not rendered while there is no data', () => {
      renderWithProviders(<LineChart {...defaultProps} channelTotalsData={[]} />);
      expect(screen.queryByRole('grid')).not.toBeInTheDocument();
    });
  });

  it('keeps all series checkboxes while data is loading', () => {
    renderWithProviders(<LineChart {...defaultProps} channel1Data={[]} channel2Data={[]} channelTotalsData={[]} />);
    expect(screen.getAllByRole('checkbox')).toHaveLength(3);
  });
});
