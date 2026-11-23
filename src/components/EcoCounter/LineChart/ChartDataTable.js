import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { visuallyHidden } from '@mui/utils';

/**
 * Visually hidden table that presents the chart data to screen reader users.
 * Rows are the given series and columns are the x-axis labels of the chart.
 * Value cells are keyboard focusable: focusing a cell lets the chart highlight the
 * matching point and show its tooltip, which also acts as the visible focus indicator.
 */
const ChartDataTable = ({
  caption, labels, datasets, onCellFocus, onCellBlur,
}) => {
  const intl = useIntl();

  const formatValue = value => (typeof value === 'number' ? intl.formatNumber(value) : '');

  // Moving between cells must not clear the chart point, the next cell's focus replaces it
  const handleBlur = event => {
    if (!event.currentTarget.closest('table')?.contains(event.relatedTarget)) {
      onCellBlur();
    }
  };

  return (
    <div style={visuallyHidden}>
      <table>
        <caption>{caption}</caption>
        <thead>
          <tr>
            <th scope="col">{intl.formatMessage({ id: 'ecocounter.chart.table.seriesHeader' })}</th>
            {labels.map((label, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <th key={index} scope="col">{label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {datasets.map(dataset => (
            <tr key={dataset.key}>
              <th scope="row">{dataset.label}</th>
              {labels.map((label, index) => (
                <td
                  // eslint-disable-next-line react/no-array-index-key
                  key={index}
                  tabIndex={0}
                  onFocus={() => onCellFocus(dataset.key, index)}
                  onBlur={handleBlur}
                >
                  {formatValue(dataset.data[index])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

ChartDataTable.propTypes = {
  caption: PropTypes.string.isRequired,
  labels: PropTypes.arrayOf(PropTypes.any).isRequired,
  datasets: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string,
    label: PropTypes.string,
    hidden: PropTypes.bool,
    data: PropTypes.arrayOf(PropTypes.any),
  })).isRequired,
  onCellFocus: PropTypes.func,
  onCellBlur: PropTypes.func,
};

ChartDataTable.defaultProps = {
  onCellFocus: () => {},
  onCellBlur: () => {},
};

export default ChartDataTable;
