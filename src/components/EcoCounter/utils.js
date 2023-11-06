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

export { formatDates, formatFullDates, formatMonths };
