/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import { useSelector } from 'react-redux';
import disabledParkingIcon from 'servicemap-ui-turku/assets/icons/icons-icon_disabled_parking.svg';
import disabledParkingIconBw from 'servicemap-ui-turku/assets/icons/contrast/icons-icon_disabled_parking-bw.svg';
import { useMobilityPlatformContext } from '../../../../context/MobilityPlatformContext';
import { useAccessibleMap } from '../../../../redux/selectors/settings';
import useMobilityDataFetch from '../../utils/useMobilityDataFetch';
import { createIcon, isDataValid, fitPolygonsToBounds } from '../../utils/utils';
import DisabledParkingContent from './components/DisabledParkingContent';

/**
 * Displays disabled parking areas on the map in marker format.
 */

const DisabledParking = () => {
  const options = {
    type_name: 'DisabledParking',
    page_size: 1000,
    latlon: true,
  };
  const { showDisabledParking } = useMobilityPlatformContext();

  const { Marker, Popup } = global.rL;
  const { icon } = global.L;

  const useContrast = useSelector(useAccessibleMap);

  const customIcon = icon(createIcon(useContrast ? disabledParkingIconBw : disabledParkingIcon));

  const map = useMap();

  const { data } = useMobilityDataFetch(options, showDisabledParking);
  const renderData = isDataValid(showDisabledParking, data);

  useEffect(() => {
    fitPolygonsToBounds(renderData, data, map);
  }, [showDisabledParking, data]);

  const getSingleCoordinates = data => data[0][0];

  return (
    renderData ? (
      data.map(item => (
        <div key={item.id}>
          <Marker icon={customIcon} position={getSingleCoordinates(item.geometry_coords)}>
            <Popup className="disabled-parking-popup">
              <DisabledParkingContent item={item} />
            </Popup>
          </Marker>
        </div>
      ))
    ) : null
  );
};

export default DisabledParking;
