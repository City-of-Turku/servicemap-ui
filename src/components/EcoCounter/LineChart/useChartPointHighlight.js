/**
 * Highlights a chart point and opens its tooltip, as hovering it with a mouse would.
 * Used to follow keyboard focus in the accessible data table.
 * @param {React.RefObject} chartRef ref to the Chart.js instance
 * @param {Array} datasets the same datasets (same order, hidden ones included) that the chart was given
 */
const useChartPointHighlight = (chartRef, datasets) => {
  /**
   * @param {string} seriesKey
   * @param {number} index index of the x-axis label
   */
  const activateChartPoint = (seriesKey, index) => {
    const chart = chartRef.current;
    if (!chart) {
      return;
    }
    const datasetIndex = datasets.findIndex(dataset => dataset.key === seriesKey);
    const point = chart.getDatasetMeta(datasetIndex)?.data?.[index];
    if (datasetIndex < 0 || !point) {
      return;
    }
    const activeElements = [{ datasetIndex, index }];
    chart.setActiveElements(activeElements);
    chart.tooltip.setActiveElements(activeElements, { x: point.x, y: point.y });
    chart.update('none');
  };

  const clearChartPoint = () => {
    const chart = chartRef.current;
    if (!chart) {
      return;
    }
    chart.setActiveElements([]);
    chart.tooltip.setActiveElements([], { x: 0, y: 0 });
    chart.update('none');
  };

  return { activateChartPoint, clearChartPoint };
};

export default useChartPointHighlight;
