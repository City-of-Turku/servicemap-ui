/* eslint-disable react-hooks/exhaustive-deps */
import { useMediaQuery } from '@mui/material';
import PropTypes from 'prop-types';
import React, {
  useCallback,
  useEffect,
  useState,
} from 'react';
import { useIntl } from 'react-intl';
import { css } from '@emotion/css';
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
} from 'date-fns';
import { ReactSVG } from 'react-svg';
import iconBicycle from 'servicemap-ui-turku/assets/icons/icons-icon_bicycle.svg';
import iconCar from 'servicemap-ui-turku/assets/icons/icons-icon_car.svg';
import iconScooter from 'servicemap-ui-turku/assets/icons/icons-icon_scooter.svg';
import iconWalk from 'servicemap-ui-turku/assets/icons/icons-icon_walk.svg';
import {
  fetchInitialDayDatas,
  fetchInitialHourData,
  fetchInitialMonthDatas,
  fetchInitialWeekDatas,
  fetchSelectedYearData,
  fetchLatest,
} from '../../EcoCounterRequests/ecoCounterRequests';
import {
  formatDates,
  formatMonths,
  formatWeekStart,
  getChartDescription,
} from '../../utils';
import {
  StyledChartContainer,
  StyledContentHeader,
  StyledDateContainer,
  StyledHeaderSubtitle,
  StyledUserTypeText,
  StyledTimeStepChoices,
  StyledUserTypeChoices,
} from '../../styled/styled';
import LineChart from '../../LineChart';
import CounterActiveText from '../CounterActiveText';
import DatePickerDialog from '../../../DatePickerDialog';
import { useMobilityPlatformContext } from '../../../../context/MobilityPlatformContext';

const USER_TYPES = {
  jt: { translationId: 'ecocounter.walk', icon: iconWalk },
  pt: { translationId: 'ecocounter.bicycle', icon: iconBicycle },
  at: { translationId: 'ecocounter.car', icon: iconCar },
  st: { translationId: 'ecocounter.scooter', icon: iconScooter },
};
const SUPPORTED_SENSOR_TYPES = Object.keys(USER_TYPES);
const FILTER_TYPE_TO_SENSOR_TYPE = {
  walking: 'jt',
  cycling: 'pt',
  driving: 'at',
  scooter: 'st',
};

