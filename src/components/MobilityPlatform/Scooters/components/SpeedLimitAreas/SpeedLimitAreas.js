/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useMap } from 'react-leaflet';
import { useMobilityPlatformContext } from '../../../../../context/MobilityPlatformContext';
import { useAccessibleMap } from '../../../../../redux/selectors/settings';
import useMobilityDataFetch from '../../../utils/useMobilityDataFetch';
import {
  isDataValid, fitPolygonsToBounds, blueOptionsBase, whiteOptionsBase,
} from '../../../utils/utils';
import PolygonComponent from '../../../PolygonComponent';
import TextContent from '../../../TextContent';

/**
 * Displays speed limit areas of scooters on the map in polygon format.
 */

const SpeedLimitAreas = () => {
  const options = {
    type_name: 'ScooterSpeedLimitArea',
    page_size: 100,
    latlon: true,
  };

  const { showScooterSpeedLimitAreas } = useMobilityPlatformContext();

  const useContrast = useSelector(useAccessibleMap);

  const blueOptions = blueOptionsBase();
  const whiteOptions = whiteOptionsBase({ fillOpacity: 0.3, dashArray: '10 2 10' });
  const pathOptions = useContrast ? whiteOptions : blueOptions;

  const { data } = useMobilityDataFetch(options, showScooterSpeedLimitAreas);
  const renderData = isDataValid(showScooterSpeedLimitAreas, data);

  const map = useMap();

  useEffect(() => {
    fitPolygonsToBounds(renderData, data, map);
  }, [showScooterSpeedLimitAreas, data]);

  return (
    renderData
      ? data.map(item => (
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
      : null
  );
};

export default SpeedLimitAreas;
