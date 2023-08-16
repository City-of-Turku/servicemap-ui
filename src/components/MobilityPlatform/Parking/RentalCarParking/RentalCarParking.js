/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useMap } from 'react-leaflet';
import { useSelector } from 'react-redux';
import disabledParkingIcon from 'servicemap-ui-turku/assets/icons/icons-icon_disabled_parking.svg';
import disabledParkingIconBw from 'servicemap-ui-turku/assets/icons/contrast/icons-icon_disabled_parking-bw.svg';
import { useAccessibleMap } from '../../../../redux/selectors/settings';
import { useMobilityPlatformContext } from '../../../../context/MobilityPlatformContext';
import { fetchMobilityMapData } from '../../mobilityPlatformRequests/mobilityPlatformRequests';
import { isDataValid, fitPolygonsToBounds, createIcon } from '../../utils/utils';
import RentalCarParkingContent from './components/RentalCarParkingContent';

/**
 * Displays parking places for the rental cars on the map.
 */

const RentalCarParking = () => {
  const [rentalCarParkingData, setRentalCarParkingData] = useState([]);

  const { showRentalCarParking } = useMobilityPlatformContext();

  const useContrast = useSelector(useAccessibleMap);

  const { Marker, Popup } = global.rL;
  const { icon } = global.L;

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

  // TODO use proper icon
  const customIcon = icon(createIcon(useContrast ? disabledParkingIconBw : disabledParkingIcon));

  const map = useMap();

  const renderData = isDataValid(showRentalCarParking, rentalCarParkingData);

  useEffect(() => {
    fitPolygonsToBounds(renderData, rentalCarParkingData, map);
  }, [showRentalCarParking, rentalCarParkingData, map]);

  const getSingleCoordinates = data => data[0][0];

  return (
    <>
      {renderData
        ? rentalCarParkingData.map(item => (
          <Marker key={item.id} icon={customIcon} position={getSingleCoordinates(item.geometry_coords)}>
            <Popup>
              <RentalCarParkingContent item={item} />
            </Popup>
          </Marker>
        ))
        : null}
    </>
  );
};

export default RentalCarParking;
