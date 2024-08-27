import React from 'react';
import { useMobilityPlatformContext } from '../../../context/MobilityPlatformContext';
import Trails from '../TrailsComponent';

/* Show selected nature trails on the map */

const NatureTrails = () => {
  const { selectedNatureTrails } = useMobilityPlatformContext();

  const blueColor = 'rgba(0, 0, 153, 255)';
  const dashPattern = '12 9';

  return <Trails selectedTrails={selectedNatureTrails} color={blueColor} pattern={dashPattern} />;
};

export default NatureTrails;
