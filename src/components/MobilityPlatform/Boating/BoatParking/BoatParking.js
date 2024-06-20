import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useMobilityPlatformContext } from '../../../../context/MobilityPlatformContext';
import { useAccessibleMap } from '../../../../redux/selectors/settings';
import { selectMapRef } from '../../../../redux/selectors/general';
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
  const map = useSelector(selectMapRef);

  const blueOptions = blueOptionsBase({ weight: 5 });
  const whiteOptions = whiteOptionsBase({
    fillOpacity: 0.3,
    weight: 5,
    dashArray: '10',
  });
  const pathOptions = useContrast ? whiteOptions : blueOptions;

  const { data } = useMobilityDataFetch(options, showBoatParking);
  const renderData = isDataValid(showBoatParking, data);

  useEffect(() => {
    fitPolygonsToBounds(renderData, data, map);
  }, [renderData, data, map]);

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
