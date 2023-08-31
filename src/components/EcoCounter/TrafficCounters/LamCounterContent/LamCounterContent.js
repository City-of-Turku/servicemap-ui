/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-nested-ternary */
import React, {
  useEffect, useState, forwardRef, useRef,
} from 'react';
import { useSelector } from 'react-redux';
import { ButtonBase, Typography } from '@mui/material';
import { CalendarMonth } from '@mui/icons-material';
import PropTypes from 'prop-types';
import DatePicker, { registerLocale } from 'react-datepicker';
import {
  endOfMonth,
  startOfMonth,
  format,
  getMonth,
  getWeek,
  getYear,
  startOfWeek,
  endOfWeek,
  subMonths,
  addWeeks,
} from 'date-fns';
import enGB from 'date-fns/locale/en-GB';
import fi from 'date-fns/locale/fi';
import sv from 'date-fns/locale/sv';
import { ReactSVG } from 'react-svg';
import iconCar from 'servicemap-ui-turku/assets/icons/icons-icon_car.svg';
import {
  fetchInitialDayDatas,
  fetchInitialHourData,
  fetchInitialMonthDatas,
  fetchInitialWeekDatas,
  fetchInitialYearData,
} from '../../EcoCounterRequests/ecoCounterRequests';
import LineChart from '../../LineChart';
import InputDate from '../../InputDate';

const CustomInput = forwardRef((props, ref) => <InputDate {...props} ref={ref} />);

