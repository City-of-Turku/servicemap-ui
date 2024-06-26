import URI from 'urijs';

export const getEmbedURL = (url, params = {}) => {
  if (!url) {
    return false;
  }
  const uri = URI(url);

  const segment = uri.segment();
  const data = uri.search(true); // Get data object of search parameters
  const cityObj = params.city;
  const cities = cityObj
    ? Object.keys(cityObj).reduce((acc, current) => {
      if (Object.prototype.hasOwnProperty.call(cityObj, current)) {
        if (cityObj[current]) {
          acc.push(current);
        }
      }
      return acc;
    }, []) : [];

  if (params.map && params.map !== 'servicemap') {
    data.map = params.map;
  }
  if (cities.length > 0) {
    data.city = cities.join(',');
  }
  if (params.service && params.service !== 'none') {
    data.level = params.service;
  }
  if (data.q && params.defaultLanguage) {
    data.search_language = params.defaultLanguage;
  }
  if (params.transit) {
    data.transit = params.transit ? 1 : 0;
  }
  if (params.showUnits === false) {
    data.units = 'none';
  }
  if (params.showUnitList && params.showUnitList !== 'none') {
    data.show_list = params.showUnitList;
  }
  if (params.chargingStation) {
    data.charging_station = params.chargingStation ? 1 : 0;
  }
  if (params.cityBikes) {
    data.city_bikes = params.cityBikes ? 1 : 0;
  }
  if (params.cargoBikes) {
    data.cargo_bikes = params.cargoBikes ? 1 : 0;
  }
  if (params.rentalCars) {
    data.rental_cars = params.rentalCars ? 1 : 0;
  }
  if (params.bicycleStands) {
    data.bicycle_stands = params.bicycleStands ? 1 : 0;
  }
  if (params.frameLockable) {
    data.frame_lockable = params.frameLockable ? 1 : 0;
  }
  if (params.crossWalks) {
    data.crosswalks = params.crossWalks ? 1 : 0;
  }
  if (params.publicBenches) {
    data.public_benches = params.publicBenches ? 1 : 0;
  }
  if (params.underPass) {
    data.underpass = params.underPass ? 1 : 0;
  }
  if (params.overPass) {
    data.overpass = params.overPass ? 1 : 0;
  }
  if (params.accessibilityAreas) {
    data.accessibility_areas = params.accessibilityAreas ? 1 : 0;
  }
  if (params.accessibilityAreasWalk) {
    data.accessibility_areas_walk = params.accessibilityAreasWalk ? 1 : 0;
  }
  if (params.accessibilityAreasBicycle) {
    data.accessibility_areas_bicycle = params.accessibilityAreasBicycle ? 1 : 0;
  }
  if (params.bbox) {
    data.bbox = params.bbox;
  }

  uri.search(data);

  if (params.language) {
    segment.splice(0, 1, params.language);
  }
  uri.segment(segment);
  return URI.decode(uri);
};

export const getLanguage = (url) => {
  if (!url) {
    return null;
  }
  const uri = URI(url);
  const segment = uri.segment();
  return segment[0];
};
