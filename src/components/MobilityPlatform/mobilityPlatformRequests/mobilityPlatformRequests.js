/* eslint-disable max-len */
// Functions to make requests to the API
import config from '../../../../config';

const apiUrl = config.mobilityPlatformAPI;
const isApiUrl = !apiUrl || apiUrl === 'undefined' ? null : apiUrl;

const fetchMobilityMapData = async (type, pageSize, setData) => {
  try {
    const response = await fetch(`${isApiUrl}/mobility_data/mobile_units?type_name=${type}&page_size=${pageSize}&srid=4326`);
    const jsonData = await response.json();
    setData(jsonData.results);
  } catch (err) {
    console.warn(err.message);
  }
};

const fetchCultureRouteNames = async (setData) => {
  try {
    const response = await fetch(`${isApiUrl}/mobility_data/mobile_unit_groups/`);
    const jsonData = await response.json();
    setData(jsonData.results);
  } catch (err) {
    console.warn(err.message);
  }
};

const fetchCultureRoutesData = async (type, size, setData) => {
  try {
    const response = await fetch(`${isApiUrl}/mobility_data/mobile_units?type_name=${type}&page_size=${size}&srid=4326`);
    const jsonData = await response.json();
    setData(jsonData.results);
  } catch (err) {
    console.warn(err.message);
  }
};

const fetchBicycleRouteNames = async (setData) => {
  try {
    const response = await fetch(`${isApiUrl}/bicycle_network/bicycle_networks/`);
    const jsonData = await response.json();
    setData(jsonData.results);
  } catch (err) {
    console.warn(err.message);
  }
};

const fetchBicycleRoutesGeometry = async (setData) => {
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

const fetchMobilityMapPolygonData = async (type, pageSize, setData) => {
  try {
    const response = await fetch(`${isApiUrl}/mobility_data/mobile_units?type_name=${type}&page_size=${pageSize}&srid=4326&latlon=true`);
    const jsonData = await response.json();
    setData(jsonData.results);
  } catch (err) {
    console.warn(err.message);
  }
};

const fetchLounaistietoData = async (type, pageSize, extraKey, extraValue, setData) => {
  try {
    const response = await fetch(`${isApiUrl}/mobility_data/mobile_units?type_name=${type}&page_size=${pageSize}&srid=4326&latlon=true&extra__${extraKey}=${extraValue}`);
    const jsonData = await response.json();
    setData(jsonData.results);
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
    const response = await fetch(`${isApiUrl}/street_maintenance/maintenance_works/${endpoint}`);
    const jsonData = await response.json();
    setData(jsonData);
  } catch (err) {
    console.warn(err.message);
  }
};

export {
  fetchMobilityMapData,
  fetchCultureRouteNames,
  fetchCultureRoutesData,
  fetchBicycleRouteNames,
  fetchBicycleRoutesGeometry,
  fetchIotData,
  fetchMobilityMapPolygonData,
  fetchLounaistietoData,
  fetchCityBikesData,
  fetchStreetMaintenanceData,
};
