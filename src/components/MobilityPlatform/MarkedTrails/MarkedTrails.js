import React from 'react';
import { useMobilityPlatformContext } from '../../../context/MobilityPlatformContext';
import Trails from '../TrailsComponent';

/* Show marked trails which are part of Paavo trails on the map */

const MarkedTrails = () => {
  const { showMarkedTrails, selectedMarkedTrails } = useMobilityPlatformContext();

  const brownColor = 'rgba(117, 44, 23, 255)';
  const dashPattern = '2 9 9 9';

  return <Trails showTrail={showMarkedTrails} selectedTrails={selectedMarkedTrails} color={brownColor} pattern={dashPattern} />;
};

export default MarkedTrails;
