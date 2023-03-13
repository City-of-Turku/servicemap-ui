/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useMap } from 'react-leaflet';
import { useMobilityPlatformContext } from '../../../../../context/MobilityPlatformContext';
import { useAccessibleMap } from '../../../../../redux/selectors/settings';
import { fetchMobilityMapData } from '../../../mobilityPlatformRequests/mobilityPlatformRequests';
import {
  isDataValid, fitPolygonsToBounds, blueOptionsBase, whiteOptionsBase,
} from '../../../utils/utils';
import PolygonComponent from '../../../PolygonComponent';
import TextContent from '../../../TextContent';

/**
 * Displays speed limit areas of scooters on the map in polygon format.
 */

const SpeedLimitAreas = () => {
  const [speedLimitAreas, setSpeedLimitAreas] = useState([]);

  const { openMobilityPlatform, showScooterSpeedLimitAreas } = useMobilityPlatformContext();

  useEffect(() => {
    const options = {
      type_name: 'ScooterSpeedLimitArea',
      page_size: 100,
      srid: 4326,
      latlon: true,
    };
    if (openMobilityPlatform) {
      fetchMobilityMapData(options, setSpeedLimitAreas);
    }
  }, [openMobilityPlatform, setSpeedLimitAreas]);

  const useContrast = useSelector(useAccessibleMap);

  const blueOptions = blueOptionsBase();
  const whiteOptions = whiteOptionsBase({ fillOpacity: 0.3, dashArray: '10 2 10' });
  const pathOptions = useContrast ? whiteOptions : blueOptions;

  const renderData = isDataValid(showScooterSpeedLimitAreas, speedLimitAreas);

  const map = useMap();

  useEffect(() => {
    fitPolygonsToBounds(renderData, speedLimitAreas, map);
  }, [showScooterSpeedLimitAreas, speedLimitAreas]);

  return (
    <>
      {renderData
        ? speedLimitAreas.map(item => (
          <PolygonComponent
            key={item.id}
            item={item}
            useContrast={useContrast}
            pathOptions={pathOptions}
          >
            <TextContent
              titleId="mobilityPlatform.content.scooters.speedLimitAreas.title"
              translationId="mobilityPlatform.info.scooters.speedLimitAreas"
            />
          </PolygonComponent>
        ))
        : null}
    </>
  );
};

export default SpeedLimitAreas;
