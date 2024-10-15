/* eslint-disable import/prefer-default-export */

/**
 * Parses given linestring data and returns its coordinates
 * @param {string} s input linestring data with coordinates
 * @returns array of coordinate arrays [y, x]
 */
export function getCoordinates(s) {
  if (!s) {
    return [];
  }
  const pattern = /LINESTRING \(([^)]+)\)/;

  const match = s.match(pattern);
  if (match) {
    const coordsStr = match[1];
    // Split the string into individual coordinate pairs
    const coordPairs = coordsStr.split(', ');
    // Split each pair into numbers and create an array of arrays [x, y]
    const coordinates = coordPairs.map(pair => {
      const [x, y] = pair.split(' ').map(Number);
      // swap coordinate order for map
      return [y, x];
    });
    return coordinates;
  }
  return [];
}
