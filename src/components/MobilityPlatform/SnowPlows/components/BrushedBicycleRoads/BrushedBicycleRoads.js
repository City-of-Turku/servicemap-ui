import React, { useEffect, useState, useContext } from 'react';
import { useMap } from 'react-leaflet';
import MobilityPlatformContext from '../../../../../context/MobilityPlatformContext';
import { fetchMobilityMapPolygonData } from '../../../mobilityPlatformRequests/mobilityPlatformRequests';
import { isDataValid } from '../../../utils/utils';

/* Display brush sanded and brush salted bicycle roads */

const BrushedBicycleRoads = () => {
  const [brushSandedRoutes, setBrushSandedRoutes] = useState([]);
  const [brushSaltedRoutes, setBrushSaltedRoutes] = useState([]);

  const { openMobilityPlatform, showBrushSandedRoute, showBrushSaltedRoute } = useContext(MobilityPlatformContext);

  const { Polyline } = global.rL;

  // Orange color
  const brushSandedOptions = { color: 'rgba(227, 97, 32, 255)', weight: 8 };
  // Green color
  const brushSaltedOptions = { color: 'rgba(43, 183, 0, 255)', weight: 8 };
  // White and dashed
  const brushSandedDashed = {
    color: 'rgba(255, 255, 255, 255)', dashArray: '5, 15', lineCap: 'square', weight: 4,
  };
  const brushSaltedDashed = {
    color: 'rgba(255, 255, 255, 255)', dashArray: '4, 8', lineCap: 'round', weight: 4,
  };

  useEffect(() => {
    if (openMobilityPlatform) {
      fetchMobilityMapPolygonData('BND', 100, setBrushSandedRoutes);
      fetchMobilityMapPolygonData('BLB', 100, setBrushSaltedRoutes);
    }
  }, [openMobilityPlatform, setBrushSandedRoutes, setBrushSaltedRoutes]);

  const map = useMap();

  const renderBrushSandedData = isDataValid(showBrushSandedRoute, brushSandedRoutes);
  const renderBrushSaltedData = isDataValid(showBrushSaltedRoute, brushSaltedRoutes);

  const fitDataToBounds = (renderData, data) => {
    if (renderData) {
      const bounds = [];
      data.forEach((item) => {
        bounds.push(item.geometry_coords);
      });
      map.fitBounds([bounds]);
    }
  };

  useEffect(() => {
    fitDataToBounds(renderBrushSandedData, brushSandedRoutes);
  }, [showBrushSandedRoute, brushSandedRoutes, map]);

  useEffect(() => {
    fitDataToBounds(renderBrushSaltedData, brushSaltedRoutes);
  }, [showBrushSaltedRoute, brushSaltedRoutes]);

  const renderRoutes = (renderData, data, isBrushSanded) => renderData
      && data.map(item => (
        <div key={item.id}>
          <Polyline key={item.geometry} pathOptions={isBrushSanded ? brushSandedOptions : brushSaltedOptions} positions={item.geometry_coords} />
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
