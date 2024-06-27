import URI from 'urijs';

export const getEmbedURL = (url, params = {}) => {
  if (!url) {
    return undefined;
  }
  const uri = URI(url);

  const segment = uri.segment();
  const data = uri.search(true); // Get data object of search parameters
  if (params.map) {
    data.map = params.map;
  }
  if (params.city?.length > 0) {
    data.city = params.city.join(',');
  } else {
    delete data.city;
  }
  if (params.organization?.length > 0) {
    data.organization = params.organization.map(org => org.id).join(',');
  } else {
    delete data.organization;
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

export const setBboxToUrl = (url, bbox) => {
  if (!url) {
    return undefined;
  }
  const uri = URI(url);

  const data = uri.search(true); // Get data object of search parameters
  if (bbox) {
    data.bbox = bbox;
  } else {
    delete data.bbox;
  }
  uri.search(data);
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
