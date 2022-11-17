import React, { useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useMap } from 'react-leaflet';
import MobilityPlatformContext from '../../../../../context/MobilityPlatformContext';
import { useAccessibleMap } from '../../../../../redux/selectors/settings';
import { fetchMobilityMapPolygonData } from '../../../mobilityPlatformRequests/mobilityPlatformRequests';
import { isDataValid, fitPolygonsToBounds } from '../../../utils/utils';
import TextContent from '../../../TextContent';

/**
 * Displays speed limit areas of scooters on the map in polygon format.
 */

const SpeedLimitAreas = () => {
  const [speedLimitAreas, setSpeedLimitAreas] = useState([]);

  const { openMobilityPlatform, showScooterSpeedLimitAreas } = useContext(MobilityPlatformContext);

  const { Polygon, Popup } = global.rL;

  useEffect(() => {
    if (openMobilityPlatform) {
      fetchMobilityMapPolygonData('ScooterSpeedLimitArea', 100, setSpeedLimitAreas);
    }
  }, [openMobilityPlatform, setSpeedLimitAreas]);

  const useContrast = useSelector(useAccessibleMap);

  const blueOptions = { color: 'rgba(7, 44, 115, 255)' };
  const whiteOptions = {
    color: 'rgba(255, 255, 255, 255)', fillOpacity: 0.3, dashArray: '10 2 10',
  };
  const pathOptions = useContrast ? whiteOptions : blueOptions;

  const renderData = isDataValid(showScooterSpeedLimitAreas, speedLimitAreas);

  const map = useMap();

  useEffect(() => {
    fitPolygonsToBounds(renderData, speedLimitAreas, map);
  }, [showScooterSpeedLimitAreas, speedLimitAreas, map]);

  return (
    <>
      {renderData
        ? speedLimitAreas.map(item => (
          <Polygon
            key={item.id}
            weight={5}
            pathOptions={pathOptions}
            positions={item.geometry_coords}
            eventHandlers={{
              mouseover: (e) => {
                e.target.setStyle({ fillOpacity: useContrast ? '0.6' : '0.2' });
              },
              mouseout: (e) => {
                e.target.setStyle({ fillOpacity: useContrast ? '0.3' : '0.2' });
              },
            }}
          >
            <Popup>
              <TextContent
                titleId="mobilityPlatform.content.scooters.speedLimitAreas.title"
                translationId="mobilityPlatform.info.scooters.speedLimitAreas"
              />
            </Popup>
          </Polygon>
        ))
        : null}
    </>
  );
};

export default SpeedLimitAreas;
