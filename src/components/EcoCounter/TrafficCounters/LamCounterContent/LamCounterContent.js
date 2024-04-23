/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  useEffect, useState, forwardRef, useRef,
} from 'react';
import { useSelector } from 'react-redux';
import { Typography, useMediaQuery } from '@mui/material';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { css } from '@emotion/css';
import styled from '@emotion/styled';
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
  addWeeks,
  subDays,
} from 'date-fns';
import { enGB, fi, sv } from 'date-fns/locale';
import { ReactSVG } from 'react-svg';
import iconCar from 'servicemap-ui-turku/assets/icons/icons-icon_car.svg';
import {
  fetchInitialDayDatas,
  fetchInitialHourData,
  fetchInitialMonthDatas,
  fetchInitialWeekDatas,
  fetchInitialYearData,
  fetchSelectedYearData,
} from '../../EcoCounterRequests/ecoCounterRequests';
import { formatDates, formatMonths } from '../../utils';
import LineChart from '../../LineChart';
import InputDate from '../../InputDate';
import CounterActiveText from '../CounterActiveText';
import {
  StyledButtonBase,
  StyledChartContainer,
  StyledContentHeader,
  StyledDateContainer,
  StyledHeaderSubtitle,
  StyledIconContainer,
  StyledStepsContainer,
  StyledUserTypeText,
  StyledUserTypesContainer,
} from '../../styled/styled';

const CustomInput = forwardRef((props, ref) => <InputDate {...props} ref={ref} />);

