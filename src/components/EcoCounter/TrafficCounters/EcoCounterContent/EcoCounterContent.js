/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react-hooks/exhaustive-deps */
import { ButtonBase, Typography, useMediaQuery } from '@mui/material';
import PropTypes from 'prop-types';
import React, {
  useEffect, useState, useRef, forwardRef,
} from 'react';
import { useSelector } from 'react-redux';
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
  subDays,
  addWeeks,
} from 'date-fns';
import enGB from 'date-fns/locale/en-GB';
import fi from 'date-fns/locale/fi';
import sv from 'date-fns/locale/sv';
import { ReactSVG } from 'react-svg';
import iconBicycle from 'servicemap-ui-turku/assets/icons/icons-icon_bicycle.svg';
import iconCar from 'servicemap-ui-turku/assets/icons/icons-icon_car.svg';
import iconWalk from 'servicemap-ui-turku/assets/icons/icons-icon_walk.svg';
import {
  fetchInitialDayDatas,
  fetchInitialHourData,
  fetchInitialMonthDatas,
  fetchInitialWeekDatas,
  fetchSelectedYearData,
} from '../../EcoCounterRequests/ecoCounterRequests';
import { formatDates, formatMonths } from '../../utils';
import LineChart from '../../LineChart';
import InputDate from '../../InputDate';

const CustomInput = forwardRef((props, ref) => <InputDate {...props} ref={ref} />);

