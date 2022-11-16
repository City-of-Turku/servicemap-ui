import React, { useContext, useEffect, useState } from 'react';
import { useMap } from 'react-leaflet';
import { useSelector } from 'react-redux';
import MobilityPlatformContext from '../../../context/MobilityPlatformContext';
import { useAccessibleMap } from '../../../redux/selectors/settings';
import { fetchCultureRoutesData } from '../mobilityPlatformRequests/mobilityPlatformRequests';
import { isDataValid } from '../utils/utils';
import CultureRouteUnits from './components/CultureRouteUnits';

const CultureRoutes = () => {
  const [cultureRoutesGeometry, setCultureRoutesGeometry] = useState([]);
  const [cultureRouteUnits, setCultureRouteUnits] = useState([]);

  const { openMobilityPlatform, showCultureRoutes, cultureRouteId } = useContext(MobilityPlatformContext);

  const { Polyline } = global.rL;

  const useContrast = useSelector(useAccessibleMap);

  const blueOptions = { color: 'rgba(7, 44, 115, 255)' };
  const whiteOptions = { color: 'rgba(255, 255, 255, 255)', dashArray: !useContrast ? '1, 8' : null };
  const blackOptions = { color: 'rgba(0, 0, 0, 255)', dashArray: '2 10 10 10' };

  useEffect(() => {
    if (openMobilityPlatform) {
      fetchCultureRoutesData('CultureRouteGeometry', 20, setCultureRoutesGeometry);
    }
  }, [openMobilityPlatform, setCultureRoutesGeometry]);

  useEffect(() => {
    if (openMobilityPlatform) {
      fetchCultureRoutesData('CultureRouteUnit', 200, setCultureRouteUnits);
    }
  }, [openMobilityPlatform, setCultureRouteUnits]);

  const activeCultureRoute = cultureRoutesGeometry.filter(item => item.mobile_unit_group.id === cultureRouteId);

  const swapCoords = (inputData) => {
    if (inputData && inputData.length > 0) {
      return inputData.map(item => [item[1], item[0]]);
    }
    return inputData;
  };

  const renderData = isDataValid(showCultureRoutes, activeCultureRoute);

  const map = useMap();

  useEffect(() => {
    if (renderData) {
      const bounds = [];
      activeCultureRoute.forEach((item) => {
        bounds.push(swapCoords(item.geometry_coords));
      });
      map.fitBounds([bounds]);
    }
  }, [showCultureRoutes, activeCultureRoute, map]);

  return (
    <>
      {renderData
        ? activeCultureRoute.map(item => (
          <div key={item.id}>
            <Polyline
              key={item.geometry}
              weight={useContrast ? 10 : 8}
              pathOptions={useContrast ? whiteOptions : blueOptions}
              positions={swapCoords(item.geometry_coords)}
            />
            <Polyline
              key={item.geometry_coords}
              weight={useContrast ? 6 : 4}
              pathOptions={useContrast ? blackOptions : whiteOptions}
              positions={swapCoords(item.geometry_coords)}
            />
          </div>
        ))
        : null}
      {renderData ? <CultureRouteUnits cultureRouteUnits={cultureRouteUnits} /> : null}
    </>
  );
};

export default CultureRoutes;
