import config from '../../../../config';

const apiUrl = config.airMonitoringAPI;
const isApiUrl = !apiUrl || apiUrl === 'undefined' ? null : apiUrl;

/**
 * Fetch air monitoring stations
 * @param {*function} setStations
 */
const fetchAirMonitoringStations = async (setStations) => {
  try {
    const response = await fetch(`${isApiUrl}/stations?page_size=20`);
    const jsonData = await response.json();
    setStations(jsonData.results);
  } catch (err) {
    console.warn(err.message);
  }
};

/**
 * Fetch air quality related parameters
 * @param {*function} setData
 */
const fetchAirMonitoringParameters = async (setData) => {
  try {
    const response = await fetch(`${isApiUrl}/parameters?page_size=10`);
    const jsonData = await response.json();
    setData(jsonData.results);
  } catch (err) {
    console.warn(err.message);
  }
};

/**
 * Fetch daily datas for specific air monitoring station
 * @param {*number} endDay
 * @param {*number} startDay
 * @param {*number} id
 * @param {*number} yearNumber
 * @param {*function} setDayData
 */
const fetchAirMonitoringDayDatas = async (endDay, startDay, id, yearNumber, setDayData) => {
  try {
    const response = await fetch(
      `${isApiUrl}/data?end=${endDay}&start=${startDay}&station_id=${id}&type=day&year=${yearNumber}`,
    );
    const jsonData = await response.json();
    setDayData(jsonData.results);
  } catch (err) {
    console.warn(err.message);
  }
};

/**
 * Fetch weekly datas for specific air monitoring station
 * @param {*number} endWeek
 * @param {*number} startWeek
 * @param {*number} id
 * @param {*number} yearNumber
 * @param {*function} setMonthData
 */
const fetchAirMonitoringWeekDatas = async (endWeek, startWeek, id, yearNumber, setMonthData) => {
  try {
    const response = await fetch(
      `${isApiUrl}/data?end=${endWeek}&start=${startWeek}&station_id=${id}&type=week&year=${yearNumber}`,
    );
    const jsonData = await response.json();
    setMonthData(jsonData.results);
  } catch (err) {
    console.warn(err.message);
  }
};

/**
 * Fetch month datas for specific air monitoring station
 * @param {*number} endMonth
 * @param {*number} startMonth
 * @param {*number} id
 * @param {*number} yearNumber
 * @param {*function} setMonthData
 */
const fetchAirMonitoringMonthDatas = async (endMonth, startMonth, id, yearNumber, setMonthData) => {
  try {
    const response = await fetch(
      `${isApiUrl}/data?end=${endMonth}&start=${startMonth}&station_id=${id}&type=month&year=${yearNumber}`,
    );
    const jsonData = await response.json();
    setMonthData(jsonData.results);
  } catch (err) {
    console.warn(err.message);
  }
};

/**
 * Fetch annual datas for specific air monitoring station
 * @param {*number} endYear
 * @param {*number} startYear
 * @param {*number} id
 * @param {*function} setMonthData
 */
const fetchAirMonitoringYearDatas = async (endYear, startYear, id, setMonthData) => {
  try {
    const response = await fetch(
      `${isApiUrl}/data?end=${endYear}&start=${startYear}&station_id=${id}&type=year`,
    );
    const jsonData = await response.json();
    setMonthData(jsonData.results);
  } catch (err) {
    console.warn(err.message);
  }
};

export {
  fetchAirMonitoringStations,
  fetchAirMonitoringDayDatas,
  fetchAirMonitoringParameters,
  fetchAirMonitoringWeekDatas,
  fetchAirMonitoringMonthDatas,
  fetchAirMonitoringYearDatas,
};
