import {
  accessibilityZoneCategories,
  getAccessibilityZoneLineStyle,
  getSiteBounds,
  getSiteCenter,
  getTransportSpeed,
  groupAccessibilityZones,
  isTransportType,
} from '../utils';

const getCategory = key => accessibilityZoneCategories.find(category => category.key === key);

const createArea = (id, name, kulkumuoto, minuutit) => ({
  id,
  name_fi: name,
  extra: { kulkumuoto, minuutit },
  geometry_coords: [[[60.45, 22.26], [60.46, 22.27], [60.45, 22.28]]],
});

const schoolAreas = [
  createArea('1', 'Paattisten koulu', 'kävely', 10),
  createArea('2', 'Paattisten koulu', 'kävely', 5),
  createArea('3', 'Paattisten koulu', 'pyöräily', 5),
  createArea('4', 'Kastun päiväkoti', 'kävely, 4 km/h', 20),
  createArea('5', 'Kastun päiväkoti', 'pyöräily, 10 km/h', 10),
  createArea('6', 'Skanssi', 'bussi', 20),
];

describe('isTransportType', () => {
  it('matches transport types regardless of case and speed suffix', () => {
    expect(isTransportType(createArea('1', 'A', 'Kävely 4,6 km/h', 5), 'walking')).toBe(true);
    expect(isTransportType(createArea('1', 'A', 'kävely, 4 km/h', 5), 'walking')).toBe(true);
    expect(isTransportType(createArea('1', 'A', 'Pyöräily 15 km/h', 5), 'cycling')).toBe(true);
    expect(isTransportType(createArea('1', 'A', 'Pyöräily 15 km/h', 5), 'walking')).toBe(false);
    expect(isTransportType(createArea('1', 'A', 'bussi', 5), 'walking')).toBe(false);
    expect(isTransportType({}, 'walking')).toBe(false);
  });
});

describe('groupAccessibilityZones', () => {
  it('groups areas by site and transport type', () => {
    const groups = groupAccessibilityZones(schoolAreas, getCategory('schoolsWalking'));

    expect(groups.map(group => group.name)).toEqual(['Kastun päiväkoti', 'Paattisten koulu']);
    const paattinen = groups[1];
    expect(paattinen.id).toBe('schoolsWalking-Paattisten koulu');
    expect(paattinen.category).toBe('schoolsWalking');
    expect(paattinen.transport).toBe('walking');
    expect(paattinen.minutes).toEqual([5, 10]);
    // Largest area first, so that smaller areas are drawn on top of it.
    expect(paattinen.areas.map(area => area.id)).toEqual(['1', '2']);
  });

  it('does not include other transport types', () => {
    const groups = groupAccessibilityZones(schoolAreas, getCategory('schoolsCycling'));

    expect(groups.map(group => group.name)).toEqual(['Kastun päiväkoti', 'Paattisten koulu']);
    expect(groups.flatMap(group => group.areas).map(area => area.id)).toEqual(['5', '3']);
  });

  it('separates sites with the same name by the site id of the backend, also in the name', () => {
    const createSiteArea = (id, minuutit, siteId) => {
      const area = createArea(id, 'Asema', 'kävely', minuutit);
      return { ...area, extra: { ...area.extra, site_id: siteId } };
    };
    const areas = [
      createSiteArea('1', 10, 'Asema (Turku)'),
      createSiteArea('2', 10, 'Asema (Kaarina)'),
      createSiteArea('3', 5, 'Asema (Kaarina)'),
    ];
    const groups = groupAccessibilityZones(areas, getCategory('busStopsWalking'));

    expect(groups.map(group => group.id)).toEqual([
      'busStopsWalking-Asema (Kaarina)',
      'busStopsWalking-Asema (Turku)',
    ]);
    expect(groups.map(group => group.name)).toEqual(['Asema (Kaarina)', 'Asema (Turku)']);
    expect(groups.map(group => group.areas.map(area => area.id))).toEqual([['2', '3'], ['1']]);
  });

  it('returns an empty array for empty data', () => {
    expect(groupAccessibilityZones([], getCategory('busStopsWalking'))).toEqual([]);
    expect(groupAccessibilityZones(undefined, getCategory('busStopsWalking'))).toEqual([]);
  });
});

