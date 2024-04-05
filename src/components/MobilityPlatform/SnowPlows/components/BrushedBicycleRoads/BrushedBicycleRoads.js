/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import { useSelector } from 'react-redux';
import { useMobilityPlatformContext } from '../../../../../context/MobilityPlatformContext';
import { useAccessibleMap } from '../../../../../redux/selectors/settings';
import useMobilityDataFetch from '../../../utils/useMobilityDataFetch';
import { isDataValid, fitPolygonsToBounds } from '../../../utils/utils';

/* Display brush sanded and brush salted bicycle roads */

const BrushedBicycleRoads = () => {
  const optionsBrushSanded = {
    type_name: 'BrushSandedBicycleNetwork',
    latlon: true,
  };
  const optionsBrushSalted = {
    type_name: 'BrushSaltedBicycleNetwork',
    latlon: true,
  };

  const { showBrushSandedRoute, showBrushSaltedRoute } = useMobilityPlatformContext();

  const { Polyline } = global.rL;

  const useContrast = useSelector(useAccessibleMap);

  const white = 'rgba(255, 255, 255, 255)';
  const black = 'rgba(0, 0, 0, 255)';
  const orange = 'rgba(227, 97, 32, 255)';
  const green = 'rgba(43, 183, 0, 255)';

  // Orange color when on default background. High contrast is white.
  const brushSandedOptions = {
    color: useContrast ? white : orange,
    weight: useContrast ? 10 : 8,
  };
  // Green color when on default background. High contrast is white.
  const brushSaltedOptions = {
    color: useContrast ? white : green,
    weight: useContrast ? 10 : 8,
  };
  // White and dashed when on default background. High contrast is black.
  const brushSandedDashed = {
    color: useContrast ? black : white,
    dashArray: useContrast ? '8 2 8' : '5, 15',
    lineCap: 'square',
    weight: 4,
  };
  const brushSaltedDashed = {
    color: useContrast ? black : white,
    dashArray: useContrast ? '2 11 11 11' : '4, 8',
    lineCap: 'round',
    weight: 4,
  };

  const map = useMap();

  const { data: brushSaltedRoutes } = useMobilityDataFetch(optionsBrushSalted, showBrushSaltedRoute);
  const { data: brushSandedRoutes } = useMobilityDataFetch(optionsBrushSanded, showBrushSandedRoute);
  const renderBrushSandedData = isDataValid(showBrushSandedRoute, brushSandedRoutes);
  const renderBrushSaltedData = isDataValid(showBrushSaltedRoute, brushSaltedRoutes);

  useEffect(() => {
    fitPolygonsToBounds(renderBrushSandedData, brushSandedRoutes, map);
  }, [showBrushSandedRoute, brushSandedRoutes]);

  useEffect(() => {
    fitPolygonsToBounds(renderBrushSaltedData, brushSaltedRoutes, map);
  }, [showBrushSaltedRoute, brushSaltedRoutes]);

  const renderRoutes = (renderData, data, isBrushSanded) => renderData
    && data.map(item => (
      <div key={item.id}>
        <Polyline
          key={item.geometry}
          pathOptions={isBrushSanded ? brushSandedOptions : brushSaltedOptions}
          positions={item.geometry_coords}
        />
        <Polyline
          key={item.geometry_coords}
          pathOptions={isBrushSanded ? brushSandedDashed : brushSaltedDashed}
          positions={item.geometry_coords}
        />
      </div>
    ));

  return (
    <>
      {renderRoutes(renderBrushSandedData, brushSandedRoutes, true)}
      {renderRoutes(renderBrushSaltedData, brushSaltedRoutes, false)}
    </>
  );
};

export default BrushedBicycleRoads;
