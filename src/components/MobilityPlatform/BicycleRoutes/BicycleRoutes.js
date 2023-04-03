/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useMap } from 'react-leaflet';
import { useSelector } from 'react-redux';
import { useMobilityPlatformContext } from '../../../context/MobilityPlatformContext';
import { useAccessibleMap } from '../../../redux/selectors/settings';
import { fetchBicycleRoutesGeometry } from '../mobilityPlatformRequests/mobilityPlatformRequests';
import {
  fitPolygonsToBounds, isDataValid, blueOptionsBase, whiteOptionsBase, blackOptionsBase,
} from '../utils/utils';

const BicycleRoutes = () => {
  const [bicycleRoutes, setBicycleRoutes] = useState([]);

  const { openMobilityPlatform, showBicycleRoutes, bicycleRouteName } = useMobilityPlatformContext();

  const { Polyline } = global.rL;

  const useContrast = useSelector(useAccessibleMap);

  const blueOptions = blueOptionsBase();
  const whiteOptions = whiteOptionsBase({ dashArray: !useContrast ? '10' : null });
  const blackOptions = blackOptionsBase({ dashArray: '2 10 10 10' });

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
    fitPolygonsToBounds(renderData, activeBicycleRoute, map);
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
