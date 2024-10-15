import { getCoordinates } from '../utils';

describe('SkiTrails/utils', () => {
  describe('getCoordinates', () => {
    it('returns an empty array when input is an empty string', () => {
      expect(getCoordinates('')).toEqual([]);
    });

    it('returns an empty array when input is null or undefined', () => {
      expect(getCoordinates(null)).toEqual([]);
      expect(getCoordinates(undefined)).toEqual([]);
    });

    it('returns an empty array when input is not a LINESTRING', () => {
      expect(getCoordinates('POLYGON ((30 10, 40 40, 20 40, 10 20, 30 10))')).toEqual([]);
    });

    it('parses a LINESTRING and returns coordinates correctly', () => {
      const input = 'LINESTRING (30 10, 40 40, 20 40)';
      const expectedOutput = [
        [10, 30],
        [40, 40],
        [40, 20],
      ];
      expect(getCoordinates(input)).toEqual(expectedOutput);
    });

    it('parses a LINESTRING with negative coordinates correctly', () => {
      const input = 'LINESTRING (-30 10, 40 -40, 20 -40)';
      const expectedOutput = [
        [10, -30],
        [-40, 40],
        [-40, 20],
      ];
      expect(getCoordinates(input)).toEqual(expectedOutput);
    });

    it('parses a LINESTRING with decimal coordinates correctly', () => {
      const input = 'LINESTRING (30.5 10.2, 40.1 40.3)';
      const expectedOutput = [
        [10.2, 30.5],
        [40.3, 40.1],
      ];
      expect(getCoordinates(input)).toEqual(expectedOutput);
    });

    it('returns an empty array for incorrectly formatted LINESTRING', () => {
      const input = 'LINESTRING (30 10; 40 40; 20 40)'; // Semicolons instead of commas
      expect(getCoordinates(input)).toEqual([]);
    });
  });
});
