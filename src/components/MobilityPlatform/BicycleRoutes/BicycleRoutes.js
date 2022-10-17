import React, { useEffect, useState, useContext } from 'react';
import { useMap } from 'react-leaflet';
import MobilityPlatformContext from '../../../context/MobilityPlatformContext';
import { fetchBicycleRoutesGeometry } from '../mobilityPlatformRequests/mobilityPlatformRequests';
import { isDataValid } from '../utils/utils';

const BicycleRoutes = () => {
  const [bicycleRoutes, setBicycleRoutes] = useState([]);

  const { openMobilityPlatform, mobilityMap, bicycleRouteName } = useContext(MobilityPlatformContext);

  const { Polyline } = global.rL;

  const blueOptions = { color: 'rgba(7, 44, 115, 255)', weight: 8 };
  const whiteOptions = {
    color: '#ffff', dashArray: '5, 15', lineCap: 'square', weight: 4,
  };

  useEffect(() => {
    if (openMobilityPlatform) {
      fetchBicycleRoutesGeometry(setBicycleRoutes);
    }
  }, [openMobilityPlatform, setBicycleRoutes]);

  const activeBicycleRoute = bicycleRoutes.filter(item => item.bicycle_network_name === bicycleRouteName);

  const map = useMap();

  const renderData = isDataValid(mobilityMap.bicycleRoutes, activeBicycleRoute);

  useEffect(() => {
    if (renderData) {
      const bounds = [];
      activeBicycleRoute.forEach((item) => {
        bounds.push(item.geometry_coords);
      });
      map.fitBounds([bounds]);
    }
  }, [mobilityMap.bicycleRoutes, activeBicycleRoute]);

  return (
    <>
      {renderData
        && activeBicycleRoute.map(item => (
          <div key={item.id}>
            <Polyline pathOptions={blueOptions} positions={item.geometry_coords} />
            <Polyline pathOptions={whiteOptions} positions={item.geometry_coords} />
          </div>
        ))}
    </>
  );
};

export default BicycleRoutes;
