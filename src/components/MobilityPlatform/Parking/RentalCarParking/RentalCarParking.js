/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import rentalCarParkingIcon from 'servicemap-ui-turku/assets/icons/icons-icon_rental_car_parking.svg';
import rentalCarParkingIconBw from 'servicemap-ui-turku/assets/icons/contrast/icons-icon_rental_car_parking-bw.svg';
import { useAccessibleMap } from '../../../../redux/selectors/settings';
import { selectMapRef } from '../../../../redux/selectors/general';
import { useMobilityPlatformContext } from '../../../../context/MobilityPlatformContext';
import useMobilityDataFetch from '../../utils/useMobilityDataFetch';
import { isDataValid, fitPolygonsToBounds, createIcon } from '../../utils/utils';
import RentalCarParkingContent from './components/RentalCarParkingContent';

/**
 * Displays parking places for the rental cars on the map.
 */

const RentalCarParking = () => {
  const options = {
    type_name: 'ShareCarParkingPlace',
    page_size: 100,
    latlon: true,
  };

  const { showRentalCarParking } = useMobilityPlatformContext();

  const useContrast = useSelector(useAccessibleMap);
  const map = useSelector(selectMapRef);

  const { Marker, Popup } = global.rL;
  const { icon } = global.L;

  const customIcon = icon(createIcon(useContrast ? rentalCarParkingIconBw : rentalCarParkingIcon));

  const { data } = useMobilityDataFetch(options, showRentalCarParking);
  const renderData = isDataValid(showRentalCarParking, data);

  useEffect(() => {
    fitPolygonsToBounds(renderData, data, map);
  }, [showRentalCarParking, data, map]);

  const getSingleCoordinates = data => data[0][0];

  return (
    renderData
      ? data.map(item => (
        <Marker key={item.id} icon={customIcon} position={getSingleCoordinates(item.geometry_coords)}>
          <Popup>
            <RentalCarParkingContent item={item} />
          </Popup>
        </Marker>
      ))
      : null
  );
};

export default RentalCarParking;
