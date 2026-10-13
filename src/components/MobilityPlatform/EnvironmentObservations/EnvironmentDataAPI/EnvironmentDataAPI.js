import config from '../../../../../config';
import fetchAllPages from '../../../../utils/fetchAllPages';

const apiUrl = config.airMonitoringAPI;
const isApiUrl = !apiUrl || apiUrl === 'undefined' ? null : apiUrl;

/**
 * Take object of options and return parameter string suitable for querys
 * @param {*object} options
 * @returns {*string} params
 */
const optionsToParams = options => {
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
const fetchObservationStations = async (type, setStations) => {
  try {
    const results = await fetchAllPages(`${isApiUrl}/stations?data_type=${type}&page_size=20`);
    setStations(results);
  } catch (err) {
    console.warn(err.message);
  }
};

/**
 * Fetch air quality related parameters
 * @param {*function} setData
 */
const fetchObservationParameters = async setData => {
  try {
    const results = await fetchAllPages(`${isApiUrl}/parameters?page_size=10`);
    setData(results);
  } catch (err) {
    console.warn(err.message);
  }
};

/**
 * Fetch air quality datas for specific air monitoring station
 * @param {*object} options
 * @param {*function} setData
 */
const fetchObservationDatas = async (options, setData) => {
  const params = optionsToParams(options);
  try {
    const results = await fetchAllPages(`${isApiUrl}/data?${params}`);
    setData(results);
  } catch (err) {
    console.warn(err.message);
  }
};

export {
  fetchObservationStations,
  fetchObservationParameters,
  fetchObservationDatas,
};
