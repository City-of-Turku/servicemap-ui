/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-nested-ternary */
import { ButtonBase, Typography } from '@material-ui/core';
import DateRangeIcon from '@material-ui/icons/DateRange';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { DayPickerSingleDateController } from 'react-dates';
import 'react-dates/initialize';
import { ReactSVG } from 'react-svg';
import iconBicycle from 'servicemap-ui-turku/assets/icons/icons-icon_bicycle.svg';
import iconCar from 'servicemap-ui-turku/assets/icons/icons-icon_car.svg';
import iconWalk from 'servicemap-ui-turku/assets/icons/icons-icon_walk.svg';
import {
  fetchInitialDayDatas, fetchInitialHourData, fetchInitialMonthDatas, fetchInitialWeekDatas,
} from '../EcoCounterRequests/ecoCounterRequests';
import LineChart from '../LineChart';

const EcoCounterContent = ({
  classes, intl, stationId, stationName,
}) => {
  const [ecoCounterHour, setEcoCounterHour] = useState(null);
  const [ecoCounterDay, setEcoCounterDay] = useState(null);
  const [ecoCounterWeek, setEcoCounterWeek] = useState(null);
  const [ecoCounterMonth, setEcoCounterMonth] = useState(null);
  const [channel1Counts, setChannel1Counts] = useState([]);
  const [channel2Counts, setChannel2Counts] = useState([]);
  const [channelTotals, setChannelTotals] = useState([]);
  const [ecoCounterLabels, setEcoCounterLabels] = useState([]);
  const [currentType, setCurrentType] = useState('bicycle');
  const [currentTime, setCurrentTime] = useState('hour');
  const [activeStep, setActiveStep] = useState(0);
  const [activeType, setActiveType] = useState(0);
  const [userTypesList, setUserTypesList] = useState(null);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(moment().clone().add(-1, 'days'));

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

  // User types that include cars
  const allUsers = [
    {
      type: {
        user: 'bicycle',
        text: intl.formatMessage({ id: 'ecocounter.bicycle' }),
        icon: iconBicycle,
      },
    },
    {
      type: {
        user: 'walking',
        text: intl.formatMessage({ id: 'ecocounter.walk' }),
        icon: iconWalk,
      },
    },
    {
      type: {
        user: 'driving',
        text: intl.formatMessage({ id: 'ecocounter.car' }),
        icon: iconCar,
      },
    },
  ];

  // User types that doesn't include cars, because most stations do not include counts for cars
  const pedestrianAndBicycle = [
    {
      type: {
        user: 'bicycle',
        text: intl.formatMessage({ id: 'ecocounter.bicycle' }),
        icon: iconBicycle,
      },
    },
    {
      type: {
        user: 'walking',
        text: intl.formatMessage({ id: 'ecocounter.walk' }),
        icon: iconWalk,
      },
    },
  ];

  const bicycleOnly = [
    {
      type: {
        user: 'bicycle',
        text: intl.formatMessage({ id: 'ecocounter.bicycle' }),
        icon: iconBicycle,
      },
    },
  ];

  const changeDate = (newDate) => {
    setSelectedDate(newDate);
  };

  // Set datepicker language
  useEffect(() => {
    if (intl.locale === 'en') {
      moment.locale('en');
    } else if (intl.locale === 'sv') {
      moment.locale('sv');
    } else moment.locale('fi');
  }, [intl.locale]);

  // API returns empty data if start_week_number parameter is higher number than end_week_number.
  // This will set it to 1 so that weekly graph in January won't be empty.
  const checkWeekNumber = (dateValue) => {
    const start = dateValue.clone().startOf('month').week();
    const end = dateValue.clone().endOf('month').week();
    if (start > end) {
      return 1;
    }
    return start;
  };

  // momentjs
  // Initial values that are used to fetch data
  const currentDate = moment();
  const yesterDay = moment().clone().add(-1, 'days');
  const yesterDayFormat = yesterDay.clone().format('YYYY-MM-DD');
  const initialDateStart = yesterDay.clone().startOf('week').format('YYYY-MM-DD');
  const initialDateEnd = yesterDay.clone().endOf('week').format('YYYY-MM-DD');
  const initialWeekStart = checkWeekNumber(yesterDay);
  const initialWeekEnd = yesterDay.clone().endOf('month').week();
  const initialMonth = yesterDay.clone().month() + 1;
  const initialYear = yesterDay.clone().year();

  // Values that change based on the datepicker value
  const selectedDateFormat = selectedDate.clone().format('YYYY-MM-DD');
  const selectedDateStart = selectedDate.clone().startOf('week').format('YYYY-MM-DD');
  const selectedDateEnd = selectedDate.clone().endOf('week').format('YYYY-MM-DD');
  const selectedWeekStart = checkWeekNumber(selectedDate);
  const selectedWeekEnd = selectedDate.clone().endOf('month').week();
  let selectedMonth = currentDate.clone().month() + 1;
  const selectedYear = selectedDate.clone().year();

  // This will show full year if available
  const checkYear = () => {
    if (selectedDate.clone().year() < moment().year()) {
      selectedMonth = 12;
    }
  };

  // Reset selectedDate value when the new popup is opened.
  useEffect(() => {
    setSelectedDate(moment().clone().add(-1, 'days'));
  }, [stationId]);

  useEffect(() => {
    checkYear();
  }, [selectedDate]);

  /*  useEffect(() => {
    checkWeekNumber();
  }, [selectedWeekStart, initialWeekStart]); */

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
  const formatWeeks = weekValue => moment().day('Monday').year(selectedYear).week(weekValue)
    .format('DD.MM');

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
    setEcoCounterLabels([]);
  };

  // Channel data is set inside this function to avoid duplicate code
  const setAllChannelCounts = (newValue1, newValue2, newValue3) => {
    setChannel1Counts(channel1Counts => [...channel1Counts, newValue1]);
    setChannel2Counts(channel2Counts => [...channel2Counts, newValue2]);
    setChannelTotals(channelTotals => [...channelTotals, newValue3]);
  };

  // Sets channel data into React state, so it can be displayed on the chart
  // States for user type(s) and step(s) are used to filter shown data
  const setChannelData = () => {
    resetChannelData();
    if (currentTime === 'hour') {
      setEcoCounterLabels(labelsHour);
      if (ecoCounterHour !== null && ecoCounterHour.station === stationId) {
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
    } else if (currentTime === 'day') {
      ecoCounterDay.forEach((el) => {
        const countsArr = [];
        if (el.station === stationId && currentType === 'walking') {
          countsArr.push(el.value_jk, el.value_jp, el.value_jt, el.day_info.date);
        } else if (el.station === stationId && currentType === 'bicycle') {
          countsArr.push(el.value_pk, el.value_pp, el.value_pt, el.day_info.date);
        } else if (el.station === stationId && currentType === 'driving') {
          countsArr.push(el.value_ak, el.value_ap, el.value_at, el.day_info.date);
        }
        setChannel1Counts(channel1Counts => [...channel1Counts, countsArr[0]]);
        setChannel2Counts(channel2Counts => [...channel2Counts, countsArr[1]]);
        setChannelTotals(channelTotals => [...channelTotals, countsArr[2]]);
        setEcoCounterLabels(ecoCounterLabels => [...ecoCounterLabels, formatDates(countsArr[3])]);
      });
    } else if (currentTime === 'week') {
      ecoCounterWeek.forEach((el) => {
        const countsArr = [];
        if (el.station === stationId && currentType === 'walking') {
          countsArr.push(el.value_jk, el.value_jp, el.value_jt, el.week_info.week_number);
        } else if (el.station === stationId && currentType === 'bicycle') {
          countsArr.push(el.value_pk, el.value_pp, el.value_pt, el.week_info.week_number);
        } else if (el.station === stationId && currentType === 'driving') {
          countsArr.push(el.value_ak, el.value_ap, el.value_at, el.week_info.week_number);
        }
        setAllChannelCounts(countsArr[0], countsArr[1], countsArr[2]);
        setEcoCounterLabels(ecoCounterLabels => [...ecoCounterLabels, formatWeeks(countsArr[3])]);
      });
    } else if (currentTime === 'month') {
      ecoCounterMonth.forEach((el) => {
        const countsArr = [];
        if (el.station === stationId && currentType === 'walking') {
          countsArr.push(el.value_jk, el.value_jp, el.value_jt, el.month_info.month_number);
        } else if (el.station === stationId && currentType === 'bicycle') {
          countsArr.push(el.value_pk, el.value_pp, el.value_pt, el.month_info.month_number);
        } else if (el.station === stationId && currentType === 'driving') {
          countsArr.push(el.value_ak, el.value_ap, el.value_at, el.month_info.month_number);
        }
        setAllChannelCounts(countsArr[0], countsArr[1], countsArr[2]);
        setEcoCounterLabels(ecoCounterLabels => [...ecoCounterLabels, formatMonths(countsArr[3])]);
      });
    }
  };

  // Sets current user type and active button index
  const setUserTypeState = (index, typeValue) => {
    setActiveType(index);
    setCurrentType(typeValue);
  };

  const setUserTypes = (type, index) => {
    if (type === 'walking') setUserTypeState(index, 'walking');
    else if (type === 'bicycle') setUserTypeState(index, 'bicycle');
    else if (type === 'driving') setUserTypeState(index, 'driving');
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

  // useEffect is used to fill the chart with default data (default step is 'hourly')
  useEffect(() => {
    if (ecoCounterHour !== null && ecoCounterHour.station === stationId) {
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
  }, [ecoCounterHour, stationId]);

  // When current user type or step changes, calls function to update the chart data
  useEffect(() => {
    setChannelData();
  }, [currentType, currentTime]);

  // Only one station includes data about all user types (inluding cars) and some include only data about cycling.
  // Sets user types based on station name.
  // Initially used id, but it can change, so it's not always reliable.
  useEffect(() => {
    if (stationName === 'Auransilta') {
      setUserTypesList(allUsers);
    } else if (stationName === 'Kirjastosilta' || stationName === 'Teatteri ranta' || stationName === 'Teatterisilta') {
      setUserTypesList(pedestrianAndBicycle);
    } else setUserTypesList(bicycleOnly);
  }, [stationId]);

  const renderStationName = (input) => {
    if (input === 'Teatteri ranta') {
      return 'Teatteriranta';
    } return input;
  };

  return (
    <>
      <div className={classes.ecoCounterHeader}>
        <Typography component="h4" className={classes.headerSubtitle}>
          {renderStationName(stationName)}
        </Typography>
        <div className={classes.headerDate}>
          <div className={classes.iconContainer}>
            <DateRangeIcon />
          </div>
          {!isDatePickerOpen ? (
            <ButtonBase className={classes.buttonTransparent} onClick={() => setIsDatePickerOpen(true)}>
              <Typography component="h5" className={classes.headerSubtitle}>
                {selectedDate.clone().format('DD.MM.YYYY')}
              </Typography>
            </ButtonBase>
          ) : (
            <ButtonBase className={classes.buttonTransparent} onClick={() => setIsDatePickerOpen(false)}>
              <Typography component="h5" className={classes.headerSubtitle}>
                {selectedDate.clone().format('DD.MM.YYYY')}
              </Typography>
            </ButtonBase>
          )}
        </div>
        {isDatePickerOpen ? (
          <div className={classes.ecocounterDatePicker}>
            <DayPickerSingleDateController
              date={selectedDate}
              onDateChange={(newDate) => {
                changeDate(newDate);
                setIsDatePickerOpen(false);
              }}
              numberOfMonths={1}
            />
          </div>
        ) : null}
      </div>
      <div className={classes.ecocounterContent}>
        <div className={classes.ecocounterUserTypes}>
          {userTypesList
            && userTypesList.map((userType, i) => (
              <div key={userType.type.user} className={classes.buttonAndTextContainer}>
                <ButtonBase
                  className={i === activeType ? `${classes.buttonActive}` : `${classes.buttonWhite}`}
                  onClick={() => setUserTypes(userType.type.user, i)}
                >
                  <div>
                    <ReactSVG
                      className={i === activeType ? `${classes.iconActive}` : `${classes.icon}`}
                      src={userType.type.icon}
                    />
                  </div>
                </ButtonBase>
                <div className={classes.textContainer}>
                  <Typography variant="body2" className={classes.userTypeText}>
                    {userType.type.text}
                  </Typography>
                </div>
              </div>
            ))}
        </div>
        <div className={classes.ecocounterChart}>
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
        <div className={classes.ecocounterSteps}>
          <>
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
          </>
        </div>
      </div>
    </>
  );
};

EcoCounterContent.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  intl: PropTypes.objectOf(PropTypes.any).isRequired,
  stationId: PropTypes.number,
  stationName: PropTypes.string,
};

EcoCounterContent.defaultProps = {
  stationId: 0,
  stationName: '',
};

export default EcoCounterContent;
