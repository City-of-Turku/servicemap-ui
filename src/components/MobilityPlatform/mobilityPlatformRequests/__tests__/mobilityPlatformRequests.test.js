import { fetchMobilityMapData } from '../mobilityPlatformRequests';

const mockResponse = results => Promise.resolve({ json: () => Promise.resolve({ results }) });

describe('fetchMobilityMapData geometry filtering', () => {
  const originalFetch = global.fetch;
  let setData;

  beforeEach(() => {
    setData = jest.fn();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  const fetchWith = async results => {
    global.fetch = jest.fn(() => mockResponse(results));
    await fetchMobilityMapData({ type_name: 'Test' }, setData);
    return setData.mock.calls[0][0];
  };

  it('keeps point geometries with numeric lat and lon', async () => {
    const items = [{ id: 1, geometry_coords: { lat: 60.45, lon: 22.27 } }];
    expect(await fetchWith(items)).toEqual(items);
  });

  it('keeps line and polygon geometries given as non-empty arrays', async () => {
    const items = [
      { id: 1, geometry_coords: [[60.447, 22.270], [60.448, 22.271]] },
      { id: 2, geometry_coords: [[[60.1, 22.1], [60.2, 22.2], [60.3, 22.3]]] },
    ];
    expect(await fetchWith(items)).toEqual(items);
  });

  it('drops items with missing, empty or invalid geometry', async () => {
    const valid = { id: 1, geometry_coords: { lat: 60.45, lon: 22.27 } };
    const items = [
      valid,
      { id: 2 },
      { id: 3, geometry_coords: null },
      { id: 4, geometry_coords: '' },
      { id: 5, geometry_coords: [] },
      { id: 6, geometry_coords: { lat: 60.45 } },
      { id: 7, geometry_coords: { lat: '60.45', lon: '22.27' } },
    ];
    expect(await fetchWith(items)).toEqual([valid]);
  });

  it('drops arrays with empty or malformed contents', async () => {
    const valid = { id: 1, geometry_coords: [[60.447, 22.27], [60.448, 22.271]] };
    const items = [
      valid,
      { id: 2, geometry_coords: [[]] },
      { id: 3, geometry_coords: [[null, null]] },
      { id: 4, geometry_coords: [[60.4]] },
      { id: 5, geometry_coords: [[60.447, 22.27], []] },
      { id: 6, geometry_coords: [[[]]] },
    ];
    expect(await fetchWith(items)).toEqual([valid]);
  });

  it('drops non-finite and out-of-range coordinates', async () => {
    const valid = { id: 1, geometry_coords: { lat: 60.45, lon: 22.27 } };
    const items = [
      valid,
      { id: 2, geometry_coords: { lat: NaN, lon: 22.27 } },
      { id: 3, geometry_coords: { lat: 60.45, lon: Infinity } },
      { id: 4, geometry_coords: { lat: 160.45, lon: 22.27 } },
      { id: 5, geometry_coords: [[NaN, 22.27], [60.4, 22.2]] },
    ];
    expect(await fetchWith(items)).toEqual([valid]);
  });

  it('returns an empty list when results are missing', async () => {
    expect(await fetchWith(undefined)).toEqual([]);
  });

  it('passes the query params and abort signal to fetch', async () => {
    const { signal } = new AbortController();
    global.fetch = jest.fn(() => mockResponse([]));
    await fetchMobilityMapData({ type_name: 'Test' }, setData, signal);
    const [url, init] = global.fetch.mock.calls[0];
    expect(url).toContain('/mobility_data/mobile_units?');
    expect(url).toContain('type_name=Test');
    expect(init.signal).toBe(signal);
  });

  it('follows pagination and combines results from all pages before filtering', async () => {
    const nextUrl = 'http://api.test/mobility_data/mobile_units?page=2';
    const first = { id: 1, geometry_coords: { lat: 60.45, lon: 22.27 } };
    const second = { id: 2, geometry_coords: { lat: 60.46, lon: 22.28 } };
    const invalid = { id: 3, geometry_coords: [] };
    const pages = [
      { count: 3, next: nextUrl, results: [first, invalid] },
      { count: 3, next: null, results: [second] },
    ];
    global.fetch = jest.fn(() => Promise.resolve({ json: () => Promise.resolve(pages[global.fetch.mock.calls.length - 1]) }));
    const { signal } = new AbortController();
    await fetchMobilityMapData({ type_name: 'Test' }, setData, signal);
    expect(global.fetch).toHaveBeenCalledTimes(2);
    expect(global.fetch.mock.calls[1][0]).toBe(nextUrl);
    expect(global.fetch.mock.calls[1][1].signal).toBe(signal);
    expect(setData).toHaveBeenCalledTimes(1);
    expect(setData).toHaveBeenCalledWith([first, second]);
  });

  it('warns and does not set data when the request fails', async () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    global.fetch = jest.fn(() => Promise.reject(new Error('network down')));
    await fetchMobilityMapData({ type_name: 'Test' }, setData);
    expect(setData).not.toHaveBeenCalled();
    expect(warn).toHaveBeenCalledWith('network down');
    warn.mockRestore();
  });
});
