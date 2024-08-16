import React from 'react';
import { useMobilityPlatformContext } from '../../../context/MobilityPlatformContext';
import Trails from '../TrailsComponent';

/* Show selected fitness trails on the map */

const FitnessTrails = () => {
  const { showFitnessTrails, selectedFitnessTrails } = useMobilityPlatformContext();

  const tealColor = 'rgba(102, 102, 153, 255)';
  const dashPattern = '10 2 7';

  return <Trails showTrail={showFitnessTrails} selectedTrails={selectedFitnessTrails} color={tealColor} pattern={dashPattern} />;
};

export default FitnessTrails;
