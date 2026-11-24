import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { visuallyHidden } from '@mui/utils';

const hasValue = (dataset, index) => typeof dataset?.data[index] === 'number';

/**
 * Visually hidden table that presents the chart data to screen reader users.
 * Rows are the given series and columns are the x-axis labels of the chart.
 * Cells with a value are keyboard focusable: focusing a cell lets the chart highlight the
 * matching point and show its tooltip, which also acts as the visible focus indicator.
 *
 * The table is a single tab stop (roving tabindex, WAI-ARIA grid pattern) so keyboard users
 * do not have to tab through every value to reach the controls after the chart. Arrow keys
 * move between the cells with a value, Home and End jump to the ends of the row.
 */
const ChartDataTable = ({
  caption,
  labels,
  datasets,
  onCellFocus,
  onCellBlur,
}) => {
  const intl = useIntl();
  const tableRef = useRef(null);
  const hasFocusRef = useRef(false);
  const onCellBlurRef = useRef(onCellBlur);
  onCellBlurRef.current = onCellBlur;
  // Last focused cell, used as the tab stop when focus returns to the table
  const [activeCell, setActiveCell] = useState(null);

  // Nearest cell with a value after (row, index) in the direction (dRow, dIndex), or undefined
  const findCell = (row, index, dRow, dIndex) => {
    let r = row + dRow;
    let i = index + dIndex;
    while (datasets[r] && i >= 0 && i < labels.length) {
      if (hasValue(datasets[r], i)) return { row: r, index: i };
      r += dRow;
      i += dIndex;
    }
    return undefined;
  };

  // The remembered cell may have disappeared when series or the time period changed
  const activeRow = datasets.findIndex(
    (dataset) => dataset.key === activeCell?.key,
  );
  const isActiveCellAvailable =
    activeRow !== -1 &&
    activeCell.index < labels.length &&
    hasValue(datasets[activeRow], activeCell.index);
  const tabStop = isActiveCellAvailable
    ? { row: activeRow, index: activeCell.index }
    : datasets.map((dataset, row) => findCell(row, -1, 0, 1)).find(Boolean);

  const handleKeyDown = (event, row, index) => {
    const searches = {
      ArrowRight: [row, index, 0, 1],
      ArrowLeft: [row, index, 0, -1],
      ArrowDown: [row, index, 1, 0],
      ArrowUp: [row, index, -1, 0],
      Home: [row, -1, 0, 1],
      End: [row, labels.length, 0, -1],
    };
    if (!searches[event.key]) return;
    event.preventDefault();
    const target = findCell(...searches[event.key]);
    if (target) {
      // + 1 skips the row header
      tableRef.current.tBodies[0].rows[target.row].cells[
        target.index + 1
      ].focus();
    }
  };

  const handleFocus = (datasetKey, index) => {
    hasFocusRef.current = true;
    setActiveCell({ key: datasetKey, index });
    onCellFocus(datasetKey, index);
  };

  // Moving between cells must not clear the chart point, the next cell's focus replaces it
  const handleBlur = (event) => {
    if (!tableRef.current?.contains(event.relatedTarget)) {
      hasFocusRef.current = false;
      onCellBlur();
    }
  };

  // Browsers don't fire blur when the focused cell is removed (e.g. its series is hidden), so the
  // chart point would stay highlighted. Clear it when focus has been lost that way.
  useEffect(() => {
    if (
      hasFocusRef.current &&
      !tableRef.current?.contains(document.activeElement)
    ) {
      hasFocusRef.current = false;
      onCellBlurRef.current();
    }
  });

  // The same when the whole table is removed while a cell has focus
  useEffect(
    () => () => {
      if (hasFocusRef.current) {
        onCellBlurRef.current();
      }
    },
    [],
  );

  return (
    <div style={visuallyHidden}>
      <table ref={tableRef} role="grid" aria-readonly="true">
        <caption>{caption}</caption>
        <thead>
          <tr>
            <th scope="col">
              {intl.formatMessage({
                id: 'ecocounter.chart.table.seriesHeader',
              })}
            </th>
            {labels.map((label, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <th key={index} scope="col">
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {datasets.map((dataset, row) => (
            <tr key={dataset.key}>
              <th scope="row">{dataset.label}</th>
              {labels.map((label, index) => {
                // Cells without a value have no chart point to show as the focus indicator,
                // so they are not focusable
                if (!hasValue(dataset, index)) {
                  // eslint-disable-next-line react/no-array-index-key
                  return <td key={index} role="gridcell" />;
                }
                const isTabStop =
                  tabStop?.row === row && tabStop?.index === index;
                return (
                  <td
                    // eslint-disable-next-line react/no-array-index-key
                    key={index}
                    role="gridcell"
                    tabIndex={isTabStop ? 0 : -1}
                    onFocus={() => handleFocus(dataset.key, index)}
                    onBlur={handleBlur}
                    onKeyDown={(event) => handleKeyDown(event, row, index)}
                  >
                    {intl.formatNumber(dataset.data[index])}
                  </td>
                );
              })}
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
  datasets: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string,
      label: PropTypes.string,
      hidden: PropTypes.bool,
      data: PropTypes.arrayOf(PropTypes.any),
    }),
  ).isRequired,
  onCellFocus: PropTypes.func.isRequired,
  onCellBlur: PropTypes.func.isRequired,
};

export default ChartDataTable;
