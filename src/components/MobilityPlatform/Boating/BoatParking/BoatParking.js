/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useMap } from 'react-leaflet';
import { useMobilityPlatformContext } from '../../../../context/MobilityPlatformContext';
import { useAccessibleMap } from '../../../../redux/selectors/settings';
import {
  isDataValid, fitPolygonsToBounds, blueOptionsBase, whiteOptionsBase,
} from '../../utils/utils';
import useMobilityDataFetch from '../../utils/useMobilityDataFetch';
import PolygonComponent from '../../PolygonComponent';
import TextContent from '../../TextContent';

/**
 * Displays boat parking areas on the map in polygon format.
 */

const BoatParking = () => {
  const options = {
    type_name: 'BoatParking',
    latlon: true,
  };

  const { showBoatParking } = useMobilityPlatformContext();

  const useContrast = useSelector(useAccessibleMap);

  const blueOptions = blueOptionsBase({ weight: 5 });
  const whiteOptions = whiteOptionsBase({
    fillOpacity: 0.3,
    weight: 5,
    dashArray: '10',
  });
  const pathOptions = useContrast ? whiteOptions : blueOptions;

  const map = useMap();

  const { data } = useMobilityDataFetch(options, showBoatParking);
  const renderData = isDataValid(showBoatParking, data);

  useEffect(() => {
    fitPolygonsToBounds(renderData, data, map);
  }, [showBoatParking, data]);

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
            titleId="mobilityPlatform.content.boatParking.title"
            translationId="mobilityPlatform.info.boatParking"
          />
        </PolygonComponent>
      ))
      : null
  );
};

export default BoatParking;
