import React, { useContext, useEffect, useState } from 'react';
import { useMap } from 'react-leaflet';
import MobilityPlatformContext from '../../../context/MobilityPlatformContext';
import { fetchCultureRoutesData } from '../mobilityPlatformRequests/mobilityPlatformRequests';
import CultureRouteUnits from './components/CultureRouteUnits';

const CultureRoutes = () => {
  const [cultureRoutesGeometry, setCultureRoutesGeometry] = useState([]);
  const [cultureRouteUnits, setCultureRouteUnits] = useState([]);

  const { openMobilityPlatform, showCultureRoutes, cultureRouteId } = useContext(MobilityPlatformContext);

  const { Polyline } = global.rL;

  const blueOptions = { color: 'rgba(7, 44, 115, 255)' };
  const whiteOptions = { color: '#ffffff', dashArray: '1, 8' };

  useEffect(() => {
    if (openMobilityPlatform) {
      fetchCultureRoutesData('CRG', 20, setCultureRoutesGeometry);
    }
  }, [openMobilityPlatform, setCultureRoutesGeometry]);

  useEffect(() => {
    if (openMobilityPlatform) {
      fetchCultureRoutesData('CRU', 200, setCultureRouteUnits);
    }
  }, [openMobilityPlatform, setCultureRouteUnits]);

  const activeCultureRoute = cultureRoutesGeometry.filter(item => item.mobile_unit_group.id === cultureRouteId);

  const swapCoords = (inputData) => {
    if (inputData && inputData.length > 0) {
      return inputData.map(item => [item[1], item[0]]);
    }
    return inputData;
  };

  const map = useMap();

  useEffect(() => {
    if (showCultureRoutes && activeCultureRoute && activeCultureRoute.length > 0) {
      const bounds = [];
      activeCultureRoute.forEach((item) => {
        bounds.push(swapCoords(item.geometry_coords));
      });
      map.fitBounds([bounds]);
    }
  }, [showCultureRoutes, activeCultureRoute, map]);

  return (
    <>
      {showCultureRoutes ? (
        <>
          {activeCultureRoute && activeCultureRoute.length > 0
            && activeCultureRoute.map(item => (
              <div key={item.id}>
                <Polyline key={item.geometry} weight={8} pathOptions={blueOptions} positions={swapCoords(item.geometry_coords)} />
                <Polyline
                  key={item.geometry_coords}
                  weight={4}
                  pathOptions={whiteOptions}
                  positions={swapCoords(item.geometry_coords)}
                />
              </div>
            ))}
          <>
            <CultureRouteUnits cultureRouteUnits={cultureRouteUnits} />
          </>
        </>
      ) : null}
    </>
  );
};

export default CultureRoutes;
