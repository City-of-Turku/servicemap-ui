/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import { useSelector } from 'react-redux';
import rentalCarParkingIcon from 'servicemap-ui-turku/assets/icons/icons-icon_rental_car_parking.svg';
import rentalCarParkingIconBw from 'servicemap-ui-turku/assets/icons/contrast/icons-icon_rental_car_parking-bw.svg';
import { useAccessibleMap } from '../../../../redux/selectors/settings';
import { useMobilityPlatformContext } from '../../../../context/MobilityPlatformContext';
import useMobilityDataFetch from '../../utils/useMobilityDataFetch';
import { isDataValid, fitPolygonsToBounds, createIcon } from '../../utils/utils';
import RentalCarParkingContent from './components/RentalCarParkingContent';
import AccessibleMarker from '../../AccessibleMarker';

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

  const { Popup } = global.rL;
  const { icon } = global.L;

  const customIcon = icon(createIcon(useContrast ? rentalCarParkingIconBw : rentalCarParkingIcon));

  const map = useMap();

  const { data } = useMobilityDataFetch(options, showRentalCarParking);
  const renderData = isDataValid(showRentalCarParking, data);

  useEffect(() => {
    fitPolygonsToBounds(renderData, data, map);
  }, [showRentalCarParking, data, map]);

  const getSingleCoordinates = data => data[0][0];

  return (
    renderData
      ? data.map(item => (
        <AccessibleMarker
          key={item.id}
          typeId="mobilityPlatform.marker.rentalCarParking"
          name={{ fi: item.name_fi, sv: item.name_sv, en: item.name_en }}
          icon={customIcon}
          position={getSingleCoordinates(item.geometry_coords)}
        >
          <Popup>
            <RentalCarParkingContent item={item} />
          </Popup>
        </AccessibleMarker>
      ))
      : null
  );
};

export default RentalCarParking;
