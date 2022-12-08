import React, { useEffect, useState, useContext } from 'react';
import { useMap } from 'react-leaflet';
import { useSelector } from 'react-redux';
import MobilityPlatformContext from '../../../context/MobilityPlatformContext';
import { useAccessibleMap } from '../../../redux/selectors/settings';
import { fetchBicycleRoutesGeometry } from '../mobilityPlatformRequests/mobilityPlatformRequests';
import { isDataValid } from '../utils/utils';

const BicycleRoutes = () => {
  const [bicycleRoutes, setBicycleRoutes] = useState([]);

  const { openMobilityPlatform, showBicycleRoutes, bicycleRouteName } = useContext(MobilityPlatformContext);

  const { Polyline } = global.rL;

  const useContrast = useSelector(useAccessibleMap);

  const blueOptions = { color: 'rgba(7, 44, 115, 255)' };
  const whiteOptions = { color: 'rgba(255, 255, 255, 255)', dashArray: !useContrast ? '10' : null };
  const blackOptions = { color: 'rgba(0, 0, 0, 255)', dashArray: '2 10 10 10' };

  useEffect(() => {
    if (openMobilityPlatform) {
      fetchBicycleRoutesGeometry(setBicycleRoutes);
    }
  }, [openMobilityPlatform, setBicycleRoutes]);

  const getActiveRoutes = (data) => {
    if (data && data.length > 0) {
      return data.filter(item => item.bicycle_network_name === bicycleRouteName);
    }
    return [];
  };

  const activeBicycleRoute = getActiveRoutes(bicycleRoutes);
  const renderData = isDataValid(showBicycleRoutes, activeBicycleRoute);

  const map = useMap();

  useEffect(() => {
    if (renderData) {
      const bounds = [];
      activeBicycleRoute.forEach((item) => {
        bounds.push(item.geometry_coords);
      });
      map.fitBounds([bounds]);
    }
  }, [showBicycleRoutes, activeBicycleRoute]);

  return (
    <>
      {renderData
        ? activeBicycleRoute.map(item => (
          <React.Fragment key={item.id}>
            <Polyline
              weight={useContrast ? 10 : 8}
              pathOptions={useContrast ? whiteOptions : blueOptions}
              positions={item.geometry_coords}
            />
            <Polyline
              weight={useContrast ? 6 : 4}
              pathOptions={useContrast ? blackOptions : whiteOptions}
              positions={item.geometry_coords}
            />
          </React.Fragment>
        ))
        : null}
    </>
  );
};

export default BicycleRoutes;