const LamCounterContent = ({
  classes, intl, station,
}) => {
  const [lamCounterHour, setLamCounterHour] = useState([]);
  const [lamCounterDay, setLamCounterDay] = useState([]);
  const [lamCounterWeek, setLamCounterWeek] = useState([]);
  const [lamCounterMonth, setLamCounterMonth] = useState([]);
  const [lamCounterYear, setLamCounterYear] = useState(null);
  const [channel1Counts, setChannel1Counts] = useState([]);
  const [channel2Counts, setChannel2Counts] = useState([]);
  const [channelTotals, setChannelTotals] = useState([]);
  const [lamCounterLabels, setLamCounterLabels] = useState([]);
  const [currentTime, setCurrentTime] = useState('hour');
  const [activeStep, setActiveStep] = useState(0);
  const [selectedDate, setSelectedDate] = useState(startOfMonth(subMonths(new Date(), 1)));

  const locale = useSelector((state) => state.user.locale);
  const inputRef = useRef(null);

  const stationId = station.id;
  const stationName = station.name;
  const stationSource = station.csv_data_source;
  const userTypes = station.sensor_types;

  // steps that determine which data is shown on the chart
  const buttonSteps = [
    {
      step: {
        type: 'hour',
        text: intl.formatMessage({ id: 'ecocounter.hour' }),
      },
    },
    {
      step: {
        type: 'day',
        text: intl.formatMessage({ id: 'ecocounter.day' }),
      },
    },
    {
      step: {
        type: 'week',
        text: intl.formatMessage({ id: 'ecocounter.week' }),
      },
    },
    {
      step: {
        type: 'month',
        text: intl.formatMessage({ id: 'ecocounter.month' }),
      },
    },
  ];

  const renderUserTypeText = (userType) => {
    if (userType === 'at') {
      return (
        <div className={classes.textContainer}>
          <Typography variant="body2" className={classes.userTypeText}>
            {intl.formatMessage({ id: 'ecocounter.car' })}
          </Typography>
        </div>
      );
    }
    return null;
  };

  const renderUserTypeIcon = (userType) => {
    if (userType === 'at') {
      return (
        <div className={classes.iconWrapper}>
          <ReactSVG className={classes.iconActive} src={iconCar} />
        </div>
      );
    }
    return null;
  };

  const changeDate = (newDate) => {
    setSelectedDate(newDate);
  };

  // Set datepicker language
  useEffect(() => {
    if (locale === 'en') {
      registerLocale('en', enGB);
    } else if (locale === 'sv') {
      registerLocale('sv', sv);
    } else registerLocale('fi', fi);
  }, [locale]);

  // API returns empty data if start_week_number parameter is higher number than end_week_number.
  // This will set it to 1 so that weekly graph in January won't be empty in case week number of 1.1 is 52 or 53.
  const checkWeekNumber = (dateValue) => {
    const start = getWeek(startOfMonth(dateValue));
    const end = getWeek(endOfMonth(dateValue));
    if (start > end) {
      return 1;
    }
    return start;
  };

  // Initial values that are used to fetch data
  const currentDate = new Date();
  const lastMonth = subMonths(currentDate, 1);
  const lastMonthFormat = format(lastMonth, 'yyyy-MM-dd');
  const initialDateStart = format(startOfWeek(lastMonth), 'yyyy-MM-dd');
  const initialDateEnd = format(endOfWeek(lastMonth), 'yyyy-MM-dd');
  const initialWeekStart = checkWeekNumber(lastMonth);
  const initialWeekEnd = getWeek(endOfMonth(lastMonth));
  const initialMonth = getMonth(lastMonth);
  const initialYear = getYear(lastMonth);

  // Values that change based on the datepicker value
  const selectedDateFormat = format(selectedDate, 'yyyy-MM-dd');
  const selectedDateStart = format(startOfWeek(selectedDate, 1), 'yyyy-MM-dd');
  const selectedDateEnd = format(endOfWeek(selectedDate, 1), 'yyyy-MM-dd');
  const selectedWeekStart = checkWeekNumber(selectedDate);
  const selectedWeekEnd = getWeek(endOfMonth(selectedDate));
  let selectedMonth = getMonth(currentDate);
  const selectedYear = getYear(selectedDate);

  // Reset selectedDate value when the new popup is opened.
  useEffect(() => {
    setSelectedDate(startOfMonth(subMonths(currentDate, 1)));
  }, [stationId]);

  // This will show full year if available
  const checkYear = () => {
    if (getYear(selectedDate) < getYear(currentDate)) {
      selectedMonth = 12;
    }
  };

  useEffect(() => {
    checkYear();
  }, [selectedDate]);

  const labelsHour = [
    '1:00',
    '2:00',
    '3:00',
    '4:00',
    '5:00',
    '6:00',
    '7:00',
    '8:00',
    '9:00',
    '10:00',
    '11:00',
    '12:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
    '18:00',
    '19:00',
    '20:00',
    '21:00',
    '22:00',
    '23:00',
    '00:00',
  ];

  // Format dates for the chart
  const formatDates = (dateValue) => {
    const fields = dateValue.split('-');
    return `${fields[2]}.${fields[1]}`;
  };

  // Format weeks and display first day of each week in data
  const formatWeeks = (weekValue) => {
    const startOfSelectedWeek = startOfWeek(new Date(selectedYear, 0, 1), { weekStartsOn: 1 });
    const targetWeekStartDate = addWeeks(startOfSelectedWeek, weekValue - 1);
    return format(targetWeekStartDate, 'dd.MM', { weekStartsOn: 1 });
  };

  const formatMonths = (monthValue) => {
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

  // Empties chart data so that old data won't persist on the chart
  const resetChannelData = () => {
    setChannel1Counts([]);
    setChannel2Counts([]);
    setChannelTotals([]);
    setLamCounterLabels([]);
  };

  // Channel data is set inside this function to avoid duplicate code
  const setAllChannelCounts = (newValue1, newValue2, newValue3) => {
    setChannel1Counts((channel1Counts) => [...channel1Counts, newValue1]);
    setChannel2Counts((channel2Counts) => [...channel2Counts, newValue2]);
    setChannelTotals((channelTotals) => [...channelTotals, newValue3]);
  };

  // Sets channel data into React state, so it can be displayed on the chart
  // States for user type(s) and step(s) are used to filter shown data
  const setChannelData = () => {
    resetChannelData();
    if (currentTime === 'hour') {
      setLamCounterLabels(labelsHour);
      if (lamCounterHour !== null && lamCounterHour.station === stationId) {
        const countsArr = [];
        countsArr.push(lamCounterHour.values_ak, lamCounterHour.values_ap, lamCounterHour.values_at);
        setChannel1Counts(countsArr[0]);
        setChannel2Counts(countsArr[1]);
        setChannelTotals(countsArr[2]);
      }
    } else if (currentTime === 'day') {
      lamCounterDay.forEach((el) => {
        const countsArr = [];
        if (el.station === stationId) {
          countsArr.push(el.value_ak, el.value_ap, el.value_at, el.day_info.date);
        }
        setChannel1Counts((channel1Counts) => [...channel1Counts, countsArr[0]]);
        setChannel2Counts((channel2Counts) => [...channel2Counts, countsArr[1]]);
        setChannelTotals((channelTotals) => [...channelTotals, countsArr[2]]);
        setLamCounterLabels((lamCounterLabels) => [...lamCounterLabels, formatDates(countsArr[3])]);
      });
    } else if (currentTime === 'week') {
      lamCounterWeek.forEach((el) => {
        const countsArr = [];
        if (el.station === stationId) {
          countsArr.push(el.value_ak, el.value_ap, el.value_at, el.week_info.week_number);
        }
        setAllChannelCounts(countsArr[0], countsArr[1], countsArr[2]);
        setLamCounterLabels((lamCounterLabels) => [...lamCounterLabels, formatWeeks(countsArr[3])]);
      });
    } else if (currentTime === 'month') {
      lamCounterMonth.forEach((el) => {
        const countsArr = [];
        if (el.station === stationId) {
          countsArr.push(el.value_ak, el.value_ap, el.value_at, el.month_info.month_number);
        }
        setAllChannelCounts(countsArr[0], countsArr[1], countsArr[2]);
        setLamCounterLabels((lamCounterLabels) => [...lamCounterLabels, formatMonths(countsArr[3])]);
      });
    }
  };

  // Sets current step and active button index
  const setStepState = (index, timeValue) => {
    setActiveStep(index);
    setCurrentTime(timeValue);
  };

  // Set active step
  const handleClick = (title, index) => {
    if (title === 'hour') {
      setStepState(index, 'hour');
    } else if (title === 'day') {
      setStepState(index, 'day');
    } else if (title === 'week') {
      setStepState(index, 'week');
    } else if (title === 'month') {
      setStepState(index, 'month');
    }
  };

  // Fetch initial data based on the default date
  useEffect(() => {
    setLamCounterLabels(labelsHour);
    fetchInitialHourData(lastMonthFormat, stationId, setLamCounterHour);
  }, [stationId]);

  useEffect(() => {
    fetchInitialDayDatas(initialDateStart, initialDateEnd, stationId, setLamCounterDay);
  }, [stationId]);

  useEffect(() => {
    fetchInitialWeekDatas(initialYear, initialWeekStart, initialWeekEnd, stationId, setLamCounterWeek);
  }, [stationId]);

  useEffect(() => {
    fetchInitialMonthDatas(initialYear, '1', initialMonth, stationId, setLamCounterMonth);
  }, [stationId]);

  useEffect(() => {
    fetchInitialYearData(initialYear, stationId, setLamCounterYear);
  }, [stationId]);

  // Fetch updated data when selected date is changed in datepicker.
  useEffect(() => {
    setLamCounterLabels(labelsHour);
    fetchInitialHourData(selectedDateFormat, stationId, setLamCounterHour);
    setActiveStep(0);
    setCurrentTime('hour');
  }, [selectedDate, stationId]);

  useEffect(() => {
    fetchInitialDayDatas(selectedDateStart, selectedDateEnd, stationId, setLamCounterDay);
  }, [selectedDate, stationId]);

  useEffect(() => {
    fetchInitialWeekDatas(selectedYear, selectedWeekStart, selectedWeekEnd, stationId, setLamCounterWeek);
  }, [selectedDate, stationId]);

  useEffect(() => {
    fetchInitialMonthDatas(selectedYear, '1', selectedMonth, stationId, setLamCounterMonth);
  }, [selectedYear, selectedMonth, stationId]);

  useEffect(() => {
    fetchInitialYearData(selectedYear, stationId, setLamCounterYear);
  }, [selectedYear, stationId]);

  // useEffect is used to fill the chart with default data (default step is 'hourly')
  useEffect(() => {
    if (lamCounterHour !== null && lamCounterHour.station === stationId) {
      const countsArr = [];
      countsArr.push(lamCounterHour.values_ak, lamCounterHour.values_ap, lamCounterHour.values_at);
      setChannel1Counts(countsArr[0]);
      setChannel2Counts(countsArr[1]);
      setChannelTotals(countsArr[2]);
    }
  }, [lamCounterHour, stationId]);

  // When current user type or step changes, calls function to update the chart data
  useEffect(() => {
    setChannelData();
  }, [currentTime]);

  /**
     * Split name into array of words and remove special characters (_) and first index (for example 'vt1').
     * @param {string} name for example vt1_Kupittaa
     * @returns {string} for example Kupittaa
     */
  const formatCounterName = (name) => name?.split('_').splice(1).join(' ');

  return (
    <>
      <div className={classes.lamCounterHeader}>
        <Typography component="h4" className={classes.headerSubtitle}>
          {stationSource === 'LC' ? formatCounterName(stationName) : stationName}
        </Typography>
        <div className={classes.dateContainer}>
          <DatePicker
            selected={selectedDate}
            onChange={(newDate) => changeDate(newDate)}
            locale={locale}
            dateFormat="P"
            customInput={<CustomInput inputRef={inputRef} />}
          />
          <CalendarMonth />
        </div>
      </div>
      <div className={classes.lamCounterContent}>
        <div className={classes.lamCounterUserTypes}>
          {userTypes?.map((userType) => (
            <div key={userType} className={classes.container}>
              {renderUserTypeIcon(userType)}
              {renderUserTypeText(userType)}
            </div>
          ))}
        </div>
        {lamCounterYear?.value_at === 0 ? (
          <div className={classes.yearText}>
            <Typography component="p" variant="body2">
              {intl.formatMessage({ id: 'trafficCounter.year.warning.text' }, { value: selectedYear })}
            </Typography>
          </div>
        ) : null}
        <div className={classes.lamCounterChart}>
          <LineChart
            labels={lamCounterLabels}
            labelChannel1={intl.formatMessage({
              id: 'ecocounter.chart.labelTo',
            })}
            labelChannel2={intl.formatMessage({
              id: 'ecocounter.chart.labelFrom',
            })}
            labelChannelTotal={intl.formatMessage({
              id: 'ecocounter.chart.labelTotal',
            })}
            channelTotalsData={channelTotals}
            channel1Data={channel1Counts}
            channel2Data={channel2Counts}
          />
        </div>
        <div className={classes.lamCounterSteps}>
          {buttonSteps.map((timing, i) => (
            <ButtonBase
              key={timing.step.type}
              type="button"
              className={i === activeStep ? `${classes.buttonActive}` : `${classes.buttonWhite}`}
              onClick={() => handleClick(timing.step.type, i)}
            >
              <Typography variant="body2" className={classes.buttonText}>
                {timing.step.text}
              </Typography>
            </ButtonBase>
          ))}
        </div>
      </div>
    </>
  );
};

LamCounterContent.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string).isRequired,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }).isRequired,
  station: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    csv_data_source: PropTypes.string,
    sensor_types: PropTypes.arrayOf(PropTypes.string),
  }),
};

LamCounterContent.defaultProps = {
  station: {
    id: 0,
    name: '',
    csv_data_source: '',
    sensor_types: [],
  },
};

export default LamCounterContent;
