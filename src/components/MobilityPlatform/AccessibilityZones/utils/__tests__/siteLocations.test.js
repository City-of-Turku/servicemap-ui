import { getSiteLocations, getSiteMarkers } from '../siteLocations';

const areas = [{ extra: { minuutit: 5 }, geometry_coords: [[[60.44, 22.24], [60.46, 22.26], [60.44, 22.26]]] }];
const schoolLocation = {
  name: 'Kastun päiväkoti (Pyörämäentie 4)', unit_id: 1400, lat: 60.46, lon: 22.2,
};
const schoolWalking = {
  id: 'schoolsWalking-Kastun päiväkoti',
  name: 'Kastun päiväkoti',
  category: 'schoolsWalking',
  areas,
  siteLocations: [schoolLocation],
};
const schoolCycling = { ...schoolWalking, id: 'schoolsCycling-Kastun päiväkoti', category: 'schoolsCycling' };
const busGroup = {
  id: 'busStopsWalking-Suikkilantie',
  name: 'Suikkilantie',
  category: 'busStopsWalking',
  areas,
  siteLocations: [
    {
      name: 'Suikkilantie', stop_codes: ['101'], lat: 60.45, lon: 22.25,
    },
    {
      name: 'Suikkilantie', stop_codes: ['102'], lat: 60.451, lon: 22.251,
    },
  ],
};

describe('getSiteLocations', () => {
  it('uses the locations resolved by the backend', () => {
    expect(getSiteLocations(schoolWalking)).toEqual([{ ...schoolLocation, approximate: false }]);
    expect(getSiteLocations(busGroup).map(location => location.stop_codes)).toEqual([['101'], ['102']]);
  });

  it('falls back to the center of the smallest area when the site was not found', () => {
    const [location] = getSiteLocations({ ...busGroup, siteLocations: [] });
    expect(location.approximate).toBe(true);
    expect(location.name).toBe('Suikkilantie');
    expect(location.lat).toBeCloseTo(60.45);
    expect(location.lon).toBeCloseTo(22.25);
  });
});

describe('getSiteMarkers', () => {
  it('combines walking and cycling zones of the same site into one marker', () => {
    const markers = getSiteMarkers([schoolWalking, schoolCycling, busGroup]);

    expect(markers).toHaveLength(3);
    expect(markers[0].isBusStop).toBe(false);
    expect(markers[0].name).toBe('Kastun päiväkoti (Pyörämäentie 4)');
    expect(markers[0].groups.map(group => group.id)).toEqual([schoolWalking.id, schoolCycling.id]);
    expect(markers.filter(marker => marker.isBusStop)).toHaveLength(2);
  });

  it('has no approximate marker before the geometries of a site without location are fetched', () => {
    const areasWithoutGeometry = [{ id: '1', extra: { minuutit: 5 } }];
    expect(getSiteMarkers([{ ...busGroup, siteLocations: [], areas: areasWithoutGeometry }])).toEqual([]);
  });

  it('returns no markers without selections', () => {
    expect(getSiteMarkers([])).toEqual([]);
  });
});
