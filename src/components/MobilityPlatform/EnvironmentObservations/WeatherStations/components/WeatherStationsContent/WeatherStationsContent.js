/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  useState, useEffect, useRef, forwardRef,
} from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { ButtonBase, Container, Typography } from '@mui/material';
import styled from '@emotion/styled';
import { Thermostat } from '@mui/icons-material';
import {
  getMonth, getWeek, getYear, format, subDays, lastDayOfMonth,
} from 'date-fns';
import { enGB, fi, sv } from 'date-fns/locale';
import DatePicker, { registerLocale } from 'react-datepicker';
import { fetchObservationDatas } from '../../../EnvironmentDataAPI/EnvironmentDataAPI';
import { formatDates, formatMonths } from '../../../../../EcoCounter/utils';
import InputDate from '../../../../../EcoCounter/InputDate';
import renderFixedDecimals from '../../../utils';

const CustomInput = forwardRef((props, ref) => <InputDate {...props} ref={ref} />);

const WeatherStationContent = ({ classes, intl, station }) => {
  const [weatherDataHours, setWeatherDataHours] = useState([]);
  const [weatherDataDays, setWeatherDataDays] = useState([]);
  const [weatherDataWeeks, setWeatherDataWeeks] = useState([]);
  const [weatherDataMonths, setWeatherDataMonths] = useState([]);
  const [weatherDataYears, setWeatherDataYears] = useState([]);
  const [currentTime, setCurrentTime] = useState('hour');
  const [activeStep, setActiveStep] = useState(0);
  const [selectedDate, setSelectedDate] = useState(lastDayOfMonth(subDays(new Date(), 30)));

  const stationId = station.id;
  const stationName = station.name;
  const parameterTypes = station.parameters_in_use;

  const locale = useSelector((state) => state.user.locale);

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

  // Reset selectedDate value when the new popup is opened.
  useEffect(() => {
    setSelectedDate(lastDayOfMonth(subDays(new Date(), 30)));
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
    fetchObservationDatas(options, setWeatherDataHours);
  }, [stationId]);

  useEffect(() => {
    const options = {
      end: initialDateEnd,
      start: initialDateStart,
      station_id: stationId,
      type: 'day',
      year: initialYear,
    };
    fetchObservationDatas(options, setWeatherDataDays);
  }, [stationId]);

  useEffect(() => {
    const options = {
      end: initialWeekEnd,
      start: initialWeekStart,
      station_id: stationId,
      type: 'week',
      year: initialYear,
    };
    fetchObservationDatas(options, setWeatherDataWeeks);
  }, [stationId]);

  useEffect(() => {
    const options = {
      end: initialMonth,
      start: 1,
      station_id: stationId,
      type: 'month',
      year: initialYear,
    };
    fetchObservationDatas(options, setWeatherDataMonths);
  }, [stationId]);

  useEffect(() => {
    const options = {
      end: initialYear,
      start: initialYear,
      station_id: stationId,
      type: 'year',
    };
    fetchObservationDatas(options, setWeatherDataYears);
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
    fetchObservationDatas(options, setWeatherDataHours);
  }, [stationId, selectedDate]);

  useEffect(() => {
    const options = {
      end: selectedDateEnd,
      start: selectedDateStart,
      station_id: stationId,
      type: 'day',
      year: selectedYear,
    };
    fetchObservationDatas(options, setWeatherDataDays);
  }, [stationId, selectedDate]);

  useEffect(() => {
    const options = {
      end: selectedWeekEnd,
      start: selectedWeekStart,
      station_id: stationId,
      type: 'week',
      year: selectedYear,
    };
    fetchObservationDatas(options, setWeatherDataWeeks);
  }, [stationId, selectedDate]);

  useEffect(() => {
    const options = {
      end: selectedMonth,
      start: 1,
      station_id: stationId,
      type: 'month',
      year: selectedYear,
    };
    fetchObservationDatas(options, setWeatherDataMonths);
  }, [stationId, selectedDate]);

  useEffect(() => {
    const options = {
      end: initialYear,
      start: selectedYear,
      station_id: stationId,
      type: 'year',
    };
    fetchObservationDatas(options, setWeatherDataYears);
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

  const renderParameterTypeText = (parameterKey, parameterVal) => {
    if (parameterKey === 'TA_PT1H_AVG' && parameterVal) {
      return (
        <StyledTextContainer>
          <StyledParameterText variant="body2">
            {intl.formatMessage({ id: 'mobilityPlatform.environment.temperature' })}
          </StyledParameterText>
        </StyledTextContainer>
      );
    }
    return null;
  };

  const renderParameterTypeIcon = (parameterKey, parameterVal) => {
    if (parameterKey === 'TA_PT1H_AVG' && parameterVal) {
      return (
        <StyledIconWrapper>
          <Thermostat fontSize="medium" />
        </StyledIconWrapper>
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
      return weatherDataHours;
    }
    if (currentTime === 'day') {
      return weatherDataDays;
    }
    if (currentTime === 'week') {
      return weatherDataWeeks;
    }
    if (currentTime === 'month') {
      return weatherDataMonths;
    }
    if (currentTime === 'year') {
      return weatherDataYears;
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

  const getWindDirection = (degrees) => {
    const directions = [
      'mobilityPlatform.environment.north',
      'mobilityPlatform.environment.northeast',
      'mobilityPlatform.environment.east',
      'mobilityPlatform.environment.southeast',
      'mobilityPlatform.environment.south',
      'mobilityPlatform.environment.southwest',
      'mobilityPlatform.environment.west',
      'mobilityPlatform.environment.northwest',
    ];

    const index = Math.round(degrees / 45.0) % directions.length;

    return directions[index];
  };

  const renderWeatherInfo = (measurement) => {
    if (measurement.parameter === 'TA_PT1H_AVG') {
      return (
        <Typography key={measurement.id} variant="body2" component="p">
          {`Lämpötila: ${renderFixedDecimals(measurement.value)} °C`}
        </Typography>
      );
    }
    if (measurement.parameter === 'PRA_PT1H_ACC') {
      return (
        <Typography key={measurement.id} variant="body2" component="p">
          {`Sademäärä: ${renderFixedDecimals(measurement.value)} mm`}
        </Typography>
      );
    }
    if (measurement.parameter === 'WS_PT1H_AVG') {
      return (
        <Typography key={measurement.id} variant="body2" component="p">
          {`Tuulen nopeus: ${renderFixedDecimals(measurement.value)} m/s`}
        </Typography>
      );
    }
    if (measurement.parameter === 'WD_PT1H_AVG') {
      return (
        <Typography key={measurement.id} variant="body2" component="p">
          {intl.formatMessage({ id: getWindDirection(measurement.value) })}
        </Typography>
      );
    }
    return null;
  };

  const renderData = () => {
    const data = setRenderData();
    return data.map((item) => (
      <Container key={item.id} sx={{ marginBottom: '0.2rem' }}>
        <Typography variant="subtitle2" component="h5" sx={{ marginBottom: '0.2rem' }}>
          {formatDate(item)}
        </Typography>
        {item.measurements.map((measurement) => (
          <div>
            {renderWeatherInfo(measurement)}
          </div>
        ))}
      </Container>
    ));
  };

  return (
    <StyledPopupInner>
      <StyledContentHeader>
        <StyledHeaderText component="h4">
          {stationName}
        </StyledHeaderText>
        <StyledDateContainer>
          <DatePicker
            selected={selectedDate}
            onChange={(newDate) => changeDate(newDate)}
            locale={locale}
            dateFormat="P"
            showYearDropdown
            dropdownMode="select"
            minDate={new Date('2010-01-01')}
            maxDate={new Date()}
            customInput={<CustomInput inputRef={inputRef} />}
          />
        </StyledDateContainer>
      </StyledContentHeader>
      <div>
        <StyledParameterWrapper>
          <StyledParameterContainer>
            {Object.entries(parameterTypes).map(([key, val]) => (
              <StyledIconText key={key}>
                {renderParameterTypeIcon(key, val)}
                {renderParameterTypeText(key, val)}
              </StyledIconText>
            ))}
          </StyledParameterContainer>
        </StyledParameterWrapper>
      </div>
      {renderData()}
      <div>
        <StyledDateSteps>
          {buttonSteps.map((timing, i) => (
            <ButtonBase
              key={timing.step.type}
              type="button"
              className={`${classes.button} ${classes.paddingWide} ${
                i === activeStep ? classes.buttonActive : classes.buttonWhite
              }`}
              onClick={() => handleClick(timing.step.type, i)}
            >
              <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
                {timing.step.text}
              </Typography>
            </ButtonBase>
          ))}
        </StyledDateSteps>
      </div>
    </StyledPopupInner>
  );
};

const StyledPopupInner = styled.div(({ theme }) => ({
  borderRadius: '3px',
  marginBottom: theme.spacing(1),
  marginLeft: theme.spacing(1.2),
  lineHeight: 1.2,
  overflowX: 'hidden',
}));

const StyledContentHeader = styled.div(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  marginTop: theme.spacing(0.5),
  marginBottom: theme.spacing(1.5),
  alignItems: 'flex-end',
  borderBottom: '2px solid gray',
  justifyContent: 'space-between',
  width: '92%',
}));

const StyledHeaderText = styled(Typography)(({ theme }) => ({
  padding: '4px 0 5px',
  fontWeight: 'bold',
  marginBlockStart: theme.spacing(2),
  marginBlockEnd: theme.spacing(0.2),
}));

const StyledParameterText = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(0.5),
  marginLeft: theme.spacing(3),
}));

const StyledDateContainer = styled.div(() => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  maxWidth: '32%',
}));

const StyledDateSteps = styled.div(() => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-evenly',
  alignItems: 'center',
  padding: '1rem 0',
}));

const StyledParameterWrapper = styled.div(({ theme }) => ({
  display: 'flex',
  justifyContent: 'flex-end',
  marginBottom: theme.spacing(0.5),
  paddingRight: theme.spacing(1.5),
}));

const StyledParameterContainer = styled.div(() => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
}));

const StyledIconText = styled.div(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginRight: theme.spacing(1.5),
}));

const StyledTextContainer = styled.div(({ theme }) => ({
  paddingBottom: theme.spacing(1),
}));

const StyledIconWrapper = styled.div(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(7, 44, 115, 255)',
  color: '#fff',
  border: '1px solid gray',
  borderRadius: '5px',
  padding: theme.spacing(0.5),
  width: '30px',
  height: '30px',
}));

WeatherStationContent.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string).isRequired,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }).isRequired,
  station: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    parameters_in_use: PropTypes.objectOf(PropTypes.bool),
  }),
};

WeatherStationContent.defaultProps = {
  station: {
    id: 0,
    name: '',
    parameters_in_use: {},
  },
};

export default WeatherStationContent;
