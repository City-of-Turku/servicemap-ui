import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import scooterParkingIcon from 'servicemap-ui-turku/assets/icons/icons-icon_scooter_parking.svg';
import scooterParkingIconBw from 'servicemap-ui-turku/assets/icons/contrast/icons-icon_scooter_parking-bw.svg';
import { useMobilityPlatformContext } from '../../../../../context/MobilityPlatformContext';
import { useAccessibleMap } from '../../../../../redux/selectors/settings';
import { selectMapRef } from '../../../../../redux/selectors/general';
import useMobilityDataFetch from '../../../utils/useMobilityDataFetch';
import { createIcon, isDataValid, fitToMapBounds } from '../../../utils/utils';
import TextContent from '../../../TextContent';

const ParkingAreas = () => {
  const options = {
    type_name: 'ScooterParkingArea',
  };
  const { showScooterParkingAreas } = useMobilityPlatformContext();

  const map = useSelector(selectMapRef);
  const useContrast = useSelector(useAccessibleMap);

  const { Marker, Popup } = global.rL;
  const { icon } = global.L;

  const customIcon = icon(createIcon(useContrast ? scooterParkingIconBw : scooterParkingIcon));

  const { data } = useMobilityDataFetch(options, showScooterParkingAreas);
  const renderData = isDataValid(showScooterParkingAreas, data);

  useEffect(() => {
    fitToMapBounds(renderData, data, map);
  }, [renderData, data, map]);

  return (
    renderData ? (
      data.map(item => (
        <Marker
          key={item.id}
          icon={customIcon}
          position={[item.geometry_coords.lat, item.geometry_coords.lon]}
        >
          <Popup>
            <TextContent
              titleId="mobilityPlatform.content.scooters.parkingAreas.title"
              translationId="mobilityPlatform.info.scooters.parkingAreas"
            />
          </Popup>
        </Marker>
      ))
    ) : null
  );
};

export default ParkingAreas;
