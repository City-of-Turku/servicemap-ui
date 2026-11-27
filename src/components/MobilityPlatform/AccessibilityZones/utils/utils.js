/**
 * Accessibility zone categories shown in the mobility platform menu.
 * Each category is a list of sites (bus stops, schools and kindergartens) with one mode of transport.
 * 'section' is the menu section (public transport or schools and kindergartens) in which the category is shown.
 * School and kindergarten areas of both transport modes are in the same content type,
 * so the mode of transport is resolved from the 'kulkumuoto' value.
 */
const accessibilityZoneCategories = [
  {
    key: 'busStopsWalking',
    typeName: 'BusStopAccessibilityAreaWalking',
    transport: 'walking',
    section: 'publicTransport',
    msgId: 'mobilityPlatform.menu.show.accessibilityZones.busStops.walking',
  },
  {
    key: 'busStopsCycling',
    typeName: 'BusStopAccessibilityAreaCycling',
    transport: 'cycling',
    section: 'publicTransport',
    msgId: 'mobilityPlatform.menu.show.accessibilityZones.busStops.cycling',
  },
  {
    key: 'schoolsWalking',
    typeName: 'SchoolAndKindergartenAccessibilityArea',
    transport: 'walking',
    section: 'schools',
    msgId: 'mobilityPlatform.menu.show.accessibilityZones.schools.walking',
  },
  {
    key: 'schoolsCycling',
    typeName: 'SchoolAndKindergartenAccessibilityArea',
    transport: 'cycling',
    section: 'schools',
    msgId: 'mobilityPlatform.menu.show.accessibilityZones.schools.cycling',
  },
];

const transportKeywords = {
  walking: 'kävely',
  cycling: 'pyöräily',
};

const ringColors = [
  'rgba(15, 115, 6, 255)', // green
  'rgba(7, 44, 115, 255)', // blue
  'rgba(163, 79, 0, 255)', // brown
  'rgba(180, 20, 30, 255)', // red
  'rgba(110, 40, 140, 255)', // purple
  'rgba(64, 64, 64, 255)', // gray
];

const walkingDashArray = '12 6 3';

/**
 * Line style of an accessibility zone ring. Used by both the map layer and the legend of the menu.
 * Walking zones are dashed and cycling zones solid, also on the contrast map.
 * Rings are separated by color, or by line width on the contrast map.
 * @param {number} ringIndex index of the ring from the smallest (0) to the largest
 * @param {string} transport
 * @param {boolean} useContrast
 * @returns {Object} color, weight and dashArray of the line
 */
const getAccessibilityZoneLineStyle = (ringIndex, transport, useContrast) => {
  const dashArray = transport === 'walking' ? walkingDashArray : null;
  if (useContrast) {
    return {
      color: 'rgba(255, 255, 255, 255)',
      weight: ringIndex <= 1 ? 5 : 3,
      dashArray,
    };
  }
  return {
    color: ringColors[ringIndex] ?? 'rgba(0, 0, 0, 255)',
    weight: 3,
    dashArray,
  };
};

/**
 * Check if accessibility area is of given transport type.
 * @param {Object} item
 * @param {string} transport
 * @returns {boolean}
 */
const isTransportType = (item, transport) => !!item?.extra?.kulkumuoto
  ?.toLowerCase()
  .includes(transportKeywords[transport]);

/**
 * Group accessibility areas by site. The backend importer sets extra.site_id, which is the name of the site,
 * or for sites sharing a name, the name and the municipality (e.g. 'Asema (Kaarina)'). It is used as the id
 * and the name of the group, so that sites with the same name are separate items in the list.
 * Falls back to the Finnish name, if the areas were imported before the site ids.
 * Areas of a group are sorted from the largest to the smallest, so that smaller areas are drawn on top.
 * The areas fetched for the lists have no geometry, the map layer fetches it for the selected groups.
 * @param {Array} data
 * @param {Object} category
 * @returns {Array} groups sorted by name
 */
const groupAccessibilityZones = (data, category) => {
  if (!data?.length) {
    return [];
  }
  const groups = data.reduce((acc, item) => {
    if (!isTransportType(item, category.transport) || !item.name_fi) {
      return acc;
    }
    const siteId = item.extra?.site_id ?? item.name_fi;
    const id = `${category.key}-${siteId}`;
    if (!acc[id]) {
      acc[id] = {
        id,
        name: siteId,
        category: category.key,
        transport: category.transport,
        // Locations of the site (bus stops or a school or kindergarten unit), resolved by the backend importer.
        // Same in all areas of the site, empty if the backend did not find the site.
        siteLocations: Array.isArray(item.extra?.site_locations) ? item.extra.site_locations : [],
        areas: [],
      };
    }
    acc[id].areas.push(item);
    return acc;
  }, {});

  return Object.values(groups)
    .map(group => ({
      ...group,
      areas: group.areas.slice().sort((a, b) => b.extra.minuutit - a.extra.minuutit),
      minutes: [...new Set(group.areas.map(area => area.extra.minuutit))].sort((a, b) => a - b),
    }))
    .sort((a, b) => a.name.localeCompare(b.name, 'fi'));
};

/**
 * Check if the geometries of the areas of a group have been fetched.
 * @param {Object} group
 * @returns {boolean}
 */
const hasGeometry = group => group.areas.every(area => area.geometry_coords);

// Coordinates are nested arrays of [lat, lon] pairs (polygon or multipolygon).
const getPoints = coords => {
  if (!Array.isArray(coords)) {
    return [];
  }
  if (typeof coords[0] === 'number') {
    return [coords];
  }
  return coords.flatMap(getPoints);
};

/**
 * Bounds of the smallest area of a group. The site (bus stop, school or kindergarten) is inside it.
 * @param {Object} group
 * @returns {Object|null} minLat, minLon, maxLat and maxLon
 */
const getSiteBounds = group => {
  const smallestArea = group?.areas?.[group.areas.length - 1];
  const points = getPoints(smallestArea?.geometry_coords);
  if (!points.length) {
    return null;
  }
  const lats = points.map(point => point[0]);
  const lons = points.map(point => point[1]);
  return {
    minLat: Math.min(...lats),
    minLon: Math.min(...lons),
    maxLat: Math.max(...lats),
    maxLon: Math.max(...lons),
  };
};

/**
 * Approximate location of the site: center of the smallest area.
 * Used when the backend has not found the location of the site.
 * @param {Object} group
 * @returns {Object|null} lat and lon
 */
const getSiteCenter = group => {
  const bounds = getSiteBounds(group);
  if (!bounds) {
    return null;
  }
  return {
    lat: (bounds.minLat + bounds.maxLat) / 2,
    lon: (bounds.minLon + bounds.maxLon) / 2,
  };
};

const isBusStopGroup = group => group?.category?.startsWith('busStops');

/**
 * Speed of the mode of transport from the 'kulkumuoto' value, e.g. 'Kävely 4,6 km/h' -> '4,6 km/h'.
 * @param {Object} group
 * @returns {string|null}
 */
const getTransportSpeed = group => {
  const match = group?.areas?.[0]?.extra?.kulkumuoto?.match(/(\d+(?:[,.]\d+)?)\s*km\/h/i);
  return match ? `${match[1]} km/h` : null;
};

export {
  accessibilityZoneCategories,
  getSiteBounds,
  getSiteCenter,
  isBusStopGroup,
  getTransportSpeed,
  ringColors,
  getAccessibilityZoneLineStyle,
  transportKeywords,
  isTransportType,
  groupAccessibilityZones,
  hasGeometry,
  walkingDashArray,
};
