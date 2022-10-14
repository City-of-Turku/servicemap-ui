import React, { useContext, useEffect, useState } from 'react';
import { useMap } from 'react-leaflet';
import MobilityPlatformContext from '../../../../../context/MobilityPlatformContext';
import { fetchMobilityMapPolygonData } from '../../../mobilityPlatformRequests/mobilityPlatformRequests';
import TextContent from '../../../TextContent';

/**
 * Displays speed limit areas of scooters on the map in polygon format.
 */

const SpeedLimitAreas = () => {
  const [speedLimitAreas, setSpeedLimitAreas] = useState([]);

  const { openMobilityPlatform, mobilityMap } = useContext(MobilityPlatformContext);

  const { Polygon, Popup } = global.rL;

  useEffect(() => {
    if (openMobilityPlatform) {
      fetchMobilityMapPolygonData('SSL', 100, setSpeedLimitAreas);
    }
  }, [openMobilityPlatform, setSpeedLimitAreas]);

  const blueOptions = { color: 'rgba(7, 44, 115, 255)' };

  const map = useMap();

  useEffect(() => {
    if (mobilityMap.scooterSpeedLimit && speedLimitAreas && speedLimitAreas.length > 0) {
      const bounds = [];
      speedLimitAreas.forEach((item) => {
        bounds.push(item.geometry_coords);
      });
      map.fitBounds(bounds);
    }
  }, [mobilityMap.scooterSpeedLimit, speedLimitAreas, map]);

  return (
    <>
      {mobilityMap.scooterSpeedLimit ? (
        <>
          {speedLimitAreas
            && speedLimitAreas.length > 0
            && speedLimitAreas.map(item => (
              <Polygon key={item.id} pathOptions={blueOptions} positions={item.geometry_coords}>
                <Popup>
                  <TextContent
                    titleId="mobilityPlatform.content.scooters.speedLimitAreas.title"
                    translationId="mobilityPlatform.info.scooters.speedLimitAreas"
                  />
                </Popup>
              </Polygon>
            ))}
        </>
      ) : null}
    </>
  );
};

export default SpeedLimitAreas;
