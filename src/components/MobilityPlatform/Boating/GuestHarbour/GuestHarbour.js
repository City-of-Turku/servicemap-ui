/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from 'react';
import { useMap } from 'react-leaflet';
import { useSelector } from 'react-redux';
import { MobilityPlatformContext } from '../../../../context/MobilityPlatformContext';
import { useAccessibleMap } from '../../../../redux/selectors/settings';
import { fetchMobilityMapPolygonData } from '../../mobilityPlatformRequests/mobilityPlatformRequests';
import {
  fitPolygonsToBounds, isDataValid, blueOptionsBase, whiteOptionsBase,
} from '../../utils/utils';
import PolygonComponent from '../../PolygonComponent';
import TextContent from '../../TextContent';

/**
 * Displays quest harbour on the map in polygon format.
 */

const GuestHarbour = () => {
  const [guestHarbourData, setGuestHarbourData] = useState([]);

  const { openMobilityPlatform, showGuestHarbour } = useContext(MobilityPlatformContext);

  const useContrast = useSelector(useAccessibleMap);

  useEffect(() => {
    if (openMobilityPlatform) {
      fetchMobilityMapPolygonData('GuestMarina', 50, setGuestHarbourData);
    }
  }, [openMobilityPlatform, setGuestHarbourData]);

  const blueOptions = blueOptionsBase({ weight: 5 });
  const whiteOptions = whiteOptionsBase({
    fillOpacity: 0.3,
    weight: 5,
    dashArray: '8 2 8',
  });
  const pathOptions = useContrast ? whiteOptions : blueOptions;

  const map = useMap();

  const renderData = isDataValid(showGuestHarbour, guestHarbourData);

  useEffect(() => {
    fitPolygonsToBounds(renderData, guestHarbourData, map);
  }, [showGuestHarbour, guestHarbourData]);

  return (
    <>
      {renderData
        ? guestHarbourData.map(item => (
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
        : null}
    </>
  );
};

export default GuestHarbour;