const EcoCounterContent = ({ classes, intl, station }) => {
  const [ecoCounterHour, setEcoCounterHour] = useState([]);
  const [ecoCounterDay, setEcoCounterDay] = useState([]);
  const [ecoCounterWeek, setEcoCounterWeek] = useState([]);
  const [ecoCounterMonth, setEcoCounterMonth] = useState([]);
  const [ecoCounterMultipleYears, setEcoCounterMultipleYears] = useState([]);
  const [channel1Counts, setChannel1Counts] = useState([]);
  const [channel2Counts, setChannel2Counts] = useState([]);
  const [channelTotals, setChannelTotals] = useState([]);
  const [ecoCounterLabels, setEcoCounterLabels] = useState([]);
  const [currentType, setCurrentType] = useState('bicycle');
  const [currentTime, setCurrentTime] = useState('hour');
  const [activeStep, setActiveStep] = useState(0);
  const [selectedDate, setSelectedDate] = useState(subDays(new Date(), 1));

  const locale = useSelector((state) => state.user.locale);
  const inputRef = useRef(null);

  const useMobileStatus = () => useMediaQuery('(max-width:768px)');
  const isNarrow = useMobileStatus();

  const stationId = station.id;
  const stationName = station.name;
  const stationSource = station.csv_data_source;

  /** When all 3 user types are rendered, a reverse order is required where 'at' is placed last */
  const reverseUserTypes = () => {
    if (station.sensor_types.includes('at')) {
      return [...station.sensor_types].reverse();
    }
    return station.sensor_types;
  };

  const userTypes = reverseUserTypes();

  const setUserTypeValue = () => {
    if (userTypes.includes('at')) {
      return 1;
    }
    return 0;
  };

  const [activeType, setActiveType] = useState(setUserTypeValue());

  // steps that determine which data is shown on the chart
  const buttonSteps = [
    {
      step: {
        type: 'hour',
        visible: true,
        text: intl.formatMessage({ id: 'ecocounter.hour' }),
      },
    },
    {
      step: {
        type: 'day',
        visible: true,
        text: intl.formatMessage({ id: 'ecocounter.day' }),
      },
    },
    {
      step: {
        type: 'week',
        visible: true,
        text: intl.formatMessage({ id: 'ecocounter.week' }),
      },
    },
    {
      step: {
        type: 'month',
        visible: true,
        text: intl.formatMessage({ id: 'ecocounter.month' }),
      },
    },
    {
      step: {
        type: 'year',
        visible: stationSource !== 'TR',
        text: intl.formatMessage({ id: 'ecocounter.year' }),
      },
    },
  ];

  // Sets current user type and active button index
  const setUserTypeState = (index, typeValue) => {
    setActiveType(index);
    setCurrentType(typeValue);
  };

  const setUserTypes = (type, index) => {
    if (type === 'jt') setUserTypeState(index, 'walking');
    else if (type === 'pt') setUserTypeState(index, 'bicycle');
    else if (type === 'at') setUserTypeState(index, 'driving');
  };

  /**
   * Text component
   * @param {string} translationId
   * @returns JSX element
   */
  const userTypeText = (translationId) => (
    <div className={classes.textContainer}>
      <Typography variant="body2" className={classes.userTypeText}>
        {intl.formatMessage({ id: translationId })}
      </Typography>
    </div>
  );

  /**
   * Renders texts based on user type value
   * @param {string} userType
   * @returns JSX element
   */
  const renderUserTypeText = (userType) => {
    if (userType === 'at') {
      return userTypeText('ecocounter.car');
    }
    if (userType === 'pt') {
      return userTypeText('ecocounter.bicycle');
    }
    if (userType === 'jt') {
      return userTypeText('ecocounter.walk');
    }
    return null;
  };

  /**
   * Returns button with icon which is based on user type value
   * @param {string} userType
   * @param {node} iconValue
   * @param {number} i
   * @returns JSX Element
   */
  const userTypeButton = (userType, iconValue, i) => (
    <ButtonBase
      className={`${classes.button} ${classes.paddingNarrow} ${
        i === activeType ? classes.buttonActive : classes.buttonWhite
      }`}
      onClick={() => setUserTypes(userType, i)}
    >
      <div>
        <ReactSVG className={i === activeType ? `${classes.iconActive}` : `${classes.icon}`} src={iconValue} />
      </div>
    </ButtonBase>
  );

  /**
   * Renders buttons and icons based on user types
   * @param {string} userType
   * @param {node} iconValue
   */
  const renderUserTypeIcon = (userType, i) => {
    if (userType === 'at') {
      return userTypeButton(userType, iconCar, i);
    }
    if (userType === 'pt') {
      return userTypeButton(userType, iconBicycle, i);
    }
    if (userType === 'jt') {
      return userTypeButton(userType, iconWalk, i);
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

  /**
   * API returns empty data if start_week_number parameter is higher number than end_week_number.
   * This will set it to 1 so that weekly graph in January won't be empty in case week number of 1.1 is 52 or 53.
   * @param {*date} dateValue
   * @returns {*number}
   */
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
  const yesterDay = subDays(currentDate, 1);
  const yesterDayFormat = format(yesterDay, 'yyyy-MM-dd');
  const initialDateStart = format(startOfWeek(yesterDay, 1), 'yyyy-MM-dd');
  const initialDateEnd = format(endOfWeek(yesterDay, 1), 'yyyy-MM-dd');
  const initialWeekStart = checkWeekNumber(yesterDay);
  const initialWeekEnd = getWeek(endOfMonth(yesterDay));
  const initialMonth = getMonth(yesterDay);
  const initialYear = getYear(yesterDay);

  // Values that change based on the datepicker value
  const selectedDateFormat = format(selectedDate, 'yyyy-MM-dd');
  const selectedDateStart = format(startOfWeek(selectedDate, 1), 'yyyy-MM-dd');
  const selectedDateEnd = format(endOfWeek(selectedDate, 1), 'yyyy-MM-dd');
  const selectedWeekStart = checkWeekNumber(selectedDate);
  const selectedWeekEnd = getWeek(endOfMonth(selectedDate));
  let selectedMonth = getMonth(currentDate);
  const selectedYear = getYear(selectedDate);

  // This will show full year if available
  const checkYear = () => {
    if (getYear(selectedDate) < getYear(currentDate)) {
      selectedMonth = 12;
    }
  };

  // Reset selectedDate value when the new popup is opened.
  useEffect(() => {
    setSelectedDate(subDays(currentDate, 1));
  }, [stationId]);

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

  /**
   * Format weeks and display first day of each week in data
   * @param {date} weekValue
   * @returns {*string}
   */
  const formatWeeks = (weekValue) => {
    const startOfSelectedWeek = startOfWeek(new Date(selectedYear, 0, 1), { weekStartsOn: 1 });
    const targetWeekStartDate = addWeeks(startOfSelectedWeek, weekValue - 1);
    return format(targetWeekStartDate, 'dd.MM', { weekStartsOn: 1 });
  };

  /**
   * Empties chart data so that old data won't persist on the chart
   */
  const resetChannelData = () => {
    setChannel1Counts([]);
    setChannel2Counts([]);
    setChannelTotals([]);
    setEcoCounterLabels([]);
  };

  /**
   * Channel data is set inside this function to avoid duplicate code
   * @param {*object} newValue1
   * @param {*object} newValue2
   * @param {*object} newValue3
   */
  const setAllChannelCounts = (newValue1, newValue2, newValue3) => {
    setChannel1Counts((channel1Counts) => [...channel1Counts, newValue1]);
    setChannel2Counts((channel2Counts) => [...channel2Counts, newValue2]);
    setChannelTotals((channelTotals) => [...channelTotals, newValue3]);
  };

  /**
   * Gets correct values from data and returns them based on currentType
   * @param {object} el
   * @returns {*Array}
   */
  const getUserTypedata = (el) => {
    switch (currentType) {
      case 'walking':
        return [el.value_jk, el.value_jp, el.value_jt];
      case 'bicycle':
        return [el.value_pk, el.value_pp, el.value_pt];
      case 'driving':
        return [el.value_ak, el.value_ap, el.value_at];
      default:
        return [];
    }
  };

  /**
   * Processes data and sets correct count values into the state
   * @param {Array} data
   * @param {function} labelFormatter
   */
  const processData = (data, labelFormatter) => {
    data.forEach((el) => {
      if (el.station === stationId) {
        const countsArr = getUserTypedata(el);
        setAllChannelCounts(countsArr[0], countsArr[1], countsArr[2]);
        setEcoCounterLabels((lamCounterLabels) => [...lamCounterLabels, labelFormatter(el)]);
      }
    });
  };

  /**
   * Process hour data and set correct values into the state.
   * Hour data has different structure so few chnages are required.
   */
  const processHourData = () => {
    setEcoCounterLabels(labelsHour);
    if (ecoCounterHour?.station === stationId) {
      const countsArr = [];
      if (currentType === 'walking') {
        countsArr.push(ecoCounterHour.values_jk, ecoCounterHour.values_jp, ecoCounterHour.values_jt);
      } else if (currentType === 'bicycle') {
        countsArr.push(ecoCounterHour.values_pk, ecoCounterHour.values_pp, ecoCounterHour.values_pt);
      } else if (currentType === 'driving') {
        countsArr.push(ecoCounterHour.values_ak, ecoCounterHour.values_ap, ecoCounterHour.values_at);
      }
      setChannel1Counts(countsArr[0]);
      setChannel2Counts(countsArr[1]);
      setChannelTotals(countsArr[2]);
    }
  };

  /**
   * Sets channel data into React state, so it can be displayed on the chart.
   * States for user type(s) and step(s) are used to filter shown data.
   * */
  const setChannelData = () => {
    resetChannelData();
    if (currentTime === 'hour') {
      processHourData();
    } else if (currentTime === 'day') {
      processData(ecoCounterDay, (el) => formatDates(el.day_info.date));
    } else if (currentTime === 'week') {
      processData(ecoCounterWeek, (el) => formatWeeks(el.week_info.week_number));
    } else if (currentTime === 'month') {
      processData(ecoCounterMonth, (el) => formatMonths(el.month_info.month_number, intl));
    } else if (currentTime === 'year') {
      processData(ecoCounterMultipleYears, (el) => el.year_info.year_number);
    }
  };

  /**
   * Set current step and active button index
   * @param {*number} index
   * @param {*date} timeValue
   */
  const setStepState = (index, timeValue) => {
    setActiveStep(index);
    setCurrentTime(timeValue);
  };

  /**
   * Set active step into state
   * @param {*string} title
   * @param {*number} index
   */
  const handleClick = (title, index) => {
    if (title === 'hour') {
      setStepState(index, 'hour');
    } else if (title === 'day') {
      setStepState(index, 'day');
    } else if (title === 'week') {
      setStepState(index, 'week');
    } else if (title === 'month') {
      setStepState(index, 'month');
    } else if (title === 'year') {
      setStepState(index, 'year');
    }
  };

  // Fetch initial data based on the default date
  useEffect(() => {
    setEcoCounterLabels(labelsHour);
    fetchInitialHourData(yesterDayFormat, stationId, setEcoCounterHour);
  }, [stationId, setEcoCounterHour]);

  useEffect(() => {
    fetchInitialDayDatas(initialDateStart, initialDateEnd, stationId, setEcoCounterDay);
  }, [stationId, setEcoCounterDay]);

  useEffect(() => {
    fetchInitialWeekDatas(initialYear, initialWeekStart, initialWeekEnd, stationId, setEcoCounterWeek);
  }, [stationId, setEcoCounterWeek]);

  useEffect(() => {
    fetchInitialMonthDatas(initialYear, '1', initialMonth, stationId, setEcoCounterMonth);
  }, [stationId, setEcoCounterMonth]);

  // Fetch updated data when selected date is changed in datepicker.
  useEffect(() => {
    setEcoCounterLabels(labelsHour);
    fetchInitialHourData(selectedDateFormat, stationId, setEcoCounterHour);
    setActiveStep(0);
    setCurrentTime('hour');
  }, [selectedDate, stationId]);

  useEffect(() => {
    fetchInitialDayDatas(selectedDateStart, selectedDateEnd, stationId, setEcoCounterDay);
  }, [selectedDate, stationId]);

  useEffect(() => {
    fetchInitialWeekDatas(selectedYear, selectedWeekStart, selectedWeekEnd, stationId, setEcoCounterWeek);
  }, [selectedDate, stationId]);

  useEffect(() => {
    fetchInitialMonthDatas(selectedYear, '1', selectedMonth, stationId, setEcoCounterMonth);
  }, [selectedDate, stationId]);

  useEffect(() => {
    fetchSelectedYearData(selectedYear, initialYear, stationId, setEcoCounterMultipleYears);
  }, [selectedYear, stationId]);

  // useEffect is used to fill the chart with default data (default step is 'hourly')
  useEffect(() => {
    processHourData();
  }, [ecoCounterHour, stationId]);

  // When current user type or step changes, calls function to update the chart data
  useEffect(() => {
    setChannelData();
  }, [currentType, currentTime]);

  /**
   * Fix incorrect spelling of Teatteriranta.
   * Otherwise return input as is.
   * @param {*string} input
   * @returns {*string}
   */
  const renderStationName = (input) => {
    if (input === 'Teatteri ranta') {
      return 'Teatteriranta';
    }
    return input;
  };

  return (
    <>
      <div className={`${classes.trafficCounterHeader} ${isNarrow ? classes.widthSm : classes.widthMd}`}>
        <Typography component="h4" className={classes.headerSubtitle}>
          {stationSource === 'TR' ? 'Telraam' : renderStationName(stationName)}
        </Typography>
        <div className={classes.dateContainer}>
          <DatePicker
            selected={selectedDate}
            onChange={(newDate) => changeDate(newDate)}
            locale={locale}
            dateFormat="P"
            showYearDropdown={stationSource !== 'TR'}
            dropdownMode="select"
            minDate={stationSource === 'TR' ? new Date('2023-05-26') : new Date('2020-01-01')}
            maxDate={new Date()}
            customInput={<CustomInput inputRef={inputRef} />}
          />
        </div>
      </div>
      <div className={classes.trafficCounterContent}>
        <div className={classes.trafficCounterUserTypes}>
          {userTypes?.map((userType, i) => (
            <div key={userType} className={classes.buttonAndTextContainer}>
              {renderUserTypeIcon(userType, i)}
              {renderUserTypeText(userType)}
            </div>
          ))}
        </div>
        <div className={classes.trafficCounterChart}>
          <LineChart
            labels={ecoCounterLabels}
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
        <div className={classes.trafficCounterSteps}>
          {buttonSteps
            .filter((item) => item.step.visible)
            .map((timing, i) => (
              <ButtonBase
                key={timing.step.type}
                type="button"
                className={`${classes.button} ${classes.paddingWide} ${
                  i === activeStep ? classes.buttonActive : classes.buttonWhite
                }`}
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

EcoCounterContent.propTypes = {
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

EcoCounterContent.defaultProps = {
  station: {
    id: 0,
    name: '',
    csv_data_source: '',
    sensor_types: [],
  },
};

export default EcoCounterContent;
