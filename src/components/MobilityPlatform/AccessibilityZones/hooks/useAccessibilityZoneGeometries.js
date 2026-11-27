import { useEffect, useRef } from 'react';
import { useMobilityPlatformContext } from '../../../../context/MobilityPlatformContext';
import { fetchMobileUnitGeometries } from '../../mobilityPlatformRequests/mobilityPlatformRequests';
import { hasGeometry } from '../utils/utils';

/**
 * Fetch the geometries of the areas of the selected accessibility zone groups. The lists are fetched
 * without geometry, as there are thousands of bus stop areas. The fetched geometries are stored in the
 * selections, so that they are fetched only once per selection. Areas with invalid geometry are left out.
 */
const useAccessibilityZoneGeometries = () => {
  const { accessibilityZoneSelections, setAccessibilityZoneSelections } = useMobilityPlatformContext();
  const pendingIdsRef = useRef(new Set());
  const controllerRef = useRef(new AbortController());

  useEffect(() => () => controllerRef.current.abort(), []);

  useEffect(() => {
    accessibilityZoneSelections
      .filter(group => !hasGeometry(group) && !pendingIdsRef.current.has(group.id))
      .forEach(async group => {
        pendingIdsRef.current.add(group.id);
        try {
          const units = await fetchMobileUnitGeometries(
            group.areas.map(area => area.id),
            controllerRef.current.signal,
          );
          const coordsById = Object.fromEntries(units.map(unit => [unit.id, unit.geometry_coords]));
          setAccessibilityZoneSelections(prevState => prevState.map(item => (item.id === group.id
            ? {
              ...item,
              areas: item.areas
                .filter(area => coordsById[area.id])
                .map(area => ({ ...area, geometry_coords: coordsById[area.id] })),
            }
            : item)));
        } catch (err) {
          console.warn(err.message);
        } finally {
          pendingIdsRef.current.delete(group.id);
        }
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessibilityZoneSelections]);
};

export default useAccessibilityZoneGeometries;
