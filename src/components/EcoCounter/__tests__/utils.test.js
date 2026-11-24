import { createIntl } from 'react-intl';
import finnish from '../../../i18n/fi';
import english from '../../../i18n/en';
import { formatWeekStart, getChartDescription, getChartPeriodText } from '../utils';

const intlFi = createIntl({ locale: 'fi', messages: finnish });
const intlEn = createIntl({ locale: 'en', messages: english });

const basePeriod = {
  selectedDate: new Date(2025, 2, 2),
  weekStart: '2025-03-02',
  weekEnd: '2025-03-08',
  selectedYear: 2025,
  latestYear: 2026,
};

describe('getChartPeriodText', () => {
  it('describes each step with the period that is fetched for it', () => {
    expect(getChartPeriodText(intlFi, { ...basePeriod, step: 'hour' })).toBe('tunneittain 02.03.2025');
    expect(getChartPeriodText(intlFi, { ...basePeriod, step: 'day' })).toBe('päivittäin 02.03.2025–08.03.2025');
    expect(getChartPeriodText(intlFi, { ...basePeriod, step: 'week' })).toBe('viikoittain maaliskuu 2025');
    expect(getChartPeriodText(intlFi, { ...basePeriod, step: 'month' })).toBe('kuukausittain 2025');
    expect(getChartPeriodText(intlFi, { ...basePeriod, step: 'year' })).toBe('vuosittain 2025–2026');
  });

  it('shows a single year when the year range has only one year', () => {
    expect(getChartPeriodText(intlFi, { ...basePeriod, step: 'year', latestYear: 2025 })).toBe('vuosittain 2025');
  });

  it('returns an empty string for an unknown step', () => {
    expect(getChartPeriodText(intlFi, { ...basePeriod, step: 'decade' })).toBe('');
  });
});

describe('getChartDescription', () => {
  it('combines station, user type and period', () => {
    expect(getChartDescription(intlFi, {
      stationName: 'Teatteriranta',
      userTypeText: 'Pyöräily',
      period: { ...basePeriod, step: 'month' },
    })).toBe('Teatteriranta, Pyöräily, kuukausittain 2025');
  });

  it('leaves out a missing user type', () => {
    expect(getChartDescription(intlEn, {
      stationName: 'Kupittaa',
      userTypeText: '',
      period: { ...basePeriod, step: 'month' },
    })).toBe('Kupittaa, monthly, 2025');
  });
});

describe('formatWeekStart', () => {
  it('gives the Monday of the ISO week', () => {
    // 1 January 2024 is a Monday
    expect(formatWeekStart(2024, 1)).toBe('01.01');
    expect(formatWeekStart(2024, 10)).toBe('04.03');
  });

  it('starts week 1 on the Monday after 1 January when 1 January is on Friday to Sunday', () => {
    // 1 January 2021 is a Friday, ISO week 1 starts on 4 January
    expect(formatWeekStart(2021, 1)).toBe('04.01');
    expect(formatWeekStart(2021, 52)).toBe('27.12');
  });

  it('starts the first days of January, numbered as the previous ISO year\'s last week, on 1 January', () => {
    // 1–3 January 2021 belong to ISO week 53 of 2020
    expect(formatWeekStart(2021, 53)).toBe('01.01');
  });

  it('does not start week 1 before 1 January when the ISO week begins in December', () => {
    // 1 January 2026 is a Thursday, ISO week 1 starts on 29 December 2025
    expect(formatWeekStart(2026, 1)).toBe('01.01');
    expect(formatWeekStart(2026, 2)).toBe('05.01');
  });
});
