/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  useState, useEffect, useRef, forwardRef,
} from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { ButtonBase, Typography } from '@mui/material';
import { Air } from '@mui/icons-material';
import {
  getMonth, getWeek, getYear, format, subDays,
} from 'date-fns';
import { enGB, fi, sv } from 'date-fns/locale';
import DatePicker, { registerLocale } from 'react-datepicker';
import { fetchAirMonitoringDatas, fetchAirMonitoringParameters } from '../../../AirMonitoringAPI/AirMonitoringAPI';
import { formatDates, formatMonths } from '../../../../EcoCounter/utils';
import InputDate from '../../../../EcoCounter/InputDate';
import ChartComponent from '../ChartComponent';

const CustomInput = forwardRef((props, ref) => <InputDate {...props} ref={ref} />);

const AirMonitoringContent = ({ classes, intl, station }) => {
  const [airQualityHours, setAirQualityHours] = useState([]);
  const [airQualityDays, setAirQualityDays] = useState([]);
  const [airQualityWeeks, setAirQualityWeeks] = useState([]);
  const [airQualityMonths, setAirQualityMonths] = useState([]);
  const [airQualityYears, setAirQualityYears] = useState([]);
  const [airQualityParameters, setAirQualityParameters] = useState([]);
  const [channel1Data, setChannel1Data] = useState([]);
  const [dataLabels, setDataLabels] = useState([]);
  const [currentTime, setCurrentTime] = useState('hour');
  const [activeStep, setActiveStep] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const stationId = station.id;
  const stationName = station.name;
  const parameterTypes = station.parameters;

  const locale = useSelector((state) => state.user.locale);

  const isNarrow = false;
  const inputRef = useRef(null);

  // Initial values that are used to fetch data
  const currentDate = new Date();
  const initialDateEnd = format(subDays(currentDate, 1), 'MM-dd');
  const initialDateStart = format(subDays(currentDate, 7), 'MM-dd');
  const initialWeekEnd = getWeek(currentDate);
  const initialWeekStart = getWeek(subDays(currentDate, 30));
  const initialMonth = getMonth(currentDate) + 1;
  const initialYear = getYear(currentDate);

  // Values that change based on the datepicker value
  const selectedDateEnd = format(selectedDate, 'MM-dd');
  const selectedDateStart = format(subDays(selectedDate, 7), 'MM-dd');
  const selectedWeekEnd = getWeek(selectedDate);
  const selectedWeekStart = getWeek(subDays(selectedDate, 30));
  const selectedMonth = getMonth(selectedDate) + 1;
  const selectedYear = getYear(selectedDate);

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

  useEffect(() => {
    fetchAirMonitoringParameters(setAirQualityParameters);
  }, [stationId]);

  const getAirQIndex = () => {
    const AirQItem = airQualityParameters.find((item) => item.name === 'AQINDEX_PT1H_avg');
    return AirQItem?.id;
  };

  const AirQIndex = getAirQIndex();

  // Reset selectedDate value when the new popup is opened.
  useEffect(() => {
    setSelectedDate(currentDate);
  }, [stationId]);

  // Initial values
  useEffect(() => {
    const options = {
      end: initialDateEnd,
      start: initialDateEnd,
      station_id: stationId,
      type: 'hour',
      year: initialYear,
    };
    fetchAirMonitoringDatas(options, setAirQualityHours);
  }, [stationId]);

  useEffect(() => {
    const options = {
      end: initialDateEnd,
      start: initialDateStart,
      station_id: stationId,
      type: 'day',
      year: initialYear,
    };
    fetchAirMonitoringDatas(options, setAirQualityDays);
  }, [stationId]);

  useEffect(() => {
    const options = {
      end: initialWeekEnd,
      start: initialWeekStart,
      station_id: stationId,
      type: 'week',
      year: initialYear,
    };
    fetchAirMonitoringDatas(options, setAirQualityWeeks);
  }, [stationId]);

  useEffect(() => {
    const options = {
      end: initialMonth,
      start: '1',
      station_id: stationId,
      type: 'month',
      year: initialYear,
    };
    fetchAirMonitoringDatas(options, setAirQualityMonths);
  }, [stationId]);

  useEffect(() => {
    const options = {
      end: initialYear,
      start: initialYear,
      station_id: stationId,
      type: 'year',
    };
    fetchAirMonitoringDatas(options, setAirQualityYears);
  }, [stationId]);

  // Selected values
  useEffect(() => {
    const options = {
      end: selectedDateEnd,
      start: selectedDateEnd,
      station_id: stationId,
      type: 'hour',
      year: selectedYear,
    };
    fetchAirMonitoringDatas(options, setAirQualityHours);
  }, [stationId, selectedDate]);

  useEffect(() => {
    const options = {
      end: selectedDateEnd,
      start: selectedDateStart,
      station_id: stationId,
      type: 'day',
      year: selectedYear,
    };
    fetchAirMonitoringDatas(options, setAirQualityDays);
  }, [stationId, selectedDate]);

  useEffect(() => {
    const options = {
      end: selectedWeekEnd,
      start: selectedWeekStart,
      station_id: stationId,
      type: 'week',
      year: selectedYear,
    };
    fetchAirMonitoringDatas(options, setAirQualityWeeks);
  }, [stationId, selectedDate]);

  useEffect(() => {
    const options = {
      end: selectedMonth,
      start: '1',
      station_id: stationId,
      type: 'month',
      year: selectedYear,
    };
    fetchAirMonitoringDatas(options, setAirQualityMonths);
  }, [stationId, selectedDate]);

  useEffect(() => {
    const options = {
      end: initialYear,
      start: selectedYear,
      station_id: stationId,
      type: 'year',
      year: selectedYear,
    };
    fetchAirMonitoringDatas(options, setAirQualityYears);
  }, [stationId, selectedDate]);

  // steps that determine which data is shown
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

  const renderParameterTypeText = (parameterType) => {
    if (parameterType === AirQIndex) {
      return (
        <div className={classes.textContainer}>
          <Typography variant="body2" className={classes.parameterTypeText}>
            {intl.formatMessage({ id: 'mobilityPlatform.airMonitoring.airIndex' })}
          </Typography>
        </div>
      );
    }
    return null;
  };

  const renderParameterTypeIcon = (parameterType) => {
    if (parameterType === AirQIndex) {
      return (
        <div className={classes.iconWrapper}>
          <Air fontSize="medium" />
        </div>
      );
    }
    return null;
  };

  const formatWeeks = (weekNumber) => `${intl.formatMessage({ id: 'mobilityPlatform.airMonitoring.chart.week' })} ${weekNumber}`;

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

  // Empties chart data so that old data won't persist on the chart
  const resetChannelDatas = () => {
    setChannel1Data([]);
    setDataLabels([]);
  };

  // Channel data is set inside this function to avoid duplicate code
  const setAllChannelDatas = (newValue) => {
    if (newValue) {
      setChannel1Data((channel1Data) => [...channel1Data, newValue]);
    }
  };

  const getAQIndexValues = (measurementsData) => {
    const aqIndex = measurementsData.find((item) => item.parameter === 'AQINDEX_PT1H_avg');
    return aqIndex?.value;
  };

  /**
   * Function that will process data & update state values
   * @param {Array} data
   * @param {function} labelFormatter
   */
  const processData = (data, labelFormatter) => {
    data.forEach((el) => {
      const measurementsArr = el.measurements;
      const aqIndex = getAQIndexValues(measurementsArr);
      setAllChannelDatas(aqIndex);
      setDataLabels((dataLabels) => [...dataLabels, labelFormatter(el)]);
    });
  };

  /**
   * Sets channel data into React state, so it can be displayed on the chart.
   * States for user type(s) and step(s) are used to filter shown data.
   * */
  const setChannelData = () => {
    resetChannelDatas();
    if (currentTime === 'hour') {
      processData(airQualityHours, (el) => `${el.hour_number}:00`);
    } else if (currentTime === 'day') {
      processData(airQualityDays, (el) => formatDates(el.date));
    } else if (currentTime === 'week') {
      processData(airQualityWeeks, (el) => formatWeeks(el.week_number));
    } else if (currentTime === 'month') {
      processData(airQualityMonths, (el) => formatMonths(el.month_number, intl));
    } else if (currentTime === 'year') {
      processData(airQualityYears, (el) => el.year_number);
    }
  };

  useEffect(() => {
    if (currentTime === 'hour') {
      processData(airQualityHours, (el) => el.hour_number);
    }
  }, [airQualityHours, stationId]);

  // When current user type or step changes, calls function to update the chart data
  useEffect(() => {
    setChannelData();
  }, [currentTime]);

  return (
    <div className={classes.popupInner}>
      <div className={`${classes.contentHeader} ${isNarrow ? classes.widthSm : classes.widthMd}`}>
        <Typography component="h4" className={classes.headerSubtitle}>
          {stationName}
        </Typography>
        <div className={classes.dateContainer}>
          <DatePicker
            selected={selectedDate}
            onChange={(newDate) => changeDate(newDate)}
            locale={locale}
            dateFormat="P"
            showYearDropdown
            dropdownMode="select"
            minDate={new Date('2015-01-01')}
            maxDate={new Date()}
            customInput={<CustomInput inputRef={inputRef} />}
          />
        </div>
      </div>
      <div className={classes.wrapper}>
        <div className={classes.parameterTypes}>
          {parameterTypes?.map((parameterType) => (
            <div key={parameterType} className={classes.container}>
              {renderParameterTypeIcon(parameterType)}
              {renderParameterTypeText(parameterType)}
            </div>
          ))}
        </div>
      </div>
      <div className={classes.chartContainer}>
        <ChartComponent
          labels={dataLabels}
          labelChannel1={intl.formatMessage({
            id: 'mobilityPlatform.airMonitoring.chart.label',
          })}
          channel1Data={channel1Data}
        />
      </div>
      <div>
        <div className={classes.dateStepsContainer}>
          {buttonSteps.map((timing, i) => (
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
    </div>
  );
};

AirMonitoringContent.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string).isRequired,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }).isRequired,
  station: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    parameters: PropTypes.arrayOf(PropTypes.number),
  }),
};

AirMonitoringContent.defaultProps = {
  station: {
    id: 0,
    name: '',
    parameters: [],
  },
};

export default AirMonitoringContent;
