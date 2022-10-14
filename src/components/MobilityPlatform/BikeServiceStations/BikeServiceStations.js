import React, { useEffect, useState, useContext } from 'react';
import { useMap } from 'react-leaflet';
import bikeServiceIcon from 'servicemap-ui-turku/assets/icons/icons-icon_bike_service_station.svg';
import MobilityPlatformContext from '../../../context/MobilityPlatformContext';
import BikeServiceStationContent from './components/BikeServiceStationContent';
import { fetchMobilityMapData } from '../mobilityPlatformRequests/mobilityPlatformRequests';

const BikeServiceStations = () => {
  const [bikeServiceStations, setBikeServiceStations] = useState([]);

  const { openMobilityPlatform, mobilityMap } = useContext(MobilityPlatformContext);

  const map = useMap();

  const { Marker, Popup } = global.rL;
  const { icon } = global.L;

  const chargerStationIcon = icon({
    iconUrl: bikeServiceIcon,
    iconSize: [45, 45],
  });

  useEffect(() => {
    if (openMobilityPlatform) {
      fetchMobilityMapData('BSS', 100, setBikeServiceStations);
    }
  }, [openMobilityPlatform, setBikeServiceStations]);

  useEffect(() => {
    if (mobilityMap.bikeServiceStations && bikeServiceStations && bikeServiceStations.length > 0) {
      const bounds = [];
      bikeServiceStations.forEach((item) => {
        bounds.push([item.geometry_coords.lat, item.geometry_coords.lon]);
      });
      map.fitBounds(bounds);
    }
  }, [mobilityMap.bikeServiceStations, bikeServiceStations]);

  return (
    <>
      {mobilityMap.bikeServiceStations ? (
        <>
          {bikeServiceStations && bikeServiceStations.length > 0
            && bikeServiceStations.map(item => (
              <Marker
                key={item.id}
                icon={chargerStationIcon}
                position={[item.geometry_coords.lat, item.geometry_coords.lon]}
              >
                <div>
                  <Popup className="charger-stations-popup">
                    <BikeServiceStationContent
                      station={item}
                    />
                  </Popup>
                </div>
              </Marker>
            ))}
        </>
      ) : null}
    </>
  );
};

export default BikeServiceStations;
