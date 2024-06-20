import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useMobilityPlatformContext } from '../../../../context/MobilityPlatformContext';
import { useAccessibleMap } from '../../../../redux/selectors/settings';
import { selectMapRef } from '../../../../redux/selectors/general';
import useMobilityDataFetch from '../../utils/useMobilityDataFetch';
import {
  fitPolygonsToBounds, isDataValid, blueOptionsBase, whiteOptionsBase,
} from '../../utils/utils';
import PolygonComponent from '../../PolygonComponent';
import TextContent from '../../TextContent';

/**
 * Displays quest harbour on the map in polygon format.
 */
const GuestHarbour = () => {
  const options = {
    type_name: 'GuestMarina',
    latlon: true,
  };

  const { showGuestHarbour } = useMobilityPlatformContext();

  const useContrast = useSelector(useAccessibleMap);
  const map = useSelector(selectMapRef);

  const blueOptions = blueOptionsBase({ weight: 5 });
  const whiteOptions = whiteOptionsBase({
    fillOpacity: 0.3,
    weight: 5,
    dashArray: '8 2 8',
  });
  const pathOptions = useContrast ? whiteOptions : blueOptions;

  const { data } = useMobilityDataFetch(options, showGuestHarbour);
  const renderData = isDataValid(showGuestHarbour, data);

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
            titleId="mobilityPlatform.content.guestHarbour.title"
            translationId="mobilityPlatform.content.guestHarbour.info"
          />
        </PolygonComponent>
      ))
      : null
  );
};

export default GuestHarbour;
