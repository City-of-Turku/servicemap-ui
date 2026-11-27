import { getSiteCenter, isBusStopGroup } from './utils';

/**
 * Locations of the site of an accessibility zone group. The backend importer resolves the locations
 * (service map unit of a school or kindergarten, or the Föli stops of a bus stop) into extra.site_locations.
 * If the site was not found, the center of the smallest area is used as an approximate location.
 * @param {Object} group
 * @returns {Array} [{ name, lat, lon, approximate }]
 */
const getSiteLocations = group => {
  if (group.siteLocations?.length) {
    return group.siteLocations.map(location => ({ ...location, approximate: false }));
  }
  const center = getSiteCenter(group);
  return center ? [{ name: group.name, ...center, approximate: true }] : [];
};

/**
 * Markers of the selected sites. Walking and cycling zones of the same site share one marker,
 * so the marker popup lists the travel times of both.
 * @param {Array} selections selected accessibility zone groups
 * @returns {Array} [{ key, name, lat, lon, approximate, isBusStop, groups }]
 */
const getSiteMarkers = selections => {
  const markers = {};
  selections.forEach(group => {
    const isBusStop = isBusStopGroup(group);
    getSiteLocations(group).forEach(location => {
      const key = `${isBusStop ? 'busStop' : 'unit'}-${location.lat.toFixed(5)}-${location.lon.toFixed(5)}`;
      if (!markers[key]) {
        markers[key] = {
          key,
          name: location.name || group.name,
          lat: location.lat,
          lon: location.lon,
          approximate: location.approximate,
          isBusStop,
          groups: [],
        };
      }
      markers[key].groups.push(group);
    });
  });
  return Object.values(markers);
};

export { getSiteLocations, getSiteMarkers };
