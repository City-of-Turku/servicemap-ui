/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useMap } from 'react-leaflet';
import { useSelector } from 'react-redux';
import { useAccessibleMap } from '../../../../redux/selectors/settings';
import { useMobilityPlatformContext } from '../../../../context/MobilityPlatformContext';
import { fetchMobilityMapData } from '../../mobilityPlatformRequests/mobilityPlatformRequests';
import {
  isDataValid, blueOptionsBase, whiteOptionsBase, fitPolygonsToBounds,
} from '../../utils/utils';
import PolygonComponent from '../../PolygonComponent';

/**
 * Displays parking places for the rental cars on the map in polygon format.
 */

const RentalCarParking = () => {
  const [rentalCarParkingData, setRentalCarParkingData] = useState([]);

  const { showRentalCarParking } = useMobilityPlatformContext();

  const useContrast = useSelector(useAccessibleMap);

  useEffect(() => {
    const options = {
      type_name: 'ShareCarParkingPlace',
      page_size: 100,
      latlon: true,
    };
    if (showRentalCarParking) {
      fetchMobilityMapData(options, setRentalCarParkingData);
    }
  }, [showRentalCarParking]);

  const blueOptions = blueOptionsBase({ weight: 5 });
  const whiteOptions = whiteOptionsBase({ fillOpacity: 0.3, weight: 5, dashArray: '2 4 6' });
  const pathOptions = useContrast ? whiteOptions : blueOptions;

  const map = useMap();

  const renderData = isDataValid(showRentalCarParking, rentalCarParkingData);

  useEffect(() => {
    fitPolygonsToBounds(renderData, rentalCarParkingData, map);
  }, [showRentalCarParking, rentalCarParkingData, map]);

  return (
    <>
      {renderData
        ? rentalCarParkingData.map(item => (
          <PolygonComponent
            key={item.id}
            item={item}
            useContrast={useContrast}
            pathOptions={pathOptions}
          >
            <p>abc</p>
          </PolygonComponent>
        )) : null}
    </>
  );
};

export default RentalCarParking;
