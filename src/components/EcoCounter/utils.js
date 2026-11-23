import { format } from 'date-fns';

/**
 * Format dates for the chart
 * @param {date} dateValue
 * @returns {*string}
 */
const formatDates = (dateValue) => {
  const fields = dateValue.split('-');
  return `${fields[2]}.${fields[1]}`;
};

/**
 * Format full date with year as well
 * @param {string} dateValue
 * @returns string
 */
const formatFullDates = (dateValue) => {
  const dates = dateValue.split('-');
  return `${dates[2]}.${dates[1]}.${dates[0]}`;
};

/**
 * Return months as string based on numerical value
 * @param {*number} monthValue
 * @param {*function} intl
 * @returns {*function}
 */
const formatMonths = (monthValue, intl) => {
  switch (monthValue) {
    case 1:
      return intl.formatMessage({ id: 'ecocounter.jan' });
    case 2:
      return intl.formatMessage({ id: 'ecocounter.feb' });
    case 3:
      return intl.formatMessage({ id: 'ecocounter.march' });
    case 4:
      return intl.formatMessage({ id: 'ecocounter.april' });
    case 5:
      return intl.formatMessage({ id: 'ecocounter.may' });
    case 6:
      return intl.formatMessage({ id: 'ecocounter.june' });
    case 7:
      return intl.formatMessage({ id: 'ecocounter.july' });
    case 8:
      return intl.formatMessage({ id: 'ecocounter.aug' });
    case 9:
      return intl.formatMessage({ id: 'ecocounter.sep' });
    case 10:
      return intl.formatMessage({ id: 'ecocounter.oct' });
    case 11:
      return intl.formatMessage({ id: 'ecocounter.nov' });
    case 12:
      return intl.formatMessage({ id: 'ecocounter.dec' });
    default:
      return monthValue;
  }
};

const CHART_PERIOD_MESSAGE_IDS = {
  hour: 'ecocounter.chart.period.hour',
  day: 'ecocounter.chart.period.day',
  week: 'ecocounter.chart.period.week',
  month: 'ecocounter.chart.period.month',
  year: 'ecocounter.chart.period.year',
};

/**
 * Describe the time period shown on the chart for the given step.
 * The values must be the same ones that are used to fetch the chart data,
 * so that the description matches what is drawn.
 * @param {object} intl
 * @param {object} params
 * @param {string} params.step hour | day | week | month | year
 * @param {Date} params.selectedDate date selected in the date picker
 * @param {string} params.weekStart first date of the 'day' step, yyyy-MM-dd
 * @param {string} params.weekEnd last date of the 'day' step, yyyy-MM-dd
 * @param {number} params.selectedYear year of the selected date
 * @param {number} params.latestYear last year shown in the 'year' step
 * @returns {string}
 */
const getChartPeriodText = (intl, {
  step, selectedDate, weekStart, weekEnd, selectedYear, latestYear,
}) => {
  let period;
  switch (step) {
    case 'hour':
      period = formatFullDates(format(selectedDate, 'yyyy-MM-dd'));
      break;
    case 'day':
      period = `${formatFullDates(weekStart)}–${formatFullDates(weekEnd)}`;
      break;
    case 'week':
      period = intl.formatDate(selectedDate, { month: 'long', year: 'numeric' });
      break;
    case 'month':
      period = `${selectedYear}`;
      break;
    case 'year':
      period = selectedYear === latestYear ? `${selectedYear}` : `${selectedYear}–${latestYear}`;
      break;
    default:
      return '';
  }
  return intl.formatMessage({ id: CHART_PERIOD_MESSAGE_IDS[step] }, { period });
};

/**
 * Short description of what the chart shows, e.g. 'Teatteriranta, Pyöräily, kuukausittain 2025'.
 * Used in the accessible name of the chart canvas and in the caption of the accessible data table.
 * @param {object} intl
 * @param {object} params
 * @param {string} params.stationName
 * @param {string} [params.userTypeText] e.g. 'Pyöräily'
 * @param {object} params.period see getChartPeriodText
 * @returns {string}
 */
const getChartDescription = (intl, { stationName, userTypeText, period }) => (
  [stationName, userTypeText, getChartPeriodText(intl, period)].filter(Boolean).join(', ')
);

export {
  formatDates, formatFullDates, formatMonths, getChartPeriodText, getChartDescription,
};