describe('getAccessibilityZoneLineStyle', () => {
  it('uses the same color for the same ring of walking and cycling zones', () => {
    expect(getAccessibilityZoneLineStyle(0, 'walking', false)).toEqual({
      color: 'rgba(15, 115, 6, 255)', weight: 3, dashArray: '12 6 3',
    });
    expect(getAccessibilityZoneLineStyle(0, 'cycling', false)).toEqual({
      color: 'rgba(15, 115, 6, 255)', weight: 3, dashArray: null,
    });
    expect(getAccessibilityZoneLineStyle(2, 'walking', false).color).toBe('rgba(163, 79, 0, 255)');
  });

  it('separates rings by line width on the contrast map', () => {
    expect(getAccessibilityZoneLineStyle(1, 'walking', true)).toEqual({
      color: 'rgba(255, 255, 255, 255)', weight: 5, dashArray: '12 6 3',
    });
    expect(getAccessibilityZoneLineStyle(2, 'cycling', true).weight).toBe(3);
  });

  it('falls back to black for rings without a color', () => {
    expect(getAccessibilityZoneLineStyle(6, 'cycling', false).color).toBe('rgba(0, 0, 0, 255)');
    expect(getAccessibilityZoneLineStyle(-1, 'cycling', false).color).toBe('rgba(0, 0, 0, 255)');
  });
});

describe('site location helpers', () => {
  const group = {
    id: 'busStopsWalking-Kauppatori',
    name: 'Kauppatori',
    category: 'busStopsWalking',
    areas: [
      {
        extra: { minuutit: 10, kulkumuoto: 'Kävely 4,6 km/h' },
        geometry_coords: [[[60.40, 22.20], [60.50, 22.30], [60.40, 22.30]]],
      },
      {
        extra: { minuutit: 5, kulkumuoto: 'Kävely 4,6 km/h' },
        geometry_coords: [[[60.44, 22.24], [60.46, 22.26], [60.44, 22.26]]],
      },
    ],
  };

  it('uses the smallest (last) area for the bounds and center of the site', () => {
    expect(getSiteBounds(group)).toEqual({
      minLat: 60.44, minLon: 22.24, maxLat: 60.46, maxLon: 22.26,
    });
    const center = getSiteCenter(group);
    expect(center.lat).toBeCloseTo(60.45);
    expect(center.lon).toBeCloseTo(22.25);
    expect(getSiteCenter({ areas: [] })).toBeNull();
  });

  it('reads the speed from the mode of transport', () => {
    expect(getTransportSpeed(group)).toBe('4,6 km/h');
    expect(getTransportSpeed({ areas: [{ extra: { kulkumuoto: 'kävely' } }] })).toBeNull();
  });
});

describe('site locations of groups', () => {
  it('takes the site locations resolved by the backend from the areas', () => {
    const location = {
      name: 'Kastun päiväkoti (Pyörämäentie 4)', unit_id: 1400, lat: 60.47, lon: 22.3,
    };
    const area = {
      ...createArea(1, 'Kastun päiväkoti', 'kävely', 10),
      extra: { kulkumuoto: 'kävely', minuutit: 10, site_locations: [location] },
    };
    const [group] = groupAccessibilityZones([area], getCategory('schoolsWalking'));
    expect(group.siteLocations).toEqual([location]);
  });

  it('uses an empty list when the backend has not added site locations', () => {
    const area = createArea(1, 'Kauppatori', 'Kävely 4,6 km/h', 5);
    const [group] = groupAccessibilityZones([area], getCategory('busStopsWalking'));
    expect(group.siteLocations).toEqual([]);
  });
});
