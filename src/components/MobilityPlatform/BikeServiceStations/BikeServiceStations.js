import React, { useContext, useEffect, useState } from 'react';
import { useMap } from 'react-leaflet';
import bikeServiceIcon from 'servicemap-ui-turku/assets/icons/icons-icon_bike_service_station.svg';
import MobilityPlatformContext from '../../../context/MobilityPlatformContext';
import { fetchMobilityMapData } from '../mobilityPlatformRequests/mobilityPlatformRequests';
import { isDataValid, createIcon } from '../utils/utils';
import BikeServiceStationContent from './components/BikeServiceStationContent';

const BikeServiceStations = () => {
  const [bikeServiceStations, setBikeServiceStations] = useState([]);

  const { openMobilityPlatform, mobilityMap } = useContext(MobilityPlatformContext);

  const map = useMap();

  const { Marker, Popup } = global.rL;
  const { icon } = global.L;

  const customIcon = icon(createIcon(bikeServiceIcon));

  useEffect(() => {
    if (openMobilityPlatform) {
      fetchMobilityMapData('BSS', 100, setBikeServiceStations);
    }
  }, [openMobilityPlatform, setBikeServiceStations]);

  const renderData = isDataValid(mobilityMap.bikeServiceStations, bikeServiceStations);

  useEffect(() => {
    if (renderData) {
      const bounds = [];
      bikeServiceStations.forEach((item) => {
        bounds.push([item.geometry_coords.lat, item.geometry_coords.lon]);
      });
      map.fitBounds(bounds);
    }
  }, [mobilityMap.bikeServiceStations, bikeServiceStations]);

  return (
    <>
      {renderData
        && bikeServiceStations.map(item => (
          <Marker
            key={item.id}
            icon={customIcon}
            position={[item.geometry_coords.lat, item.geometry_coords.lon]}
          >
            <div>
              <Popup>
                <BikeServiceStationContent station={item} />
              </Popup>
            </div>
          </Marker>
        ))}
    </>
  );
};

export default BikeServiceStations;
