/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  useState, useEffect, useRef, forwardRef,
} from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { ButtonBase, Container, Typography } from '@mui/material';
import { Air } from '@mui/icons-material';
import {
  getMonth, getWeek, getYear, format, subDays,
} from 'date-fns';
import { enGB, fi, sv } from 'date-fns/locale';
import DatePicker, { registerLocale } from 'react-datepicker';
import { fetchAirMonitoringDatas, fetchAirMonitoringParameters } from '../../../AirMonitoringAPI/AirMonitoringAPI';
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
  const [currentParameter, setCurrentParameter] = useState('AQINDEX_PT1H_avg');
  const [currentTime, setCurrentTime] = useState('hour');
  const [activeParameter, setActiveParameter] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const stationId = station.id;
  const stationName = station.name;

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

  // Sets current user type and active button index
  const setParameterTypeState = (index, typeValue) => {
    setActiveParameter(index);
    setCurrentParameter(typeValue.name);
  };

  const setParameterTypes = (type, index) => {
    setParameterTypeState(index, type);
  };

  const getParameterText = (paramType) => {
    switch (paramType) {
      case 'SO2_PT1H_avg':
        return 'mobilityPlatform.airMonitoring.SO2_PT1H_avg';
      case 'NO2_PT1H_avg':
        return 'mobilityPlatform.airMonitoring.NO2_PT1H_avg';
      case 'PM10_PT1H_avg':
        return 'mobilityPlatform.airMonitoring.PM10_PT1H_avg';
      case 'PM25_PT1H_avg':
        return 'mobilityPlatform.airMonitoring.PM25_PT1H_avg';
      case 'O3_PT1H_avg':
        return 'mobilityPlatform.airMonitoring.O3_PT1H_avg';
      default:
        return 'mobilityPlatform.airMonitoring.AQINDEX_PT1H_avg';
    }
  };

  const renderParameterTypeText = (parameterType) => (
    <div className={classes.textContainer}>
      <Typography variant="body2" component="p" className={classes.parameterTypeText}>
        {intl.formatMessage({ id: getParameterText(parameterType.name) })}
      </Typography>
    </div>
  );

  const renderParameterTypeButton = (parameterType, i) => (
    <div>
      <ButtonBase
        className={`${classes.button} ${classes.paddingNarrow} ${
          i === activeParameter ? classes.buttonActive : classes.buttonWhite
        }`}
        onClick={() => setParameterTypes(parameterType, i)}
      >
        <div className={i === activeParameter ? `${classes.iconActive}` : `${classes.icon}`}>
          <Air fontSize="medium" />
        </div>
      </ButtonBase>
    </div>
  );

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
    return null;
  };

  const renderAirQuality = (measurement, parentObj) => {
    if (measurement.parameter === currentParameter) {
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
    const filteredData = data.filter((item) => item.measurements.some((measurement) => measurement.parameter === currentParameter));
    return filteredData.map((item) => (
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
          {airQualityParameters?.map((parameterType, i) => (
            <div key={parameterType.name} className={classes.container}>
              {renderParameterTypeButton(parameterType, i)}
              {renderParameterTypeText(parameterType)}
            </div>
          ))}
        </div>
      </div>
      <Container sx={{ margin: '0.5rem 0' }}>
        {renderData()}
      </Container>
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
