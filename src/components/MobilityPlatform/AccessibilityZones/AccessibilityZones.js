/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useMap } from 'react-leaflet';
import { useMobilityPlatformContext } from '../../../context/MobilityPlatformContext';
import { useAccessibleMap } from '../../../redux/selectors/settings';
import { fitPolygonsToBounds } from '../utils/utils';
import { getAccessibilityZoneLineStyle, hasGeometry } from './utils/utils';
import { StyledPopupWrapper, StyledPopupInner } from '../styled/styled';
import AccessibilityAreasContent from '../AccessibilityAreas/components/AccessibilityAreasContent';
import AccessibilityZoneSiteMarkers from './components/AccessibilityZoneSiteMarkers';
import useAccessibilityZoneGeometries from './hooks/useAccessibilityZoneGeometries';

const getLoadedGroups = selections => selections.filter(hasGeometry);

const AccessibilityZones = () => {
  const { accessibilityZoneSelections } = useMobilityPlatformContext();
  const useContrast = useSelector(useAccessibleMap);

  const map = useMap();
  const { Polygon, Popup } = global.rL;

  useAccessibilityZoneGeometries();

  const loadedGroups = getLoadedGroups(accessibilityZoneSelections);

  // Ids of the groups the map has been fitted to. The map is fitted to a group when its geometries
  // have been fetched, not when it is selected.
  const fittedIdsRef = useRef(loadedGroups.map(group => group.id));

  useEffect(() => {
    const fittedIds = fittedIdsRef.current;
    const addedAreas = loadedGroups
      .filter(group => !fittedIds.includes(group.id))
      .flatMap(group => group.areas);
    fitPolygonsToBounds(addedAreas.length > 0, addedAreas, map);
    fittedIdsRef.current = loadedGroups.map(group => group.id);
  }, [accessibilityZoneSelections]);

  const getPathOptions = (group, minutes) => ({
    ...getAccessibilityZoneLineStyle(group.minutes.indexOf(minutes), group.transport, useContrast),
    fillOpacity: useContrast ? 0.1 : 0.08,
  });

  if (!loadedGroups.length) {
    return null;
  }

  return (
    <>
      {loadedGroups.map(group => group.areas.map(item => (
        <Polygon
          key={`${group.id}-${item.id}`}
          pathOptions={getPathOptions(group, item.extra?.minuutit)}
          positions={item.geometry_coords}
        >
          <StyledPopupWrapper>
            <Popup>
              <StyledPopupInner>
                <AccessibilityAreasContent item={item} />
              </StyledPopupInner>
            </Popup>
          </StyledPopupWrapper>
        </Polygon>
      )))}
      <AccessibilityZoneSiteMarkers />
    </>
  );
};

export default AccessibilityZones;
