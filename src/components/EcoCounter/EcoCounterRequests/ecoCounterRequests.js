/* eslint-disable max-len */
// Functions to make requests to ecouCounter API

import config from '../../../../config';
import fetchAllPages from '../../../utils/fetchAllPages';

const apiUrl = config.mobilityPlatformAPI;
const isApiUrl = !apiUrl || apiUrl === 'undefined' ? null : apiUrl;
const TRAFFIC_COUNTER_DATA_TYPES = {
  walking: 'j',
  cycling: 'p',
  driving: 'a',
  scooter: 's',
};

/** fetch counter stations by counter type, eg. 'TR' (Telraam). */
const fetchTrafficCounterStations = async (type, setStations) => {
  try {
    const results = await fetchAllPages(`${isApiUrl}/eco-counter/stations?page_size=200&counter_type=${type}`);
    setStations(results);
  } catch (err) {
    console.warn(err.message);
  }
};

/** Fetch traffic counter stations by user type, eg. 'p' (cyclists / pyöräilijät). */
const fetchTrafficCounterStationsByType = async (dataType, setStations) => {
  try {
    const results = await fetchAllPages(`${isApiUrl}/eco-counter/stations?page_size=200&data_type=${dataType}`);
    setStations(results);
  } catch (err) {
    console.warn(err.message);
  }
};

/**
 * Fetches JSON and passes it to setData. Failed requests are logged; aborted ones are ignored.
 * @param {string} url
 * @param {function} setData
 * @param {AbortSignal} [signal]
 */
const fetchJsonInto = async (url, setData, signal) => {
  try {
    const response = await fetch(url, { signal });
    if (!response.ok) throw new Error(`${response.status} ${response.url}`);
    const jsonData = await response.json();
    if (!signal?.aborted) setData(jsonData);
  } catch (err) {
    if (err.name !== 'AbortError') console.warn(err.message);
  }
};

const fetchInitialHourData = (day, stationId, setHourData, signal) => fetchJsonInto(
  `${isApiUrl}/eco-counter/hour_data/get_hour_data?date=${day}&station_id=${stationId}`,
  setHourData,
  signal,
);

const fetchInitialDayDatas = (startDate, endDate, id, setDayData, signal) => fetchJsonInto(
  `${isApiUrl}/eco-counter/day_data/get_day_datas?start_date=${startDate}&end_date=${endDate}&station_id=${id}`,
  setDayData,
  signal,
);

const fetchInitialWeekDatas = (year, startWeek, endWeek, id, setWeekData, signal) => fetchJsonInto(
  `${isApiUrl}/eco-counter/week_data/get_week_datas?year_number=${year}&start_week_number=${startWeek}&end_week_number=${endWeek}&station_id=${id}`,
  setWeekData,
  signal,
);

const fetchInitialMonthDatas = (yearNumber, startMonth, endMonth, id, setMonthData, signal) => fetchJsonInto(
  `${isApiUrl}/eco-counter/month_data/get_month_datas?year_number=${yearNumber}&start_month_number=${startMonth}&end_month_number=${endMonth}&station_id=${id}`,
  setMonthData,
  signal,
);

const fetchInitialYearData = (yearNumber, id, setYearData, signal) => fetchJsonInto(
  `${isApiUrl}/eco-counter/year_data/get_year_data?year_number=${yearNumber}&station_id=${id}`,
  setYearData,
  signal,
);

const fetchSelectedYearData = (startYear, endYear, id, setYearData, signal) => fetchJsonInto(
  `${isApiUrl}/eco-counter/year_data/get_year_datas?start_year_number=${startYear}&end_year_number=${endYear}&station_id=${id}`,
  setYearData,
  signal,
);

/**
 * Clears the state and fetches fresh data into it. Returns a cleanup that aborts the request,
 * so a request for a previous selection can't overwrite newer data or keep downloading.
 * @param {function} fetchData called with the setter and an AbortSignal,
 * e.g. (set, signal) => fetchInitialHourData(date, id, set, signal)
 * @param {function} setData state setter
 * @param {*} emptyValue value shown while loading and if the request fails
 * @returns {function} effect cleanup
 */
const fetchLatest = (fetchData, setData, emptyValue = []) => {
  const controller = new AbortController();
  setData(emptyValue);
  fetchData(setData, controller.signal);
  return () => controller.abort();
};

export {
  TRAFFIC_COUNTER_DATA_TYPES,
  fetchLatest,
  fetchTrafficCounterStations,
  fetchTrafficCounterStationsByType,
  fetchInitialHourData,
  fetchInitialDayDatas,
  fetchInitialWeekDatas,
  fetchInitialMonthDatas,
  fetchInitialYearData,
  fetchSelectedYearData,
};
