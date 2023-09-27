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
      `${isApiUrl}/data?end=${endMonth}&start=${startMonth}&station_id=${id}$type=month&year=${yearNumber}`,
    );
    const jsonData = await response.json();
    setMonthData(jsonData);
  } catch (err) {
    console.warn(err.message);
  }
};

export {
  fetchAirMonitoringStations,
  fetchAirMonitoringMonthDatas,
};
