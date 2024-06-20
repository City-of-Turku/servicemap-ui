import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useMobilityPlatformContext } from '../../../context/MobilityPlatformContext';
import { useAccessibleMap } from '../../../redux/selectors/settings';
import { selectMapRef } from '../../../redux/selectors/general';
import useMobilityDataFetch from '../utils/useMobilityDataFetch';
import {
  isDataValid, blueOptionsBase, whiteOptionsBase, blackOptionsBase,
} from '../utils/utils';
import CultureRouteUnits from './components/CultureRouteUnits';

const CultureRoutes = () => {
  const optionsGeometry = {
    type_name: 'CultureRouteGeometry',
    page_size: 50,
  };
  const optionsUnit = {
    type_name: 'CultureRouteUnit',
    page_size: 200,
  };

  const { openMobilityPlatform, showCultureRoutes, cultureRouteId } = useMobilityPlatformContext();

  const { Polyline } = global.rL;

  const useContrast = useSelector(useAccessibleMap);
  const map = useSelector(selectMapRef);

  const blueOptions = blueOptionsBase();
  const whiteOptions = whiteOptionsBase({ dashArray: !useContrast ? '1, 8' : null });
  const blackOptions = blackOptionsBase({ dashArray: '2 10 10 10' });

  const { data: cultureRoutesGeometry } = useMobilityDataFetch(optionsGeometry, openMobilityPlatform);
  const { data: cultureRouteUnits } = useMobilityDataFetch(optionsUnit, openMobilityPlatform);

  const filterRoutes = data => {
    if (data && data.length > 0) {
      return data.filter(item => item.mobile_unit_group.id === cultureRouteId);
    }
    return [];
  };

  const activeCultureRoute = filterRoutes(cultureRoutesGeometry);

  const swapCoords = inputData => {
    if (inputData && inputData.length > 0) {
      return inputData.map(item => [item[1], item[0]]);
    }
    return inputData;
  };

  const renderData = isDataValid(showCultureRoutes, activeCultureRoute);

  useEffect(() => {
    if (renderData) {
      const bounds = [];
      activeCultureRoute.forEach(item => {
        bounds.push(swapCoords(item.geometry_coords));
      });
      map?.fitBounds([bounds]);
    }
  }, [renderData, activeCultureRoute, map]);

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
