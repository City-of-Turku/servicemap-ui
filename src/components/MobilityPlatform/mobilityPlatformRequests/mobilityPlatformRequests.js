/* eslint-disable max-len */
// Functions to make requests to the API
import config from '../../../../config';

const apiUrl = config.mobilityPlatformAPI;
const isApiUrl = !apiUrl || apiUrl === 'undefined' ? null : apiUrl;

const railwaysApiUrl = config.railwaysAPI;
const isRailwaysApiUrl = !railwaysApiUrl || railwaysApiUrl === 'undefined' ? null : railwaysApiUrl;

/**
 * Returns query options as a search params for URLs
 * @param {Object} options
 * @param {*} options.key
 * @returns {string}
 */

const optionsToParams = options => {
  const defaultOptions = {
    page_size: 100,
    srid: 4326,
  };
  const params = new URLSearchParams();
  Object.entries({ ...defaultOptions, ...options }).forEach(([key, value]) => {
    params.set(key, value);
  });
  return params.toString();
};

const fetchMobilityMapData = async (options, setData, signal) => {
  const params = optionsToParams(options);
  try {
    const response = await fetch(`${isApiUrl}/mobility_data/mobile_units?${params}`, { signal });
    const jsonData = await response.json();
    setData(jsonData.results);
  } catch (err) {
    console.warn(err.message);
  }
};

const fetchCultureRouteNames = async setData => {
  try {
    const response = await fetch(`${isApiUrl}/mobility_data/mobile_unit_groups/`);
    const jsonData = await response.json();
    setData(jsonData.results);
  } catch (err) {
    console.warn(err.message);
  }
};

const fetchBicycleRouteNames = async setData => {
  try {
    const response = await fetch(`${isApiUrl}/bicycle_network/bicycle_networks/`);
    const jsonData = await response.json();
    setData(jsonData.results);
  } catch (err) {
    console.warn(err.message);
  }
};

const fetchBicycleRoutesGeometry = async setData => {
  try {
    const response = await fetch(`${isApiUrl}/bicycle_network/bicycle_networkparts/?page_size=1000&latlon=true`);
    const jsonData = await response.json();
    setData(jsonData.results);
  } catch (err) {
    console.warn(err.message);
  }
};

const fetchIotData = async (sourceName, setData, isScooter) => {
  try {
    const response = await fetch(`${isApiUrl}/iot?source_name=${sourceName}`);
    const jsonData = await response.json();
    setData(!isScooter ? jsonData.results[0].data : jsonData.results[0].data.data.bikes);
  } catch (err) {
    console.warn(err.message);
  }
};

const fetchCityBikesData = async (sourceName, setData) => {
  try {
    const response = await fetch(`${isApiUrl}/iot?source_name=${sourceName}`);
    const jsonData = await response.json();
    setData(jsonData.results[0].data.data.stations);
  } catch (err) {
    console.warn(err.message);
  }
};

const fetchStreetMaintenanceData = async (endpoint, setData) => {
  try {
    const response = await fetch(`${isApiUrl}/street_maintenance/${endpoint}`);
    const jsonData = await response.json();
    setData(jsonData.results);
  } catch (err) {
    console.warn(err.message);
  }
};

const fetchParkingAreaGeometries = async (endpoint, setData, setError) => {
  try {
    const response = await fetch(endpoint);
    const jsonData = await response.json();
    setData(jsonData.features);
  } catch (err) {
    setError(true);
    console.warn(err.message);
  }
};

const fetchParkingAreaStats = async (endpoint, setData, setError) => {
  try {
    const response = await fetch(endpoint);
    const jsonData = await response.json();
    setData(jsonData.results);
  } catch (err) {
    setError(true);
    console.warn(err.message);
  }
};

const fetchRailwaysData = async (endpoint, setData) => {
  try {
    const response = await fetch(`${isRailwaysApiUrl}/${endpoint}`);
    const jsonData = await response.json();
    setData(jsonData);
  } catch (err) {
    console.warn(err.message);
  }
};

export {
  fetchMobilityMapData,
  fetchCultureRouteNames,
  fetchBicycleRouteNames,
  fetchBicycleRoutesGeometry,
  fetchIotData,
  fetchCityBikesData,
  fetchStreetMaintenanceData,
  fetchParkingAreaGeometries,
  fetchParkingAreaStats,
  fetchRailwaysData,
};
