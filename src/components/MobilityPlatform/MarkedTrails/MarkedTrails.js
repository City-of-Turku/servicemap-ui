import React from 'react';
import { useMobilityPlatformContext } from '../../../context/MobilityPlatformContext';
import Trails from '../TrailsComponent';

/* Show marked trails (Paavo trails) on the map */

const MarkedTrails = () => {
  const { selectedMarkedTrails } = useMobilityPlatformContext();

  const showMarkedTrails = selectedMarkedTrails.length > 0;

  const brownColor = 'rgba(117, 44, 23, 255)';
  const dashPattern = '2 9 9 9';

  return <Trails showTrail={showMarkedTrails} selectedTrails={selectedMarkedTrails} color={brownColor} pattern={dashPattern} />;
};

export default MarkedTrails;
