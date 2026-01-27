/* eslint-disable max-len */
// Functions to make requests to the API
import config from '../../../../config';

const apiUrl = config.mobilityPlatformAPI;
const isApiUrl = !apiUrl || apiUrl === 'undefined' ? null : apiUrl;

const railwaysApiUrl = config.railwaysAPI;
const isRailwaysApiUrl = !railwaysApiUrl || railwaysApiUrl === 'undefined' ? null : railwaysApiUrl;

const serviceMapApiUrlBase = config.serviceMapAPI.root;
const serviceMapApiUrlVersion = config.serviceMapAPI.version;
const serviceMapApiUrl = `${serviceMapApiUrlBase}${serviceMapApiUrlVersion}`;
const isServiceMapApiUrl = !serviceMapApiUrlBase || serviceMapApiUrlBase === 'undefined' ? null : serviceMapApiUrl;

const roadworksApiUrl = config.roadworksAPI;
const isRoadworksApiUrl = !roadworksApiUrl || roadworksApiUrl === 'undefined' ? null : roadworksApiUrl;

const portNetApiUrl = config.portnetAPI;
const isPortNetApiUrl = !portNetApiUrl || portNetApiUrl === 'undefined' ? null : portNetApiUrl;

/**
 * Returns query options as a search params for URLs
 * @param {Object} options
 * @param {*} options.key
 * @returns {string}
 */

const optionsToParams = options => {
  const defaultOptions = {
    page_size: 100,
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

const fetchCultureRouteNames = async (setData, signal) => {
  try {
    const response = await fetch(`${isApiUrl}/mobility_data/mobile_unit_groups/`, { signal });
    const jsonData = await response.json();
    setData(jsonData.results);
  } catch (err) {
    console.warn(err.message);
  }
};

const fetchBicycleRouteNames = async (setData, signal) => {
  try {
    const response = await fetch(`${isApiUrl}/bicycle_network/bicycle_networks/`, { signal });
    const jsonData = await response.json();
    setData(jsonData.results);
  } catch (err) {
    console.warn(err.message);
  }
};

const fetchBicycleRoutesGeometry = async (setData, signal) => {
  try {
    const response = await fetch(`${isApiUrl}/bicycle_network/bicycle_networkparts/?page_size=1000&latlon=true`, {
      signal,
    });
    const jsonData = await response.json();
    setData(jsonData.results);
  } catch (err) {
    console.warn(err.message);
  }
};

const fetchIotData = async (sourceName, setData, signal) => {
  try {
    const response = await fetch(`${isApiUrl}/iot?source_name=${sourceName}`, { signal });
    const jsonData = await response.json();
    setData(jsonData.results[0].data);
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

const fetchAreaGeometries = async (endpoint, setData, setError, signal) => {
  try {
    const response = await fetch(endpoint, { signal });
    const jsonData = await response.json();
    setData(jsonData.features);
  } catch (err) {
    setError(true);
    console.warn(err.message);
  }
};

const fetchParkingAreaStats = async (endpoint, setData, setError, signal) => {
  try {
    const response = await fetch(endpoint, { signal });
    const jsonData = await response.json();
    setData(jsonData.results);
  } catch (err) {
    setError(true);
    console.warn(err.message);
  }
};

const fetchRailwaysData = async (endpoint, setData, signal) => {
  try {
    const response = await fetch(`${isRailwaysApiUrl}/${endpoint}`, { signal });
    const jsonData = await response.json();
    setData(jsonData);
  } catch (err) {
    console.warn(err.message);
  }
};

const fetchRoadworksData = async (options, setData, signal) => {
  const params = optionsToParams(options);
  try {
    const response = await fetch(`${isRoadworksApiUrl}/situation/?${params}`, { signal });
    const jsonData = await response.json();
    setData(jsonData.results);
  } catch (err) {
    console.warn(err.message);
  }
};

const fetchPostCodeAreas = async (setData, signal) => {
  try {
    const response = await fetch(
      `${isServiceMapApiUrl}/administrative_division/?type=postcode_area&geometry=true&page_size=100`,
      { signal },
    );
    const jsonData = await response.json();
    setData(jsonData.results);
  } catch (err) {
    console.warn(err.message);
  }
};

const fetchPortNetData = async (endpoint, setData, isPortCalls, signal) => {
  try {
    const response = await fetch(`${isPortNetApiUrl}/${endpoint}`, { signal });
    const jsonData = await response.json();
    setData(isPortCalls ? jsonData?.portCalls : jsonData?.portAreas?.features);
  } catch (err) {
    console.warn(err.message);
  }
};

const fetchUnitMaintenanceData = async (options, setData, signal) => {
  const params = optionsToParams(options);
  try {
    const response = await fetch(`${isApiUrl}/maintenance/unit_maintenance/?${params}`, { signal });
    const jsonData = await response.json();
    setData(jsonData.results);
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
  fetchStreetMaintenanceData,
  fetchAreaGeometries,
  fetchParkingAreaStats,
  fetchRailwaysData,
  fetchRoadworksData,
  fetchPostCodeAreas,
  fetchPortNetData,
  fetchUnitMaintenanceData,
};
