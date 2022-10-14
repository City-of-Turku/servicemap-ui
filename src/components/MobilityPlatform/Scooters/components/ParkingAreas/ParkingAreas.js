import React, { useContext, useEffect, useState } from 'react';
import { useMap } from 'react-leaflet';
import scooterParkingIcon from 'servicemap-ui-turku/assets/icons/icons-icon_scooter_parking.svg';
import MobilityPlatformContext from '../../../../../context/MobilityPlatformContext';
import { fetchMobilityMapData } from '../../../mobilityPlatformRequests/mobilityPlatformRequests';
import TextContent from '../../../TextContent';

const ParkingAreas = () => {
  const [parkingAreas, setParkingAreas] = useState([]);

  const { openMobilityPlatform, mobilityMap } = useContext(MobilityPlatformContext);

  const map = useMap();

  const { Marker, Popup } = global.rL;
  const { icon } = global.L;

  const customIcon = icon({
    iconUrl: scooterParkingIcon,
    iconSize: [45, 45],
  });

  useEffect(() => {
    if (openMobilityPlatform) {
      fetchMobilityMapData('SPG', 100, setParkingAreas);
    }
  }, [openMobilityPlatform, setParkingAreas]);


  useEffect(() => {
    if (mobilityMap.scooterParking && parkingAreas && parkingAreas.length > 0) {
      const bounds = [];
      parkingAreas.forEach((item) => {
        bounds.push([item.geometry_coords.lat, item.geometry_coords.lon]);
      });
      map.fitBounds(bounds);
    }
  }, [mobilityMap.scooterParking, parkingAreas, map]);

  return (
    <>
      {mobilityMap.scooterParking ? (
        <>
          {parkingAreas && parkingAreas.length > 0
              && parkingAreas.map(item => (
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
              ))}
        </>
      ) : null}
    </>
  );
};

export default ParkingAreas;
