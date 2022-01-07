/* eslint-disable max-len */
/* eslint-disable import/prefer-default-export */
// Functions to make requests to the API

export const fetchCGSStationsData = async (apiUrl, setStations) => {
  try {
    const response = await fetch(`${apiUrl}/mobile_units?type_name=CGS&page_size=150&srid=4326`);
    const jsonData = await response.json();
    setStations(jsonData.results);
  } catch (err) {
    console.log(err.message);
  }
};

export const fetchGFSStationsData = async (apiUrl, setStations) => {
  try {
    const response = await fetch(`${apiUrl}/mobile_units?type_name=GFS&page_size=10&srid=4326`);
    const jsonData = await response.json();
    setStations(jsonData.results);
  } catch (err) {
    console.log(err.message);
  }
};

export const fetchBicycleStandsData = async (apiUrl, setStations) => {
  try {
    const response = await fetch(`${apiUrl}/mobile_units?type_name=BIS&page_size=100&srid=4326`);
    const jsonData = await response.json();
    setStations(jsonData.results);
  } catch (err) {
    console.log(err.message);
  }
};

export const fetchBicycleRoutesData = async (apiUrl, networkName, setStations) => {
  try {
    const response = await fetch(`${apiUrl}/bicycle_networkparts?page_size=10000&network_name=${networkName}&latlon=true`);
    const jsonData = await response.json();
    setStations(jsonData.results);
  } catch (err) {
    console.log(err.message);
  }
};

export const fetchCultureRoutesGroup = async (apiUrl, setStations) => {
  try {
    const response = await fetch(`${apiUrl}/mobile_unit_groups/`);
    const jsonData = await response.json();
    setStations(jsonData.results);
  } catch (err) {
    console.log(err.message);
  }
};

export const fetchCultureRoutesGeometry = async (apiUrl, setStations) => {
  try {
    const response = await fetch(`${apiUrl}/mobile_units?type_name=CRG&page_size=20&latlon=true&srid=4326`);
    const jsonData = await response.json();
    setStations(jsonData.results);
  } catch (err) {
    console.log(err.message);
  }
};

export const fetchCultureRoutesUnits = async (apiUrl, setStations) => {
  try {
    const response = await fetch(`${apiUrl}/mobile_units?type_name=CRU&page_size=150&latlon=true&srid=4326`);
    const jsonData = await response.json();
    setStations(jsonData.results);
  } catch (err) {
    console.log(err.message);
  }
};
