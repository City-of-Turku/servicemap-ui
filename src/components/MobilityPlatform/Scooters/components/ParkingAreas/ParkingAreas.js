import React, { useContext, useEffect, useState } from 'react';
import { useMap } from 'react-leaflet';
import { useSelector } from 'react-redux';
import scooterParkingIcon from 'servicemap-ui-turku/assets/icons/icons-icon_scooter_parking.svg';
import scooterParkingIconBw from 'servicemap-ui-turku/assets/icons/contrast/icons-icon_scooter_parking-bw.svg';
import { MobilityPlatformContext } from '../../../../../context/MobilityPlatformContext';
import { useAccessibleMap } from '../../../../../redux/selectors/settings';
import { fetchMobilityMapData } from '../../../mobilityPlatformRequests/mobilityPlatformRequests';
import { createIcon, isDataValid, fitToMapBounds } from '../../../utils/utils';
import TextContent from '../../../TextContent';

const ParkingAreas = () => {
  const [parkingAreas, setParkingAreas] = useState([]);

  const { openMobilityPlatform, showScooterParkingAreas } = useContext(MobilityPlatformContext);

  const map = useMap();

  const useContrast = useSelector(useAccessibleMap);

  const { Marker, Popup } = global.rL;
  const { icon } = global.L;

  const customIcon = icon(createIcon(useContrast ? scooterParkingIconBw : scooterParkingIcon));

  useEffect(() => {
    if (openMobilityPlatform) {
      fetchMobilityMapData('ScooterParkingArea', 100, setParkingAreas);
    }
  }, [openMobilityPlatform, setParkingAreas]);

  const renderData = isDataValid(showScooterParkingAreas, parkingAreas);

  useEffect(() => {
    fitToMapBounds(renderData, parkingAreas, map);
  }, [showScooterParkingAreas, parkingAreas]);

  return (
    <>
      {renderData ? (
        parkingAreas.map(item => (
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
      ) : null}
    </>
  );
};

export default ParkingAreas;
