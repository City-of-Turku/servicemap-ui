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
import AccessibleMarker from '../../AccessibleMarker';

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

  const { Popup } = global.rL;
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
          <AccessibleMarker
            typeId="mobilityPlatform.content.disabledParking.title"
            name={{ fi: item.address_fi, sv: item.address_sv, en: item.address_en }}
            icon={customIcon}
            position={getSingleCoordinates(item.geometry_coords)}
          >
            <Popup className="disabled-parking-popup">
              <DisabledParkingContent item={item} />
            </Popup>
          </AccessibleMarker>
        </div>
      ))
    ) : null
  );
};

export default DisabledParking;
