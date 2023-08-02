/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useMap } from 'react-leaflet';
import { useSelector } from 'react-redux';
import disabledParkingIcon from 'servicemap-ui-turku/assets/icons/icons-icon_disabled_parking.svg';
import disabledParkingIconBw from 'servicemap-ui-turku/assets/icons/contrast/icons-icon_disabled_parking-bw.svg';
import { useMobilityPlatformContext } from '../../../../context/MobilityPlatformContext';
import { useAccessibleMap } from '../../../../redux/selectors/settings';
import { fetchMobilityMapData } from '../../mobilityPlatformRequests/mobilityPlatformRequests';
import { createIcon, isDataValid, fitPolygonsToBounds } from '../../utils/utils';
import DisabledParkingContent from './components/DisabledParkingContent';

/**
 * Displays disabled parking areas on the map in marker format.
 */

const DisabledParking = () => {
  const [disabledParkingData, setDisabledParkingData] = useState([]);

  const { showDisabledParking } = useMobilityPlatformContext();

  const { Marker, Popup } = global.rL;
  const { icon } = global.L;

  const useContrast = useSelector(useAccessibleMap);

  const customIcon = icon(createIcon(useContrast ? disabledParkingIconBw : disabledParkingIcon));

  useEffect(() => {
    const options = {
      type_name: 'DisabledParking',
      page_size: 1000,
      latlon: true,
    };
    if (showDisabledParking) {
      fetchMobilityMapData(options, setDisabledParkingData);
    }
  }, [showDisabledParking]);

  const map = useMap();

  const renderData = isDataValid(showDisabledParking, disabledParkingData);

  useEffect(() => {
    fitPolygonsToBounds(renderData, disabledParkingData, map);
  }, [showDisabledParking, disabledParkingData]);

  const getSingleCoordinates = data => data[0][0];

  return (
    <>
      {renderData ? (
        disabledParkingData.map(item => (
          <div key={item.id}>
            <Marker icon={customIcon} position={getSingleCoordinates(item.geometry_coords)}>
              <Popup className="disabled-parking-popup">
                <DisabledParkingContent item={item} />
              </Popup>
            </Marker>
          </div>
        ))
      ) : null}
    </>
  );
};

export default DisabledParking;
