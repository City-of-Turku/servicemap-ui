/**
 * Stable keys for each series. These are used to identify a dataset regardless of
 * its position in the datasets array (e.g. when mapping accessible table cells to chart points).
 */
export const SERIES_KEYS = {
  to: 'to',
  from: 'from',
  total: 'total',
};

const baseDataset = {
  fill: false,
  lineTension: 0.2,
  borderWidth: 3,
  pointRadius: 5,
  pointBackgroundColor: '#fff',
  pointBorderWidth: 2,
  // Active point (mouse hover or keyboard focus on a table cell) is clearly larger
  pointHoverRadius: 7,
  pointHoverBorderWidth: 3,
  pointHoverBackgroundColor: '#fff',
};

/**
 * Visual style per series. pointStyle and borderDash are shared by the chart and the
 * legend toggle swatches, so the HTML legend always matches what is drawn on the canvas.
 */
export const seriesStyles = {
  [SERIES_KEYS.to]: {
    color: 'rgba(0, 167, 225, 255)',
    pointStyle: 'rect',
    borderDash: [6, 4],
    visibleByDefault: false,
  },
  [SERIES_KEYS.from]: {
    color: 'rgba(235, 169, 0, 255)',
    pointStyle: 'triangle',
    borderDash: [2, 3],
    visibleByDefault: false,
  },
  [SERIES_KEYS.total]: {
    color: 'rgba(7, 44, 115, 255)',
    pointStyle: 'circle',
    borderDash: [],
    visibleByDefault: true,
  },
};

export const chartOptions = {
  responsive: true,
  aspectRatio: 2,
  plugins: {
    // The canvas legend is not keyboard accessible, so it is replaced with HTML checkboxes
    legend: {
      display: false,
    },
    tooltip: {
      usePointStyle: true,
    },
  },
  scales: {
    y: {
      ticks: {
        beginAtZero: true,
      },
    },
  },
};

export const getInitialVisibility = () => Object.fromEntries(
  Object.entries(seriesStyles).map(([key, { visibleByDefault }]) => [key, visibleByDefault]),
);

/**
 * Combines each series with its visual style and visibility into a Chart.js dataset.
 * @param {{ key: string, label: string, data: Array }[]} series
 * @param {Object<string, boolean>} visibleSeries visibility by series key
 */
export const buildDatasets = (series, visibleSeries) => series.map(({ key, label, data }) => {
  const { color, pointStyle, borderDash } = seriesStyles[key];
  return {
    ...baseDataset,
    key,
    label,
    data,
    borderColor: color,
    backgroundColor: color,
    pointStyle,
    borderDash,
    hidden: !visibleSeries[key],
  };
});
