/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useMap } from 'react-leaflet';
import { useMobilityPlatformContext } from '../../../../context/MobilityPlatformContext';
import { useAccessibleMap } from '../../../../redux/selectors/settings';
import {
  isDataValid, fitPolygonsToBounds, blueOptionsBase, whiteOptionsBase,
} from '../../utils/utils';
import { fetchMobilityMapData } from '../../mobilityPlatformRequests/mobilityPlatformRequests';
import PolygonComponent from '../../PolygonComponent';
import TextContent from '../../TextContent';

/**
 * Displays boat parking areas on the map in polygon format.
 */

const BoatParking = () => {
  const [boatParkingData, setBoatParkingData] = useState([]);

  const { openMobilityPlatform, showBoatParking } = useMobilityPlatformContext();

  const useContrast = useSelector(useAccessibleMap);

  useEffect(() => {
    const options = {
      type_name: 'BoatParking',
      latlon: true,
    };
    if (openMobilityPlatform) {
      fetchMobilityMapData(options, setBoatParkingData);
    }
  }, [openMobilityPlatform, setBoatParkingData]);

  const blueOptions = blueOptionsBase({ weight: 5 });
  const whiteOptions = whiteOptionsBase({
    fillOpacity: 0.3,
    weight: 5,
    dashArray: '10',
  });
  const pathOptions = useContrast ? whiteOptions : blueOptions;

  const map = useMap();

  const renderData = isDataValid(showBoatParking, boatParkingData);

  useEffect(() => {
    fitPolygonsToBounds(renderData, boatParkingData, map);
  }, [showBoatParking, boatParkingData]);

  return (
    <>
      {renderData
        ? boatParkingData.map(item => (
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
        : null}
    </>
  );
};

export default BoatParking;