const LamCounterContent = ({ station }) => {
  const [lamCounterHour, setLamCounterHour] = useState([]);
  const [lamCounterDay, setLamCounterDay] = useState([]);
  const [lamCounterWeek, setLamCounterWeek] = useState([]);
  const [lamCounterMonth, setLamCounterMonth] = useState([]);
  const [lamCounterYear, setLamCounterYear] = useState(null);
  const [lamCounterMultipleYears, setLamCounterMultipleYears] = useState([]);
  const [channel1Counts, setChannel1Counts] = useState([]);
  const [channel2Counts, setChannel2Counts] = useState([]);
  const [channelTotals, setChannelTotals] = useState([]);
  const [lamCounterLabels, setLamCounterLabels] = useState([]);
  const [currentTime, setCurrentTime] = useState('hour');
  const [activeStep, setActiveStep] = useState(0);

  const intl = useIntl();
  const locale = useSelector(state => state.user.locale);
  const inputRef = useRef(null);

  const useMobileStatus = () => useMediaQuery('(max-width:768px)');
  const isNarrow = useMobileStatus();

  const stationId = station?.id;
  const stationName = station?.name;
  const stationSource = station?.csv_data_source;
  const userTypes = station?.sensor_types;
  const dataFrom = station?.data_from_date;
  const dataUntil = station?.data_until_date;

  const [selectedDate, setSelectedDate] = useState(subDays(new Date(dataUntil), 1));

  const iconClass = css({
    fill: 'rgb(255, 255, 255)',
    width: '40px',
    height: '40px',
  });

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
    {
      step: {
        type: 'year',
        text: intl.formatMessage({ id: 'ecocounter.year' }),
      },
    },
  ];

  const renderUserTypeText = userType => {
    if (userType === 'at') {
      return (
        <div>
          <StyledUserTypeText variant="body2">
            {intl.formatMessage({ id: 'ecocounter.car' })}
          </StyledUserTypeText>
        </div>
      );
    }
    return null;
  };

  const renderUserTypeIcon = userType => {
    if (userType === 'at') {
      return (
        <StyledIconContainer>
          <ReactSVG className={iconClass} src={iconCar} />
        </StyledIconContainer>
      );
    }
    return null;
  };

  const changeDate = newDate => {
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
  const checkWeekNumber = dateValue => {
    const start = getWeek(startOfMonth(dateValue));
    const end = getWeek(endOfMonth(dateValue));
    if (start > end) {
      return 1;
    }
    return start;
  };

  // Initial values that are used to fetch data
  const initialDate = new Date(dataUntil);
  const initialDateFormat = format(initialDate, 'yyyy-MM-dd');
  const initialDateStart = format(startOfWeek(initialDate), 'yyyy-MM-dd');
  const initialDateEnd = format(endOfWeek(initialDate), 'yyyy-MM-dd');
  const initialWeekStart = checkWeekNumber(initialDate);
  const initialWeekEnd = getWeek(endOfMonth(initialDate));
  const initialMonth = getMonth(initialDate);
  const initialYear = getYear(initialDate);

  // Values that change based on the datepicker value
  const selectedDateFormat = format(selectedDate, 'yyyy-MM-dd');
  const selectedDateStart = format(startOfWeek(selectedDate, 1), 'yyyy-MM-dd');
  const selectedDateEnd = format(endOfWeek(selectedDate, 1), 'yyyy-MM-dd');
  const selectedWeekStart = checkWeekNumber(selectedDate);
  const selectedWeekEnd = getWeek(endOfMonth(selectedDate));
  let selectedMonth = getMonth(initialDate);
  const selectedYear = getYear(selectedDate);

  // Reset selectedDate value when the new popup is opened.
  useEffect(() => {
    setSelectedDate(subDays(new Date(dataUntil), 1));
  }, [stationId]);

  // This will show full year if available
  const checkYear = () => {
    if (getYear(selectedDate) < getYear(initialDate)) {
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

  /**
   * Format weeks and display first day of each week in data
   * @param {date} weekValue
   * @returns {*string}
   */
  const formatWeeks = weekValue => {
    const startOfSelectedWeek = startOfWeek(new Date(selectedYear, 0, 1), { weekStartsOn: 1 });
    const targetWeekStartDate = addWeeks(startOfSelectedWeek, weekValue - 1);
    return format(targetWeekStartDate, 'dd.MM', { weekStartsOn: 1 });
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
    setChannel1Counts(channel1Counts => [...channel1Counts, newValue1]);
    setChannel2Counts(channel2Counts => [...channel2Counts, newValue2]);
    setChannelTotals(channelTotals => [...channelTotals, newValue3]);
  };

  /**
   * Function that will process data & update state values
   * @param {Array} data
   * @param {function} labelFormatter
   */
  const processData = (data, labelFormatter) => {
    data.forEach(el => {
      if (el.station === stationId) {
        const countsArr = [el.value_ak, el.value_ap, el.value_at];
        setAllChannelCounts(countsArr[0], countsArr[1], countsArr[2]);
        setLamCounterLabels(lamCounterLabels => [...lamCounterLabels, labelFormatter(el)]);
      }
    });
  };

  const processHourData = () => {
    setLamCounterLabels(labelsHour);
    if (lamCounterHour?.station === stationId) {
      const countsArr = [];
      countsArr.push(lamCounterHour.values_ak, lamCounterHour.values_ap, lamCounterHour.values_at);
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
      processData(lamCounterDay, el => formatDates(el.day_info.date));
    } else if (currentTime === 'week') {
      processData(lamCounterWeek, el => formatWeeks(el.week_info.week_number));
    } else if (currentTime === 'month') {
      processData(lamCounterMonth, el => formatMonths(el.month_info.month_number, intl));
    } else if (currentTime === 'year') {
      processData(lamCounterMultipleYears, el => el.year_info.year_number);
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
    setLamCounterLabels(labelsHour);
    fetchInitialHourData(initialDateFormat, stationId, setLamCounterHour);
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

  useEffect(() => {
    fetchSelectedYearData(selectedYear, initialYear, stationId, setLamCounterMultipleYears);
  }, [selectedYear, stationId]);

  // useEffect is used to fill the chart with default data (default step is 'hourly')
  useEffect(() => {
    processHourData();
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
  const formatCounterName = name => name?.split('_').splice(1).join(' ');

  return (
    <>
      <StyledContentHeader isNarrow={isNarrow}>
        <StyledHeaderSubtitle component="h4">
          {stationSource === 'LC' ? formatCounterName(stationName) : stationName}
        </StyledHeaderSubtitle>
        <StyledDateContainer>
          <DatePicker
            selected={selectedDate}
            onChange={newDate => changeDate(newDate)}
            locale={locale}
            dateFormat="P"
            showYearDropdown
            dropdownMode="select"
            minDate={new Date(dataFrom)}
            maxDate={new Date(dataUntil)}
            customInput={<CustomInput inputRef={inputRef} />}
          />
        </StyledDateContainer>
      </StyledContentHeader>
      <div>
        <StyledUserTypesContainer>
          {userTypes?.map(userType => (
            <div key={userType}>
              {renderUserTypeIcon(userType)}
              {renderUserTypeText(userType)}
            </div>
          ))}
        </StyledUserTypesContainer>
        {lamCounterYear?.value_at === 0 ? (
          <StyledMissingDataText>
            <Typography component="p" variant="body2">
              {intl.formatMessage({ id: 'trafficCounter.year.warning.text' }, { value: selectedYear })}
            </Typography>
          </StyledMissingDataText>
        ) : null}
        <CounterActiveText dataFrom={dataFrom} dataUntil={dataUntil} />
        <StyledChartContainer>
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
        </StyledChartContainer>
        <StyledStepsContainer>
          {buttonSteps.map((timing, i) => (
            <StyledButtonBase
              key={timing.step.type}
              type="button"
              sx={
                i === activeStep
                  ? { backgroundColor: 'rgba(7, 44, 115, 255)', color: 'rgb(255, 255, 255)', padding: '4px 8px' }
                  : { color: 'rgb(0, 0, 0)', padding: '4px 8px' }
              }
              onClick={() => handleClick(timing.step.type, i)}
            >
              <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
                {timing.step.text}
              </Typography>
            </StyledButtonBase>
          ))}
        </StyledStepsContainer>
      </div>
    </>
  );
};

const StyledMissingDataText = styled.div(({ theme }) => ({
  textAlign: 'center',
  margin: `${theme.spacing(1)} 0`,
}));

LamCounterContent.propTypes = {
  station: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    csv_data_source: PropTypes.string,
    sensor_types: PropTypes.arrayOf(PropTypes.string),
    data_from_date: PropTypes.string,
    data_until_date: PropTypes.string,
  }),
};

LamCounterContent.defaultProps = {
  station: {
    id: 0,
    name: '',
    csv_data_source: '',
    sensor_types: [],
    data_from_date: '2010-02-01',
    data_until_date: '2020-30-01',
  },
};

export default LamCounterContent;
