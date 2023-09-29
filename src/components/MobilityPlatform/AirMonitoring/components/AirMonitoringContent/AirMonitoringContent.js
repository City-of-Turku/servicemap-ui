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
import {
  fetchAirMonitoringHourDatas,
  fetchAirMonitoringDayDatas,
  fetchAirMonitoringMonthDatas,
  fetchAirMonitoringWeekDatas,
  fetchAirMonitoringYearDatas,
  fetchAirMonitoringParameters,
} from '../../../AirMonitoringAPI/AirMonitoringAPI';
import { formatDates, formatMonths } from '../../../../EcoCounter/utils';
import InputDate from '../../../../EcoCounter/InputDate';

const CustomInput = forwardRef((props, ref) => <InputDate {...props} ref={ref} />);

const AirMonitoringContent = ({ classes, intl, station }) => {
  const [airQualityHours, setAirQualityHours] = useState([]);
  const [airQualityDays, setAirQualityDays] = useState([]);
  const [airQualityWeeks, setAirQualityWeeks] = useState([]);
  const [airQualityMonths, setAirQualityMonths] = useState([]);
  const [airQualityYears, setAirQualityYears] = useState([]);
  const [airQualityParameters, setAirQualityParameters] = useState([]);
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
    fetchAirMonitoringHourDatas(initialDateEnd, initialDateEnd, stationId, initialYear, setAirQualityHours);
  }, [stationId]);

  useEffect(() => {
    fetchAirMonitoringDayDatas(initialDateEnd, initialDateStart, stationId, initialYear, setAirQualityDays);
  }, [stationId]);

  useEffect(() => {
    fetchAirMonitoringWeekDatas(initialWeekEnd, initialWeekStart, stationId, initialYear, setAirQualityWeeks);
  }, [stationId]);

  useEffect(() => {
    fetchAirMonitoringMonthDatas(initialMonth, '1', stationId, initialYear, setAirQualityMonths);
  }, [stationId]);

  useEffect(() => {
    fetchAirMonitoringYearDatas(initialYear, initialYear, stationId, setAirQualityYears);
  }, [stationId]);

  // Selected values
  useEffect(() => {
    fetchAirMonitoringHourDatas(selectedDateEnd, selectedDateEnd, stationId, selectedYear, setAirQualityHours);
  }, [stationId, selectedDate]);

  useEffect(() => {
    fetchAirMonitoringDayDatas(selectedDateEnd, selectedDateStart, stationId, selectedYear, setAirQualityDays);
  }, [stationId, selectedDate]);

  useEffect(() => {
    fetchAirMonitoringWeekDatas(selectedWeekEnd, selectedWeekStart, stationId, selectedYear, setAirQualityWeeks);
  }, [stationId, selectedDate]);

  useEffect(() => {
    fetchAirMonitoringMonthDatas(selectedMonth, '1', stationId, selectedYear, setAirQualityMonths);
  }, [stationId, selectedDate]);

  useEffect(() => {
    fetchAirMonitoringYearDatas(initialYear, selectedYear, stationId, setAirQualityYears);
  }, [stationId, selectedDate]);

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

  const setRenderData = () => {
    if (currentTime === 'hour') {
      return airQualityHours;
    }
    if (currentTime === 'day') {
      return airQualityDays;
    }
    if (currentTime === 'week') {
      return airQualityWeeks;
    }
    if (currentTime === 'month') {
      return airQualityMonths;
    }
    if (currentTime === 'year') {
      return airQualityYears;
    }
    return null;
  };

  const formatDate = (item) => {
    if (Object.hasOwn(item, 'hour_number')) {
      return `${item.hour_number}:00`;
    }
    if (Object.hasOwn(item, 'date')) {
      return formatDates(item.date);
    }
    if (Object.hasOwn(item, 'week_number')) {
      return `Viikko: ${item.week_number}`;
    }
    if (Object.hasOwn(item, 'month_number')) {
      return formatMonths(item.month_number, intl);
    }
    if (Object.hasOwn(item, 'year_number')) {
      return `Vuosi ${item.year_number}`;
    }
    return '';
  };

  const renderAirQuality = (measurement, parentObj) => {
    if (measurement.parameter === 'AQINDEX_PT1H_avg') {
      return (
        <Typography key={measurement.id} variant="body2" component="p">
          {`${formatDate(parentObj)}: ${measurement.value}`}
        </Typography>
      );
    }
    return null;
  };

  const renderData = () => {
    const data = setRenderData();
    return data.map((item) => (
      <div key={item.id}>{item.measurements.map((measurement) => renderAirQuality(measurement, item))}</div>
    ));
  };

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
      {renderData()}
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
