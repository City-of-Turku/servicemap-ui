/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  useState, useEffect, useRef, forwardRef,
} from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import {
  Box, ButtonBase, Card, Container, Typography,
} from '@mui/material';
import styled from '@emotion/styled';
import {
  getMonth, getWeek, getYear, format, subDays,
} from 'date-fns';
import { enGB, fi, sv } from 'date-fns/locale';
import DatePicker, { registerLocale } from 'react-datepicker';
import { fetchAirMonitoringDatas } from '../../../EnvironmentDataAPI/EnvironmentDataAPI';
import { formatDates, formatMonths } from '../../../../../EcoCounter/utils';
import InputDate from '../../../../../EcoCounter/InputDate';

const CustomInput = forwardRef((props, ref) => <InputDate {...props} ref={ref} />);

const AirMonitoringContent = ({ classes, intl, station }) => {
  const [airQualityDays, setAirQualityDays] = useState([]);
  const [airQualityWeeks, setAirQualityWeeks] = useState([]);
  const [airQualityMonths, setAirQualityMonths] = useState([]);
  const [airQualityYears, setAirQualityYears] = useState([]);
  const [currentTime, setCurrentTime] = useState('day');
  const [activeStep, setActiveStep] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const stationId = station.id;
  const stationName = station.name;

  const locale = useSelector((state) => state.user.locale);

  const isNarrow = false;
  const inputRef = useRef(null);

  // Initial values that are used to fetch data
  const currentDate = new Date();
  const initialDateFormat = format(subDays(currentDate, 1), 'MM-dd');
  const initialWeek = getWeek(currentDate);
  const initialMonth = getMonth(currentDate) + 1;
  const initialYear = getYear(currentDate);

  // Values that change based on the datepicker value
  const selectedDateFormat = format(selectedDate, 'MM-dd');
  const selectedWeek = getWeek(selectedDate);
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

  // Reset selectedDate value when the new popup is opened.
  useEffect(() => {
    setSelectedDate(currentDate);
  }, [stationId]);

  // Initial values
  useEffect(() => {
    const options = {
      end: initialDateFormat,
      start: initialDateFormat,
      station_id: stationId,
      type: 'day',
      year: initialYear,
    };
    fetchAirMonitoringDatas(options, setAirQualityDays);
  }, [stationId]);

  useEffect(() => {
    const options = {
      end: initialWeek,
      start: initialWeek,
      station_id: stationId,
      type: 'week',
      year: initialYear,
    };
    fetchAirMonitoringDatas(options, setAirQualityWeeks);
  }, [stationId]);

  useEffect(() => {
    const options = {
      end: initialMonth,
      start: initialMonth,
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
      end: selectedDateFormat,
      start: selectedDateFormat,
      station_id: stationId,
      type: 'day',
      year: selectedYear,
    };
    fetchAirMonitoringDatas(options, setAirQualityDays);
  }, [stationId, selectedDate]);

  useEffect(() => {
    const options = {
      end: selectedWeek,
      start: selectedWeek,
      station_id: stationId,
      type: 'week',
      year: selectedYear,
    };
    fetchAirMonitoringDatas(options, setAirQualityWeeks);
  }, [stationId, selectedDate]);

  useEffect(() => {
    const options = {
      end: selectedMonth,
      start: selectedMonth,
      station_id: stationId,
      type: 'month',
      year: selectedYear,
    };
    fetchAirMonitoringDatas(options, setAirQualityMonths);
  }, [stationId, selectedDate]);

  useEffect(() => {
    const options = {
      end: selectedYear,
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
        type: 'day',
        text: intl.formatMessage({ id: 'mobilityPlatform.airMonitoring.button.day' }),
      },
    },
    {
      step: {
        type: 'week',
        text: intl.formatMessage({ id: 'mobilityPlatform.airMonitoring.button.week' }),
      },
    },
    {
      step: {
        type: 'month',
        text: intl.formatMessage({ id: 'mobilityPlatform.airMonitoring.button.month' }),
      },
    },
    {
      step: {
        type: 'year',
        text: intl.formatMessage({ id: 'mobilityPlatform.airMonitoring.button.year' }),
      },
    },
  ];

  const getParameterText = (paramType) => {
    if (paramType === 'SO2_PT1H_avg') {
      return 'mobilityPlatform.airMonitoring.SO2_PT1H_avg';
    }
    if (paramType === 'NO2_PT1H_avg') {
      return 'mobilityPlatform.airMonitoring.NO2_PT1H_avg';
    }
    if (paramType === 'PM10_PT1H_avg') {
      return 'mobilityPlatform.airMonitoring.PM10_PT1H_avg';
    }
    if (paramType === 'PM25_PT1H_avg') {
      return 'mobilityPlatform.airMonitoring.PM25_PT1H_avg';
    }
    if (paramType === 'O3_PT1H_avg') {
      return 'mobilityPlatform.airMonitoring.O3_PT1H_avg';
    }
    return 'mobilityPlatform.airMonitoring.AQINDEX_PT1H_avg';
  };

  const renderParameterTypeText = () => (
    <div className={classes.textContainer}>
      <Typography variant="subtitle1" component="h4" className={classes.parameterTypeText}>
        {intl.formatMessage({ id: 'mobilityPlatform.airMonitoring.airIndex' })}
      </Typography>
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
    if (title === 'day') {
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
    if (Object.hasOwn(item, 'date')) {
      return `${intl.formatMessage(
        { id: 'mobilityPlatform.airMonitoring.text.date' },
        { value: formatDates(item.date) },
      )}`;
    }
    if (Object.hasOwn(item, 'week_number')) {
      return `${intl.formatMessage({ id: 'mobilityPlatform.airMonitoring.text.week' }, { value: item.week_number })}`;
    }
    if (Object.hasOwn(item, 'month_number')) {
      return `${intl.formatMessage(
        { id: 'mobilityPlatform.airMonitoring.text.month' },
        { value: formatMonths(item.month_number, intl) },
      )}`;
    }
    if (Object.hasOwn(item, 'year_number')) {
      return `${intl.formatMessage({ id: 'mobilityPlatform.airMonitoring.text.year' }, { value: item.year_number })}`;
    }
    return null;
  };

  const renderThresholdValues = (measurementVal) => {
    if (measurementVal >= 0 && measurementVal <= 50) {
      return intl.formatMessage({ id: 'mobilityPlatform.airMonitoring.quality.good' });
    }
    if (measurementVal >= 51 && measurementVal <= 75) {
      return intl.formatMessage({ id: 'mobilityPlatform.airMonitoring.quality.satisfactory' });
    }
    if (measurementVal >= 76 && measurementVal <= 100) {
      return intl.formatMessage({ id: 'mobilityPlatform.airMonitoring.quality.fair' });
    }
    if (measurementVal >= 101 && measurementVal <= 150) {
      return intl.formatMessage({ id: 'mobilityPlatform.airMonitoring.quality.poor' });
    }
    if (measurementVal >= 151) {
      return intl.formatMessage({ id: 'mobilityPlatform.airMonitoring.quality.hazardous' });
    }
    return '';
  };

  const renderFixedDecimals = (measurementVal) => {
    if (!Number.isInteger(measurementVal)) {
      return measurementVal.toFixed(2);
    }
    return measurementVal;
  };

  const getColorValues = (measurementVal) => {
    if (measurementVal >= 0 && measurementVal <= 50) {
      return '#009966';
    }
    if (measurementVal >= 51 && measurementVal <= 75) {
      return '#FFDE33';
    }
    if (measurementVal >= 76 && measurementVal <= 100) {
      return '#FF9933';
    }
    if (measurementVal >= 101 && measurementVal <= 150) {
      return '#CC0033';
    }
    if (measurementVal >= 151) {
      return '#660099';
    }
    return '#fff';
  };

  const renderAirQuality = (measurement) => (
    <StyledColorBox sx={{ bgcolor: getColorValues(measurement.value) }}>
      <div className={classes.textContainer}>
        <Typography key={measurement.id} variant="body2" component="p">
          {`${intl.formatMessage({ id: getParameterText(measurement.parameter) })}: ${renderFixedDecimals(
            measurement.value,
          )}`}
        </Typography>
      </div>
      <div className={classes.textContainer}>
        <Typography variant="body2" component="p">
          {renderThresholdValues(measurement.value)}
        </Typography>
      </div>
    </StyledColorBox>
  );

  const renderConcentrations = (measurement) => (
    <div className={classes.textContainer}>
      <Typography key={measurement.id} variant="body2" component="p">
        {`${intl.formatMessage({ id: getParameterText(measurement.parameter) })}: ${renderFixedDecimals(
          measurement.value,
        )}`}
      </Typography>
    </div>
  );

  const renderData = () => {
    const data = setRenderData();
    return data.map((item) => (
      <Card key={item.id} variant="outlined">
        <StyledBox>
          <div className={classes.textContainer}>
            <Typography variant="body2" component="p">
              {formatDate(item)}
            </Typography>
          </div>
          <div>
            {item.measurements.map((measurement) => (
              <div key={`${measurement.parameter}${measurement.value}`}>
                {measurement.parameter === 'AQINDEX_PT1H_avg'
                  ? renderAirQuality(measurement)
                  : renderConcentrations(measurement)}
              </div>
            ))}
          </div>
        </StyledBox>
      </Card>
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
      <div className={classes.parameterTitle}>{renderParameterTypeText()}</div>
      <StyledContainer>{renderData()}</StyledContainer>
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

const StyledContainer = styled(Container)(({ theme }) => ({
  paddingLeft: theme.spacing(1.5),
  paddingRight: theme.spacing(1.5),
}));

const StyledBox = styled(Box)(({ theme }) => ({
  paddingLeft: theme.spacing(1),
  paddingTop: theme.spacing(1),
}));

const StyledColorBox = styled(Box)(({ theme }) => ({
  borderRadius: '10px',
  width: '50%',
  padding: theme.spacing(1),
  marginBottom: theme.spacing(1),
}));

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
