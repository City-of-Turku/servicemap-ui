import React, { useEffect, useContext } from 'react';
import { useMap } from 'react-leaflet';
import MobilityPlatformContext from '../../../context/MobilityPlatformContext';

/* Show marked trails which are part of Paavo trails on the map */

const MarkedTrails = () => {
  const { showMarkedTrails, markedTrailsObj } = useContext(MobilityPlatformContext);

  const { Polyline } = global.rL;

  const brownOptions = { color: 'rgba(117, 44, 23, 255)' };
  const whiteOptions = { color: 'rgba(255, 255, 255, 255)', dashArray: '5, 20', lineCap: 'square' };

  const renderData = showMarkedTrails && markedTrailsObj && Object.entries(markedTrailsObj).length > 0;

  const map = useMap();

  useEffect(() => {
    if (renderData) {
      const bounds = [];
      bounds.push(markedTrailsObj.geometry_coords);
      map.fitBounds([bounds]);
    }
  }, [showMarkedTrails, markedTrailsObj]);

  return (
    <>
      {renderData && (
        <>
          <Polyline weight={8} pathOptions={brownOptions} positions={markedTrailsObj.geometry_coords} />
          <Polyline weight={4} pathOptions={whiteOptions} positions={markedTrailsObj.geometry_coords} />
        </>
      )}
    </>
  );
};

export default MarkedTrails;
