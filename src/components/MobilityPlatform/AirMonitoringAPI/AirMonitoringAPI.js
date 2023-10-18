import config from '../../../../config';

const apiUrl = config.airMonitoringAPI;
const isApiUrl = !apiUrl || apiUrl === 'undefined' ? null : apiUrl;

/**
 * Take object of options and return parameter string suitable for querys
 * @param {*object} options
 * @returns {*string} params
 */
const optionsToParams = (options) => {
  const defaultOptions = {
    page_size: 200,
  };
  const params = new URLSearchParams();
  Object.entries({ ...defaultOptions, ...options }).forEach(([key, value]) => {
    params.set(key, value);
  });
  return params.toString();
};

/**
 * Fetch air monitoring stations
 * @param {*function} setStations
 */
const fetchAirMonitoringStations = async (type, setStations) => {
  try {
    const response = await fetch(`${isApiUrl}/stations?data_type=${type}&page_size=20`);
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
 * Fetch air quality datas for specific air monitoring station
 * @param {*object} options
 * @param {*function} setData
 */
const fetchAirMonitoringDatas = async (options, setData) => {
  const params = optionsToParams(options);
  try {
    const response = await fetch(
      `${isApiUrl}/data?${params}`,
    );
    const jsonData = await response.json();
    setData(jsonData.results);
  } catch (err) {
    console.warn(err.message);
  }
};

export {
  fetchAirMonitoringStations,
  fetchAirMonitoringParameters,
  fetchAirMonitoringDatas,
};
