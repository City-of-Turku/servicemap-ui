import React, { useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { Line } from 'react-chartjs-2';
import { StyledSeriesChoices } from '../styled/styled';
import ChartDataTable from './ChartDataTable';
import SeriesSwatch from './SeriesSwatch';
import useChartPointHighlight from './useChartPointHighlight';
import {
  SERIES_KEYS, buildDatasets, chartOptions, getInitialVisibility,
} from './chartConfig';

let chartInstanceCount = 0;

const LineChart = ({
  labels,
  channel1Data,
  channel2Data,
  channelTotalsData,
  labelChannel1,
  labelChannel2,
  labelChannelTotal,
  description,
}) => {
  const intl = useIntl();
  const chartRef = useRef(null);
  const [visibleSeries, setVisibleSeries] = useState(getInitialVisibility);
  // Unique per chart so the series checkbox ids don't clash when several popups are open
  const [seriesInputName] = useState(() => {
    chartInstanceCount += 1;
    return `ecocounter-chart-series-${chartInstanceCount}`;
  });

  const toggleSeries = (key) => {
    setVisibleSeries((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const datasets = useMemo(() => buildDatasets([
    { key: SERIES_KEYS.to, label: labelChannel1, data: channel1Data },
    { key: SERIES_KEYS.from, label: labelChannel2, data: channel2Data },
    { key: SERIES_KEYS.total, label: labelChannelTotal, data: channelTotalsData },
  ], visibleSeries), [
    channel1Data,
    channel2Data,
    channelTotalsData,
    labelChannel1,
    labelChannel2,
    labelChannelTotal,
    visibleSeries,
  ]);

  const { activateChartPoint, clearChartPoint } = useChartPointHighlight(chartRef, datasets);

  const data = useMemo(() => ({ labels, datasets }), [labels, datasets]);

  const tableDatasets = datasets.filter(
    (dataset) => !dataset.hidden && dataset.data.length > 0,
  );
  const hasTable = labels.length > 0 && tableDatasets.length > 0;

  return (
    <div className="chart-container">
      <StyledSeriesChoices
        type="checkbox"
        name={seriesInputName}
        legend={intl.formatMessage({ id: 'ecocounter.chart.seriesGroup' })}
        options={datasets.map(({ key, label }) => ({ value: key, label }))}
        isSelected={(key) => visibleSeries[key]}
        onChange={toggleSeries}
        renderOption={({ value, label }) => (
          <span className="choice-face">
            <SeriesSwatch seriesKey={value} />
            <span className="series-label">{label}</span>
          </span>
        )}
      />
      {/* react-chartjs-2 renders the canvas with role="img"; aria-label gives it an accessible name */}
      <Line
        ref={chartRef}
        data={data}
        options={chartOptions}
        aria-label={intl.formatMessage(
          {
            id: hasTable
              ? 'ecocounter.chart.ariaLabel'
              : 'ecocounter.chart.ariaLabelNoTable',
          },
          { details: description },
        )}
      />
      {hasTable && (
        <ChartDataTable
          caption={intl.formatMessage(
            { id: 'ecocounter.chart.table.caption' },
            { details: description },
          )}
          labels={labels}
          datasets={tableDatasets}
          onCellFocus={activateChartPoint}
          onCellBlur={clearChartPoint}
        />
      )}
    </div>
  );
};

LineChart.propTypes = {
  labels: PropTypes.arrayOf(PropTypes.any).isRequired,
  labelChannel1: PropTypes.string.isRequired,
  labelChannel2: PropTypes.string.isRequired,
  labelChannelTotal: PropTypes.string.isRequired,
  channel1Data: PropTypes.arrayOf(PropTypes.any).isRequired,
  channel2Data: PropTypes.arrayOf(PropTypes.any).isRequired,
  channelTotalsData: PropTypes.arrayOf(PropTypes.any).isRequired,
  /** What the chart shows, e.g. 'Teatteriranta, Pyöräily, kuukausittain 2025' */
  description: PropTypes.string.isRequired,
};

export default LineChart;