const EcoCounterContent = ({ station }) => {
  const [ecoCounterHour, setEcoCounterHour] = useState([]);
  const [ecoCounterDay, setEcoCounterDay] = useState([]);
  const [ecoCounterWeek, setEcoCounterWeek] = useState([]);
  const [ecoCounterMonth, setEcoCounterMonth] = useState([]);
  const [ecoCounterMultipleYears, setEcoCounterMultipleYears] = useState([]);
  const [channel1Counts, setChannel1Counts] = useState([]);
  const [channel2Counts, setChannel2Counts] = useState([]);
  const [channelTotals, setChannelTotals] = useState([]);
  const [ecoCounterLabels, setEcoCounterLabels] = useState([]);
  const [currentTime, setCurrentTime] = useState('hour');
  const [activeStep, setActiveStep] = useState(0);

  const intl = useIntl();
  const { showTrafficCounter, lastPickedTrafficCounterFilter } =
    useMobilityPlatformContext();

  const useMobileStatus = () => useMediaQuery('(max-width:768px)');
  const isNarrow = useMobileStatus();

  const stationId = station?.id;
  const stationName = station?.name;
  const stationSource = station?.csv_data_source;
  const dataFrom = station?.data_from_date;
  const dataUntil = station?.data_until_date;

  const [selectedDate, setSelectedDate] = useState(
    subDays(new Date(dataUntil), 1),
  );

  const iconClass = css({
    fill: 'rgba(0, 0, 0, 255)',
    width: '40px',
    height: '40px',
    '& svg': {
      display: 'block',
    },
  });

  const iconActiveClass = css({
    fill: 'rgba(255, 255, 255, 255)',
    width: '40px',
    height: '40px',
    '& svg': {
      display: 'block',
    },
  });

  /** When all 3 user types are rendered, a reverse order is required where 'at' is placed last */
  const reverseUserTypes = () => {
    const validSensorTypes = (station?.sensor_types || []).filter((type) =>
      SUPPORTED_SENSOR_TYPES.includes(type),
    );
    if (validSensorTypes.includes('at')) {
      return [...validSensorTypes].reverse();
    }
    return validSensorTypes;
  };

  const userTypes = reverseUserTypes();

  const getSingleEnabledSensorType = useCallback(() => {
    const enabledFilterTypes = Object.entries(showTrafficCounter || {})
      .filter(([, isEnabled]) => isEnabled)
      .map(([filterType]) => filterType);

    if (enabledFilterTypes.length !== 1) {
      return null;
    }

    return FILTER_TYPE_TO_SENSOR_TYPE[enabledFilterTypes[0]] || null;
  }, [showTrafficCounter]);

  const getUserTypeName = (type) => {
    if (type === 'jt') return 'walking';
    if (type === 'pt') return 'bicycle';
    if (type === 'at') return 'driving';
    if (type === 'st') return 'scooter';
    return 'bicycle';
  };

  const getDefaultUserTypeIndex = () => {
    const lastPickedSensorType =
      FILTER_TYPE_TO_SENSOR_TYPE[lastPickedTrafficCounterFilter];
    if (lastPickedSensorType) {
      const lastPickedIndex = userTypes.indexOf(lastPickedSensorType);
      if (lastPickedIndex !== -1) {
        return lastPickedIndex;
      }
    }

    const singleEnabledSensorType = getSingleEnabledSensorType();
    if (singleEnabledSensorType) {
      const singleEnabledIndex = userTypes.indexOf(singleEnabledSensorType);
      if (singleEnabledIndex !== -1) {
        return singleEnabledIndex;
      }
    }

    const drivingTypeIndex = userTypes.indexOf('at');
    if (drivingTypeIndex !== -1) {
      return drivingTypeIndex;
    }
    return 0;
  };

  const [activeType, setActiveType] = useState(getDefaultUserTypeIndex());
  const [currentType, setCurrentType] = useState(
    getUserTypeName(userTypes[getDefaultUserTypeIndex()]),
  );

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
  const visibleSteps = buttonSteps.filter((item) => item.step.visible);
  const getStepIndex = (type) =>
    visibleSteps.findIndex(({ step }) => step.type === type);

  // Sets current user type and active button index
  const setUserTypeState = (index, typeValue) => {
    setActiveType(index);
    setCurrentType(typeValue);
  };

  const setUserTypes = (type, index) => {
    if (type === 'jt') setUserTypeState(index, 'walking');
    else if (type === 'pt') setUserTypeState(index, 'bicycle');
    else if (type === 'at') setUserTypeState(index, 'driving');
    else if (type === 'st') setUserTypeState(index, 'scooter');
  };

  const renderUserTypeOption = ({ value }, checked) => (
    <>
      <span className="choice-face" aria-hidden="true">
        <ReactSVG
          wrapper="span"
          className={checked ? iconActiveClass : iconClass}
          src={USER_TYPES[value].icon}
        />
      </span>
      <StyledUserTypeText variant="body2" component="span">
        {intl.formatMessage({ id: USER_TYPES[value].translationId })}
      </StyledUserTypeText>
    </>
  );

  const changeDate = (newDate) => {
    setSelectedDate(newDate);
  };

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
  const initialDate = new Date(dataUntil);
  const yesterDay = subDays(initialDate, 1);
  const initialYear = getYear(yesterDay);

  // Values that change based on the datepicker value
  const selectedDateFormat = format(selectedDate, 'yyyy-MM-dd');
  const selectedDateStart = format(startOfWeek(selectedDate, 1), 'yyyy-MM-dd');
  const selectedDateEnd = format(endOfWeek(selectedDate, 1), 'yyyy-MM-dd');
  const selectedWeekStart = checkWeekNumber(selectedDate);
  const selectedWeekEnd = getWeek(endOfMonth(selectedDate));
  const selectedYear = getYear(selectedDate);
  // Past years show all 12 months, the current year up to the latest data
  const selectedMonth =
    selectedYear < getYear(initialDate) ? 12 : getMonth(initialDate);

  // Reset selectedDate value when the new popup is opened.
  useEffect(() => {
    setSelectedDate(subDays(new Date(dataUntil), 1));
  }, [stationId]);

  useEffect(() => {
    const defaultUserTypeIndex = getDefaultUserTypeIndex();
    setActiveType(defaultUserTypeIndex);
    setCurrentType(getUserTypeName(userTypes[defaultUserTypeIndex]));
  }, [
    stationId,
    lastPickedTrafficCounterFilter,
    showTrafficCounter?.walking,
    showTrafficCounter?.cycling,
    showTrafficCounter?.driving,
    showTrafficCounter?.scooter,
  ]);

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

  const getSafeCountValue = (value) => value ?? 0;
  const getSafeSeriesValue = (value) => (Array.isArray(value) ? value : []);

  /**
   * Gets correct values from data and returns them based on currentType
   * @param {object} el
   * @returns {*Array}
   */
  const getUserTypedata = (el) => {
    switch (currentType) {
      case 'walking':
        return [
          getSafeCountValue(el.value_jk),
          getSafeCountValue(el.value_jp),
          getSafeCountValue(el.value_jt),
        ];
      case 'bicycle':
        return [
          getSafeCountValue(el.value_pk),
          getSafeCountValue(el.value_pp),
          getSafeCountValue(el.value_pt),
        ];
      case 'driving':
        return [
          getSafeCountValue(el.value_ak),
          getSafeCountValue(el.value_ap),
          getSafeCountValue(el.value_at),
        ];
      case 'scooter':
        return [
          getSafeCountValue(el.value_sk),
          getSafeCountValue(el.value_sp),
          getSafeCountValue(el.value_st),
        ];
      default:
        return [0, 0, 0];
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
        setEcoCounterLabels((lamCounterLabels) => [
          ...lamCounterLabels,
          labelFormatter(el),
        ]);
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
        countsArr.push(
          getSafeSeriesValue(ecoCounterHour.values_jk),
          getSafeSeriesValue(ecoCounterHour.values_jp),
          getSafeSeriesValue(ecoCounterHour.values_jt),
        );
      } else if (currentType === 'bicycle') {
        countsArr.push(
          getSafeSeriesValue(ecoCounterHour.values_pk),
          getSafeSeriesValue(ecoCounterHour.values_pp),
          getSafeSeriesValue(ecoCounterHour.values_pt),
        );
      } else if (currentType === 'driving') {
        countsArr.push(
          getSafeSeriesValue(ecoCounterHour.values_ak),
          getSafeSeriesValue(ecoCounterHour.values_ap),
          getSafeSeriesValue(ecoCounterHour.values_at),
        );
      } else if (currentType === 'scooter') {
        countsArr.push(
          getSafeSeriesValue(ecoCounterHour.values_sk),
          getSafeSeriesValue(ecoCounterHour.values_sp),
          getSafeSeriesValue(ecoCounterHour.values_st),
        );
      }
      setChannel1Counts(countsArr[0] ?? []);
      setChannel2Counts(countsArr[1] ?? []);
      setChannelTotals(countsArr[2] ?? []);
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
      processData(ecoCounterWeek, (el) =>
        formatWeekStart(selectedYear, el.week_info.week_number),
      );
    } else if (currentTime === 'month') {
      processData(ecoCounterMonth, (el) =>
        formatMonths(el.month_info.month_number, intl),
      );
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

  // Fetch data for the selected period (also runs on mount and when the station changes).

  useEffect(() => {
    setEcoCounterLabels(labelsHour);
    setActiveStep(0);
    setCurrentTime('hour');
    return fetchLatest(
      (set, signal) =>
        fetchInitialHourData(selectedDateFormat, stationId, set, signal),
      setEcoCounterHour,
    );
  }, [selectedDateFormat, stationId]);

  useEffect(
    () =>
      fetchLatest(
        (set, signal) =>
          fetchInitialDayDatas(
            selectedDateStart,
            selectedDateEnd,
            stationId,
            set,
            signal,
          ),
        setEcoCounterDay,
      ),
    [selectedDateStart, selectedDateEnd, stationId],
  );

  useEffect(
    () =>
      fetchLatest(
        (set, signal) =>
          fetchInitialWeekDatas(
            selectedYear,
            selectedWeekStart,
            selectedWeekEnd,
            stationId,
            set,
            signal,
          ),
        setEcoCounterWeek,
      ),
    [selectedYear, selectedWeekStart, selectedWeekEnd, stationId],
  );

  useEffect(
    () =>
      fetchLatest(
        (set, signal) =>
          fetchInitialMonthDatas(
            selectedYear,
            '1',
            selectedMonth,
            stationId,
            set,
            signal,
          ),
        setEcoCounterMonth,
      ),
    [selectedYear, selectedMonth, stationId],
  );

  useEffect(
    () =>
      fetchLatest(
        (set, signal) =>
          fetchSelectedYearData(
            selectedYear,
            initialYear,
            stationId,
            set,
            signal,
          ),
        setEcoCounterMultipleYears,
      ),
    [selectedYear, stationId],
  );

  // Redraw whenever the selection changes or data arrives, so a late response for another step can't replace it
  useEffect(() => {
    setChannelData();
  }, [
    currentType,
    currentTime,
    stationId,
    ecoCounterHour,
    ecoCounterDay,
    ecoCounterWeek,
    ecoCounterMonth,
    ecoCounterMultipleYears,
  ]);

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

  const displayedStationName =
    stationSource === 'TR' ? 'Telraam' : renderStationName(stationName);

  const userTypeMessageIds = {
    walking: 'ecocounter.walk',
    bicycle: 'ecocounter.bicycle',
    driving: 'ecocounter.car',
    scooter: 'ecocounter.scooter',
  };

  const chartDescription = getChartDescription(intl, {
    stationName: displayedStationName,
    userTypeText: userTypeMessageIds[currentType]
      ? intl.formatMessage({ id: userTypeMessageIds[currentType] })
      : '',
    period: {
      step: currentTime,
      selectedDate,
      weekStart: selectedDateStart,
      weekEnd: selectedDateEnd,
      selectedYear,
      latestYear: initialYear,
    },
  });

  return (
    <>
      <StyledContentHeader isNarrow={isNarrow}>
        <StyledHeaderSubtitle component="h4">
          {displayedStationName}
        </StyledHeaderSubtitle>
        <StyledDateContainer>
          <DatePickerDialog
            value={selectedDate}
            onChange={changeDate}
            minDate={new Date(dataFrom)}
            maxDate={new Date(dataUntil)}
            showYearSelection={stationSource !== 'TR'}
            buttonLabel={intl.formatMessage({
              id: 'ecocounter.chart.datePicker.button',
            })}
            dialogTitle={intl.formatMessage({
              id: 'ecocounter.chart.datePicker.title',
            })}
          />
        </StyledDateContainer>
      </StyledContentHeader>
      <div>
        <StyledUserTypeChoices
          type="radio"
          name={`ecocounter-${stationId}-user-type`}
          legend={intl.formatMessage({ id: 'ecocounter.chart.userTypeGroup' })}
          options={userTypes.map((userType) => ({ value: userType }))}
          isSelected={(userType) => userTypes.indexOf(userType) === activeType}
          onChange={(userType) =>
            setUserTypes(userType, userTypes.indexOf(userType))
          }
          renderOption={renderUserTypeOption}
        />
        <CounterActiveText dataFrom={dataFrom} dataUntil={dataUntil} />
        <StyledChartContainer>
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
            description={chartDescription}
            timeStep={currentTime}
          />
        </StyledChartContainer>
        <StyledTimeStepChoices
          type="radio"
          name={`ecocounter-${stationId}-time-step`}
          legend={intl.formatMessage({ id: 'ecocounter.chart.timeStepGroup' })}
          options={visibleSteps.map(({ step }) => ({
            value: step.type,
            label: step.text,
          }))}
          isSelected={(type) => getStepIndex(type) === activeStep}
          onChange={(type) => handleClick(type, getStepIndex(type))}
          renderOption={({ label }) => (
            <span className="choice-face">{label}</span>
          )}
        />
      </div>
    </>
  );
};

EcoCounterContent.propTypes = {
  station: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    csv_data_source: PropTypes.string,
    sensor_types: PropTypes.arrayOf(PropTypes.string),
    data_from_date: PropTypes.string,
    data_until_date: PropTypes.string,
    is_active: PropTypes.shape({
      30: PropTypes.bool,
    }),
  }),
};

EcoCounterContent.defaultProps = {
  station: {
    id: 0,
    name: '',
    csv_data_source: '',
    sensor_types: [],
    data_from_date: '',
    data_until_date: '',
    is_active: {},
  },
};

export default EcoCounterContent;
